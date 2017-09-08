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
    if (!req.body.busTourRawData) throw Error('busTourRawData is required')

    let tmpFilePath = path.join(os.tmpdir(), 'temp')
    let tomateloRoutingMachinePath = path.join(__dirname, 'internal/tomatelo-routing-machine/build/tomatelo-routing-machine')

    fs.writeFileSync(tmpFilePath, req.body.busTourRawData)
    
    exec(tomateloRoutingMachinePath + ' ' + tmpFilePath, (err, stdout, stderr) => {
        if (err) res.status(500).send(stderr)
        else {
            res.send(stdout)
        }
    })
})

api.post('/parseDevicesTours', (req, res) => {
    if (!req.body.busTourRawData) throw Error('busTourRawData is required')
    if (!req.body.devicesToursRawData) throw Error('devicesToursRawData is required')
    
    let busTour = []
    let devicesTours = {}
    let output = []
    
    busTour = req.body.busTourRawData.split('\n').map(line => {
        let aux = line.split(' ')
        return {
            ts: Math.floor(parseInt(aux[0]) / 1000),
            lat: aux[1],
            lng: aux[2]
        }
    })
    
    req.body.devicesToursRawData.split('\n').forEach(line => {
        if (!line.length) return;

        let aux = line.split('\t')
        let macAddr = aux[0].trim()
        let ts = Math.floor(+Date.parse(aux[1].trim()) / 1000)
        
        if (!devicesTours[macAddr]) {
            devicesTours[macAddr] = { fst: ts, lst: ts }
        }
        else {
            devicesTours[macAddr].lst = ts
        }
    })

    Object.keys(devicesTours).forEach(macAddr => {
        let deviceTour = devicesTours[macAddr]

        if (deviceTour.lst - deviceTour.fst > 5) {
            let fst, lst

            for (var i = 0; i < busTour.length - 2; i++) {
                if (busTour[i].ts <= deviceTour.fst && busTour[i + 1].ts >= deviceTour.fst) {
                    fst = busTour[i]
                }
                if (busTour[i].ts <= deviceTour.lst && busTour[i + 1].ts >= deviceTour.lst) {
                    lst = busTour[i]
                }
            }
            
            if (fst && lst) {
                output.push({
                    macAddr,
                    fst: fst,
                    lst: lst
                })
            }
        }
    })

    res.send(output)
})

module.exports = api