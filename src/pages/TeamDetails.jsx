import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const TeamDetails = () => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');
    const { teamId } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        fetchTeamDetails();
    }, [teamId]);

    const fetchTeamDetails = async () => {
        try {
            const response = await api.get(`/api/teams/${teamId}`);
            setTeam(response.data);
        } catch (error) {
            console.error('Error fetching team details:', error);
            toast.error('Error loading team details');
            navigate('/manager/events');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentStatus = async (status) => {
        try {
            const response = await api.put(`/api/teams/${teamId}/payment-status`, {
                status,
                notes: notes.trim() || undefined
            });

            if (response.data.team) {
                setTeam(response.data.team);
                toast.success(`Payment ${status === 'verified' ? 'accepted' : 'rejected'} successfully`);
                setNotes('');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
            toast.error('Error updating payment status');
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen pt-20 flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className={`min-h-screen pt-20 flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
                <h2 className="text-2xl font-bold mb-4">Team not found</h2>
                <button
                    onClick={() => navigate('/manager/events')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Back to Events
                </button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(-1)}
                                className={`flex items-center ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="ml-2">Back</span>
                            </button>
                            <h2 className="text-2xl font-bold">{team.name}</h2>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            team.paymentStatus === 'verified' 
                                ? isDarkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-100 text-green-800'
                                : team.paymentStatus === 'rejected'
                                ? isDarkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-800'
                                : team.paymentStatus === 'pending'
                                ? isDarkMode ? 'bg-yellow-900/50 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                        }`}>
                            {team.paymentStatus === 'verified' ? 'Verified' :
                             team.paymentStatus === 'rejected' ? 'Rejected' :
                             team.paymentStatus === 'pending' ? 'Pending' :
                             team.paymentStatus === 'not_required' ? 'No Payment Required' :
                             'Unknown'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-6 rounded-lg`}>
                            <h3 className="text-lg font-semibold mb-4">Team Information</h3>
                            <div className="space-y-3">
                                <p>
                                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Team Name:
                                    </span>{' '}
                                    {team.name}
                                </p>
                                <p>
                                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Event:
                                    </span>{' '}
                                    {team.event.title}
                                </p>
                                <p>
                                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Registration Date:
                                    </span>{' '}
                                    {new Date(team.registrationDate).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">Event Manager Contact</h3>
                                <div className="space-y-3">
                                    <p>
                                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Organization:
                                        </span>{' '}
                                        {team.event.manager?.organization || 'Not specified'}
                                    </p>
                                    <p>
                                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Email:
                                        </span>{' '}
                                        {team.event.manager?.email || 'Not specified'}
                                    </p>
                                    <p>
                                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Phone:
                                        </span>{' '}
                                        {team.event.manager?.phone || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {team.event.entryFee > 0 && (
                            <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-6 rounded-lg`}>
                                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                                <div className="space-y-3">
                                    <p>
                                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Entry Fee:
                                        </span>{' '}
                                        ₹{team.event.entryFee}
                                    </p>
                                    <p>
                                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Transaction ID:
                                        </span>{' '}
                                        {team.upiTransactionId || 'Not provided'}
                                    </p>
                                    {team.verificationDate && (
                                        <p>
                                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Verified On:
                                            </span>{' '}
                                            {new Date(team.verificationDate).toLocaleString()}
                                        </p>
                                    )}
                                    {team.notes && (
                                        <p>
                                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Notes:
                                            </span>{' '}
                                            {team.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`mt-8 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-6`}>
                        <h3 className="text-lg font-semibold mb-4">Team Members</h3>
                        <div className="overflow-x-auto">
                            <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                                <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Register No.</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
                                    </tr>
                                </thead>
                                <tbody className={`${isDarkMode ? 'divide-y divide-gray-600' : 'bg-white divide-y divide-gray-200'}`}>
                                    {team.members.map((member, index) => (
                                        <tr key={index} className={isDarkMode ? 'bg-gray-800' : ''}>
                                            <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    member.isLeader
                                                        ? isDarkMode ? 'bg-purple-900/50 text-purple-200' : 'bg-purple-100 text-purple-800'
                                                        : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {member.isLeader ? 'Team Leader' : 'Member'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{member.registerNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>{member.email}</div>
                                                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                                    {member.mobileNumber}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {team.paymentStatus === 'pending' && team.event.entryFee > 0 && (
                        <div className={`mt-8 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className="text-lg font-semibold mb-4">Payment Verification</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="notes" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Notes (optional)
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows="3"
                                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                            isDarkMode
                                                ? 'bg-gray-800 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500'
                                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                        }`}
                                        placeholder="Add any notes about the payment verification..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handlePaymentStatus('verified')}
                                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Accept Payment
                                    </button>
                                    <button
                                        onClick={() => handlePaymentStatus('rejected')}
                                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Reject Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamDetails;
