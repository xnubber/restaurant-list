const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantList = require('../../restaurant.json')
const db = require('../../config/mongoose')

const SEED_USER = [
  {
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678'
  },
  {
  name: 'user2',
  email: 'user2@example.com',
  password: '12345678'
  }
]


db.once('open', async () => {
  await User.deleteMany({})
  await Restaurant.deleteMany({})
  for(let i = 0; i < 2; i++) {
    const seedUser = new User({
      name: SEED_USER[i].name,
      email: SEED_USER[i].email,
      password: SEED_USER[i].password
    })
    await seedUser.save() 
  }

  for (let i = 0; i < 3; i++) {
    const email = SEED_USER[0].email
    const user = await User.findOne({ email })
    const userId = user._id
    const { name, location, category, phone, description, image, rating, google_map } = restaurantList.results[i]
    const restaurant = new Restaurant({ name, location, category, phone, description, image, rating, google_map, userId})
    await restaurant.save()
  }
  for (let i = 3; i < 6; i++) {
    const email = SEED_USER[1].email
    const user = await User.findOne({ email })
    const userId = user._id
    const { name, location, category, phone, description, image, rating, google_map } = restaurantList.results[i]
    const restaurant = new Restaurant({ name, location, category, phone, description, image, rating, google_map, userId })
    await restaurant.save()
  }
  console.log('done')
  process.exit()
})
