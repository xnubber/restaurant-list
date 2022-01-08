const express = require('express')
const router = express.Router()
const catchAsync = require('../../helpers/catchAsync')
const ExpressError = require('../../helpers/ExpressError')
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')


router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login',failureFlash: true}), (req, res) => {
  req.flash('success_msg', 'Welcome!')
  res.redirect('/')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', catchAsync(async (req, res, next) => {
  const {name, email, password, confirmPassword} = req.body
  const user = await User.findOne({email})
  if (user) {
    req.flash('warning_msg', 'User already exists.')
    return res.render('register', { name, email, password, confirmPassword })
  }
  if (password !== confirmPassword) {
    req.flash('warning_msg', 'Password and confirm password must be the same.')
    return res.render('register', { name, email, password, confirmPassword })
  }
  const newUser = new User({ name, email, password })
  await newUser.save()
  req.login(newUser, err =>{
    if (err) return next(err)
    req.flash('success_msg', 'Login and Registration success!')
    res.redirect('/')
  })
}))

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'Success Logout')
  res.redirect('/users/login')
})

module.exports = router