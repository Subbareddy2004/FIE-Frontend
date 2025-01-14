import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const TeamDetails = () => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');
    const { teamId } = useParams();
    const navigate = useNavigate();

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
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
            toast.error('Error updating payment status');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!team) {
        return <div className="flex justify-center items-center h-screen">Team not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Team Details</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Team Information</h3>
                        <div className="space-y-2">
                            <p><span className="font-medium">Team Name:</span> {team.name}</p>
                            <p><span className="font-medium">Event:</span> {team.event.title}</p>
                            <p><span className="font-medium">Registration Date:</span> {new Date(team.registrationDate).toLocaleDateString()}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3">Event Manager Contact</h3>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">Organization:</span>{' '}
                                    {team.event.manager?.organization || 'Not specified'}
                                </p>
                                <p>
                                    <span className="font-medium">Email:</span>{' '}
                                    {team.event.manager?.email || 'Not specified'}
                                </p>
                                <p>
                                    <span className="font-medium">Phone:</span>{' '}
                                    {team.event.manager?.phone || 'Not specified'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {team.event.entryFee > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Entry Fee:</span> ₹{team.event.entryFee}</p>
                                <p><span className="font-medium">Transaction ID:</span> {team.paymentDetails?.upiTransactionId}</p>
                                {team.paymentDetails?.verificationDate && (
                                    <p><span className="font-medium">Verified On:</span> {new Date(team.paymentDetails.verificationDate).toLocaleString()}</p>
                                )}
                                {team.paymentDetails?.notes && (
                                    <p><span className="font-medium">Notes:</span> {team.paymentDetails.notes}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Team Members</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Register No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {team.members.map((member, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {member.isLeader ? 'Team Leader' : 'Member'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{member.registerNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>{member.email}</div>
                                            <div className="text-sm text-gray-500">{member.mobileNumber}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {team.paymentStatus === 'pending' && team.event.entryFee > 0 && (
                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-3">Payment Verification</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                                <textarea
                                    id="notes"
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Add any notes about the payment verification..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handlePaymentStatus('verified')}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Accept Payment
                                </button>
                                <button
                                    onClick={() => handlePaymentStatus('rejected')}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Reject Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamDetails;
