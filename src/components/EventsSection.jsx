import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => (
  <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
    <div className="flex-shrink-0">
      <img className="h-48 w-full object-cover" src={event.image} alt={event.title} />
    </div>
    <div className="flex-1 bg-white p-6 flex flex-col justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-primary-600">
          {event.category}
        </p>
        <Link to={`/event/${event.id}`} className="block mt-2">
          <p className="text-xl font-semibold text-gray-900">{event.title}</p>
          <p className="mt-3 text-base text-gray-500">{event.description}</p>
        </Link>
      </div>
      <div className="mt-6 flex items-center">
        <div className="flex-shrink-0">
          <span className="sr-only">{event.organizer}</span>
          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
            {event.organizer.charAt(0)}
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            {event.organizer}
          </p>
          <div className="flex space-x-1 text-sm text-gray-500">
            <time dateTime={event.date}>{new Date(event.date).toLocaleDateString()}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EventsSection = () => {
  // Sample events data - replace with actual data from your backend
  const events = [
    {
      id: 1,
      title: "AI Innovation Challenge",
      description: "Join us for a 48-hour hackathon focused on artificial intelligence and machine learning innovations.",
      category: "Artificial Intelligence",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      organizer: "TechCorp",
      date: "2024-03-15",
      location: "Virtual",
    },
    {
      id: 2,
      title: "Sustainable Tech Hackathon",
      description: "Create innovative solutions for environmental challenges using cutting-edge technology.",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      organizer: "GreenTech",
      date: "2024-04-01",
      location: "San Francisco, CA",
    },
    {
      id: 3,
      title: "Web3 Development Challenge",
      description: "Build the future of decentralized applications in this exciting blockchain hackathon.",
      category: "Blockchain",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      organizer: "CryptoLabs",
      date: "2024-04-15",
      location: "Virtual",
    },
  ];

  return (
    <div className="bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl font-display">
            Upcoming Hackathons
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover exciting hackathons and challenges from around the world
          </p>
        </div>
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/events"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
          >
            View all events
            <svg
              className="ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsSection;
