const API_BASE_URL = 'http://localhost:5000/api';

const api = {
    // Rooms API
    async fetchRooms() {
        console.log('in frontend api module in fetchRooms method - Initiating GET request to fetch all rooms.');
        try {
            const response = await fetch(`${API_BASE_URL}/rooms`);
            console.log(`in frontend api module in fetchRooms method - Response status: ${response.status}`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to fetch rooms');
            }
            const data = await response.json();
            console.log('in frontend api module in fetchRooms method - Rooms successfully fetched:', data);
            return data;
        } catch (error) {
            console.error('in frontend api module in fetchRooms method - fetchRooms error:', error);
            throw error;
        }
    },

    async fetchRoomById(id) {
        console.log(`in frontend api module in fetchRoomById method - Initiating GET request for room ID: ${id}`);
        try {
            const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
            console.log(`in frontend api module in fetchRoomById method - Response status: ${response.status}`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to fetch room');
            }
            const data = await response.json();
            console.log(`in frontend api module in fetchRoomById method - Room fetched for ID ${id}:`, data);
            return data;
        } catch (error) {
            console.error(`in frontend api module in fetchRoomById method - fetchRoomById error for ID ${id}:`, error);
            throw error;
        }
    },

    async createRoom(roomName) {
        console.log(`in frontend api module in createRoom method - Initiating POST request to create room: "${roomName}"`);
        try {
            const response = await fetch(`${API_BASE_URL}/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomName }),
            });
            console.log(`in frontend api module in createRoom method - Response status: ${response.status}`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to create room');
            }
            const data = await response.json();
            console.log('in frontend api module in createRoom method - Room successfully created:', data);
            return data;
        } catch (error) {
            console.error('in frontend api module in createRoom method - createRoom error:', error);
            throw error;
        }
    },

    // Messages API
    async fetchMessages(roomId) {
        console.log(`in frontend api module in fetchMessages method - Initiating GET request to fetch messages for room ID: ${roomId}`);
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${roomId}`);
            console.log(`in frontend api module in fetchMessages method - Response status: ${response.status}`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to fetch messages');
            }
            const data = await response.json();
            console.log(`in frontend api module in fetchMessages method - Messages fetched for room ${roomId}:`, data);
            return data;
        } catch (error) {
            console.error(`in frontend api module in fetchMessages method - fetchMessages error for room ${roomId}:`, error);
            throw error;
        }
    },

    async sendMessage(roomId, username, message) {
        console.log(`in frontend api module in sendMessage method - Initiating POST request to send message in room ID: ${roomId} by "${username}"`);
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomId, username, message }),
            });
            console.log(`in frontend api module in sendMessage method - Response status: ${response.status}`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to send message');
            }
            const data = await response.json();
            console.log('in frontend api module in sendMessage method - Message successfully sent and saved:', data);
            return data;
        } catch (error) {
            console.error('in frontend api module in sendMessage method - sendMessage error:', error);
            throw error;
        }
    }
};

window.appApi = api;
