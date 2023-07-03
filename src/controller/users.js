const ctrl = {}
const model = require('../model/users')
const respone = require('../utils/respon')
// const hash = require('../utils/hash')
const argon = require('argon2')

ctrl.fetchData = async (req, res) => {
    try {
    // console.log(req.user)
        const result = await model.getByUser(req.user.username)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

ctrl.save = async (req, res) => {
    try {
        const hasPassword = await argon.hash(req.body.password)
        const params = {
            ...req.body,
            password: hasPassword
        }

        const result = await model.saveData(params)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

ctrl.update = async (req, res) => {
    try {
        const result = await model.updateData(req.user)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

ctrl.delete = async (req, res) => {
    try {
        const result = await model.deleteData(req.user)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

module.exports = ctrl
