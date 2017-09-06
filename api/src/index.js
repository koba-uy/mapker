const express = require('express')
const api = express()

api.get('/', (req, res) => {
    res.send('v1.0')
})

module.exports = api