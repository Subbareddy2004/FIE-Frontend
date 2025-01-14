import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState(['']);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: {
      name: '',
      address: '',
      city: ''
    },
    teamSize: {
      min: '1',
      max: '4'
    },
    maxTeams: '50',
    entryFee: '0',
    paymentDetails: {
      upiId: '',
      paymentRequired: false
    },
    contactEmail: '',
    contactPhone: '',
    rules: ['']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Update payment required status when entry fee changes
    if (name === 'entryFee') {
      const entryFeeValue = parseInt(value) || 0;
      setFormData(prev => ({
        ...prev,
        paymentDetails: {
          ...prev.paymentDetails,
          paymentRequired: entryFeeValue > 0,
          upiId: entryFeeValue === 0 ? '' : prev.paymentDetails.upiId
        }
      }));
    }
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };

  const addRule = () => {
    setRules([...rules, '']);
  };

  const removeRule = (index) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate UPI ID if entry fee is greater than 0
      if (parseInt(formData.entryFee) > 0 && !formData.paymentDetails.upiId.trim()) {
        toast.error('Please enter UPI ID for payment collection');
        setLoading(false);
        return;
      }

      const eventData = {
        ...formData,
        rules: rules.filter(rule => rule.trim() !== ''),
        registrationDeadline: formData.endDate,
        status: 'upcoming',
        teamSize: {
          min: parseInt(formData.teamSize.min) || 1,
          max: parseInt(formData.teamSize.max) || 4
        },
        maxTeams: parseInt(formData.maxTeams) || 50,
        entryFee: parseInt(formData.entryFee) || 0
      };

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        navigate('/manager/login');
        return;
      }

      const response = await api.post('/api/events', eventData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Event created successfully!');
      navigate('/manager/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to create event';
      toast.error(errorMessage);
      if (error.response?.status === 401) {
        navigate('/manager/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow px-6 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
            <p className="mt-1 text-sm text-gray-600">Fill in the details to create a new event.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Date and Time</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Venue Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Venue Information</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="venue.name" className="block text-sm font-medium text-gray-700">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    id="venue.name"
                    name="venue.name"
                    value={formData.venue.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="venue.city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    id="venue.city"
                    name="venue.city"
                    value={formData.venue.city}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="venue.address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  id="venue.address"
                  name="venue.address"
                  rows="2"
                  value={formData.venue.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Team and Payment Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Team and Payment Settings</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="teamSize.min" className="block text-sm font-medium text-gray-700">
                    Min Team Size
                  </label>
                  <input
                    type="number"
                    id="teamSize.min"
                    name="teamSize.min"
                    min="1"
                    value={formData.teamSize.min}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="teamSize.max" className="block text-sm font-medium text-gray-700">
                    Max Team Size
                  </label>
                  <input
                    type="number"
                    id="teamSize.max"
                    name="teamSize.max"
                    min="1"
                    value={formData.teamSize.max}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="maxTeams" className="block text-sm font-medium text-gray-700">
                    Max Teams
                  </label>
                  <input
                    type="number"
                    id="maxTeams"
                    name="maxTeams"
                    min="1"
                    value={formData.maxTeams}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <div>
                  <label htmlFor="entryFee" className="block text-sm font-medium text-gray-700">
                    Entry Fee (₹)
                  </label>
                  <input
                    type="number"
                    id="entryFee"
                    name="entryFee"
                    min="0"
                    value={formData.entryFee}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {parseInt(formData.entryFee) > 0 && (
                  <div className="bg-white p-4 rounded-md border border-blue-200">
                    <label htmlFor="paymentDetails.upiId" className="block text-sm font-medium text-gray-700">
                      UPI ID for Payment Collection
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="paymentDetails.upiId"
                        name="paymentDetails.upiId"
                        value={formData.paymentDetails.upiId}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="example@upi"
                        required={parseInt(formData.entryFee) > 0}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        This UPI ID will be shown to participants for making payments
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Event Rules</h3>
                <button
                  type="button"
                  onClick={addRule}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Rule
                </button>
              </div>

              {rules.map((rule, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    placeholder={`Rule ${index + 1}`}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating Event...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
