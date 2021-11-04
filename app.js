const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const mongoose = require('mongoose')
const restaurantList = require('./restaurant.json')
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

// exprss-handlebars
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')
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

// search
app.get('/search', (req, res) => {
  let keyword = req.query.keyword.toLowerCase()
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword) || 
    restaurant.category.toLowerCase().includes(keyword)
  })
  res.render('index', { restaurants: restaurants, keyword: req.query.keyword })
})

// listen
app.listen(port, () => {
  console.log(`localhost:${port}`)
})