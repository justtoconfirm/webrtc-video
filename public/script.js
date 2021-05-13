// Socket.io to connect to our root path
const socket = io('/')

// Get reference to the video element in the DOM
const videoGrid = document.getElementById('video-grid')

// Peer will generate the id of the user
const myPeer = new Peer(undefined, {
	host: '/',
	port: '3001'
})

const myVideo = document.createElement('video')
// Mute the user's own video for the user
myVideo.muted = true

// Store users connected to in object
const peers = {}

// Get video and audio from the user's webcam using promise as a stream
navigator.mediaDevices.getUserMedia({
	video: true,
	audio: true
}).then(stream => {
	addVideoStream(myVideo, stream)

	// Answer a call so we can display another user's video
	myPeer.on('call', call => {
		// Answer the call and sent the new user our video stream
		call.answer(stream)

		const video = document.createElement('video')

		// Show video calls to all users in each window when a user joins
		call.on('stream', userVideoStream => {
			addVideoStream(video, userVideoStream)
		})
	})

	// Allow users to be connected
	socket.on('user-connected', userId => {
		connectToNewUser(userId, stream)
	})
})

// Disconnect users from the server
socket.on('user-disconnected', userId => {
	// Make sure we close the connection to the correct user if users exist
	if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
	// Send event to our server and pass in the id of room and user
	socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
	// Call user and sent the our video stream
	const call = myPeer.call(userId, stream)
	const video = document.createElement('video')
	// Listen to the other user's video stream
	call.on('stream', userVideoStream => {
		addVideoStream(video, userVideoStream)
	})
	// Close event for when user leaves the video chat
	call.on('close', () => {
		video.remove()
	})

	// Every user id to every call made
	peers[userId] = call
}

/*
socket.on('user-connected', userId => {
	console.log('User connected: ' + userId)
})
*/

function addVideoStream(video, stream) {
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		// Load stream and play the video on the page
		video.play()
	})

	// Append video onto the page
	videoGrid.append(video)
}