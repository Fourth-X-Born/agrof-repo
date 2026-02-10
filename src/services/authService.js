import api from './api';

// Authentication Service
const authService = {
    // Login user
    login: async (email, password) => {
        const response = await api.post('/auth/login', { identifier: email, password });
        if (response.success && response.data) {
            // Store auth data
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
            }
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response;
    },

    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('user');
    },

    // Update user profile (phone and district)
    updateProfile: async (profileData) => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || !currentUser.id) {
            throw new Error("User not logged in");
        }
        const response = await api.put(`/profile/update?farmerId=${currentUser.id}`, profileData);
        if (response.success && response.data) {
            // Update stored user data
            const updatedUser = { ...currentUser, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response;
    },
};

export default authService;
