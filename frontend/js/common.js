// Form validation helpers
const isValidString = (str, minLength = 3, maxLength = 30) => {
    console.log(`in frontend common module in isValidString method - Checking string validity. Length limits: ${minLength}-${maxLength}. Value: "${str}"`);
    if (!str || typeof str !== 'string') {
        console.log('in frontend common module in isValidString method - Invalid: not a string or empty.');
        return false;
    }
    const trimmed = str.trim();
    const valid = trimmed.length >= minLength && trimmed.length <= maxLength;
    console.log(`in frontend common module in isValidString method - Validation result: ${valid}`);
    return valid;
};

// Toast Notification System
const showToast = (message, type = 'error') => {
    console.log(`in frontend common module in showToast method - Displaying toast notification. Type: ${type}, Message: "${message}"`);
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Date formatters
const formatTime = (dateString = new Date()) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Session storage helpers
const storage = {
    set: (key, value) => {
        console.log(`in frontend common module in storage.set method - Writing key "${key}" to sessionStorage:`, value);
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('in frontend common module in storage.set method - Error saving to sessionStorage', e);
        }
    },
    get: (key) => {
        try {
            const item = sessionStorage.getItem(key);
            const val = item ? JSON.parse(item) : null;
            console.log(`in frontend common module in storage.get method - Reading key "${key}" from sessionStorage. Found:`, val);
            return val;
        } catch (e) {
            console.error('in frontend common module in storage.get method - Error reading from sessionStorage', e);
            return null;
        }
    },
    remove: (key) => {
        console.log(`in frontend common module in storage.remove method - Removing key "${key}" from sessionStorage.`);
        sessionStorage.removeItem(key);
    },
    clear: () => {
        console.log('in frontend common module in storage.clear method - Clearing sessionStorage.');
        sessionStorage.clear();
    }
};

// Generate initials or short name for avatar
const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

// Export to window for global access
window.appUtils = {
    isValidString,
    showToast,
    formatTime,
    storage,
    getInitials
};
