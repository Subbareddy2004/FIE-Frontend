import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { API_ENDPOINTS } from '../config/api';

const EventTeams = () => {
    const { isDarkMode } = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
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

    const handleExportCSV = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.EVENTS.EXPORT_CSV(id), {
                params: { status: statusFilter },
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }
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
            const response = await api.get(API_ENDPOINTS.EVENTS.EXPORT_PDF(id), {
                params: { status: statusFilter },
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }
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

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'verified':
                return 'bg-green-500 text-white';
            case 'rejected':
                return 'bg-red-500 text-white';
            case 'pending':
            default:
                return 'bg-yellow-500 text-white';
        }
    };

    const filteredTeams = teams.filter(team => {
        const matchesSearch = 
            (team.teamName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (team.members || []).some(member => 
                (member.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (member.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (member.registerNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesStatus = statusFilter === 'all' || team.paymentStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Event not found</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/manager/dashboard')}
                            className="flex items-center text-gray-400 hover:text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="ml-2">Back to Dashboard</span>
                        </button>
                        <h1 className="text-2xl font-semibold">{event.title}</h1>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleExportCSV}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Export PDF
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-50'}`}>
                        <h3 className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                            Total Teams
                        </h3>
                        <p className={`mt-1 text-2xl font-semibold ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                            {teams.length} / {event.maxTeams || 'Unlimited'}
                        </p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/50' : 'bg-green-50'}`}>
                        <h3 className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                            Total Participants
                        </h3>
                        <p className={`mt-1 text-2xl font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-900'}`}>
                            {teams.reduce((acc, team) => acc + (team.members?.length || 0), 0)}
                        </p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-50'}`}>
                        <h3 className={`text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                            Registration Status
                        </h3>
                        <p className={`mt-1 text-2xl font-semibold ${isDarkMode ? 'text-purple-200' : 'text-purple-900'}`}>
                            {new Date() <= new Date(event.registrationDeadline) ? 'Open' : 'Closed'}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by team name, member name, email, or register number..."
                        className={`w-1/2 px-4 py-2 rounded-lg ${
                            isDarkMode
                                ? 'bg-gray-800 border-gray-700 focus:border-indigo-500'
                                : 'bg-white border-gray-300 focus:border-indigo-500'
                        } border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors duration-200`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className={`px-4 py-2 rounded-lg ${
                            isDarkMode
                                ? 'bg-gray-800 border-gray-700 focus:border-indigo-500'
                                : 'bg-white border-gray-300 focus:border-indigo-500'
                        } border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors duration-200`}
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map(team => (
                        <div
                            key={team._id}
                            onClick={() => navigate(`/manager/teams/${team._id}`)}
                            className={`${
                                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                            } rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 transform hover:-translate-y-1`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold">{team.teamName}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(team.paymentStatus)}`}>
                                    {team.paymentStatus.charAt(0).toUpperCase() + team.paymentStatus.slice(1)}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Team Size: {team.members?.length || 0} members
                                </p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Leader: {team.members?.find(m => m.isLeader)?.name || 'Not specified'}
                                </p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Registered: {format(parseISO(team.registrationDate), 'MMM d, yyyy')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTeams.length === 0 && (
                    <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p className="text-xl">No teams found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventTeams;
