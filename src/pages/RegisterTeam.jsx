import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const RegisterTeam = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([
    { name: '', email: '', registerNumber: '', mobileNumber: '', isLeader: true }
  ]);

  const handleAddMember = () => {
    if (members.length < 4) {
      setMembers([...members, { name: '', email: '', registerNumber: '', mobileNumber: '', isLeader: false }]);
    } else {
      toast.error('Maximum 4 members allowed');
    }
  };

  const handleRemoveMember = (index) => {
    if (!members[index].isLeader) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!teamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    // Validate all member fields
    for (const member of members) {
      if (!member.name.trim() || !member.email.trim() || 
          !member.registerNumber.trim() || !member.mobileNumber.trim()) {
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

    try {
      const response = await axios.post(
        `http://localhost:5000/api/teams/register/${eventId}`,
        {
          teamName: teamName,
          members: members.map(member => ({
            name: member.name,
            email: member.email,
            registerNumber: member.registerNumber,
            mobileNumber: member.mobileNumber,
            isLeader: member.isLeader
          }))
        }
      );
      
      toast.success('Team registered successfully!');
      navigate(`/event/${eventId}`);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to register team';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Register Your Team</h2>
          <p className="text-gray-600">Join the hackathon and showcase your skills!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Team Name Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              placeholder="Enter your team name"
            />
          </div>

          {/* Team Members Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
              <button
                type="button"
                onClick={handleAddMember}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Member
              </button>
            </div>

            {/* Team Leader */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Team Leader</h4>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={members[0]?.name || ''}
                    onChange={(e) => handleMemberChange(0, 'name', e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={members[0]?.email || ''}
                    onChange={(e) => handleMemberChange(0, 'email', e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Register Number
                  </label>
                  <input
                    type="text"
                    value={members[0]?.registerNumber || ''}
                    onChange={(e) => handleMemberChange(0, 'registerNumber', e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter register number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={members[0]?.mobileNumber || ''}
                    onChange={(e) => handleMemberChange(0, 'mobileNumber', e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            </div>

            {/* Other Team Members */}
            {members.slice(1).map((member, index) => (
              <div key={index + 1} className="bg-gray-50 p-6 rounded-lg relative">
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index + 1)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Team Member {index + 1}</h4>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index + 1, 'name', e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index + 1, 'email', e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Register Number
                    </label>
                    <input
                      type="text"
                      value={member.registerNumber}
                      onChange={(e) => handleMemberChange(index + 1, 'registerNumber', e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter register number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={member.mobileNumber}
                      onChange={(e) => handleMemberChange(index + 1, 'mobileNumber', e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Link
              to={`/event/${eventId}`}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterTeam;
