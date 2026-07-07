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

const formatDate = (dateString = new Date()) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

// Loader overlay helpers
const showLoader = () => {
    console.log('in frontend common module in showLoader method - Showing loader.');
    let loader = document.getElementById('app-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'app-loader';
        loader.className = 'app-loader-overlay';
        loader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loader);
    }
    loader.classList.add('visible');
};

const hideLoader = () => {
    console.log('in frontend common module in hideLoader method - Hiding loader.');
    const loader = document.getElementById('app-loader');
    if (loader) {
        loader.classList.remove('visible');
    }
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

// Dynamic backend URL resolver
const getBackendUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }
    return 'https://openchat-bvzt.onrender.com';
};

// Reusable Custom Modal Dialogs (replacing window.prompt)
const showCustomPrompt = (title, promptText, isCancelable = true, placeholder = 'Enter password...', isPassword = true) => {
    return new Promise((resolve) => {
        const existing = document.getElementById('custom-prompt-modal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'custom-prompt-modal';
        overlay.className = 'modal-overlay';

        const container = document.createElement('div');
        container.className = 'modal-container';

        const cancelBtnHtml = isCancelable 
            ? `<button id="modal-cancel-btn" class="btn-outline" style="border-radius: var(--radius-md); padding: 8px 16px; font-size: 13px;">Cancel</button>` 
            : '';

        container.innerHTML = `
            <div class="modal-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <h3 style="font-size: 16px; text-transform: uppercase;">${title}</h3>
            </div>
            <div class="modal-body" style="margin: 16px 0;">
                <p class="text-muted" style="margin-bottom: 12px; font-size: 14px; text-transform: none;">${promptText}</p>
                <input type="${isPassword ? 'password' : 'text'}" id="modal-input-field" class="input-field" placeholder="${placeholder}" style="width: 100%;">
            </div>
            <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
                ${cancelBtnHtml}
                <button id="modal-submit-btn" class="btn-primary" style="width: auto; padding: 8px 20px; font-size: 13px;">Submit</button>
            </div>
        `;

        overlay.appendChild(container);
        document.body.appendChild(overlay);

        const inputField = document.getElementById('modal-input-field');
        inputField.focus();

        const submit = () => {
            const val = inputField.value;
            overlay.remove();
            resolve(val);
        };

        const cancel = () => {
            overlay.remove();
            resolve(null);
        };

        document.getElementById('modal-submit-btn').addEventListener('click', submit);
        if (isCancelable) {
            document.getElementById('modal-cancel-btn').addEventListener('click', cancel);
        }

        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submit();
            } else if (e.key === 'Escape' && isCancelable) {
                e.preventDefault();
                cancel();
            }
        });
    });
};

// Export to window for global access
window.appUtils = {
    isValidString,
    showToast,
    formatTime,
    formatDate,
    showLoader,
    hideLoader,
    storage,
    getInitials,
    getBackendUrl,
    showCustomPrompt
};
