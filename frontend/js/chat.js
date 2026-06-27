document.addEventListener('DOMContentLoaded', () => {
    // 1. Read user and room details
    const userData = appUtils.storage.get('openchat_user');
    
    // Redirect if no session found
    if (!userData || !userData.name || !userData.room) {
        window.location.href = 'index.html';
        return;
    }

    const { name: userName, room: roomName } = userData;

    // 2. Display room and user information
    document.getElementById('current-user-name').textContent = userName;
    document.getElementById('current-user-avatar').textContent = appUtils.getInitials(userName);
    
    // Assign a random color class to the current user's avatar for consistency
    const colors = ['green', 'purple', 'orange', 'pink'];
    const myColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('current-user-avatar').classList.add(myColor);

    document.getElementById('chat-room-title').textContent = `# ${roomName}`;
    
    // Handle Sidebar Active Room highlighting (Mock logic for UI purposes)
    const sidebarRooms = document.querySelectorAll('.room-item');
    let roomExists = false;
    sidebarRooms.forEach(room => {
        room.classList.remove('active');
        if (room.getAttribute('data-room').toLowerCase() === roomName.toLowerCase()) {
            room.classList.add('active');
            roomExists = true;
        }
    });

    // If room is new/custom, inject it into the sidebar
    if (!roomExists) {
        const roomList = document.getElementById('sidebar-room-list');
        const newRoomEl = document.createElement('div');
        newRoomEl.className = 'room-item active';
        newRoomEl.setAttribute('data-room', roomName);
        newRoomEl.innerHTML = `
            <div class="room-hash">#</div>
            <div class="room-info">
                <span class="room-name">${roomName}</span>
                <span class="room-online">1 online</span>
            </div>
        `;
        roomList.prepend(newRoomEl);
    }

    const chatMessagesContainer = document.getElementById('chat-messages');

    // Helper: Scroll to bottom
    const scrollToBottom = () => {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    };

    // Helper: Render Notification
    const renderNotification = (text, type = 'join') => {
        const div = document.createElement('div');
        div.className = `message-notification ${type === 'leave' ? 'leave' : ''}`;
        
        const icon = type === 'leave' ? '👋' : '👋'; // simplified emoji for demo
        
        div.innerHTML = `
            <span class="notification-text">${icon} ${text}</span>
            <span class="notification-time">${appUtils.formatTime()}</span>
        `;
        chatMessagesContainer.appendChild(div);
        scrollToBottom();
    };

    // Helper: Render Chat Message
    const renderMessage = (author, text, colorClass = myColor) => {
        const isMe = author.toLowerCase() === userName.toLowerCase();
        const div = document.createElement('div');
        div.className = `message ${isMe ? 'me' : ''}`;
        div.innerHTML = `
            <div class="message-avatar ${colorClass}">${appUtils.getInitials(author)}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author ${colorClass}">${author}</span>
                    <span class="message-time">${appUtils.formatTime()}</span>
                </div>
                <div class="message-text">${text}</div>
            </div>
        `;
        chatMessagesContainer.appendChild(div);
        scrollToBottom();
    };

    // Initial mock events
    setTimeout(() => {
        renderNotification(`${userName} joined the room`);
    }, 500);

    // Mock incoming message for demonstration
    setTimeout(() => {
        renderMessage('Alice', 'Hello everyone! 👋', 'green');
    }, 2000);

    // 3. Sending messages (initially mock/local)
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = messageInput.value.trim();
        if (!text) return;

        // Render own message
        renderMessage(userName, text, myColor);
        
        // Clear input
        messageInput.value = '';
        messageInput.focus();
    });

    // Handle leaving room
    document.getElementById('btn-leave-room').addEventListener('click', () => {
        appUtils.storage.remove('openchat_user');
        window.location.href = 'index.html';
    });

    // Handle Create New Room button (redirect to index for now)
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

    // Close sidebar on mobile when a room is clicked
    document.querySelectorAll('.room-item').forEach(item => {
        item.addEventListener('click', () => {
            if (chatSidebar.classList.contains('visible')) {
                chatSidebar.classList.remove('visible');
            }
        });
    });
});
