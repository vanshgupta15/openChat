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
    document.getElementById('chat-room-count').textContent = '1 member online'; // Initialize with 1 (the user themselves)

    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');

    // UI helper: Scroll to bottom
    const scrollToBottom = () => {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    };

    // UI helper: Clear Message Input
    const clearMessageInput = () => {
        messageInput.value = '';
        messageInput.focus();
    };

    // UI helper: Render/Display Notification
    const displayNotification = (text, type = 'join', timestamp = new Date()) => {
        console.log(`in frontend chat module in displayNotification method - Rendering system notification: "${text}"`);
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

    // UI helper: Render/Display Chat Message
    const displayMessage = (author, text, createdAt = new Date()) => {
        console.log(`in frontend chat module in displayMessage method - Rendering message from "${author}": "${text}"`);
        const isMe = author.toLowerCase() === userName.toLowerCase();
        
        // Find avatar color
        const hashChar = author.charCodeAt(0) || 0;
        const authorColor = isMe ? myColor : colors[hashChar % colors.length];
        
        const div = document.createElement('div');
        div.className = `message ${isMe ? 'me' : ''}`;
        div.innerHTML = `
            <div class="message-avatar ${authorColor}">${appUtils.getInitials(author)}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author ${authorColor}">${author}</span>
                    <span class="message-time">${appUtils.formatTime(createdAt)}</span>
                </div>
                <div class="message-text">${text}</div>
            </div>
        `;
        chatMessagesContainer.appendChild(div);
        scrollToBottom();
    };

    // UI helper: Display Online Users (sets online counts in the active header & current room item)
    const displayOnlineUsers = (users) => {
        console.log(`in frontend chat module in displayOnlineUsers method - Displaying online users in room ${roomId}. Count: ${users.length}`);
        
        // Update header subtitle
        const count = users.length;
        document.getElementById('chat-room-count').textContent = `${count} ${count === 1 ? 'member' : 'members'} online`;
        
        // Update members list badge
        const membersBtn = document.querySelector('button[title="Members"] span');
        if (membersBtn) {
            membersBtn.textContent = count;
        }

        // Update active room online count in the sidebar
        const roomEl = document.querySelector(`.room-item[data-id="${roomId}"] .room-online`);
        if (roomEl) {
            roomEl.textContent = `${count} online`;
        }
    };

    // 3. Socket communication setup
    const initializeChat = () => {
        console.log('in frontend chat module in initializeChat method - Connecting and registering Socket.IO events...');
        
        // Connect to the socket server
        appSocket.connectSocket('http://localhost:5000');

        // Listen for new messages
        appSocket.listenForMessages((msg) => {
            console.log('in frontend chat module in initializeChat - Received message event:', msg);
            displayMessage(msg.username, msg.message, msg.createdAt);
        });

        // Listen for user joined notification
        appSocket.listenForUserJoined((data) => {
            console.log('in frontend chat module in initializeChat - User joined event:', data);
            displayNotification(data.message, 'join', data.timestamp);
        });

        // Listen for user left notification
        appSocket.listenForUserLeft((data) => {
            console.log('in frontend chat module in initializeChat - User left event:', data);
            displayNotification(data.message, 'leave', data.timestamp);
        });

        // Listen for the online user list updates
        appSocket.listenForOnlineUsers((users) => {
            console.log('in frontend chat module in initializeChat - Received updated online users list:', users);
            displayOnlineUsers(users);
        });

        // Listen for a specific room's count updates
        appSocket.listenForRoomCounts(({ roomId: rId, count }) => {
            console.log(`in frontend chat module in initializeChat - Room count update for room ${rId}: ${count}`);
            const roomEl = document.querySelector(`.room-item[data-id="${rId}"] .room-online`);
            if (roomEl) {
                roomEl.textContent = `${count} online`;
            }
            if (rId === roomId) {
                // If it is the current room, update header elements too
                document.getElementById('chat-room-count').textContent = `${count} ${count === 1 ? 'member' : 'members'} online`;
                const membersBtn = document.querySelector('button[title="Members"] span');
                if (membersBtn) {
                    membersBtn.textContent = count;
                }
            }
        });

        // Listen for all room counts sent during handshake
        appSocket.listenForAllRoomCounts((counts) => {
            console.log('in frontend chat module in initializeChat - Received all active room counts:', counts);
            Object.keys(counts).forEach(rId => {
                const count = counts[rId];
                const roomEl = document.querySelector(`.room-item[data-id="${rId}"] .room-online`);
                if (roomEl) {
                    roomEl.textContent = `${count} online`;
                }
                if (rId === roomId) {
                    document.getElementById('chat-room-count').textContent = `${count} ${count === 1 ? 'member' : 'members'} online`;
                    const membersBtn = document.querySelector('button[title="Members"] span');
                    if (membersBtn) {
                        membersBtn.textContent = count;
                    }
                }
            });
        });

        // Emit room join event
        appSocket.joinRoom(userName, roomId);
    };

    // 4. Load rooms and populate sidebar dynamically
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
                
                // Initialize rooms with 0 online (active room will be updated by server immediately after join)
                const count = isActive ? 1 : 0;
                
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
                        // Notify the server about leaving the current room before reloading/unloading
                        appSocket.leaveRoom(userName, roomId);
                        appSocket.disconnectSocket();
                        
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

    // 5. Load message history for active room
    const loadMessageHistory = async () => {
        console.log(`in frontend chat module in loadMessageHistory method - Starting load message history for roomId: ${roomId}`);
        try {
            const messages = await appApi.fetchMessages(roomId);
            console.log(`in frontend chat module in loadMessageHistory method - Fetched ${messages.length} messages.`);
            chatMessagesContainer.innerHTML = '';
            
            if (messages.length === 0) {
                console.log('in frontend chat module in loadMessageHistory method - Message history empty. Rendering welcome notification.');
                displayNotification(`Welcome to the #${roomName} room!`);
            } else {
                console.log('in frontend chat module in loadMessageHistory method - Rendering history messages...');
                messages.forEach(msg => {
                    displayMessage(msg.username, msg.message, msg.createdAt);
                });
            }
        } catch (error) {
            console.error('in frontend chat module in loadMessageHistory method - Failed to load chat history:', error);
            appUtils.showToast('Failed to load chat history', 'error');
        }
    };

    // 6. Sending messages via socket.js
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = messageInput.value.trim();
        console.log(`in frontend chat module in chatFormSubmit method - User submitting message: "${text}"`);
        if (!text) {
            console.log('in frontend chat module in chatFormSubmit method - Empty message. Aborting submission.');
            return;
        }

        try {
            console.log(`in frontend chat module in chatFormSubmit method - Sending message via socket: ${roomId}`);
            appSocket.sendMessage(roomId, userName, text);
            
            // Clear input field and refocus
            clearMessageInput();
        } catch (error) {
            console.error('in frontend chat module in chatFormSubmit method - Failed to send message:', error);
            appUtils.showToast('Failed to send message', 'error');
        }
    });

    // Handle leaving room (clears session and returns to join page)
    document.getElementById('btn-leave-room').addEventListener('click', () => {
        console.log('in frontend chat module in leaveRoom method - User clicked Leave Room. Clearing session data and redirecting.');
        appSocket.leaveRoom(userName, roomId);
        appSocket.disconnectSocket();
        appUtils.storage.remove('openchat_user');
        window.location.href = 'index.html';
    });

    // Handle Create New Room button (redirects to join page)
    document.getElementById('btn-create-room').addEventListener('click', () => {
        console.log('in frontend chat module in createRoomNav method - Redirecting user to index.html (room selection/creation).');
        appSocket.leaveRoom(userName, roomId);
        appSocket.disconnectSocket();
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

    // Initialize sidebar list, history, and then establish real-time socket connections
    (async () => {
        await loadSidebarRooms();
        await loadMessageHistory();
        initializeChat();
    })();
});
