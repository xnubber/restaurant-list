const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const Restaurant = require('./models/restaurant')
const restaurantList = require('./restaurant.json')
const methodOverride = require('method-override')
const routes = require('./routes')

// mongoose
require('./config/mongoose')

// 
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

// exprss-handlebars
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// static
app.use(express.static('public'))

// error handler
app.use((err, req, res, next) => {
  const { message, statusCode } = err
  res.status(statusCode).render('error', { message })
})

// listen
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})