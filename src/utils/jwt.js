const jwt = require('jsonwebtoken')

module.exports = {
    genToken: (username,role) => {

        const payload = {
            username:username,
            role:role
        }

        const token = jwt.sign(payload, "SCRET_BNGT", { expiresIn: '1h' })
        return token
    }
}
