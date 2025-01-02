import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details');
    const [isEventManager, setIsEventManager] = useState(false);
    const managerInfo = JSON.parse(localStorage.getItem('managerInfo') || '{}');

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
        const fetchEventAndTeams = async () => {
            try {
                const eventRes = await api.get(`/api/events/${id}`);
                setEvent(eventRes.data);
                
                const token = localStorage.getItem('token');
                setIsEventManager(token && managerInfo?.id === eventRes.data.manager);

                // Only fetch teams if user is the event manager
                if (token && managerInfo?.id === eventRes.data.manager) {
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    try {
                        const teamsRes = await api.get(`/api/teams/event/${id}`, config);
                        // Ensure teams is always an array
                        setTeams(Array.isArray(teamsRes.data?.teams) ? teamsRes.data.teams : []);
                    } catch (error) {
                        if (error.response?.status === 401) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('managerInfo');
                            toast.error('Session expired. Please login again.');
                            navigate('/manager/login');
                        }
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load event details');
                setLoading(false);
            }
        };

        fetchEventAndTeams();
    }, [id, managerInfo?.id, navigate]);

    const getCSVData = () => {
        return teams.map(team => ({
            'Team Name': team.teamName,
            'Department': team.department,
            'Members': team.members?.length || 0,
            'Registration Date': formatDate(team.createdAt)
        }));
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text(`${event.title} - Teams Report`, 14, 15);
        
        const tableData = teams.map(team => [
            team.teamName,
            team.department,
            team.members?.length.toString() || '0',
            formatDate(team.createdAt)
        ]);

        doc.autoTable({
            head: [['Team Name', 'Department', 'Members', 'Registration Date']],
            body: tableData,
            startY: 25
        });

        doc.save(`${event.title}_teams_report.pdf`);
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

    const isRegistrationOpen = event.registrationDeadline ? new Date() < parseISO(event.registrationDeadline) : false;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Event Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                            <p className="text-gray-600">{event.description}</p>
                        </div>
                        {isEventManager && (
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => navigate(`/manager/events/${id}/edit`)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Edit Event
                                </button>
                                <CSVLink
                                    data={getCSVData()}
                                    filename={`${event.title}_teams.csv`}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                >
                                    Export Teams
                                </CSVLink>
                                <button
                                    onClick={downloadPDF}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                >
                                    Download Report
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">Registration Deadline</p>
                            <p className="text-gray-900">{formatDate(event.registrationDeadline)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Event Date</p>
                            <p className="text-gray-900">{formatDate(event.startDate)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Venue</p>
                            <div className="text-gray-900">
                                {event.venue ? (
                                    <>
                                        <p className="font-medium">{event.venue.name}</p>
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

                {isEventManager ? (
                    // Manager View
                    <>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Registered Teams</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Team Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Members
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Registration Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {teams.map((team) => (
                                            <tr key={team._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {team.teamName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {team.department}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {team.members?.length || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(team.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <button
                                                        onClick={() => navigate(`/manager/teams/${team._id}`)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    // Student View
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="text-center">
                            {isRegistrationOpen ? (
                                <>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Registration is Open!
                                    </h3>
                                    <Link
                                        to={`/register-team/${event._id}`}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Register Your Team
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <span className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-red-100 text-red-800">
                                        Registration Closed
                                    </span>
                                    <p className="mt-2 text-sm text-gray-500">
                                        The registration deadline has passed.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
