const express = require('express')
const app = express()

const path = require('path')
const session = require('express-session')
const restaurantList = require('./restaurant.json')
const methodOverride = require('method-override')
const routes = require('./routes')
const errorHandler = require('./helpers/errorHandler')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PORT = process.env.PORT


const usePassport = require('./config/passport')
// mongoose
require('./config/mongoose')

// 
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))

// static
app.use(express.static('public'))
app.use(methodOverride('_method'))
const sessionConfig = {
  secret: ThisIsMySecret, 
  resave: false,
  saveUninitialized: true
}
// exprss-handlebars
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// session
app.use(session(sessionConfig))

// passport
usePassport(app)
app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

// error handler
app.use(errorHandler)

// listen
app.listen(PORT, () => {
  console.log(`Express is listening on localhost:${PORT}`)
})