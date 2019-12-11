const http = require('http')
const fs = require('fs')
const { pipeline } = require('stream')

const { createGzip } = require('zlib')
const dataDir = `${__dirname}/data`

let server = http.createServer()
server.listen(9999, 'localhost')
    .on('request', (req, res) => {

        const file = fs.createWriteStream(
            `${dataDir}/${Date.now()}-${req.headers['filename']}`
        )

        req.pipe(file, err => console.error)

        pipeline(req, createGzip(), res, err => {
            if (err) {
                console.error(err)
                res.statusCode = 500;
                res.statusMessage = 'Internal Server Error'
                res.end()
            }
        })
    });