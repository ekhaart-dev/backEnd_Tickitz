const express = require('express')
const route = express.Router()
const ctrl = require('../controller/booking')
const authCheck = require('../middleware/authCheck')

//? admin and user can accsess
route.get('/', authCheck('admin', 'user'), ctrl.fetchBy)

//! only admin can accsess
route.post('/', authCheck('admin'), ctrl.save)

//! only admin can accsess
route.put('/:id', authCheck('admin'), ctrl.patch)

module.exports = route
