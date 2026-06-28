const API_BASE_URL = 'http://localhost:5000/api';

const api = {
    // Rooms API
    async fetchRooms() {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to fetch rooms');
            }
            return await response.json();
        } catch (error) {
            console.error('fetchRooms error:', error);
            throw error;
        }
    },

    async fetchRoomById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to fetch room');
            }
            return await response.json();
        } catch (error) {
            console.error('fetchRoomById error:', error);
            throw error;
        }
    },

    async createRoom(roomName) {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomName }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to create room');
            }
            return await response.json();
        } catch (error) {
            console.error('createRoom error:', error);
            throw error;
        }
    },

    // Messages API
    async fetchMessages(roomId) {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${roomId}`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to fetch messages');
            }
            return await response.json();
        } catch (error) {
            console.error('fetchMessages error:', error);
            throw error;
        }
    },

    async sendMessage(roomId, username, message) {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomId, username, message }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to send message');
            }
            return await response.json();
        } catch (error) {
            console.error('sendMessage error:', error);
            throw error;
        }
    }
};

window.appApi = api;
