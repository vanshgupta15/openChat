document.addEventListener('DOMContentLoaded', async () => {
    console.log('in frontend rooms module in DOMContentLoaded event - Initializing Room Selection page.');

    let currentUser = null;
    let allRooms = [];

    // 1. Initialize Firebase
    try {
        await window.appAuth.initializeFirebase();
    } catch (err) {
        console.error('Failed to initialize Firebase in rooms.js:', err);
        window.appUtils.showToast('Failed to initialize connection to server', 'error');
        window.location.href = 'index.html';
        return;
    }

    // 2. Observe Auth State
    window.appAuth.observeAuthState(async (user) => {
        if (!user) {
            console.warn('in rooms module observeAuthState - User not authenticated. Redirecting to index.html.');
            window.location.href = 'index.html';
            return;
        }

        currentUser = window.appAuth.getCurrentUser();
        console.log('in rooms module observeAuthState - Authenticated user:', currentUser);

        renderNavUser(currentUser);
        await loadRooms();
    });

    // 3. Render Navbar User Info
    const renderNavUser = (user) => {
        const nameEl = document.getElementById('nav-user-name');
        const avatarEl = document.getElementById('nav-user-avatar');

        if (nameEl) nameEl.textContent = user.displayName;

        if (avatarEl) {
            if (user.photoURL) {
                avatarEl.innerHTML = `<img src="${user.photoURL}" alt="avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            } else {
                avatarEl.textContent = window.appUtils.getInitials(user.displayName);
            }
        }
    };

    // 4. Logout Handler
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                window.appUtils.showLoader();
                await window.appAuth.logout();
                window.location.href = 'index.html';
            } catch (err) {
                console.error('Logout error:', err);
                window.appUtils.showToast('Logout failed', 'error');
            } finally {
                window.appUtils.hideLoader();
            }
        });
    }

    // 5. Fetch & Render Rooms
    const loadRooms = async () => {
        try {
            window.appUtils.showLoader();
            allRooms = await window.appApi.fetchRooms();
            console.log('Fetched rooms for selection page:', allRooms);
            renderRooms(allRooms);
        } catch (err) {
            console.error('Error fetching rooms:', err);
            window.appUtils.showToast('Failed to load rooms list.', 'error');
            const grid = document.getElementById('rooms-grid');
            if (grid) {
                grid.innerHTML = `
                    <div class="rooms-empty">
                        <div class="rooms-empty-icon">⚠️</div>
                        <p>Failed to load rooms. Please check your network and try refreshing.</p>
                    </div>
                `;
            }
        } finally {
            window.appUtils.hideLoader();
        }
    };

    const renderRooms = (roomsToDisplay) => {
        const grid = document.getElementById('rooms-grid');
        if (!grid) return;

        if (!roomsToDisplay || roomsToDisplay.length === 0) {
            grid.innerHTML = `
                <div class="rooms-empty">
                    <div class="rooms-empty-icon">💬</div>
                    <h3>No Rooms Found</h3>
                    <p>There are no rooms matching your search. Create one below to get started!</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = '';
        roomsToDisplay.forEach(room => {
            const card = document.createElement('div');
            card.className = 'room-card';

            const isProtected = room.hasPassword !== undefined ? room.hasPassword : !!(room.password && room.password.trim() !== '');
            const badgeHtml = isProtected
                ? `<span class="badge badge-protected"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Protected</span>`
                : `<span class="badge badge-public"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path></svg> Public</span>`;

            const isCreator = currentUser && room.creatorId === currentUser.uid;
            const creatorTag = isCreator ? `<div class="room-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Created by You</div>` : '';

            card.innerHTML = `
                <div class="room-card-header">
                    <div class="room-card-title"><span>#</span>${escapeHtml(room.roomName)}</div>
                    ${badgeHtml}
                </div>
                <div class="room-card-body">
                    ${creatorTag}
                    <div class="room-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        Click enter to join conversation
                    </div>
                </div>
                <div class="room-card-footer">
                    <button class="btn-enter-room" data-id="${room._id}" data-name="${escapeHtml(room.roomName)}" data-protected="${isProtected}">
                        Enter Room
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            `;

            grid.appendChild(card);
        });

        // Add event listeners to "Enter Room" buttons
        grid.querySelectorAll('.btn-enter-room').forEach(btn => {
            btn.addEventListener('click', () => handleEnterRoom(btn));
        });
    };

    const escapeHtml = (str) => {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    // 6. Handle Entering a Room
    const handleEnterRoom = async (btn) => {
        const roomId = btn.getAttribute('data-id');
        const roomName = btn.getAttribute('data-name');
        const isProtected = btn.getAttribute('data-protected') === 'true';

        console.log(`User selected room "${roomName}" (ID: ${roomId}, protected: ${isProtected})`);

        let isAuthorized = sessionStorage.getItem('room_auth_' + roomId) === 'true';

        if (isProtected && !isAuthorized) {
            const passwordAttempt = await window.appUtils.showCustomPrompt(
                'Access Password Required',
                `This room #${roomName} is password-protected. Please enter the password to join.`,
                true,
                'Enter password...'
            );

            if (passwordAttempt === null) {
                window.appUtils.showToast('Password is required to enter this room.', 'info');
                return;
            }

            try {
                window.appUtils.showLoader();
                await window.appApi.verifyRoomPassword(roomId, passwordAttempt);
                sessionStorage.setItem('room_auth_' + roomId, 'true');
                window.appUtils.showToast('Joined room successfully!', 'success');
            } catch (err) {
                console.error('Password verification error:', err);
                window.appUtils.showToast('Invalid room password. Access denied.', 'error');
                return;
            } finally {
                window.appUtils.hideLoader();
            }
        } else {
            // For public room, auto authorize
            sessionStorage.setItem('room_auth_' + roomId, 'true');
        }

        // Set active room and navigate to chat.html
        sessionStorage.setItem('openchat_active_room_id', roomId);
        sessionStorage.setItem('openchat_active_room_name', roomName);
        window.location.href = 'chat.html';
    };

    // 7. Search Input Filter Handler
    const searchInput = document.getElementById('room-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            const filtered = allRooms.filter(r => r.roomName.toLowerCase().includes(query));
            renderRooms(filtered);
        });
    }

    // 8. Create New Room Handler
    const createRoomBtn = document.getElementById('btn-create-room-hero');
    if (createRoomBtn) {
        createRoomBtn.addEventListener('click', async () => {
            const roomName = await window.appUtils.showCustomPrompt(
                'Create New Room',
                'Enter a unique name for your new room (3-30 characters):',
                true,
                'Room name...',
                false
            );

            if (roomName === null) return; // User cancelled

            if (!window.appUtils.isValidString(roomName, 3, 30)) {
                window.appUtils.showToast('Room name must be between 3 and 30 characters.', 'error');
                return;
            }

            const password = await window.appUtils.showCustomPrompt(
                'Set Room Password (Optional)',
                `Protect room #${roomName.trim()} with a password? Leave blank for a public room.`,
                true,
                'Optional password (or leave empty)...',
                true
            );

            if (password === null) return; // User cancelled

            try {
                window.appUtils.showLoader();
                const newRoom = await window.appApi.createRoom(roomName.trim(), password || '');
                console.log('Room created successfully:', newRoom);

                // Authorize creator for this room
                sessionStorage.setItem('room_auth_' + newRoom._id, 'true');
                sessionStorage.setItem('openchat_active_room_id', newRoom._id);
                sessionStorage.setItem('openchat_active_room_name', newRoom.roomName);

                window.appUtils.showToast(`Room #${newRoom.roomName} created! Entering...`, 'success');
                setTimeout(() => {
                    window.location.href = 'chat.html';
                }, 600);
            } catch (err) {
                console.error('Error creating room:', err);
                window.appUtils.showToast(err.message || 'Failed to create room', 'error');
            } finally {
                window.appUtils.hideLoader();
            }
        });
    }
});
