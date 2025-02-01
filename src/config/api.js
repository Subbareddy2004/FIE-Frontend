export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  STUDENT: {
    REGISTER: '/api/student/register',
    LOGIN: '/api/student/login',
  },
  EVENTS: {
    CREATE: '/api/events',
    GET_ALL: '/api/events',
    GET_ONE: (id) => `/api/events/${id}`,
    EXPORT_CSV: (id) => `/api/events/${id}/export-csv`,
    EXPORT_PDF: (id) => `/api/events/${id}/export-pdf`,
  }
};
