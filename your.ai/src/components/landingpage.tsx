import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Your.Ai</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900">About Us</a>
              <Link
                to="/dashboard"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <button className="text-gray-600 hover:text-gray-900">
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Organize Your Life with</span>
              <span className="block text-indigo-600">Your.ai </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              The perfect blend of calendar and note-taking. Keep track of your schedule while taking detailed notes for every event.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">See Your.ai in Action</h2>
            <p className="mt-4 text-lg text-gray-500">Watch how easy it is to organize your schedule and take notes</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl bg-white p-4">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <i className="fas fa-play-circle text-6xl text-indigo-600 mb-4"></i>
                  <p className="text-gray-600">Demo video coming soon!</p>
                  <p className="text-sm text-gray-500 mt-2">Experience our AI-powered calendar and note-taking features</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Features that make you more productive
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* AI-Powered Scheduling */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition duration-300">
              <div className="text-indigo-600 mb-4">
                <i className="fas fa-brain text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Scheduling</h3>
              <p className="text-gray-600">Smart scheduling assistant that learns your preferences and suggests optimal meeting times.</p>
            </div>
            {/* Task Organizer */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition duration-300">
              <div className="text-indigo-600 mb-4">
                <i className="fas fa-tasks text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Task Organizer</h3>
              <p className="text-gray-600">Efficiently organize and prioritize your tasks with smart categorization and reminders.</p>
            </div>
            {/* Smart Notes */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition duration-300">
              <div className="text-indigo-600 mb-4">
                <i className="fas fa-lightbulb text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Notes</h3>
              <p className="text-gray-600">AI-powered note suggestions and automatic organization based on your calendar events.</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Dedicated professionals working to make your life more organized
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
                <i className="fas fa-user text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Harsh Patel</h3>
              <p className="text-gray-600">Frontend </p>
              <p className="mt-4 text-gray-500">Blank.</p>
            </div>
            {/* Team Member 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
                <i className="fas fa-user text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Sreenidhi</h3>
              <p className="text-gray-600">Frontend</p>
              <p className="mt-4 text-gray-500">blank.</p>
            </div>
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
                <i className="fas fa-user text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Suhani Rana</h3>
              <p className="text-gray-600">Backend Manager</p>
              <p className="mt-4 text-gray-500">blank.</p>
            </div>
            {/* Team Member 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
                <i className="fas fa-user text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Krish Arora</h3>
              <p className="text-gray-600">Backend</p>
              <p className="mt-4 text-gray-500">blank.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Your.ai</h4>
              <p className="text-gray-400">Organize your life with smart calendar and note-taking features.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Check us out</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; ACM . All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
