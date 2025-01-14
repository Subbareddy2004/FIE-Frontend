import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../services/api';

const ManagerDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sharing, setSharing] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/manager/login');
            return;
        }

        const fetchEvents = async () => {
            try {
                const response = await api.get('/api/events/manager', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                toast.error('Failed to load events');
                setLoading(false);
                if (error.response?.status === 401) {
                    navigate('/manager/login');
                }
            }
        };

        fetchEvents();
    }, [token, navigate]);

    const handleShare = async (eventId) => {
        if (sharing) return; // Prevent multiple clicks
        
        setSharing(true);
        try {
            const response = await api.post(`/api/events/${eventId}/share`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const shareUrl = response.data.publicUrl;
            
            await navigator.clipboard.writeText(shareUrl);
            toast.success('Share link copied to clipboard!');
        } catch (error) {
            console.error('Error generating share link:', error);
            toast.error(error.response?.data?.message || 'Failed to generate share link');
        } finally {
            setSharing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const totalEvents = events.length;
    const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date()).length;
    const pastEvents = events.filter(event => new Date(event.endDate) < new Date()).length;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 mb-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
                    <p>Manage your hackathon events and track their progress</p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Events</h2>
                        <p className="text-4xl font-bold text-blue-600">{totalEvents}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Events</h2>
                        <p className="text-4xl font-bold text-green-600">{upcomingEvents}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Past Events</h2>
                        <p className="text-4xl font-bold text-gray-600">{pastEvents}</p>
                    </div>
                </div>

                {/* Events List */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Your Events</h2>
                        <Link
                            to="/manager/create-event"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Create Event
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div key={event._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                            event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{format(new Date(event.startDate), 'MMM d, yyyy')}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{event.venue.city}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span>{event.registeredTeams} / {event.maxTeams} teams</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/manager/events/${event._id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View Details
                                            </Link>
                                            <span className="text-gray-300">|</span>
                                            <Link
                                                to={`/manager/events/${event._id}/teams`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View Teams
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => handleShare(event._id)}
                                            disabled={sharing}
                                            className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white ${
                                                sharing ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                            </svg>
                                            {sharing ? 'Sharing...' : 'Share'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {events.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">You haven't created any events yet.</p>
                            <Link
                                to="/manager/create-event"
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Create Your First Event
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
