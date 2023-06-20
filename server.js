require('dotenv').config();
const WebSocket = require('ws')
const http = require('http')
const StaticServer = require('node-static').Server
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 1234

const staticServer = new StaticServer('../', { cache: 3600, gzip: true })

const server = http.createServer((request, response) => {
  request.addListener('end', () => {
    staticServer.serve(request, response)
  }).resume()
})
const wss = new WebSocket.Server({ server })

wss.on('connection', (conn, req) => setupWSConnection(conn, req, { gc: req.url.slice(1) !== 'prosemirror-versions' }))

server.listen(port, host, () => {
    console.log(`running at '${host}' on port ${port}`);
})