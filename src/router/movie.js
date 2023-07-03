const express = require('express');
const route = express.Router();
const ctrl = require('../controller/movie');
const authCheck = require('../middleware/authCheck');
const upload = require('../middleware/upload');
const cloudinary = require('../utils/cloudinary');

//? admin and user can accsess
route.get('/', authCheck('admin', 'user'), ctrl.fetchBy)

//! only admin can accsess
route.post('/', authCheck('admin'), upload.single('banner'), ctrl.save)

//! only admin can accsess
route.put('/:id', authCheck('admin'), ctrl.patch)

module.exports = route
