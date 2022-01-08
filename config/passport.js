const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')


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
      if (user.password !== password) {
        req.flash('warning_msg', 'Email or password incorrect')
        return done(null, false)
      }
      return done(null, user)
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