const express = require('express')
const app = express()
// Create a server based on Express to be used with socket.io
const server = require('http').Server(app)
// Pass the server to Socket.io to know what server is being used
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

// Setup the route
app.set('view engine', 'ejs')
// Setup the static folder containing our JavaScript and CSS code
app.use(express.static('public'))

// Home route
app.get('/', (req, res) => {
	/*
		Redirect users to the correct room and provide a dynamic URL using uuid
		This dynamic URL will be generated each time the user goes to the homepage
	*/
	res.redirect(`/${uuidV4()}`)
})

// Create rooms for our users with dynamic parameter
app.get('/:room', (req, res) => {
	// Room value comes from the URL parameter
	res.render('room', { roomId: req.params.room })
})

// Connect to the application through Socket.io
io.on('connection', socket => {
	// Event to join the room called when user connects to a room and pass in ID of room and user
	socket.on('join-room', (roomId, userId) => {

		// Join the room to the current user
		socket.join(roomId)
		// Send message to the room and sent to all users in that room
		socket.broadcast.to(roomId).emit('user-connected', userId)

		// Run this function when a user disconnects to clear their video from chat
		socket.on('disconnect', () => {
			// Pass in the id of the user that disconnected
			socket.broadcast.to(roomId).emit('user-disconnected', userId)
		})
		
		//console.log(roomId, userId)
	})
})

// Start server and listen on the specified port
server.listen(3000)