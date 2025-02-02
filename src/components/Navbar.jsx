import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout, isStudent } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavLinks = () => {
    if (!user) {
      return (
        <>
          <Link
            to="/events"
            className={getLinkClasses('/events')}
          >
            Hackathons
          </Link>
          <Link
            to="/about"
            className={getLinkClasses('/about')}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={getLinkClasses('/contact')}
          >
            Contact
          </Link>
        </>
      );
    }

    if (isStudent) {
      return (
        <>
          <Link
            to="/student/dashboard"
            className={getLinkClasses('/student/dashboard')}
          >
            Dashboard
          </Link>
          <Link
            to="/events"
            className={getLinkClasses('/events')}
          >
            Browse Hackathons
          </Link>
          <Link
            to="/student/registered"
            className={getLinkClasses('/student/registered')}
          >
            My Registrations
          </Link>
        </>
      );
    }

    return (
      <>
        <Link
          to="/manager/dashboard"
          className={getLinkClasses('/manager/dashboard')}
        >
          Dashboard
        </Link>
        <Link
          to="/events/create"
          className={getLinkClasses('/events/create')}
        >
          Create Event
        </Link>
        <Link
          to="/events"
          className={getLinkClasses('/events')}
        >
          My Events
        </Link>
      </>
    );
  };

  const getLinkClasses = (path) => {
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
        : isDarkMode
          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
    }`;
  };

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'
    } shadow-lg backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg transform rotate-45"></div>
                <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-lg transform rotate-45"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-lg">H</span>
                </div>
              </div>
              <span className={`font-bold text-xl ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                HackOn
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {getNavLinks()}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* User Menu */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center space-x-2 ${
                    isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <span>{user.name}</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } ring-1 ring-black ring-opacity-5`}>
                    <Link
                      to={isStudent ? "/student/profile" : "/manager/profile"}
                      className={`block px-4 py-2 text-sm ${
                        isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Auth Buttons */}
            {!user && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/student/login"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Student Login
                </Link>
                <Link
                  to="/manager/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
                >
                  Manager Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {getNavLinks()}
          </div>
          
          {/* Add user options for mobile */}
          {user && (
            <div className={`pt-4 pb-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="px-2 space-y-1">
                {/* User info section */}
                <div className={`px-3 py-2 rounded-md text-base font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {user.name}
                </div>
                
                {/* Profile link */}
                <Link
                  to={isStudent ? "/student/profile" : "/manager/profile"}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Profile
                </Link>
                
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
          
          {/* Keep the existing non-logged-in user options */}
          {!user && (
            <div className={`pt-4 pb-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="px-2 space-y-1">
                <Link
                  to="/student/login"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Student Login
                </Link>
                <Link
                  to="/manager/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                >
                  Manager Login
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
