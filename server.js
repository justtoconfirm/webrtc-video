const express = require('express')
const app = express()
// Create a server based on Express to be used with socket.io
const server = require('http').Server(app)
// Pass the server to Socket.io to know what server is being used
const io = require('socket.io')(server)

// Start server and listen on the specified port
server.listen(3000)