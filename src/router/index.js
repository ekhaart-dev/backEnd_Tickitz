const express = require('express')
const route = express.Router()

const movie = require('./movie')
const schedule = require('./schedule')
const booking = require('./booking')
const genre = require('./genre')
const users = require('./users')
const auth = require('./auth')

route.use('/movie', movie)
route.use('/booking', booking)
route.use('/schedule', schedule)
route.use('/genre', genre)
route.use('/users', users)
route.use('/auth', auth)

module.exports = route