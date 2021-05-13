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

// Get video and audio from the user's webcam using promise as a stream
navigator.mediaDevices.getUserMedia({
	video: true,
	audio: true
}).then(stream => {
	addVideoStream(myVideo, stream)
})

myPeer.on('open', id => {
	// Send event to our server and pass in the id of room and user
	socket.emit('join-room', ROOM_ID, id)
})

socket.on('user-connected', userId => {
	console.log('User connected: ' + userId)
})

function addVideoStream(video, stream) {
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		// Load stream and play the video on the page
		video.play()
	})

	// Append video onto the page
	videoGrid.append(video)
}