import api from './api';

const authApi = {
    register: async (userData) => {
        try {
            const response = await api.post('/api/auth/register', userData);
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    _id: response.data._id,
                    name: response.data.name,
                    email: response.data.email,
                    organization: response.data.organization,
                    department: response.data.department,
                    role: response.data.role
                }));
            }
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            throw error;
        }
    },

    studentRegister: async (userData) => {
        try {
            const response = await api.post('/api/student/register', userData);
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    _id: response.data._id,
                    name: response.data.name,
                    email: response.data.email,
                    college: response.data.college,
                    role: 'student'
                }));
            }
            return response.data;
        } catch (error) {
            console.error('Student registration error:', error.response?.data || error.message);
            throw error;
        }
    },

    studentLogin: async (credentials) => {
        try {
            const response = await api.post('/api/student/login', credentials);
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    _id: response.data._id,
                    name: response.data.name,
                    email: response.data.email,
                    college: response.data.college,
                    role: 'student'
                }));
            }
            return response.data;
        } catch (error) {
            console.error('Student login error:', error.response?.data || error.message);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    _id: response.data._id,
                    name: response.data.name,
                    email: response.data.email,
                    organization: response.data.organization,
                    department: response.data.department,
                    role: response.data.role
                }));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    },

    getStudentProfile: async () => {
        try {
            const response = await api.get('/api/student/profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching student profile:', error.response?.data || error.message);
            throw error;
        }
    },

    getManagerProfile: async () => {
        try {
            const response = await api.get('/api/auth/profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching manager profile:', error.response?.data || error.message);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export { authApi };
