const express = require('express')
const path = require('path')

const api = require('./api/src')
const app = express()

// Put all backend endpoints under '/api'
app.use('/api', api)

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'app/dist')))
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/dist/index.html'))
})

app.listen(process.env.PORT || 5000)