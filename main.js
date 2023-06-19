const express = require('express')
const main = express()
const routers = require('./src/router')
const db = require('./src/config/db')

main.use(express.json())
main.use(express.urlencoded({ extended: true }))
main.use(routers)

db.connect()
    .then(() => {
        main.listen(4000, () => {
            console.log('app running on port 4000')
        })
    })
    .catch((e) => {
        console.log(e)
    })
