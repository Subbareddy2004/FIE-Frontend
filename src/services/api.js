import axios from 'axios';

// Create axios instance with base URL from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        // Get the appropriate token based on the route
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response error:', {
            status: error.response?.status,
            message: error.message,
            url: error.config?.url,
            method: error.config?.method
        });

        // Handle specific error cases
        if (error.response?.status === 401) {
            // Clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Get the current path
            const currentPath = window.location.pathname;

            // Define public routes that don't require redirection
            const publicRoutes = [
                '/login',
                '/student/login',
                '/register',
                '/student/register',
                '/events',
                '/'
            ];

            // Check if we're not already on a public route
            if (!publicRoutes.some(route => currentPath.startsWith(route))) {
                // Store the current location for redirect after login
                sessionStorage.setItem('redirectPath', currentPath);

                // Determine the appropriate login route
                const isStudentRoute = currentPath.startsWith('/student');
                const loginPath = isStudentRoute ? '/student/login' : '/manager/login';

                // Redirect to the appropriate login page
                window.location.href = loginPath;
            }
        }

        return Promise.reject(error);
    }
);

// Event-related API functions
const eventApi = {
    // Get all events
    async getAllEvents() {
        const response = await api.get('/api/events');
        return response.data;
    },

    // Get single event
    async getEvent(id) {
        const response = await api.get(`/api/events/${id}`);
        return response.data;
    },

    // Create event
    async createEvent(eventData) {
        const response = await api.post('/api/events', eventData);
        return response.data;
    },

    // Update event
    async updateEvent(id, eventData) {
        const response = await api.put(`/api/events/${id}`, eventData);
        return response.data;
    },

    // Delete event
    async deleteEvent(id) {
        const response = await api.delete(`/api/events/${id}`);
        return response.data;
    },

    // Get event teams
    async getEventTeams(eventId) {
        const response = await api.get(`/api/events/${eventId}/teams`);
        return response.data;
    },

    // Get manager's events
    async getManagerEvents() {
        const response = await api.get('/api/manager/events');
        return response.data;
    }
};

// Auth-related API functions
const authApi = {
    // Manager login
    async login(credentials) {
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    },

    // Manager register
    async register(userData) {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    },

    // Student login
    async studentLogin(credentials) {
        const response = await api.post('/api/student/login', credentials);
        return response.data;
    },

    // Student register
    async studentRegister(userData) {
        const response = await api.post('/api/student/register', userData);
        return response.data;
    },

    // Get student profile
    async getStudentProfile() {
        const response = await api.get('/api/student/profile');
        return response.data;
    },

    // Get manager profile
    async getManagerProfile() {
        const response = await api.get('/api/manager/profile');
        return response.data;
    }
};

export { eventApi, authApi };
export default api;
