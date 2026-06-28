document.addEventListener('DOMContentLoaded', () => {
    // 1. Read user and room details
    const userData = appUtils.storage.get('openchat_user');
    
    // Redirect if no session found or invalid properties
    if (!userData || !userData.name || !userData.room || !userData.roomId) {
        window.location.href = 'index.html';
        return;
    }

    const { name: userName, room: roomName, roomId } = userData;

    // 2. Display room and user information
    document.getElementById('current-user-name').textContent = userName;
    document.getElementById('current-user-avatar').textContent = appUtils.getInitials(userName);
    
    // Assign a random color class to the current user's avatar for consistency
    const colors = ['green', 'purple', 'orange', 'pink'];
    const myColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('current-user-avatar').classList.add(myColor);

    document.getElementById('chat-room-title').textContent = `# ${roomName}`;
    
    // Set online count badge based on room type
    const mockCounts = {
        'general': 12,
        'javascript': 8,
        'movies': 5,
        'sports': 7
    };
    const activeCount = mockCounts[roomName.toLowerCase()] || 1;
    document.getElementById('chat-room-count').textContent = `${activeCount} members online`;

    const chatMessagesContainer = document.getElementById('chat-messages');

    // Helper: Scroll to bottom
    const scrollToBottom = () => {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    };

    // Helper: Render Notification
    const renderNotification = (text, type = 'join', timestamp = new Date()) => {
        const div = document.createElement('div');
        div.className = `message-notification ${type === 'leave' ? 'leave' : ''}`;
        const icon = type === 'leave' ? '👋' : '👋'; 
        
        div.innerHTML = `
            <span class="notification-text">${icon} ${text}</span>
            <span class="notification-time">${appUtils.formatTime(timestamp)}</span>
        `;
        chatMessagesContainer.appendChild(div);
        scrollToBottom();
    };

    // Helper: Render Chat Message
    const renderMessage = (author, text, colorClass = 'orange', timestamp = new Date()) => {
        const isMe = author.toLowerCase() === userName.toLowerCase();
        
        // Use standard author color class if it is not me, or myColor if it is me
        const authorColor = isMe ? myColor : colorClass;
        
        const div = document.createElement('div');
        div.className = `message ${isMe ? 'me' : ''}`;
        div.innerHTML = `
            <div class="message-avatar ${authorColor}">${appUtils.getInitials(author)}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author ${authorColor}">${author}</span>
                    <span class="message-time">${appUtils.formatTime(timestamp)}</span>
                </div>
                <div class="message-text">${text}</div>
            </div>
        `;
        chatMessagesContainer.appendChild(div);
        scrollToBottom();
    };

    // 3. Load rooms and populate sidebar dynamically
    const loadSidebarRooms = async () => {
        try {
            const rooms = await appApi.fetchRooms();
            const roomList = document.getElementById('sidebar-room-list');
            roomList.innerHTML = '';
            
            rooms.forEach(room => {
                const isActive = room._id === roomId;
                const roomItem = document.createElement('div');
                roomItem.className = `room-item ${isActive ? 'active' : ''}`;
                roomItem.setAttribute('data-id', room._id);
                roomItem.setAttribute('data-room', room.roomName);
                
                const count = mockCounts[room.roomName.toLowerCase()] || 1;
                
                roomItem.innerHTML = `
                    <div class="room-hash">#</div>
                    <div class="room-info">
                        <span class="room-name">${room.roomName}</span>
                        <span class="room-online">${count} online</span>
                    </div>
                `;
                roomList.appendChild(roomItem);
                
                // Event listener for room switching
                roomItem.addEventListener('click', () => {
                    if (room._id !== roomId) {
                        userData.roomId = room._id;
                        userData.room = room.roomName;
                        appUtils.storage.set('openchat_user', userData);
                        window.location.reload();
                    }
                    
                    const chatSidebar = document.getElementById('chat-sidebar');
                    if (chatSidebar && chatSidebar.classList.contains('visible')) {
                        chatSidebar.classList.remove('visible');
                    }
                });
            });
        } catch (error) {
            appUtils.showToast('Failed to load rooms list', 'error');
        }
    };

    // 4. Load message history for active room
    const loadMessageHistory = async () => {
        try {
            const messages = await appApi.fetchMessages(roomId);
            chatMessagesContainer.innerHTML = '';
            
            if (messages.length === 0) {
                // Seeding a join notification if chat is empty
                renderNotification(`${userName} joined the room`);
            } else {
                messages.forEach(msg => {
                    const hashChar = msg.username.charCodeAt(0) || 0;
                    const randomColor = colors[hashChar % colors.length];
                    renderMessage(msg.username, msg.message, randomColor, msg.createdAt);
                });
            }
        } catch (error) {
            appUtils.showToast('Failed to load chat history', 'error');
        }
    };

    // 5. Sending messages
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = messageInput.value.trim();
        if (!text) return;

        try {
            const savedMsg = await appApi.sendMessage(roomId, userName, text);
            renderMessage(savedMsg.username, savedMsg.message, myColor, savedMsg.createdAt);
            
            // Clear input
            messageInput.value = '';
            messageInput.focus();
        } catch (error) {
            appUtils.showToast('Failed to send message', 'error');
        }
    });

    // Handle leaving room
    document.getElementById('btn-leave-room').addEventListener('click', () => {
        appUtils.storage.remove('openchat_user');
        window.location.href = 'index.html';
    });

    // Handle Create New Room button
    document.getElementById('btn-create-room').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Sidebar toggle logic for mobile responsiveness
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const chatSidebar = document.getElementById('chat-sidebar');

    if (sidebarToggle && chatSidebar) {
        sidebarToggle.addEventListener('click', () => {
            chatSidebar.classList.add('visible');
        });
    }

    if (sidebarClose && chatSidebar) {
        sidebarClose.addEventListener('click', () => {
            chatSidebar.classList.remove('visible');
        });
    }

    // Load dynamic data on initiation
    loadSidebarRooms();
    loadMessageHistory();
});
