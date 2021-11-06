const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const catchAsync = require('../../helpers/catchAsync')
const ExpressError = require('../../helpers/ExpressError')



// create page
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', catchAsync(async (req, res, next) => {
    const newRestaurant = new Restaurant(req.body)
    await newRestaurant.save()
    res.redirect('/')
}))

// show page
router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  const restaurant = await Restaurant.findById(id).lean()
  if(!restaurant) throw new ExpressError('Page Not Found', 404)
  res.render('show', { restaurant })
}))

// update page
router.get('/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params
  const restaurant = await Restaurant.findById(id).lean()
  res.render('edit', { restaurant })
}))

router.patch('/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  const restaurant = await Restaurant.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
  res.redirect(`/restaurants/${id}`)
}))

// delete
router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  await Restaurant.findByIdAndDelete(id)
  res.redirect('/')
}))

// error handler
router.use((err, req, res, next) => {
  const { message, statusCode } = err
  res.status(statusCode).render('error', { message })
})


module.exports = router