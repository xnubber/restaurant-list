const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')

mongoose.connect('mongodb://localhost:27017/restaurant-list')

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  restaurantList.results.forEach(rest => {
    const { name, location, category, phone, description, image, rating, google_map } = rest
    Restaurant.create({ name, location, category, phone, description, image, rating, google_map })
  })
  console.log('done')
})
