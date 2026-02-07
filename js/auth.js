import { API } from './api.js';

export const Auth = {
    isAuthenticated() {
        return !!localStorage.getItem('auth_token');
    },

    getToken() {
        return localStorage.getItem('auth_token');
    },

    currentUser() {
        const userStr = localStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    async login(email, password, remember = false) {
        try {
            console.log("Auth.login called");
            const response = await API.login(email, password);
            console.log("API response received:", response);

            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('auth_user', JSON.stringify(response.user));

            // Verify persistence
            const savedToken = localStorage.getItem('auth_token');
            if (!savedToken) console.error("CRITICAL: Token was not saved to localStorage!");
            else console.log("Token saved successfully.");

            return { success: true };
        } catch (error) {
            console.error("Auth.login error:", error);
            return { success: false, message: error.message };
        }
    },

    async register(name, email, password) {
        try {
            const response = await API.register({ name, email, password });
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('auth_user', JSON.stringify(response.user));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '../index.html';
    },

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '../pages/login.html';
        }
    },

    redirectIfAuth() {
        if (this.isAuthenticated()) {
            window.location.href = '../pages/dashboard.html';
        }
    }
};
