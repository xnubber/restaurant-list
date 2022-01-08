const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')


module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, async (req, email, password, done) => {
    try{
      const user = await User.findOne({ email })
      if (!user) {
        req.flash('warning_msg', 'That email is not registered')
        return done(null, false)
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        req.flash('warning_msg', 'Email or password incorrect')
        return done(null, false)
      }
      return done(null, user)
    } catch(err) {
      return done(err, false)
    }
  }))

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
    try{
      const { name, email } = profile._json
      const facebookUser = await User.findOne({ email })
      if (facebookUser) return done(null, facebookUser)
      const randomPassword = Math.random().toString(36).slice(-8)
      const hash = await bcrypt.hash(randomPassword, 10)
      const newFBUser = new User({ name, email, password: hash })
      await newFBUser.save()
      return done(null, newFBUser)
    } catch(err) {
      return done(err, false)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean()
      return done(null, user)
    } catch(err) {
      return done(err, null)
    }
  })
}