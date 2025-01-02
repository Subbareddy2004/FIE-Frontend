import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';

const EventTeams = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchEventAndTeams = async () => {
            if (!token) {
                navigate('/manager/login');
                return;
            }

            try {
                const [eventRes, teamsRes] = await Promise.all([
                    api.get(`/api/events/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    api.get(`/api/teams/event/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setEvent(eventRes.data);
                setTeams(teamsRes.data || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load event details');
                if (error.response?.status === 401) {
                    navigate('/manager/login');
                }
                setLoading(false);
            }
        };

        fetchEventAndTeams();
    }, [id, token, navigate]);

    const downloadCSV = () => {
        // Implement CSV download
        toast.success('CSV download started');
    };

    const downloadPDF = () => {
        // Implement PDF download
        toast.success('PDF download started');
    };

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

    // Calculate statistics safely
    const totalTeams = teams.length;
    const totalParticipants = teams.reduce((acc, team) => acc + (team.members?.length || 0), 0);
    const registrationStatus = new Date() <= new Date(event.registrationDeadline) ? 'Open' : 'Closed';

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                            <p className="text-gray-600">Registered Teams</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={downloadCSV}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Export CSV
                            </button>
                            <button
                                onClick={downloadPDF}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Export PDF
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-blue-800">Total Teams</h3>
                            <p className="mt-1 text-2xl font-semibold text-blue-900">
                                {totalTeams} / {event.maxTeams || 0}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-green-800">Total Participants</h3>
                            <p className="mt-1 text-2xl font-semibold text-green-900">
                                {totalParticipants}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-purple-800">Registration Status</h3>
                            <p className="mt-1 text-2xl font-semibold text-purple-900">
                                {registrationStatus}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Teams Table */}
                <div className="bg-white rounded-lg shadow-lg p-6">
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {teams.map((team) => {
                                        const leader = team.members?.find(m => m.isLeader) || {};
                                        return (
                                            <tr key={team._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {team.name || team.teamName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {leader.name || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {leader.email || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {team.members?.length || 0} members
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {team.members?.map(m => m.name).join(', ') || 'No members'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {team.registeredAt ? format(new Date(team.registeredAt), 'PP') : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        team.registrationStatus === 'confirmed' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {team.registrationStatus || 'pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => navigate(`/manager/teams/${team._id}`)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        View Details
                                                    </button>
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
        </div>
    );
};

export default EventTeams;
