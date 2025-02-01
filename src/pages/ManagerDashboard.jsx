import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const ManagerDashboard = () => {
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({
        totalEvents: 0,
        activeEvents: 0,
        upcomingEvents: 0,
        completedEvents: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchManagerEvents();
    }, []);

    const fetchManagerEvents = async () => {
        try {
            const response = await api.get('/api/events/manager');
            setEvents(response.data.events);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = () => {
        navigate('/events/create');
    };

    const EventCard = ({ event, onDelete }) => {
        const [deleteLoading, setDeleteLoading] = useState(false);

        const handleDelete = async (e) => {
            e.preventDefault();
            if (window.confirm('Are you sure you want to delete this event?')) {
                setDeleteLoading(true);
                try {
                    await api.delete(`/api/events/${event._id}`);
                    toast.success('Event deleted successfully');
                    onDelete(event._id);
                } catch (error) {
                    console.error('Error deleting event:', error);
                    toast.error('Failed to delete event');
                } finally {
                    setDeleteLoading(false);
                }
            }
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-4 w-full max-w-2xl">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{event.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full mb-2">
                            {event.status || 'published'}
                        </span>
                        <span className="text-sm text-gray-500">
                            {formatDate(event.startDate)}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                        Teams: {event.teams?.length || 0}
                    </span>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => navigate(`/events/${event._id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>
                    <button 
                        onClick={() => navigate(`/events/${event._id}/teams`)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Teams
                    </button>
                    <button 
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {deleteLoading ? (
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        )}
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <div className="pt-20 px-6 pb-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                                Welcome, {user?.name || 'Manager'}
                            </h1>
                            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Manage your events and track registrations
                            </p>
                        </div>
                        <button
                            onClick={handleCreateEvent}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Create New Event
                        </button>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl transform transition-all duration-200 hover:scale-105`}>
                            <h3 className="text-lg font-semibold mb-2">Total Events</h3>
                            <p className="text-3xl font-bold text-indigo-600">{stats.totalEvents}</p>
                        </div>
                        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl transform transition-all duration-200 hover:scale-105`}>
                            <h3 className="text-lg font-semibold mb-2">Active Events</h3>
                            <p className="text-3xl font-bold text-green-600">{stats.activeEvents}</p>
                        </div>
                        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl transform transition-all duration-200 hover:scale-105`}>
                            <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
                            <p className="text-3xl font-bold text-blue-600">{stats.upcomingEvents}</p>
                        </div>
                        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl transform transition-all duration-200 hover:scale-105`}>
                            <h3 className="text-lg font-semibold mb-2">Completed Events</h3>
                            <p className="text-3xl font-bold text-purple-600">{stats.completedEvents}</p>
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Your Events</h2>
                        {events.length === 0 ? (
                            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 text-center`}>
                                <p className="text-gray-500">No events created yet. Create your first event!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((event) => (
                                    <EventCard key={event._id} event={event} onDelete={(eventId) => setEvents(events.filter((event) => event._id !== eventId))} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
