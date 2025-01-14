import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventApi } from '../services/api';
import { format, isValid, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const StudentEventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to safely format dates
    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString);
            return isValid(date) ? format(date, 'PPP') : 'Date not available';
        } catch (error) {
            return 'Date not available';
        }
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError(null);
                const eventData = await eventApi.getEvent(id);
                setEvent(eventData);
            } catch (error) {
                console.error('Error fetching event:', error);
                setError(error.response?.data?.message || 'Failed to load event details');
                toast.error('Failed to load event details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Link to="/" className="text-blue-500 hover:text-blue-600">
                    Return to Home
                </Link>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Event not found</h2>
                <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="text-blue-500 hover:text-blue-600">
                    Return to Home
                </Link>
            </div>
        );
    }

    const isRegistrationOpen = new Date() <= new Date(event.registrationDeadline);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Event Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
                    <p className="text-blue-100">{event.description}</p>
                </div>

                {/* Event Details */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Registration Deadline</p>
                                    <p className="text-gray-900">
                                        {formatDate(event.registrationDeadline)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Event Date</p>
                                    <p className="text-gray-900">
                                        {formatDate(event.startDate)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Venue</p>
                                    <div className="text-gray-900">
                                        {event.venue ? (
                                            <>
                                                <p>{event.venue.name}</p>
                                                <p className="text-sm text-gray-600">{event.venue.address}</p>
                                                <p className="text-sm text-gray-600">{event.venue.city}</p>
                                            </>
                                        ) : (
                                            <p>Venue not specified</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Team Size</p>
                                    <p className="text-gray-900">
                                        {event.minTeamSize || '1'} - {event.maxTeamSize || '4'} members
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Eligibility</p>
                                    <p className="text-gray-900">{event.eligibility || 'Open to all'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center">
                        {isRegistrationOpen ? (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Participate?</h2>
                                <p className="text-gray-600 mb-6">Join the hackathon and showcase your skills!</p>
                                <Link
                                    to={`/register-team/${event._id}`}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Register Your Team
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold text-red-600 mb-4">Registration Closed</h2>
                                <p className="text-gray-600">
                                    The registration deadline has passed. Stay tuned for future events!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentEventDetails;
