document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('join-form');
    const nameInput = document.getElementById('display-name');
    const newRoomInput = document.getElementById('new-room');
    const roomRadios = document.querySelectorAll('input[name="room"]');
    const roomOptions = document.querySelectorAll('.room-option');

    // Handle styling for radio buttons
    roomRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Remove active class from all
            roomOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to selected
            if(e.target.checked) {
                e.target.closest('.room-option').classList.add('active');
            }
            // Clear new room input if a radio is selected
            newRoomInput.value = '';
        });
    });

    // Clear radio buttons if user starts typing a new room
    newRoomInput.addEventListener('input', () => {
        if(newRoomInput.value.trim().length > 0) {
            roomRadios.forEach(radio => radio.checked = false);
            roomOptions.forEach(opt => opt.classList.remove('active'));
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const displayName = nameInput.value.trim();
        let selectedRoom = '';

        // Determine which room is selected
        if (newRoomInput.value.trim()) {
            selectedRoom = newRoomInput.value.trim();
            if (!appUtils.isValidString(selectedRoom, 3, 30)) {
                appUtils.showToast('New room name must be 3-30 characters', 'error');
                return;
            }
        } else {
            const checkedRadio = document.querySelector('input[name="room"]:checked');
            if (checkedRadio) {
                selectedRoom = checkedRadio.value;
            } else {
                appUtils.showToast('Please select or create a room', 'error');
                return;
            }
        }

        if (!appUtils.isValidString(displayName, 3, 20)) {
            appUtils.showToast('Display name must be 3-20 characters', 'error');
            return;
        }

        // Save to session storage
        appUtils.storage.set('openchat_user', {
            name: displayName,
            room: selectedRoom
        });

        // Redirect to chat
        window.location.href = 'chat.html';
    });
});
