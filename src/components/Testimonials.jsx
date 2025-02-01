import React from 'react';

const testimonials = [
  {
    content: "HackHub made organizing our university hackathon a breeze. The platform is intuitive and the support team is amazing!",
    author: "Sarah Chen",
    role: "Event Organizer",
    organization: "Tech University",
  },
  {
    content: "As a participant, I love how easy it is to find and join hackathons. The platform has everything I need in one place.",
    author: "Michael Rodriguez",
    role: "Software Developer",
    organization: "StartupCo",
  },
  {
    content: "We've seen a 50% increase in hackathon participation since switching to HackHub. The analytics and management tools are fantastic.",
    author: "Emily Thompson",
    role: "Community Manager",
    organization: "Innovation Labs",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-white py-12 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-20">
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl font-display">
            What People Are Saying
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Don't just take our word for it - hear from some of our amazing customers
          </p>
        </div>
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg shadow-lg overflow-hidden"
            >
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-3 text-base text-gray-500">"{testimonial.content}"</p>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                      {testimonial.author.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <p>{testimonial.role}</p>
                      <span aria-hidden="true">&middot;</span>
                      <p>{testimonial.organization}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
