import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Chatbot from '../components/Chatbot';

const HomePage = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-10"></div>
        
        {/* Animated Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className={`block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome to</span>
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#B8860B] animate-gradient">
                HackOn
              </span>
            </h1>
            <p className={`mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              The ultimate platform for organizing and participating in hackathons.
              Join the community of innovators, creators, and problem solvers.
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                <Link
                  to="/events"
                  className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10 transform transition hover:scale-105"
                >
                  Explore Hackathons
                </Link>
                <Link
                  to="/manager/register"
                  className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transform transition hover:scale-105"
                >
                  Host a Hackathon
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:text-4xl`}>
              Why Choose HackOn?
            </h2>
            <p className={`mt-4 max-w-2xl mx-auto text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Everything you need to run successful hackathons
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className={`relative group p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl transition-all duration-500 transform hover:scale-105`}>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className={`mt-4 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Easy Organization</h3>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Streamlined tools for managing participants, submissions, and judging.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className={`relative group p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl transition-all duration-500 transform hover:scale-105`}>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className={`mt-4 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Global Community</h3>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Connect with participants and organizers from around the world.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className={`relative group p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl transition-all duration-500 transform hover:scale-105`}>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className={`mt-4 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Secure Platform</h3>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Built with security and privacy in mind for all participants.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default HomePage;
