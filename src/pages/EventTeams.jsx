import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';

const EventTeams = () => {
    const [event, setEvent] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { id } = useParams();
    const navigate = useNavigate();
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
                // Ensure teams is always an array
                setTeams(Array.isArray(teamsRes.data?.teams) ? teamsRes.data.teams : []);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load event details');
                if (error.response?.status === 401) {
                    navigate('/manager/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEventAndTeams();
    }, [id, token, navigate]);

    const filteredTeams = teams.filter(team => {
        const matchesSearch = 
            team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.members.some(member => 
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesStatus = statusFilter === 'all' || team.paymentStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleExportCSV = async () => {
        try {
            const response = await api.get(`/api/events/${id}/export-csv`, {
                params: { status: statusFilter },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = `${event.title}-${statusFilter === 'all' ? 'all' : statusFilter}-teams.csv`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            toast.success(`${statusFilter === 'all' ? 'All' : statusFilter} teams exported to CSV successfully`);
        } catch (error) {
            console.error('Error downloading CSV:', error);
            toast.error('Error downloading CSV');
        }
    };

    const handleExportPDF = async () => {
        try {
            const response = await api.get(`/api/events/${id}/export-pdf`, {
                params: { status: statusFilter },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = `${event.title}-${statusFilter === 'all' ? 'all' : statusFilter}-teams.pdf`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            toast.success(`${statusFilter === 'all' ? 'All' : statusFilter} teams exported to PDF successfully`);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            toast.error('Error downloading PDF');
        }
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
                                onClick={handleExportCSV}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Export CSV
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Export PDF
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-blue-800">Total Teams</h3>
                            <p className="mt-1 text-2xl font-semibold text-blue-900">
                                {teams.length} / {event.maxTeams || 0}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-green-800">Total Participants</h3>
                            <p className="mt-1 text-2xl font-semibold text-green-900">
                                {teams.reduce((acc, team) => acc + (team.members?.length || 0), 0)}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-purple-800">Registration Status</h3>
                            <p className="mt-1 text-2xl font-semibold text-purple-900">
                                {new Date() <= new Date(event.registrationDeadline) ? 'Open' : 'Closed'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <input
                            type="text"
                            placeholder="Search by team name, member name, email, or register number..."
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-1/4">
                        <select
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                            <option value="not_required">No Payment Required</option>
                        </select>
                    </div>
                </div>

                {/* Teams Table */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {filteredTeams.length === 0 ? (
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
                                    {filteredTeams.map((team) => {
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
                                                        {team.registeredAt ? 
                                                            format(parseISO(team.registeredAt), 'PPp') 
                                                            : 'Not available'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        team.paymentStatus === 'verified' ? 'bg-green-100 text-green-800' :
                                                        team.paymentStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        team.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        team.paymentStatus === 'not_required' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {team.paymentStatus === 'verified' ? 'Verified' :
                                                         team.paymentStatus === 'rejected' ? 'Rejected' :
                                                         team.paymentStatus === 'pending' ? 'Pending' :
                                                         team.paymentStatus === 'not_required' ? 'No Payment Required' :
                                                         'Unknown'}
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
