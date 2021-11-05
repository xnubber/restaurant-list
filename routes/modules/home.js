const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', async (req, res) => {
  const restaurants = await Restaurant.find({}).lean()
  res.render('index', { restaurants })
})

// search
router.get('/search', async (req, res) => {
  let keyword = req.query.keyword.toLowerCase()
  if (!keyword) res.redirect('/')
  const allRestaurants = await Restaurant.find({}).lean()
  const restaurants = allRestaurants.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword) ||
      restaurant.category.toLowerCase().includes(keyword)
  })

  if (restaurants.length === 0) {
    res.render('error')
  } else {
    res.render('index', { restaurants, keyword: req.query.keyword })
  }
})

module.exports = router