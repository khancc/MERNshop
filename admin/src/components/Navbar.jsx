import React from 'react';
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";

const AdminNavbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-padd-container flexBetween h-16">
        {/* Logo with subtle scaling effect */}
        <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
          <img 
            src={logo} 
            alt="Admin Logo" 
            className="h-10 w-auto"  // Adjusted size for admin interface
          />
        </div>

        {/* Profile section with elegant dropdown indicator */}
        <div className="relative group">
          <div className="flex items-center space-x-2 cursor-pointer">
            <span className="hidden md:inline text-sm font-medium text-gray-600">Admin</span>
            <div className="relative">
              <img 
                src={profile} 
                alt="Admin Profile" 
                className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200 hover:ring-primary-300 transition-all duration-200"
              />
              {/* Active indicator dot */}
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-400 border border-white"></span>
            </div>
          </div>

          {/* Simple dropdown arrow indicator */}
          <svg 
            className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;