// Socket.io to connect to our root path
const socket = io('/')
// Peer will generate the id of the user
const myPeer = new Peer(undefined, {
	host: '/',
	port: '3001'
})

myPeer.on('open', id => {
	// Send event to our server and pass in the id of room and user
	socket.emit('join-room', ROOM_ID, id)
})

socket.on('user-connected', userId => {
	console.log('User connected: ' + userId)
})