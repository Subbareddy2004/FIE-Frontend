import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const RegisterTeam = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [showUpiDetails, setShowUpiDetails] = useState(false);
  const [members, setMembers] = useState([
    { name: '', email: '', registerNumber: '', mobileNumber: '', isLeader: true }
  ]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        let response;
        // Check if this is a public share link
        if (eventId.includes('-')) {
          response = await api.get(`/api/public/events/${eventId}`);
        } else {
          response = await api.get(`/api/events/${eventId}`);
        }
        
        const eventData = response.data;
        
        // Validate payment details if entry fee is set
        if (eventData.entryFee > 0) {
          if (!eventData.paymentDetails?.upiId) {
            toast.error('Payment details are not properly configured for this event. Please contact the event organizer.');
            setShowUpiDetails(false);
          } else {
            setShowUpiDetails(true);
          }
        }
        
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
        if (error.response?.status === 400) {
          toast.error('Invalid event ID format');
        } else if (error.response?.status === 404) {
          toast.error('Event not found');
        } else {
          toast.error('Error loading event details. Please try again later.');
        }
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  const handleAddMember = () => {
    if (members.length < (event?.teamSize?.max || 4)) {
      setMembers([...members, { name: '', email: '', registerNumber: '', mobileNumber: '', isLeader: false }]);
    } else {
      toast.error(`Maximum ${event?.teamSize?.max || 4} members allowed`);
    }
  };

  const handleRemoveMember = (index) => {
    if (!members[index].isLeader && members.length > (event?.teamSize?.min || 1)) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleCopyUpiId = () => {
    if (event?.paymentDetails?.upiId) {
      navigator.clipboard.writeText(event.paymentDetails.upiId);
      toast.success('UPI ID copied to clipboard!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate team name
    if (!teamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    // Validate members
    if (members.length < event.teamSize.min || members.length > event.teamSize.max) {
      toast.error(`Team size must be between ${event.teamSize.min} and ${event.teamSize.max} members`);
      return;
    }

    // Validate each member's details
    for (const member of members) {
      if (!member.name.trim() || !member.email.trim() || !member.registerNumber.trim() || !member.mobileNumber.trim()) {
        toast.error('Please fill in all member details');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(member.email)) {
        toast.error('Please enter valid email addresses');
        return;
      }

      // Validate mobile number (10 digits)
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(member.mobileNumber)) {
        toast.error('Please enter valid 10-digit mobile numbers');
        return;
      }
    }

    // Validate UPI transaction ID if payment is required
    if (event.entryFee > 0) {
      if (!event.paymentDetails?.upiId) {
        toast.error('Payment details are not configured. Please contact the event organizer.');
        return;
      }
      if (!upiTransactionId.trim()) {
        toast.error('Please enter the UPI transaction ID');
        return;
      }
    }

    try {
      const registrationEndpoint = eventId.includes('-')
        ? `/api/public/events/${eventId}/register`
        : `/api/teams/register/${event._id}`;

      const response = await api.post(registrationEndpoint, {
        name: teamName,
        members: members,
        upiTransactionId: event.entryFee > 0 ? upiTransactionId : undefined
      });

      toast.success('Team registered successfully! Please wait for payment verification.');
      navigate('/registration-success', { 
        state: { 
          teamName, 
          eventName: event.title,
          paymentStatus: event.entryFee > 0 ? 'pending' : 'not_required',
          transactionId: upiTransactionId
        } 
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Error registering team');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
            <h2 className="text-4xl font-bold text-white mb-3">Register Your Team</h2>
            <p className="text-blue-100 text-lg">Join {event?.title} and showcase your skills!</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Team Information Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Team Information
              </h3>
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 text-lg"
                  placeholder="Enter your team name"
                  required
                />
              </div>
            </div>

            {/* Payment Details Section */}
            {event?.entryFee > 0 && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Payment Details
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                    <span className="text-lg font-medium text-blue-900">Entry Fee:</span>
                    <span className="text-2xl font-bold text-blue-600">₹{event.entryFee}</span>
                  </div>

                  {showUpiDetails ? (
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Instructions</h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-600">
                          <li>Open your UPI payment app (Google Pay, PhonePe, etc.)</li>
                          <li>Send ₹{event.entryFee} to UPI ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{event.paymentDetails.upiId}</span></li>
                          <li>Copy the UPI Transaction ID from your payment app</li>
                          <li>Paste the Transaction ID below</li>
                        </ol>
                      </div>

                      <div>
                        <label htmlFor="upiTransactionId" className="block text-sm font-medium text-gray-700 mb-2">
                          UPI Transaction ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="upiTransactionId"
                          value={upiTransactionId}
                          onChange={(e) => setUpiTransactionId(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your UPI transaction ID"
                          required
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          This helps us verify your payment. Your registration will be confirmed after payment verification.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Payment details are not available. Please contact the event organizer for payment instructions.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Team Members Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Team Members
                </h3>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Member
                </button>
              </div>

              {members.map((member, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-900 flex items-center">
                      {member.isLeader ? (
                        <span className="flex items-center">
                          <svg className="w-5 h-5 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.668 2.146a.5.5 0 01.664 0l1.605 1.357 1.91-.329a.5.5 0 01.582.34l.477 1.76 1.76.477a.5.5 0 01.34.582l-.329 1.91 1.357 1.605a.5.5 0 010 .664l-1.357 1.605.329 1.91a.5.5 0 01-.34.582l-1.76.477-.477 1.76a.5.5 0 01-.582.34l-1.91-.329-1.605 1.357a.5.5 0 01-.664 0l-1.605-1.357-1.91.329a.5.5 0 01-.582-.34l-.477-1.76-1.76-.477a.5.5 0 01-.34-.582l.329-1.91L2.146 10.332a.5.5 0 010-.664l1.357-1.605-.329-1.91a.5.5 0 01.34-.582l1.76-.477.477-1.76a.5.5 0 01.582-.34l1.91.329L9.668 2.146zM8 10a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Team Leader
                        </span>
                      ) : `Member ${index + 1}`}
                    </h4>
                    {!member.isLeader && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter member name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Register Number</label>
                      <input
                        type="text"
                        value={member.registerNumber}
                        onChange={(e) => handleMemberChange(index, 'registerNumber', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter register number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        value={member.mobileNumber}
                        onChange={(e) => handleMemberChange(index, 'mobileNumber', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter 10-digit mobile number"
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Register Team
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterTeam;
