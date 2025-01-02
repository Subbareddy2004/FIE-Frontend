import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/events');
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-poppins mb-6">
              Welcome to HackathonHub
            </h1>
            <p className="text-xl md:text-2xl font-inter mb-8">
              The ultimate platform for organizing and participating in hackathons
            </p>
            <div className="flex justify-center space-x-6">
              <Link
                to="/manager/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Register as Manager
              </Link>
              <Link
                to="/manager/login"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-4">
              Why Choose HackathonHub?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 text-2xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">Easy Event Management</h3>
              <p className="text-gray-600">Create and manage hackathons with our intuitive dashboard</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 text-2xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">Team Registration</h3>
              <p className="text-gray-600">Simple and efficient team registration process</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 text-2xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">Analytics & Reports</h3>
              <p className="text-gray-600">Get detailed insights about your events and participants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 text-center text-white">
              <h2 className="text-3xl font-bold font-poppins mb-4">
                Ready to Host Your Hackathon?
              </h2>
              <p className="text-xl mb-8 font-inter">
                Join HackathonHub today and start managing your events efficiently
              </p>
              <Link
                to="/manager/register"
                className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Hackathons Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 font-poppins mb-12">
            Upcoming Hackathons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 font-poppins">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Date:</span>{' '}
                      {format(new Date(event.startDate), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Venue:</span> {event.venue.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Team Size:</span>{' '}
                      {event.teamSize.min} - {event.teamSize.max} members
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Entry Fee:</span> ₹{event.entryFee}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/event/${event._id}`}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
