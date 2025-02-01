import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const StudentRegisteredEvents = () => {
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (!user || user.role !== 'student') {
            navigate('/student/login');
            return;
        }
        fetchRegisteredEvents();
    }, [user, navigate]);

    const fetchRegisteredEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to view your registrations');
                navigate('/student/login');
                return;
            }

            const response = await api.get('/api/student/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && Array.isArray(response.data.registeredHackathons)) {
                setRegisteredEvents(response.data.registeredHackathons);
            } else {
                console.warn('No registered hackathons found:', response.data);
                setRegisteredEvents([]);
            }
        } catch (error) {
            console.error('Error fetching registered events:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                logout();
                navigate('/student/login');
            } else {
                toast.error('Failed to load registered events');
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredAndSortedEvents = () => {
        let filtered = [...registeredEvents];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.teamMembers?.some(member => 
                    member.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(event => event.paymentStatus === statusFilter);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let compareValue;
            switch (sortBy) {
                case 'title':
                    compareValue = (a.title || '').localeCompare(b.title || '');
                    break;
                case 'team':
                    compareValue = (a.teamName || '').localeCompare(b.teamName || '');
                    break;
                case 'date':
                default:
                    compareValue = new Date(b.submissionDate) - new Date(a.submissionDate);
            }
            return sortOrder === 'asc' ? compareValue : -compareValue;
        });

        return filtered;
    };

    if (loading) {
        return (
            <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-6">My Registered Events</h1>
                    <p className="text-gray-600 dark:text-gray-300">View and manage your event registrations</p>
                </div>

                {/* Filters Section */}
                <div className={`mb-8 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Search</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search events, teams..."
                                className={`w-full px-3 py-2 rounded-md ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                } border focus:ring-2 focus:ring-indigo-500`}
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Payment Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className={`w-full px-3 py-2 rounded-md ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                } border focus:ring-2 focus:ring-indigo-500`}
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                                <option value="rejected">Rejected</option>
                                <option value="not_required">No Payment Required</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={`w-full px-3 py-2 rounded-md ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                } border focus:ring-2 focus:ring-indigo-500`}
                            >
                                <option value="date">Registration Date</option>
                                <option value="title">Event Name</option>
                                <option value="team">Team Name</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Sort Order</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className={`w-full px-3 py-2 rounded-md ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                } border focus:ring-2 focus:ring-indigo-500`}
                            >
                                <option value="desc">Newest First</option>
                                <option value="asc">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedEvents().map((event, index) => (
                        <div
                            key={index}
                            className={`${
                                isDarkMode ? 'bg-gray-800' : 'bg-white'
                            } rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:transform hover:-translate-y-1`}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold">{event.title}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        event.paymentStatus === 'verified'
                                            ? 'bg-green-100 text-green-800'
                                            : event.paymentStatus === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : event.paymentStatus === 'rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {event.paymentStatus.charAt(0).toUpperCase() + event.paymentStatus.slice(1)}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Team: {event.teamName}
                                    </p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Role: {event.role.charAt(0).toUpperCase() + event.role.slice(1)}
                                    </p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Registered: {new Date(event.submissionDate).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => navigate(`/events/${event.hackathonId}`)}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => navigate(`/events/${event.hackathonId}/edit-team/${event.teamId}`)}
                                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                                    >
                                        Edit Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredAndSortedEvents().length === 0 && (
                    <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p className="text-lg">No registered events found</p>
                        <p className="mt-2">Try adjusting your filters or search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentRegisteredEvents;
