import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const TeamRegistration = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        members: [
            {
                name: '',
                email: '',
                registerNumber: '',
                mobileNumber: '',
                isLeader: true
            }
        ]
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
                setEvent(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event:', error);
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleTeamNameChange = (e) => {
        setFormData(prev => ({
            ...prev,
            name: e.target.value
        }));
    };

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...formData.members];
        newMembers[index] = {
            ...newMembers[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            members: newMembers
        }));
    };

    const addMember = () => {
        if (formData.members.length < event.teamSize.max) {
            setFormData(prev => ({
                ...prev,
                members: [
                    ...prev.members,
                    {
                        name: '',
                        email: '',
                        registerNumber: '',
                        mobileNumber: '',
                        isLeader: false
                    }
                ]
            }));
        }
    };

    const removeMember = (index) => {
        if (formData.members.length > event.teamSize.min) {
            setFormData(prev => ({
                ...prev,
                members: prev.members.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/teams/${id}`, formData);
            toast.success('Team registered successfully!');
            navigate(`/event/${id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to register team');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-red-600">Event not found</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Register Your Team</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Team Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={handleTeamNameChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Team Members</h2>
                            {formData.members.length < event.teamSize.max && (
                                <button
                                    type="button"
                                    onClick={addMember}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Add Member
                                </button>
                            )}
                        </div>

                        {formData.members.map((member, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium">
                                        {member.isLeader ? 'Team Leader' : `Member ${index + 1}`}
                                    </h3>
                                    {!member.isLeader && (
                                        <button
                                            type="button"
                                            onClick={() => removeMember(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            value={member.name}
                                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={member.email}
                                            onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Register Number</label>
                                        <input
                                            type="text"
                                            value={member.registerNumber}
                                            onChange={(e) => handleMemberChange(index, 'registerNumber', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                        <input
                                            type="tel"
                                            value={member.mobileNumber}
                                            onChange={(e) => handleMemberChange(index, 'mobileNumber', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/event/${id}`)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                            Register Team
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeamRegistration;
