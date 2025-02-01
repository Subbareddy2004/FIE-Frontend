import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Events = () => {
    const { isDarkMode } = useTheme();
    const { user, isStudent } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('startDate');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/api/public/events');
                const currentDate = new Date();
                const activeEvents = response.data.filter(event => {
                    const registrationDeadline = new Date(event.registrationDeadline);
                    return registrationDeadline > currentDate && event.status !== 'draft';
                });
                setEvents(activeEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleRegistration = (event) => {
        if (!user) {
            toast.error('Please login as a student to register for events');
            // Store the event ID in session storage to redirect back after login
            sessionStorage.setItem('pendingRegistration', event._id);
            navigate('/student/login', { state: { from: `/register/${event._id}` } });
            return;
        }
        if (!isStudent) {
            toast.error('Only students can register for events');
            return;
        }
        navigate(`/register/${event._id}`);
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        if (sortBy === 'startDate') {
            return new Date(a.startDate) - new Date(b.startDate);
        } else if (sortBy === 'registrationDeadline') {
            return new Date(a.registrationDeadline) - new Date(b.registrationDeadline);
        }
        return 0;
    });

    if (loading) {
        return (
            <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                        Hackathons & Events
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Discover upcoming hackathons and register your team
                    </p>
                    {!user && (
                        <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                            <p className="text-yellow-800 dark:text-yellow-200">
                                <FaLock className="inline-block mr-2" />
                                Please <Link to="/student/login" className="font-bold underline">login</Link> to register for events
                            </p>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                isDarkMode 
                                    ? 'bg-gray-800 border-gray-700 text-white' 
                                    : 'bg-white border-gray-300'
                            }`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                isDarkMode 
                                    ? 'bg-gray-800 border-gray-700 text-white' 
                                    : 'bg-white border-gray-300'
                            }`}
                        >
                            <option value="all">All Events</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                isDarkMode 
                                    ? 'bg-gray-800 border-gray-700 text-white' 
                                    : 'bg-white border-gray-300'
                            }`}
                        >
                            <option value="startDate">Start Date</option>
                            <option value="registrationDeadline">Registration Deadline</option>
                        </select>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => (
                        <div
                            key={event._id}
                            className={`rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 ${
                                isDarkMode ? 'bg-gray-800' : 'bg-white'
                            }`}
                        >
                            <div className="p-6">
                                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {event.title}
                                </h3>
                                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {event.description.substring(0, 150)}...
                                </p>
                                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <p>Start Date: {format(new Date(event.startDate), 'PPP')}</p>
                                    <p>Registration Deadline: {format(new Date(event.registrationDeadline), 'PPP')}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleRegistration(event)}
                                        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
                                            !user
                                                ? 'bg-gray-400 cursor-not-allowed flex items-center justify-center'
                                                : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                        disabled={!user}
                                    >
                                        {!user && <FaLock className="mr-2" />}
                                        {user ? 'Register Now' : 'Login to Register'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            No events found matching your criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
