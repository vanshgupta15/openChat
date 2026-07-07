let authInstance = null;
let isInitialized = false;

const authManager = {
    async initializeFirebase() {
        if (isInitialized) return;
        console.log('in frontend auth module in initializeFirebase method - Fetching configuration from backend...');
        try {
            const response = await fetch(`${window.appUtils.getBackendUrl()}/api/auth/config`);
            if (!response.ok) {
                throw new Error('Failed to fetch Firebase configuration');
            }
            const config = await response.json();
            console.log('in frontend auth module in initializeFirebase method - Initializing Firebase SDK...');
            
            firebase.initializeApp(config);
            authInstance = firebase.auth();
            isInitialized = true;
            console.log('in frontend auth module in initializeFirebase method - Firebase Auth initialized successfully.');
        } catch (error) {
            console.error('in frontend auth module in initializeFirebase method - Error initializing Firebase:', error);
            throw error;
        }
    },

    async loginWithGoogle() {
        console.log('in frontend auth module in loginWithGoogle method - Initiating Google Sign-In...');
        try {
            if (!isInitialized) await this.initializeFirebase();
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await authInstance.signInWithPopup(provider);
            console.log('in frontend auth module in loginWithGoogle method - Google Sign-In successful for:', JSON.stringify(result.user));
            return result.user;
        } catch (error) {
            console.error('in frontend auth module in loginWithGoogle method - Google Sign-In error:', JSON.stringify(error));
            throw error;
        }
    },

    async logout() {
        console.log('in frontend auth module in logout method - Logging out user...');
        try {
            if (!isInitialized) await this.initializeFirebase();
            await authInstance.signOut();
            console.log('in frontend auth module in logout method - Logout completed successfully.');
        } catch (error) {
            console.error('in frontend auth module in logout method - Logout error:', error);
            throw error;
        }
    },

    getCurrentUser() {
        if (authInstance) {
            const user = authInstance.currentUser;
            if (user) {
                return {
                    uid: user.uid,
                    displayName: user.displayName || user.email || 'Anonymous',
                    photoURL: user.photoURL || '',
                    email: user.email
                };
            }
        }
        return null;
    },

    async getIdToken() {
        if (authInstance && authInstance.currentUser) {
            return await authInstance.currentUser.getIdToken(true);
        }
        return null;
    },

    isAuthenticated() {
        return authInstance && authInstance.currentUser !== null;
    },

    observeAuthState(callback) {
        console.log('in frontend auth module in observeAuthState method - Registering auth state observer...');
        if (!authInstance) {
            const checkInterval = setInterval(() => {
                if (authInstance) {
                    clearInterval(checkInterval);
                    authInstance.onAuthStateChanged(callback);
                }
            }, 100);
        } else {
            authInstance.onAuthStateChanged(callback);
        }
    }
};

window.appAuth = authManager;
