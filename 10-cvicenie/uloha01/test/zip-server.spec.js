const {spawn} = require('child_process')
const assert = require("assert");
const path = require('path')
const fs = require('fs');

const resourceDir = `${__dirname}/resources`
const serverDir = `${__dirname}/../src/data`
const startServer = () => spawn('node', [`${__dirname}/../src/zip-server.js`])
const startClient = (file) => spawn('node', [
    `${__dirname}/../src/zip-client.js`, file,
])

describe("Zip server and client tests", function () {

    it('should send text file', function () {
        cleardir(serverDir)

        const server = startServer()
        const client = startClient(
            `${resourceDir}/testdata.txt`)

        client.on('close', () => {
            server.kill()
            assertContains(serverDir, 'testdata.txt')
            assertContains(resourceDir, 'testdata.gz')
            cleardir(serverDir)
        })
    })
})

function cleardir(dir) {
    fs.readdir(dir, (err, files) => {
        files.filter(f => f !== '.keep')
            .forEach(f => fs.unlinkSync(path.join(dir, f)))
    })
}

function assertContains(dir, filename) {
    fs.readdir(dir, (err, files) => {
        files = files.filter(f => f !== '.keep')
        assert(files.some(f => (new RegExp(filename + '$')).test(f)))
    })
}
