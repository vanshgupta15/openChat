document.addEventListener('DOMContentLoaded', () => {
    console.log('in frontend join-room module in DOMContentLoaded event - Initializing join-room view.');

    const form = document.getElementById('join-form');
    const nameInput = document.getElementById('display-name');
    const newRoomInput = document.getElementById('new-room');
    const roomListContainer = document.getElementById('available-rooms');

    // Dynamically load rooms from database
    const loadRooms = async () => {
        console.log('in frontend join-room module in loadRooms method - Starting to load rooms...');
        try {
            const rooms = await appApi.fetchRooms();
            console.log(`in frontend join-room module in loadRooms method - Fetched ${rooms.length} rooms from backend.`);
            roomListContainer.innerHTML = '';
            
            if (rooms.length === 0) {
                console.log('in frontend join-room module in loadRooms method - No rooms available in the database.');
                roomListContainer.innerHTML = '<p class="text-muted" style="padding: 10px;">No active rooms. Create one below!</p>';
                return;
            }

            rooms.forEach((room, index) => {
                const label = document.createElement('label');
                label.className = `room-option ${index === 0 ? 'active' : ''}`;
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'room';
                radio.value = room._id;
                radio.setAttribute('data-name', room.roomName);
                if (index === 0) {
                    radio.checked = true;
                }

                label.appendChild(radio);
                
                const nameSpan = document.createElement('span');
                nameSpan.className = 'room-name';
                nameSpan.textContent = room.roomName;
                label.appendChild(nameSpan);

                // Mock dynamic counts for online badge (to maintain aesthetic)
                const mockCounts = {
                    'general': 12,
                    'javascript': 8,
                    'movies': 5,
                    'sports': 7
                };
                const count = mockCounts[room.roomName.toLowerCase()] || 1;
                const onlineSpan = document.createElement('span');
                onlineSpan.className = 'online-badge';
                onlineSpan.textContent = `${count} online`;
                label.appendChild(onlineSpan);

                roomListContainer.appendChild(label);

                // Handle change styling
                radio.addEventListener('change', (e) => {
                    console.log(`in frontend join-room module in roomRadioSelection method - User selected existing room: "${room.roomName}" (ID: ${room._id})`);
                    document.querySelectorAll('.room-option').forEach(opt => opt.classList.remove('active'));
                    if (e.target.checked) {
                        e.target.closest('.room-option').classList.add('active');
                    }
                    newRoomInput.value = '';
                });
            });
        } catch (error) {
            console.error('in frontend join-room module in loadRooms method - Failed to load rooms:', error);
            appUtils.showToast('Error loading rooms from backend', 'error');
            roomListContainer.innerHTML = '<p class="text-danger" style="padding: 10px;">Could not connect to backend.</p>';
        }
    };

    // Clear radio buttons if user starts typing a new room
    newRoomInput.addEventListener('input', () => {
        if (newRoomInput.value.trim().length > 0) {
            console.log('in frontend join-room module in newRoomInput method - User typing a custom room name. Clearing pre-selected room options.');
            document.querySelectorAll('input[name="room"]').forEach(radio => radio.checked = false);
            document.querySelectorAll('.room-option').forEach(opt => opt.classList.remove('active'));
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('in frontend join-room module in formSubmit method - Join room form submission intercepted.');
        
        const displayName = nameInput.value.trim();
        let selectedRoomId = '';
        let selectedRoomName = '';
 
        console.log(`in frontend join-room module in formSubmit method - Validating display name: "${displayName}"`);
        if (!appUtils.isValidString(displayName, 3, 20)) {
            console.warn(`in frontend join-room module in formSubmit method - Validation failed. Name: "${displayName}" must be 3-20 characters.`);
            appUtils.showToast('Display name must be 3-20 characters', 'error');
            return;
        }

        try {
            // Determine which room is selected
            if (newRoomInput.value.trim()) {
                const newRoomName = newRoomInput.value.trim();
                console.log(`in frontend join-room module in formSubmit method - User opted to create a new room: "${newRoomName}"`);
                if (!appUtils.isValidString(newRoomName, 3, 30)) {
                    console.warn(`in frontend join-room module in formSubmit method - New room name validation failed: "${newRoomName}"`);
                    appUtils.showToast('New room name must be 3-30 characters', 'error');
                    return;
                }
                
                // Create room on the backend
                console.log(`in frontend join-room module in formSubmit method - Calling api.createRoom for: "${newRoomName}"`);
                const createdRoom = await appApi.createRoom(newRoomName);
                selectedRoomId = createdRoom._id;
                selectedRoomName = createdRoom.roomName;
                console.log(`in frontend join-room module in formSubmit method - New room successfully created. ID: ${selectedRoomId}`);
            } else {
                const checkedRadio = document.querySelector('input[name="room"]:checked');
                if (checkedRadio) {
                    selectedRoomId = checkedRadio.value;
                    selectedRoomName = checkedRadio.getAttribute('data-name');
                    console.log(`in frontend join-room module in formSubmit method - User selected existing room: "${selectedRoomName}" (ID: ${selectedRoomId})`);
                } else {
                    console.warn('in frontend join-room module in formSubmit method - Submission aborted: No room selected or entered.');
                    appUtils.showToast('Please select or create a room', 'error');
                    return;
                }
            }

            // Save to session storage
            console.log('in frontend join-room module in formSubmit method - Saving user data to sessionStorage...');
            appUtils.storage.set('openchat_user', {
                name: displayName,
                roomId: selectedRoomId,
                room: selectedRoomName
            });
 
            // Redirect to chat
            console.log('in frontend join-room module in formSubmit method - Redirecting user to chat.html');
            window.location.href = 'chat.html';
        } catch (error) {
            console.error('in frontend join-room module in formSubmit method - Error occurred during form submission execution flow:', error);
            appUtils.showToast(error.message || 'Error joining room', 'error');
        }
    });

    loadRooms();
});
