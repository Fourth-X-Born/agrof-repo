import api from './api';

// Admin Authentication Service
const adminAuthService = {
    // Login admin
    login: async (email, password) => {
        const response = await api.post('/admin/auth/login', { email, password });
        if (response.success && response.data) {
            // Store admin auth data
            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
            }
            localStorage.setItem('admin', JSON.stringify(response.data));
        }
        return response;
    },

    // Register new admin
    register: async (adminData) => {
        const response = await api.post('/admin/auth/register', adminData);
        return response;
    },

    // Logout admin
    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
    },

    // Get current admin from localStorage
    getCurrentAdmin: () => {
        const admin = localStorage.getItem('admin');
        return admin ? JSON.parse(admin) : null;
    },

    // Check if admin is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('admin');
    },
};

export default adminAuthService;
