const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const catchAsync = require('../../helpers/catchAsync')
const ExpressError = require('../../helpers/ExpressError')



// create page
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', catchAsync(async (req, res) => {
  const userId = req.user._id
  const { name, location, category, phone, description, image, rating, google_map } = req.body
  const newRestaurant = new Restaurant({ name, location, category, phone, description, image, rating, google_map, userId })
  await newRestaurant.save()
  res.redirect('/')
}))

// show page
router.get('/:id', catchAsync(async (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const restaurant = await Restaurant.findOne({_id, userId})
  .lean()
  .exec()
  if (!restaurant) throw new ExpressError('Page Not Found', 404)
  res.render('show', { restaurant })
}))

// update page
router.get('/:id/edit', catchAsync(async (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const restaurant = await Restaurant.findOne({_id, userId}).lean()
  res.render('edit', { restaurant })
}))

router.patch('/:id', catchAsync(async (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const restaurant = await Restaurant.findOne({_id, userId})
  const { name, location, category, phone, description, image, rating, google_map } = req.body
  await restaurant.update({ name, location, category, phone, description, image, rating, google_map})
  res.redirect(`/restaurants/${_id}`)
}))

// delete
router.delete('/:id', catchAsync(async (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const restaurant = await Restaurant.findOne({_id, userId})
  await restaurant.remove()
  res.redirect('/')
}))




module.exports = router