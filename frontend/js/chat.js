document.addEventListener('DOMContentLoaded', () => {
    console.log('in frontend chat module in DOMContentLoaded event - Initializing chat view.');

    // 1. Read user and room details
    const userData = appUtils.storage.get('openchat_user');
    console.log('in frontend chat module in DOMContentLoaded event - Loaded user session data:', userData);
    
    // Redirect if no session found or invalid properties
    if (!userData || !userData.name || !userData.room || !userData.roomId) {
        console.warn('in frontend chat module in DOMContentLoaded event - Invalid or missing user session data. Redirecting to index.html.');
        window.location.href = 'index.html';
        return;
    }

    const { name: userName, room: roomName, roomId } = userData;
    console.log(`in frontend chat module in DOMContentLoaded event - Session validated. User: "${userName}", Room: "${roomName}" (ID: ${roomId})`);

    // 2. Display room and user information
    document.getElementById('current-user-name').textContent = userName;
    document.getElementById('current-user-avatar').textContent = appUtils.getInitials(userName);
    
    // Assign a random color class to the current user's avatar for consistency
    const colors = ['green', 'purple', 'orange', 'pink'];
    const myColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('current-user-avatar').classList.add(myColor);
    console.log(`in frontend chat module in DOMContentLoaded event - Assigned avatar color: ${myColor} to current user.`);

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
        console.log(`in frontend chat module in renderNotification method - Rendering system notification: "${text}"`);
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
        console.log(`in frontend chat module in renderMessage method - Rendering message from "${author}": "${text}"`);
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
        console.log('in frontend chat module in loadSidebarRooms method - Starting to load sidebar rooms...');
        try {
            const rooms = await appApi.fetchRooms();
            console.log(`in frontend chat module in loadSidebarRooms method - Successfully fetched ${rooms.length} sidebar rooms.`);
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
                    console.log(`in frontend chat module in sidebarRoomClick method - Switching room. User: "${userName}" -> New Room: "${room.roomName}" (ID: ${room._id})`);
                    if (room._id !== roomId) {
                        userData.roomId = room._id;
                        userData.room = room.roomName;
                        appUtils.storage.set('openchat_user', userData);
                        console.log('in frontend chat module in sidebarRoomClick method - Updated session data. Reloading page.');
                        window.location.reload();
                    } else {
                        console.log('in frontend chat module in sidebarRoomClick method - Clicked current room. No action taken.');
                    }
                    
                    const chatSidebar = document.getElementById('chat-sidebar');
                    if (chatSidebar && chatSidebar.classList.contains('visible')) {
                        chatSidebar.classList.remove('visible');
                    }
                });
            });
        } catch (error) {
            console.error('in frontend chat module in loadSidebarRooms method - Failed to load rooms list:', error);
            appUtils.showToast('Failed to load rooms list', 'error');
        }
    };

    // 4. Load message history for active room
    const loadMessageHistory = async () => {
        console.log(`in frontend chat module in loadMessageHistory method - Starting load message history for roomId: ${roomId}`);
        try {
            const messages = await appApi.fetchMessages(roomId);
            console.log(`in frontend chat module in loadMessageHistory method - Fetched ${messages.length} messages.`);
            chatMessagesContainer.innerHTML = '';
            
            if (messages.length === 0) {
                console.log('in frontend chat module in loadMessageHistory method - Message history empty. Rendering join notification.');
                // Seeding a join notification if chat is empty
                renderNotification(`${userName} joined the room`);
            } else {
                console.log('in frontend chat module in loadMessageHistory method - Iterating and rendering history messages...');
                messages.forEach(msg => {
                    const hashChar = msg.username.charCodeAt(0) || 0;
                    const randomColor = colors[hashChar % colors.length];
                    renderMessage(msg.username, msg.message, randomColor, msg.createdAt);
                });
            }
        } catch (error) {
            console.error('in frontend chat module in loadMessageHistory method - Failed to load chat history:', error);
            appUtils.showToast('Failed to load chat history', 'error');
        }
    };

    // 5. Sending messages
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = messageInput.value.trim();
        console.log(`in frontend chat module in chatFormSubmit method - User submitting message: "${text}"`);
        if (!text) {
            console.log('in frontend chat module in chatFormSubmit method - Empty message. Aborting submission.');
            return;
        }

        try {
            console.log(`in frontend chat module in chatFormSubmit method - Calling api.sendMessage for room: ${roomId}`);
            const savedMsg = await appApi.sendMessage(roomId, userName, text);
            console.log('in frontend chat module in chatFormSubmit method - Message successfully saved by backend:', savedMsg);
            renderMessage(savedMsg.username, savedMsg.message, myColor, savedMsg.createdAt);
            
            // Clear input
            messageInput.value = '';
            messageInput.focus();
        } catch (error) {
            console.error('in frontend chat module in chatFormSubmit method - Failed to send message:', error);
            appUtils.showToast('Failed to send message', 'error');
        }
    });

    // Handle leaving room
    document.getElementById('btn-leave-room').addEventListener('click', () => {
        console.log('in frontend chat module in leaveRoom method - User clicked Leave Room. Clearing session data and redirecting.');
        appUtils.storage.remove('openchat_user');
        window.location.href = 'index.html';
    });

    // Handle Create New Room button
    document.getElementById('btn-create-room').addEventListener('click', () => {
        console.log('in frontend chat module in createRoomNav method - Redirecting user to index.html (room selection/creation).');
        window.location.href = 'index.html';
    });

    // Sidebar toggle logic for mobile responsiveness
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const chatSidebar = document.getElementById('chat-sidebar');

    if (sidebarToggle && chatSidebar) {
        sidebarToggle.addEventListener('click', () => {
            console.log('in frontend chat module in sidebarToggle method - Opening mobile sidebar.');
            chatSidebar.classList.add('visible');
        });
    }

    if (sidebarClose && chatSidebar) {
        sidebarClose.addEventListener('click', () => {
            console.log('in frontend chat module in sidebarClose method - Closing mobile sidebar.');
            chatSidebar.classList.remove('visible');
        });
    }

    // Load dynamic data on initiation
    loadSidebarRooms();
    loadMessageHistory();
});
