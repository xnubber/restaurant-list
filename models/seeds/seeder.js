const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  restaurantList.results.forEach(rest => {
    const { name, location, category, phone, description, image, rating, google_map } = rest
    Restaurant.create({ name, location, category, phone, description, image, rating, google_map })
  })
  console.log('done')
})
