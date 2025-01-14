import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';
import EditEventForm from '../components/EditEventForm';

const formatDate = (dateString) => {
    try {
        if (!dateString) return 'Not set';
        const date = parseISO(dateString);
        return isValid(date) ? format(date, 'PPp') : 'Invalid date';
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Invalid date';
    }
};

const ManagerEventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventRes = await api.get(`/api/events/${id}`);
                setEvent(eventRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load event details');
                setLoading(false);
                if (error.response?.status === 401) {
                    navigate('/manager/login');
                }
            }
        };

        if (!token) {
            navigate('/manager/login');
            return;
        }

        fetchEvent();
    }, [id, token, navigate]);

    const handleUpdateEvent = (updatedEvent) => {
        setEvent(updatedEvent);
        setShowEditForm(false);
        toast.success('Event updated successfully');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!event) {
        return <div className="text-center py-8">Event not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                                {event.status || 'upcoming'}
                            </span>
                        </div>
                        <button
                            onClick={() => setShowEditForm(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Event
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Event Details</h2>
                                <p className="text-gray-600 mb-4">{event.description}</p>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {typeof event.venue === 'object' 
                                            ? `${event.venue.name}, ${event.venue.address}, ${event.venue.city}`
                                            : event.venue}
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Event Date: {formatDate(event.eventDate)}
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Registration Deadline: {formatDate(event.registrationDeadline)}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Rules</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-600 whitespace-pre-line">{event.rules}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Team Requirements</h2>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Team Size: {event.teamSize?.min || 1} - {event.teamSize?.max || 4} members
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Registration Fee: ₹{event.registrationFee || 0}
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Prize Pool: ₹{event.prizePool || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEditForm && (
                <EditEventForm
                    event={event}
                    onClose={() => setShowEditForm(false)}
                    onUpdate={handleUpdateEvent}
                />
            )}
        </div>
    );
};

export default ManagerEventDetails;
