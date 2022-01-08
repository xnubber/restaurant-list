const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const catchAsync = require('../../helpers/catchAsync')
const ExpressError = require('../../helpers/ExpressError')


router.get('/login', (req, res) => {
  res.render('login')
})

module.exports = router