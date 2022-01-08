const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const session = require('express-session')
const restaurantList = require('./restaurant.json')
const methodOverride = require('method-override')
const routes = require('./routes')
const errorHandler = require('./helpers/errorHandler')


const usePassport = require('./config/passport')
// mongoose
require('./config/mongoose')

// 
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const sessionConfig = {
  secret: 'ThisIsMySecret', 
  resave: false,
  saveUninitialized: true}

app.use(session(sessionConfig))
usePassport(app)




app.use(routes)

// exprss-handlebars
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// static
app.use(express.static('public'))

// error handler
app.use(errorHandler)

// listen
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})