import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const ViewTeams = () => {
    const { eventId } = useParams();
    const [teams, setTeams] = useState([]);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventResponse, teamsResponse] = await Promise.all([
                    api.get(`/api/events/${eventId}`),
                    api.get(`/api/teams/event/${eventId}`)
                ]);
                setEvent(eventResponse.data);
                setTeams(teamsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error loading teams');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId]);

    const handleVerifyPayment = async (teamId, status) => {
        try {
            const response = await api.post(`/api/teams/${teamId}/verify-payment`, {
                status,
                remarks: remarks.trim() || undefined
            });

            // Update the local state
            setTeams(teams.map(team => 
                team._id === teamId ? response.data.team : team
            ));

            toast.success(`Payment ${status} successfully`);
            setSelectedTeam(null);
            setRemarks('');
        } catch (error) {
            console.error('Error verifying payment:', error);
            toast.error('Error verifying payment');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Registered Teams - {event?.title}
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {teams.map(team => (
                            <div key={team._id} className="p-6 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {team.name}
                                        </h3>
                                        <div className="mt-2 text-sm text-gray-500">
                                            {team.members.map((member, index) => (
                                                <div key={index} className="mb-1">
                                                    {member.name} ({member.isLeader ? 'Leader' : 'Member'}) - 
                                                    {member.email} - {member.mobileNumber}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {event?.entryFee > 0 && (
                                        <div className="ml-4">
                                            {team.payment?.status === 'pending' ? (
                                                <div className="space-y-2">
                                                    <div className="bg-yellow-50 p-4 rounded-md">
                                                        <p className="text-sm text-yellow-700">
                                                            Transaction ID: {team.payment.upiTransactionId}
                                                        </p>
                                                        <p className="text-sm font-medium text-yellow-800">
                                                            Amount: ₹{team.payment.amount}
                                                        </p>
                                                    </div>
                                                    
                                                    {selectedTeam === team._id ? (
                                                        <div className="space-y-3">
                                                            <textarea
                                                                value={remarks}
                                                                onChange={(e) => setRemarks(e.target.value)}
                                                                placeholder="Add remarks (optional)"
                                                                className="w-full px-3 py-2 border rounded-md text-sm"
                                                                rows="2"
                                                            />
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleVerifyPayment(team._id, 'accepted')}
                                                                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    onClick={() => handleVerifyPayment(team._id, 'rejected')}
                                                                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                                                                >
                                                                    Reject
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedTeam(null);
                                                                        setRemarks('');
                                                                    }}
                                                                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setSelectedTeam(team._id)}
                                                            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                                                        >
                                                            Verify Payment
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className={`px-4 py-2 rounded-md ${
                                                    team.payment?.status === 'accepted' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    Payment {team.payment?.status}
                                                    {team.payment?.managerRemarks && (
                                                        <p className="text-sm mt-1">
                                                            Remarks: {team.payment.managerRemarks}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {teams.length === 0 && (
                            <div className="p-6 text-center text-gray-500">
                                No teams registered yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTeams;
