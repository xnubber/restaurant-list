const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const catchAsync = require('../../helpers/catchAsync')
const ExpressError = require('../../helpers/ExpressError')

router.get('/', catchAsync(async (req, res) => {
  const userId = req.user._id
  const {name = 'name', sort = 'asc'} = req.query
  let sortOption = {}
  if(name === 'name') {
    sortOption = { name: `${sort}` }
  } else if(name === 'category') {
    sortOption = { category: `${sort}` }
  } else {
    sortOption = { location: `${sort}` }
  }
  const restaurants = await Restaurant.find({userId})
  .lean()
  .sort(sortOption)
  res.render('index', { restaurants })
}))

// search
router.get('/search', catchAsync(async (req, res) => {
  let keyword = req.query.keyword.toLowerCase()
  if (!keyword) res.redirect('/')
  const allRestaurants = await Restaurant.find({}).lean()
  const restaurants = allRestaurants.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword) ||
      restaurant.category.toLowerCase().includes(keyword)
  })

  if (restaurants.length === 0) throw new ExpressError('Page Not Found', 404)
  res.render('index', { restaurants, keyword: req.query.keyword })
}))

module.exports = router