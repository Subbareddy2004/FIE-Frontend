import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const StudentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login({ email, password }, true); // true indicates student login
            
            // Get the redirect path if it exists
            const redirectPath = sessionStorage.getItem('redirectPath');
            sessionStorage.removeItem('redirectPath'); // Clear it after use
            
            // Navigate to the stored path or default to dashboard
            navigate(redirectPath || '/student/dashboard');
            toast.success('Login successful!');
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <div className="max-w-md mx-auto p-6">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8`}>
                    <div className="text-center mb-8">
                        <div className="inline-block p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Welcome Back, Hacker!</h2>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Sign in to continue your hackathon journey
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300'
                                } border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300'
                                } border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium 
                                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                                transition-colors duration-200`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm">
                            <Link
                                to="/student/register"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Don't have an account? Register
                            </Link>
                        </div>
                        <div className="text-sm">
                            <Link
                                to="/events"
                                className={`font-medium ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-500'}`}
                            >
                                Back to Events
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
