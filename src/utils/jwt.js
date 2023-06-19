const jwt = require('jsonwebtoken')

module.exports = {
    genToken: (data) => {
        const payload = {
            data: data,
            role: 'admin'
        }

        const token = jwt.sign(payload, "SCRET_BNGT", { expiresIn: '1h' })
        return token
    }
}
