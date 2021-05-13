// Socket.io to connect to our root path
const socket = io('/')

// Send event to our server and pass in the id of room and user
socket.emit('join-room', ROOM_ID, 10)

socket.on('user-connected', userId => {
	console.log('User connected: ' + userId)
})