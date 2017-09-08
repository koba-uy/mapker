const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const exec = require('child_process').exec
const express = require('express')
const fs = require('fs')
const os = require('os')
const path = require('path')

const api = express()

api.use(bodyParser.json({ limit: '2mb' }))
api.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }))
api.use(cookieParser())

api.get('/', (req, res) => {
    res.send('Mapker API')
})

api.post('/parseBusTour', (req, res) => {
    let tmpFilePath = path.join(os.tmpdir(), 'temp')
    let tomateloRoutingMachinePath = path.join(__dirname, 'internal/tomatelo-routing-machine/build/tomatelo-routing-machine')

    fs.writeFileSync(tmpFilePath, req.body.busTourRawData)
    
    exec(tomateloRoutingMachinePath + ' ' + tmpFilePath, (err, stdout, stderr) => {
        if (err) res.status(500).send(stderr)
        else {
            console.log(stdout)
            res.send(stdout)
        }
    })
})

module.exports = api