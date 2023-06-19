const {Pool} = require('pg')
const { host } = require('pg/lib/defaults')

const pool = new Pool({
    user: 'ekha',
    host: 'localhost',
    database: 'db_tickitz_new',
    password: 'eka12345'
})


module.exports = pool