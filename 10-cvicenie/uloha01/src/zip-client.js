const http = require('http')
const path = require('path')
const fs = require('fs')

const file = process.argv[2]

if (!file)
    throw Error('No file enetered!')

const request = http.request('http://localhost:9999', { method: 'POST' })

request.setHeader('filename', path.basename(file))
fs.createReadStream(file, { encoding:'utf-8' }).pipe(request, console.error)
request.on('response', res => {
    if (res.statusCode !== 200) {
        console.error(`Server returned ${res.statusMessage}`)
        process.exit(1)
    }
    res.pipe(fs.createWriteStream(`${trimExtension(file)}.gz`), console.error)
});

function trimExtension(file) {
    return file.substring(0, file.lastIndexOf('.'))
}

