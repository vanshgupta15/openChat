let socket = null;

const socketManager = {
    connectSocket(url) {
        console.log('in frontend socket manager in connectSocket method - Connecting to socket server at', url);
        socket = io(url);
        this.registerSocketEvents();
        return socket;
    },
    
    disconnectSocket() {
        if (socket) {
            console.log('in frontend socket manager in disconnectSocket method - Disconnecting socket.');
            socket.disconnect();
            socket = null;
        }
    },
    
    joinRoom(username, roomId) {
        if (socket) {
            console.log(`in frontend socket manager in joinRoom method - Emitting join-room for user "${username}" in room ${roomId}`);
            socket.emit('join-room', { username, roomId });
        }
    },
    
    sendMessage(roomId, username, message) {
        if (socket) {
            console.log(`in frontend socket manager in sendMessage method - Emitting send-message to room ${roomId}`);
            socket.emit('send-message', { roomId, username, message });
        }
    },
    
    leaveRoom(username, roomId) {
        if (socket) {
            console.log(`in frontend socket manager in leaveRoom method - Emitting leave-room for room ${roomId}`);
            socket.emit('leave-room', { username, roomId });
        }
    },
    
    listenForMessages(callback) {
        if (socket) {
            socket.on('receive-message', callback);
        }
    },
    
    listenForUserJoined(callback) {
        if (socket) {
            socket.on('user-joined', callback);
        }
    },
    
    listenForUserLeft(callback) {
        if (socket) {
            socket.on('user-left', callback);
        }
    },
    
    listenForOnlineUsers(callback) {
        if (socket) {
            socket.on('online-users', callback);
        }
    },
    
    listenForRoomCounts(callback) {
        if (socket) {
            socket.on('room-online-count', callback);
        }
    },
    
    listenForAllRoomCounts(callback) {
        if (socket) {
            socket.on('all-room-counts', callback);
        }
    },
    
    registerSocketEvents() {
        if (socket) {
            socket.on('connect', () => {
                console.log('in frontend socket manager in registerSocketEvents method - Socket connected successfully.');
            });
            socket.on('disconnect', () => {
                console.log('in frontend socket manager in registerSocketEvents method - Socket disconnected.');
            });
            socket.on('connect_error', (error) => {
                console.error('in frontend socket manager in registerSocketEvents method - Socket connection error:', error);
            });
        }
    }
};

window.appSocket = socketManager;
