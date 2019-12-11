const { spawn } = require('child_process')

const server = spawn('node', [ `${__dirname}/../src/zip-server.js`])
server.stdout.pipe(process.stdout)
server.stderr.pipe(process.stderr)

const client = spawn('node',  [
    `${__dirname}/../src/zip-client.js`,
    `${__dirname}/resources/testdata.txt`,
])
client.stdout.pipe(process.stdout)
client.stderr.pipe(process.stderr)

client.on('close', () => server.kill())