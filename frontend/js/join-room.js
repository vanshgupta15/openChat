document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('join-form');
    const nameInput = document.getElementById('display-name');
    const newRoomInput = document.getElementById('new-room');
    const roomListContainer = document.getElementById('available-rooms');

    // Dynamically load rooms from database
    const loadRooms = async () => {
        try {
            const rooms = await appApi.fetchRooms();
            roomListContainer.innerHTML = '';
            
            if (rooms.length === 0) {
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
                    document.querySelectorAll('.room-option').forEach(opt => opt.classList.remove('active'));
                    if (e.target.checked) {
                        e.target.closest('.room-option').classList.add('active');
                    }
                    newRoomInput.value = '';
                });
            });
        } catch (error) {
            appUtils.showToast('Error loading rooms from backend', 'error');
            roomListContainer.innerHTML = '<p class="text-danger" style="padding: 10px;">Could not connect to backend.</p>';
        }
    };

    // Clear radio buttons if user starts typing a new room
    newRoomInput.addEventListener('input', () => {
        if (newRoomInput.value.trim().length > 0) {
            document.querySelectorAll('input[name="room"]').forEach(radio => radio.checked = false);
            document.querySelectorAll('.room-option').forEach(opt => opt.classList.remove('active'));
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const displayName = nameInput.value.trim();
        let selectedRoomId = '';
        let selectedRoomName = '';

        if (!appUtils.isValidString(displayName, 3, 20)) {
            appUtils.showToast('Display name must be 3-20 characters', 'error');
            return;
        }

        try {
            // Determine which room is selected
            if (newRoomInput.value.trim()) {
                const newRoomName = newRoomInput.value.trim();
                if (!appUtils.isValidString(newRoomName, 3, 30)) {
                    appUtils.showToast('New room name must be 3-30 characters', 'error');
                    return;
                }
                
                // Create room on the backend
                const createdRoom = await appApi.createRoom(newRoomName);
                selectedRoomId = createdRoom._id;
                selectedRoomName = createdRoom.roomName;
            } else {
                const checkedRadio = document.querySelector('input[name="room"]:checked');
                if (checkedRadio) {
                    selectedRoomId = checkedRadio.value;
                    selectedRoomName = checkedRadio.getAttribute('data-name');
                } else {
                    appUtils.showToast('Please select or create a room', 'error');
                    return;
                }
            }

            // Save to session storage
            appUtils.storage.set('openchat_user', {
                name: displayName,
                roomId: selectedRoomId,
                room: selectedRoomName
            });

            // Redirect to chat
            window.location.href = 'chat.html';
        } catch (error) {
            appUtils.showToast(error.message || 'Error joining room', 'error');
        }
    });

    loadRooms();
});
