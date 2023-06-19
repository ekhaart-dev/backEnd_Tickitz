const express = require('express')
const route = express.Router()
const ctrl = require('../controller/auth')

route.post('/', ctrl.Login)

module.exports = route