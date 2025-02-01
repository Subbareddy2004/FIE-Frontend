import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        // Check if it's a student route
        const isStudentRoute = location.pathname.startsWith('/student');
        const loginPath = isStudentRoute ? '/student/login' : '/manager/login';
        
        // Store the intended path for redirection after login
        const currentPath = location.pathname + location.search;
        sessionStorage.setItem('redirectPath', currentPath);
        
        return <Navigate to={loginPath} replace />;
    }

    // Check if student is trying to access manager routes or vice versa
    const isStudentRoute = location.pathname.startsWith('/student');
    const isManagerRoute = location.pathname.startsWith('/manager');
    const isStudent = user.role === 'student';

    if ((isStudentRoute && !isStudent) || (isManagerRoute && isStudent)) {
        const loginPath = isStudent ? '/student/login' : '/manager/login';
        return <Navigate to={loginPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
