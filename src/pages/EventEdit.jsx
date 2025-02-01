import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const EventEdit = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        maxTeams: 0,
        maxTeamSize: 0,
        venue: {
            name: '',
            address: '',
            city: '',
            state: '',
            country: ''
        },
        status: ''
    });

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            const response = await api.get(`/api/events/${eventId}`);
            setEvent(response.data);
            const eventData = response.data;
            setFormData({
                title: eventData.title,
                description: eventData.description,
                startDate: new Date(eventData.startDate).toISOString().split('T')[0],
                endDate: new Date(eventData.endDate).toISOString().split('T')[0],
                maxTeams: eventData.maxTeams,
                maxTeamSize: eventData.maxTeamSize,
                venue: eventData.venue,
                status: eventData.status
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching event:', error);
            toast.error('Failed to load event details');
            navigate('/manager/dashboard');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('venue.')) {
            const venueField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                venue: {
                    ...prev.venue,
                    [venueField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/events/${eventId}`, formData);
            toast.success('Event updated successfully');
            navigate('/manager/dashboard');
        } catch (error) {
            console.error('Error updating event:', error);
            toast.error('Failed to update event');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-6 mt-16 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8`}>
                    <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                        Edit Event
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Event Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full p-3 rounded-lg ${
                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                } border border-gray-300 focus:ring-2 focus:ring-indigo-500`}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className={`w-full p-3 rounded-lg ${
                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                } border border-gray-300 focus:ring-2 focus:ring-indigo-500`}
                                required
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className={`w-full p-3 rounded-lg ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                    } border border-gray-300 focus:ring-2 focus:ring-indigo-500`}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className={`w-full p-3 rounded-lg ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                    } border border-gray-300 focus:ring-2 focus:ring-indigo-500`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Team Limits */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Maximum Teams</label>
                                <input
                                    type="number"
                                    name="maxTeams"
                                    value={formData.maxTeams}
                                    onChange={handleChange}
                                    min="1"
                                    className={`w-full p-3 rounded-lg ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                    } border border-gray-300 focus:ring-2 focus:ring-indigo-500`}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Team Size Limit</label>
                                <input
                                    type="number"
                                    name="maxTeamSize"
                                    value={formData.maxTeamSize}
                                    onChange={handleChange}
                                    min="1"
                                    className={`w-full p-3 rounded-lg ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                    } border border-gray-300 focus:ring-2 focus:ring-indigo-500`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Venue */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Venue Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Venue Name</label>
                                    <input
                                        type="text"
                                        name="venue.name"
                                        value={formData.venue.name}
                                        onChange={handleChange}
                                        className={`w-full p-3 rounded-lg ${
                                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                        } border border-gray-300 focus:ring-2 focus:ring-indigo-500`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">City</label>
                                    <input
                                        type="text"
                                        name="venue.city"
                                        value={formData.venue.city}
                                        onChange={handleChange}
                                        className={`w-full p-3 rounded-lg ${
                                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                        } border border-gray-300 focus:ring-2 focus:ring-indigo-500`}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Address</label>
                                <textarea
                                    name="venue.address"
                                    value={formData.venue.address}
                                    onChange={handleChange}
                                    rows="2"
                                    className={`w-full p-3 rounded-lg ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                    } border border-gray-300 focus:ring-2 focus:ring-indigo-500`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={`w-full p-3 rounded-lg ${
                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                } border border-gray-300 focus:ring-2 focus:ring-indigo-500`}
                                required
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/manager/dashboard')}
                                className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EventEdit;
