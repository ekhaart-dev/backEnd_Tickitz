const express = require('express')
const route = express.Router()
const ctrl = require('../controller/users')
const authCheck = require('../middleware/authCheck')

route.get('/', authCheck('admin', 'user'), ctrl.fetchData)
route.post('/', ctrl.save)
route.patch('/', ctrl.update)
route.delete('/', ctrl.delete)

module.exports = route
