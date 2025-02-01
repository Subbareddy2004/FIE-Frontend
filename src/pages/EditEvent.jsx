import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { eventApi } from '../services/api';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    venue: {
      name: '',
      address: '',
      city: '',
      state: '',
      country: ''
    },
    minTeamSize: 1,
    maxTeamSize: 4,
    maxTeams: 50,
    entryFee: 0,
    paymentDetails: {
      upiId: '',
      accountName: '',
      notes: ''
    },
    whatsappLink: '',
    rules: [''],
    departments: [''],
    skills: [''],
    prizes: {
      first: 0,
      second: 0,
      third: 0,
      consolation: 0
    },
    status: 'draft',
    image: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await eventApi.getEvent(id);
        setEvent({
          ...eventData,
          startDate: eventData.startDate ? new Date(eventData.startDate).toISOString().split('T')[0] : '',
          endDate: eventData.endDate ? new Date(eventData.endDate).toISOString().split('T')[0] : '',
          registrationDeadline: eventData.registrationDeadline ? new Date(eventData.registrationDeadline).toISOString().split('T')[0] : '',
          venue: eventData.venue || {
            name: '',
            address: '',
            city: '',
            state: '',
            country: ''
          },
          paymentDetails: eventData.paymentDetails || {
            upiId: '',
            accountName: '',
            notes: ''
          },
          rules: eventData.rules || [''],
          departments: eventData.departments || [''],
          skills: eventData.skills || [''],
          prizes: eventData.prizes || {
            first: 0,
            second: 0,
            third: 0,
            consolation: 0
          },
          whatsappLink: eventData.whatsappLink || ''
        });
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
        navigate('/manager/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEvent(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEvent(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format dates to ISO string
      const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return d instanceof Date && !isNaN(d) ? d.toISOString() : null;
      };

      const updatedEvent = {
        title: event.title?.trim(),
        description: event.description?.trim(),
        startDate: formatDate(event.startDate),
        endDate: formatDate(event.endDate),
        registrationDeadline: formatDate(event.registrationDeadline),
        minTeamSize: parseInt(event.minTeamSize) || 1,
        maxTeamSize: parseInt(event.maxTeamSize) || 1,
        maxTeams: parseInt(event.maxTeams) || 1,
        entryFee: parseInt(event.entryFee) || 0,
        prizes: {
          first: parseInt(event.prizes?.first) || 0,
          second: parseInt(event.prizes?.second) || 0,
          third: parseInt(event.prizes?.third) || 0,
          consolation: parseInt(event.prizes?.consolation) || 0
        },
        departments: (event.departments || []).filter(dept => dept?.trim?.()),
        skills: (event.skills || []).filter(skill => skill?.trim?.()),
        rules: (event.rules || []).filter(rule => rule?.trim?.()),
        venue: {
          name: event.venue?.name?.trim() || '',
          address: event.venue?.address?.trim() || '',
          city: event.venue?.city?.trim() || '',
          state: event.venue?.state?.trim() || '',
          country: event.venue?.country?.trim() || ''
        },
        paymentDetails: {
          upiId: event.paymentDetails?.upiId?.trim() || '',
          accountName: event.paymentDetails?.accountName?.trim() || '',
          notes: event.paymentDetails?.notes?.trim() || ''
        },
        whatsappLink: event.whatsappLink?.trim() || '',
        status: event.status || 'draft'
      };

      // Validate required fields
      const requiredFields = ['title', 'description', 'startDate', 'endDate', 'registrationDeadline'];
      const missingFields = requiredFields.filter(field => !updatedEvent[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate venue fields
      const requiredVenueFields = ['name', 'address', 'city', 'state', 'country'];
      const missingVenueFields = requiredVenueFields.filter(field => !updatedEvent.venue[field]);
      
      if (missingVenueFields.length > 0) {
        throw new Error(`Missing required venue fields: ${missingVenueFields.join(', ')}`);
      }

      // Validate team size
      if (updatedEvent.minTeamSize > updatedEvent.maxTeamSize) {
        throw new Error('Minimum team size cannot be greater than maximum team size');
      }

      await eventApi.updateEvent(id, updatedEvent);
      toast.success('Event updated successfully');
      navigate('/manager/dashboard');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.message || error.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/manager/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">Edit Event</h1>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
            
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  name="title"
                  value={event.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  name="description"
                  value={event.description}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={event.startDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={event.endDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Deadline</label>
                  <input
                    type="date"
                    name="registrationDeadline"
                    value={event.registrationDeadline}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp Group Link</label>
                  <input
                    type="url"
                    name="whatsappLink"
                    value={event.whatsappLink}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select
                    name="status"
                    value={event.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Venue Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Venue Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Venue Name</label>
                    <input
                      type="text"
                      name="venue.name"
                      value={event.venue?.name || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                    <input
                      type="text"
                      name="venue.address"
                      value={event.venue?.address || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                    <input
                      type="text"
                      name="venue.city"
                      value={event.venue?.city || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                    <input
                      type="text"
                      name="venue.state"
                      value={event.venue?.state || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                    <input
                      type="text"
                      name="venue.country"
                      value={event.venue?.country || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Team Size and Registration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Team Size</label>
                  <input
                    type="number"
                    name="minTeamSize"
                    value={event.minTeamSize}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Team Size</label>
                  <input
                    type="number"
                    name="maxTeamSize"
                    value={event.maxTeamSize}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Teams</label>
                  <input
                    type="number"
                    name="maxTeams"
                    value={event.maxTeams}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Departments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Departments</label>
                <input
                  type="text"
                  name="departments"
                  value={event.departments?.join(', ') || ''}
                  onChange={(e) => setEvent({
                    ...event,
                    departments: e.target.value.split(',').map(d => d.trim())
                  })}
                  placeholder="Enter departments separated by commas"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/manager/dashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
