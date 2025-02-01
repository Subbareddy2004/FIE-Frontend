import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/student/profile');
            setProfile(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch profile');
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-red-500 mb-2">Error Loading Profile</h3>
                    <p className="text-gray-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Section */}
                <div className={`mb-8 rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                            Profile Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-semibold">{profile?.name}</p>
                            </div>
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-semibold">{profile?.email}</p>
                            </div>
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className="text-sm text-gray-500">College</p>
                                <p className="font-semibold">{profile?.college}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registered Events Section */}
                <div className={`rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                            Registered Events
                        </h2>
                        {(!profile?.registeredHackathons || profile.registeredHackathons.length === 0) ? (
                            <div className="text-center py-8">
                                <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    You haven't registered for any events yet.
                                </p>
                                <Link
                                    to="/events"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Browse Events
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {profile.registeredHackathons.map((event) => (
                                    <div 
                                        key={event._id}
                                        className={`p-4 rounded-lg border ${
                                            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <div className="flex flex-col md:flex-row justify-between">
                                            <div className="mb-4 md:mb-0">
                                                <h3 className="text-lg font-semibold mb-2">
                                                    {event.title || 'Event Title'}
                                                </h3>
                                                <div className="space-y-2">
                                                    <p><span className="text-gray-500">Team Name:</span> {event.teamName}</p>
                                                    <p><span className="text-gray-500">Role:</span> {event.role}</p>
                                                    <div>
                                                        <p className="text-gray-500 mb-1">Team Members:</p>
                                                        <ul className="list-disc list-inside pl-2">
                                                            {event.teamMembers.map((member, idx) => (
                                                                <li key={idx} className="text-sm">{member}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between items-end">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 text-sm rounded-full ${
                                                        event.paymentStatus === 'verified' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : event.paymentStatus === 'rejected'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {event.paymentStatus?.charAt(0).toUpperCase() + event.paymentStatus?.slice(1) || 'Pending'}
                                                    </span>
                                                </div>
                                                <div className="mt-4 space-x-2">
                                                    <Link
                                                        to={`/events/${event.hackathonId}`}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                                    >
                                                        View Details
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            // Handle edit functionality
                                                            toast.error('Edit functionality coming soon!');
                                                        }}
                                                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Edit Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
