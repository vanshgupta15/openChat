let socket = null;

const socketManager = {
    async connectSocket(url) {
        console.log('in frontend socket manager in connectSocket method - Connecting to socket server at', url);
        try {
            const token = await window.appAuth.getIdToken();
            console.log('in frontend socket manager in connectSocket method - Token retrieved:', token ? 'exists' : 'null/empty');
            socket = io(url, {
                auth: {
                    token: token
                }
            });
            console.log('in frontend socket manager in connectSocket method - Socket instance created:', socket ? 'success' : 'failed');
            this.registerSocketEvents();
            return socket;
        } catch (error) {
            console.error('in frontend socket manager in connectSocket method - Socket connection token retrieval failed:', error);
            throw error;
        }
    },
    
    disconnectSocket() {
        if (socket) {
            console.log('in frontend socket manager in disconnectSocket method - Disconnecting socket.');
            socket.disconnect();
            socket = null;
        }
    },
    
    joinRoom(roomId) {
        console.log(`in frontend socket manager in joinRoom method - joinRoom called for room: ${roomId}. Socket exists:`, !!socket);
        if (socket) {
            console.log(`in frontend socket manager in joinRoom method - Emitting join-room for room ${roomId}`);
            socket.emit('join-room', { roomId });
        }
    },
    
    sendMessage(roomId, message) {
        console.log(`in frontend socket manager in sendMessage method - sendMessage called. Socket exists:`, !!socket);
        if (socket) {
            console.log(`in frontend socket manager in sendMessage method - Emitting send-message to room ${roomId}`);
            socket.emit('send-message', { roomId, message });
        }
    },
    
    leaveRoom(roomId) {
        console.log(`in frontend socket manager in leaveRoom method - leaveRoom called. Socket exists:`, !!socket);
        if (socket) {
            console.log(`in frontend socket manager in leaveRoom method - Emitting leave-room for room ${roomId}`);
            socket.emit('leave-room', { roomId });
        }
    },
    
    listenForMessages(callback) {
        console.log('in frontend socket manager in listenForMessages method - Registering receive-message listener. Socket exists:', !!socket);
        if (socket) {
            socket.on('receive-message', callback);
        }
    },
    
    listenForUserJoined(callback) {
        console.log('in frontend socket manager in listenForUserJoined method - Registering user-joined listener. Socket exists:', !!socket);
        if (socket) {
            socket.on('user-joined', callback);
        }
    },
    
    listenForUserLeft(callback) {
        console.log('in frontend socket manager in listenForUserLeft method - Registering user-left listener. Socket exists:', !!socket);
        if (socket) {
            socket.on('user-left', callback);
        }
    },
    
    listenForOnlineUsers(callback) {
        console.log('in frontend socket manager in listenForOnlineUsers method - Registering online-users listener. Socket exists:', !!socket);
        if (socket) {
            socket.on('online-users', callback);
        }
    },
    
    listenForRoomCounts(callback) {
        console.log('in frontend socket manager in listenForRoomCounts method - Registering room-online-count listener. Socket exists:', !!socket);
        if (socket) {
            socket.on('room-online-count', callback);
        }
    },
    
    listenForAllRoomCounts(callback) {
        console.log('in frontend socket manager in listenForAllRoomCounts method - Registering all-room-counts listener. Socket exists:', !!socket);
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
