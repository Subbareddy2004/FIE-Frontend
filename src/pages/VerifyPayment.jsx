import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const VerifyPayment = ({ team, onVerificationComplete }) => {
  const [remarks, setRemarks] = useState('');

  const handleVerification = async (status) => {
    try {
      await api.post(`/api/teams/${team._id}/verify-payment`, {
        status,
        remarks: remarks.trim()
      });

      toast.success(`Payment ${status} successfully`);
      onVerificationComplete();
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error(error.response?.data?.message || 'Error verifying payment');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Verify Payment</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">Team: {team.name}</p>
        <p className="text-sm text-gray-600">Transaction ID: {team.payment.upiTransactionId}</p>
        <p className="text-sm text-gray-600">Amount: ₹{team.payment.amount}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Remarks</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows="3"
          placeholder="Add any remarks (optional)"
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => handleVerification('accepted')}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Accept
        </button>
        <button
          onClick={() => handleVerification('rejected')}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default VerifyPayment;
