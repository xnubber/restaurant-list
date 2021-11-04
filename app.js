const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const restaurantList = require('./restaurant.json')
const methodOverride = require('method-override')
// mongoose
mongoose.connect('mongodb://localhost:27017/restaurant-list')

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// 
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// exprss-handlebars
const exphbs = require('express-handlebars')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// static
app.use(express.static('public'))


// index page
app.get('/', async (req, res) => {
  const restaurants = await Restaurant.find({}).lean()
  res.render('index', { restaurants })
})

// create page
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', async (req, res) => {
  const newRestaurant = new Restaurant(req.body)
  await newRestaurant.save()
  res.redirect('/')
})

// show page
app.get('/restaurants/:id', async (req, res) => {
  const {id} = req.params
  const restaurant = await Restaurant.findById(id).lean()
  res.render('show', { restaurant })
})

// update page
app.get('/restaurants/:id/edit', async (req, res) => {
  const { id } = req.params
  const restaurant = await Restaurant.findById(id).lean()
  res.render('edit', {restaurant})
})

app.patch('/restaurants/:id', async (req, res) => {
  const { id } = req.params
  const restaurant = await Restaurant.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
  res.redirect(`/restaurants/${id}`)
})

// search
app.get('/search', async (req, res) => {
  let keyword = req.query.keyword.toLowerCase()
  if(!keyword) res.redirect('/')
  const allRestaurants = await Restaurant.find({}).lean()
  const restaurants = allRestaurants.filter(restaurant => {
    console.log(keyword)
    console.log(restaurant.name.toLowerCase())
    return restaurant.name.toLowerCase().includes(keyword) ||
      restaurant.category.toLowerCase().includes(keyword)
  })
  res.render('index', { restaurants, keyword: req.query.keyword })
})

// listen
app.listen(port, () => {
  console.log(`localhost:${port}`)
})