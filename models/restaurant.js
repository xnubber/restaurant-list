const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    lowercase: true,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  rating: {
    type: Number,
    require: true,
  },
  google_map: {
    type: String,
    require: true,
  }
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)
module.exports = Restaurant