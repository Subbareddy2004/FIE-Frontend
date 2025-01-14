import axios from 'axios';

// Create axios instance with base URL from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://event-management-backend-lovat.vercel.app',
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        // Log the request
        console.log('Making request to:', config.url);
        
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
        console.log('Response received:', response.status);
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
            console.log('Unauthorized access, redirecting to login');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else if (error.response?.status === 404) {
            console.log('Resource not found');
            // You can handle 404 specifically here
        } else if (error.code === 'ECONNABORTED') {
            console.log('Request timed out');
            // Handle timeout
        } else if (!error.response) {
            console.log('Network error occurred');
            // Handle network errors
        }

        return Promise.reject(error);
    }
);

// Event-related API functions
const eventApi = {
    getEvent: async (id) => {
        try {
            console.log('Fetching event with ID:', id);
            const response = await api.get(`/api/events/${id}`);
            console.log('Event data received:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching event:', error);
            throw error;
        }
    },
    
    getAllEvents: async () => {
        try {
            const response = await api.get('/api/events');
            return response.data;
        } catch (error) {
            console.error('Error fetching all events:', error);
            throw error;
        }
    },
    
    createEvent: async (eventData) => {
        try {
            const response = await api.post('/api/events', eventData);
            return response.data;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    },
    
    updateEvent: async (id, eventData) => {
        try {
            const response = await api.put(`/api/events/${id}`, eventData);
            return response.data;
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    },
    
    deleteEvent: async (id) => {
        try {
            const response = await api.delete(`/api/events/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }
};

export { eventApi };
export default api;
