import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';

const ManagerEventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchEventAndTeams = async () => {
            try {
                const [eventRes, teamsRes] = await Promise.all([
                    api.get(`/api/events/${id}`),
                    api.get(`/api/teams/event/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setEvent(eventRes.data);
                setTeams(teamsRes.data.teams);
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

        fetchEventAndTeams();
    }, [id, token, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Event Header */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <p className="text-gray-600 mb-6">{event.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Event Date</h3>
                        <p className="mt-1 text-lg text-gray-900">
                            {format(new Date(event.startDate), 'PPP')}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Registration Deadline</h3>
                        <p className="mt-1 text-lg text-gray-900">
                            {format(new Date(event.registrationDeadline), 'PPP')}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Teams Registered</h3>
                        <p className="mt-1 text-lg text-gray-900">{teams.length} / {event.maxTeams}</p>
                    </div>
                </div>
            </div>

            {/* Registered Teams Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Registered Teams</h2>
                    <button
                        onClick={() => {/* Add export functionality */}}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Export Teams
                    </button>
                </div>

                {teams.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No teams have registered yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Team Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Team Leader
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Members
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registered On
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {teams.map((team) => {
                                    const leader = team.members.find(m => m.isLeader);
                                    return (
                                        <tr key={team.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {team.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {leader?.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {leader?.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {team.members.length} members
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {team.members.map(m => m.name).join(', ')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {format(new Date(team.registeredAt), 'PP')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    team.registrationStatus === 'confirmed' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {team.registrationStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerEventDetails;
