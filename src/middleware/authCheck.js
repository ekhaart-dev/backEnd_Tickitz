const respone = require('../utils/respon')
const jwt = require('jsonwebtoken')

const authCheck = (...roles) => {
    return (req, res, next) => {
        const { authorization } = req.headers
        let isValid = false

        if (!authorization) {
            return respone(res, 401, 'silahkan login terlebih dahulu')
        }

        const token = authorization.replace('Bearer ', '')
        // jwt.verify(token, "SCRET_BNGT", (err, decode) => {
        jwt.verify(token, "SCRET_BNGT", (err, decode) => {
            if (err) {
                return respone(res, 401, err)
            }

            roles.forEach((v) => {
                if (v == decode.role) {
                    isValid = true
                    return
                }
            })

            if (isValid) {
                req.user = decode.data
                return next()
            } else {
                return respone(res, 401, 'anda tidak punya akases')
            }
        })
    }
}

module.exports = authCheck
