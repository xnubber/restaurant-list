// express
const express = require('express')
const app = express()
const port = 3000
// restaurant data
const restaurantList = require('./restaurant.json')

// exprss-handlebars
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// static
app.use(express.static('public'))

// index page
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

// show page
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.id)
  res.render('show', { restaurant: restaurant })
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