import api from './api';

const authApi = {
    register: async (userData) => {
        try {
            const response = await api.post('/api/auth/register', userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        // You could add JWT decoding here if needed
        return token;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export { authApi };
