import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

const PublicEventView = () => {
    const { isDarkMode } = useTheme();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { shareLink } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/api/public/events/${shareLink}`);
                setEvent(response.data);
            } catch (error) {
                console.error('Error fetching event:', error);
                toast.error('Event not found or no longer available');
                navigate('/events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [shareLink, navigate]);

    if (loading) {
        return (
            <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) return null;

    const handleRegister = () => {
        // Use the shareLink parameter which includes both ID and suffix
        navigate(`/register/${shareLink}`);
    };

    return (
        <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back button */}
                <button
                    onClick={() => navigate('/events')}
                    className={`mb-6 flex items-center space-x-2 ${
                        isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Events</span>
                </button>

                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl overflow-hidden`}>
                    {/* Event Image */}
                    <div className="relative h-64 sm:h-96">
                        <img
                            src={event.image || "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{event.title}</h1>
                            <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    event.status === 'published'
                                        ? 'bg-green-100 text-green-800'
                                        : event.status === 'ongoing'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </span>
                                <span className="text-white text-sm">
                                    {format(new Date(event.startDate), 'MMM dd, yyyy')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Event Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <h2 className="text-xl font-bold mb-4">About the Event</h2>
                                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {event.description}
                                </p>

                                {event.rules && event.rules.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold mb-2">Rules</h3>
                                        <ul className={`list-disc pl-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {event.rules.map((rule, index) => (
                                                <li key={index}>{rule}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
                                <h3 className="text-lg font-bold mb-4">Event Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Date & Time</h4>
                                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                            {format(new Date(event.startDate), 'MMM dd, yyyy h:mm a')}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Location</h4>
                                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                            {event.venue.name}<br />
                                            {event.venue.address}<br />
                                            {event.venue.city}, {event.venue.state}<br />
                                            {event.venue.country}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Team Size</h4>
                                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                            {event.maxTeamSize} members per team
                                        </p>
                                    </div>
                                    {event.entryFee > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium mb-1">Entry Fee</h4>
                                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                                ₹{event.entryFee}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Registration</h4>
                                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                            {event.isRegistrationOpen ? (
                                                `Open until ${format(new Date(event.registrationDeadline), 'MMM dd, yyyy')}`
                                            ) : (
                                                'Registration Closed'
                                            )}
                                        </p>
                                    </div>
                                    {event.availableSlots !== undefined && (
                                        <div>
                                            <h4 className="text-sm font-medium mb-1">Available Slots</h4>
                                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                                {event.availableSlots} of {event.maxTeams} slots remaining
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {event.isRegistrationOpen && (
                                    <button
                                        onClick={handleRegister}
                                        className="w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-colors duration-200"
                                    >
                                        Register Now
                                    </button>
                                )}

                                {event.whatsappLink && (
                                    <a
                                        href={event.whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full mt-4 px-6 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        <span>Join WhatsApp Group</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicEventView;
