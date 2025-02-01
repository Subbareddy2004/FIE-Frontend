import { API_BASE_URL } from '../config/api';

class StudentAuthService {
  async register(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('userType', 'student');
      localStorage.setItem('studentInfo', JSON.stringify(result.student));

      return result;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('userType', 'student');
      localStorage.setItem('studentInfo', JSON.stringify(result.student));

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch profile');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('studentInfo');
  }

  isAuthenticated() {
    return localStorage.getItem('token') !== null && localStorage.getItem('userType') === 'student';
  }
}

export const studentAuthApi = new StudentAuthService();
