const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    lowercase: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  google_map: {
    type: String,
    required: true,
  }
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)
module.exports = Restaurant