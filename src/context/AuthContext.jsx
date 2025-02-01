import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            const isStudent = storedUser.role === 'student';
            
            const data = isStudent 
                ? await authApi.getStudentProfile()
                : await authApi.getManagerProfile();
            
            setUser({ ...data, role: storedUser.role });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials, isStudent = false) => {
        try {
            const data = isStudent 
                ? await authApi.studentLogin(credentials)
                : await authApi.login(credentials);
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const register = async (userData, isStudent = false) => {
        try {
            const data = isStudent
                ? await authApi.studentRegister(userData)
                : await authApi.register(userData);
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        register,
        isStudent: user?.role === 'student'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
