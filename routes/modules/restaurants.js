const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')



// create page
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', async (req, res) => {
  const newRestaurant = new Restaurant(req.body)
  await newRestaurant.save()
  res.redirect('/')
})

// show page
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const restaurant = await Restaurant.findById(id).lean()
  res.render('show', { restaurant })
})

// update page
router.get('/:id/edit', async (req, res) => {
  const { id } = req.params
  const restaurant = await Restaurant.findById(id).lean()
  res.render('edit', { restaurant })
})

router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const restaurant = await Restaurant.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
  res.redirect(`/restaurants/${id}`)
})

// delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await Restaurant.findByIdAndDelete(id)
  res.redirect('/')
})


module.exports = router