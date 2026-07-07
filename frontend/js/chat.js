document.addEventListener('DOMContentLoaded', async () => {
    console.log('in frontend chat module in DOMContentLoaded event - Bootstrapping chat view.');

    // 1. Initialize Firebase
    try {
        await window.appAuth.initializeFirebase();
    } catch (err) {
        console.error('Failed to initialize Firebase in chat.js:', err);
        window.location.href = 'index.html';
        return;
    }

    let currentUser = null;
    let activeRoomId = sessionStorage.getItem('openchat_active_room_id');
    let activeRoomName = sessionStorage.getItem('openchat_active_room_name');

    // 2. Observe Auth State
    window.appAuth.observeAuthState(async (user) => {
        if (!user) {
            console.warn('in frontend chat module observeAuthState - User not authenticated. Redirecting to index.html.');
            window.location.href = 'index.html';
            return;
        }

        currentUser = window.appAuth.getCurrentUser();
        console.log('in frontend chat module observeAuthState - Authenticated user:', currentUser);

        // Display current user profile
        displayCurrentUser(currentUser);

        // Load rooms sidebar and message history
        await bootstrapChatFlow();
    });

    const displayCurrentUser = (user) => {
        console.log(`in frontend chat module displayCurrentUser method - Rendering user profile: ${user.displayName}`);
        document.getElementById('current-user-name').textContent = user.displayName;
        const avatarEl = document.getElementById('current-user-avatar');
        if (user.photoURL) {
            avatarEl.innerHTML = `<img src="${user.photoURL}" alt="avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border: 1.5px solid var(--spidey-red);">`;
            avatarEl.className = 'avatar'; 
        } else {
            avatarEl.textContent = appUtils.getInitials(user.displayName);
            avatarEl.innerHTML = '';
            const colors = ['green', 'purple', 'orange', 'pink'];
            const myColor = colors[Math.floor(Math.random() * colors.length)];
            avatarEl.className = `avatar ${myColor}`;
        }
    };

    const bootstrapChatFlow = async () => {
        try {
            window.appUtils.showLoader();
            
            // Load rooms
            const rooms = await appApi.fetchRooms();
            if (rooms.length === 0) {
                window.appUtils.showToast('No rooms available on server.', 'error');
                window.appUtils.hideLoader();
                return;
            }

            // Default to first room if activeRoomId is invalid/missing
            const activeRoomExists = rooms.some(r => r._id === activeRoomId);
            if (!activeRoomId || !activeRoomExists) {
                activeRoomId = rooms[0]._id;
                activeRoomName = rooms[0].roomName;
                sessionStorage.setItem('openchat_active_room_id', activeRoomId);
                sessionStorage.setItem('openchat_active_room_name', activeRoomName);
            }

            document.getElementById('chat-room-title').textContent = `# ${activeRoomName}`;
            
            // Populate sidebar list
            renderSidebarRooms(rooms);
            
            // Load messages history
            await loadMessageHistory();
            
            // Initialize Socket IO
            initializeChat();
        } catch (error) {
            console.error('Error during chat flow bootstrap:', error);
            window.appUtils.showToast('Failed to load chat components', 'error');
        } finally {
            window.appUtils.hideLoader();
        }
    };

    const renderSidebarRooms = (rooms) => {
        const roomList = document.getElementById('sidebar-room-list');
        roomList.innerHTML = '';
        
        rooms.forEach(room => {
            const isActive = room._id === activeRoomId;
            const roomItem = document.createElement('div');
            roomItem.className = `room-item ${isActive ? 'active' : ''}`;
            roomItem.setAttribute('data-id', room._id);
            roomItem.setAttribute('data-room', room.roomName);
            
            const count = isActive ? 1 : 0;
            
            roomItem.innerHTML = `
                <div class="room-hash">#</div>
                <div class="room-info">
                    <span class="room-name">${room.roomName}</span>
                    <span class="room-online">${count} online</span>
                </div>
            `;
            roomList.appendChild(roomItem);
            
            // Sidebar room selection click listener
            roomItem.addEventListener('click', () => {
                console.log(`in frontend chat module sidebarClick - Selecting room: "${room.roomName}" (ID: ${room._id})`);
                if (room._id !== activeRoomId) {
                    appSocket.leaveRoom(activeRoomId);
                    appSocket.disconnectSocket();
                    
                    sessionStorage.setItem('openchat_active_room_id', room._id);
                    sessionStorage.setItem('openchat_active_room_name', room.roomName);
                    
                    window.location.reload();
                }
            });
        });
    };

    // UI helpers matching spec
    const chatMessagesContainer = document.getElementById('chat-messages');
    
    const scrollToBottom = () => {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    };

    const clearMessageBox = () => {
        const messageInput = document.getElementById('message-input');
        messageInput.value = '';
        messageInput.focus();
    };

    const displayNotification = (text, type = 'join', timestamp = new Date()) => {
        console.log(`in frontend chat module displayNotification - Rendering notification: "${text}"`);
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

    const displayMessages = (messagesList) => {
        chatMessagesContainer.innerHTML = '';
        messagesList.forEach(msg => {
            const isMe = msg.userId === currentUser.uid;
            
            const div = document.createElement('div');
            div.className = `message ${isMe ? 'me' : ''}`;
            
            let avatarContent = `<div class="message-avatar">${appUtils.getInitials(msg.displayName)}</div>`;
            if (msg.photoURL) {
                avatarContent = `<div class="message-avatar" style="border: 1px solid var(--border-color);"><img src="${msg.photoURL}" alt="avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;"></div>`;
            }
            
            div.innerHTML = `
                ${avatarContent}
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-author">${msg.displayName}</span>
                        <span class="message-time">${appUtils.formatTime(msg.createdAt)}</span>
                    </div>
                    <div class="message-text">${msg.message}</div>
                </div>
            `;
            chatMessagesContainer.appendChild(div);
        });
        scrollToBottom();
    };

    const displayOnlineUsers = (users) => {
        console.log(`in frontend chat module displayOnlineUsers - Count: ${users.length}`);
        const count = users.length;
        document.getElementById('chat-room-count').textContent = `${count} ${count === 1 ? 'member' : 'members'} online`;
        
        const membersBtn = document.querySelector('button[title="Members"] span');
        if (membersBtn) {
            membersBtn.textContent = count;
        }

        const roomEl = document.querySelector(`.room-item[data-id="${activeRoomId}"] .room-online`);
        if (roomEl) {
            roomEl.textContent = `${count} online`;
        }
    };

    const loadMessageHistory = async () => {
        console.log(`in frontend chat module loadMessageHistory - roomId: ${activeRoomId}`);
        try {
            const messages = await appApi.fetchMessages(activeRoomId);
            if (messages.length === 0) {
                chatMessagesContainer.innerHTML = '';
                displayNotification(`Welcome to the #${activeRoomName} room!`);
            } else {
                displayMessages(messages);
            }
        } catch (error) {
            console.error('Failed to load message history:', error);
            appUtils.showToast('Failed to load message history', 'error');
        }
    };

    const initializeChat = () => {
        console.log('in frontend chat module initializeChat - Connecting socket...');
        appSocket.connectSocket(window.appUtils.getBackendUrl());

        // Socket listeners
        appSocket.listenForMessages((msg) => {
            console.log('in frontend chat module initializeChat - Received receive-message event:', msg);
            const isMe = msg.userId === currentUser.uid;
            const div = document.createElement('div');
            div.className = `message ${isMe ? 'me' : ''}`;
            
            let avatarContent = `<div class="message-avatar">${appUtils.getInitials(msg.displayName)}</div>`;
            if (msg.photoURL) {
                avatarContent = `<div class="message-avatar" style="border: 1px solid var(--border-color);"><img src="${msg.photoURL}" alt="avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;"></div>`;
            }
            
            div.innerHTML = `
                ${avatarContent}
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-author">${msg.displayName}</span>
                        <span class="message-time">${appUtils.formatTime(msg.createdAt)}</span>
                    </div>
                    <div class="message-text">${msg.message}</div>
                </div>
            `;
            chatMessagesContainer.appendChild(div);
            scrollToBottom();
        });

        appSocket.listenForUserJoined((data) => {
            displayNotification(data.message, 'join', data.timestamp);
        });

        appSocket.listenForUserLeft((data) => {
            displayNotification(data.message, 'leave', data.timestamp);
        });

        appSocket.listenForOnlineUsers((users) => {
            displayOnlineUsers(users);
        });

        appSocket.listenForRoomCounts(({ roomId: rId, count }) => {
            const roomEl = document.querySelector(`.room-item[data-id="${rId}"] .room-online`);
            if (roomEl) {
                roomEl.textContent = `${count} online`;
            }
            if (rId === activeRoomId) {
                displayOnlineUsers({ length: count });
            }
        });

        appSocket.listenForAllRoomCounts((counts) => {
            Object.keys(counts).forEach(rId => {
                const count = counts[rId];
                const roomEl = document.querySelector(`.room-item[data-id="${rId}"] .room-online`);
                if (roomEl) {
                    roomEl.textContent = `${count} online`;
                }
                if (rId === activeRoomId) {
                    displayOnlineUsers({ length: count });
                }
            });
        });

        // Join active room
        appSocket.joinRoom(activeRoomId);
    };

    // Chat form submit
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();
        if (!text) return;

        try {
            appSocket.sendMessage(activeRoomId, text);
            clearMessageBox();
        } catch (error) {
            console.error('Failed to send message:', error);
            appUtils.showToast('Failed to send message', 'error');
        }
    });

    // Sign out/Leave room button
    document.getElementById('btn-leave-room').addEventListener('click', async () => {
        console.log('in frontend chat module logout click - Logging out.');
        appSocket.leaveRoom(activeRoomId);
        appSocket.disconnectSocket();
        
        try {
            await window.appAuth.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
        window.location.href = 'index.html';
    });

    // Create New Room button inside sidebar
    document.getElementById('btn-create-room').addEventListener('click', async () => {
        const roomName = prompt('Enter a new room name (3-30 characters):');
        if (!roomName) return;
        
        const trimmed = roomName.trim();
        if (trimmed.length < 3 || trimmed.length > 30) {
            appUtils.showToast('Room name must be between 3 and 30 characters', 'error');
            return;
        }

        try {
            window.appUtils.showLoader();
            const createdRoom = await appApi.createRoom(trimmed);
            
            // Success: Switch to new room!
            appSocket.leaveRoom(activeRoomId);
            appSocket.disconnectSocket();
            
            sessionStorage.setItem('openchat_active_room_id', createdRoom._id);
            sessionStorage.setItem('openchat_active_room_name', createdRoom.roomName);
            
            window.location.reload();
        } catch (error) {
            console.error('Create room error:', error);
            appUtils.showToast(error.message || 'Failed to create room', 'error');
        } finally {
            window.appUtils.hideLoader();
        }
    });

    // Sidebar toggles for mobile responsiveness
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
});
