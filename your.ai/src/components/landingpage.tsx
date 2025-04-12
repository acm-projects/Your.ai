import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-2xl font-extrabold text-indigo-600">Your.ai</span>
            <div className="hidden md:flex space-x-6 items-center">
              <Link to="/Dashboard" className="text-slate-600 hover:text-indigo-600 transition">Home</Link>
              <a href="#features" className="text-slate-600 hover:text-indigo-600 transition">Features</a>
              <a href="#about" className="text-slate-600 hover:text-indigo-600 transition">About Us</a>
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </div>
            <div className="md:hidden">
              <button className="text-slate-600 hover:text-indigo-600 transition">
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="text-center py-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-800 leading-tight">
          <span>Organize Your Life with</span>
          <br />
          <span className="text-indigo-600">Your.ai</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
          The perfect blend of calendar and note-taking. Keep track of your schedule while taking detailed notes for every event.
        </p>
        <div className="mt-8">
          <Link
            to="/login"
            className="inline-block bg-indigo-600 text-white font-medium px-8 py-3 rounded-md hover:bg-indigo-700 transition text-lg shadow"
          >
            Get Started
          </Link>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800">See Your.ai in Action</h2>
          <p className="mt-2 text-slate-500">Watch how easy it is to organize your schedule and take notes</p>
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-lg">
              <video
                className="w-full h-[300px] object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source
                  src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-800">Features that make you more productive</h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: 'fas fa-brain',
                title: 'AI-Powered Scheduling',
                desc: 'Smart assistant that learns your preferences and suggests optimal meeting times.',
              },
              {
                icon: 'fas fa-tasks',
                title: 'Task Organizer',
                desc: 'Efficiently organize and prioritize your tasks with smart categorization and reminders.',
              },
              {
                icon: 'fas fa-lightbulb',
                title: 'Smart Notes',
                desc: 'AI-powered note suggestions and automatic organization based on your calendar events.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-slate-50 p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="text-indigo-600 mb-4">
                  <i className={`${icon} text-3xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-800">Meet Our Team</h2>
          <p className="text-slate-600 mt-2">Dedicated professionals working to make your life more organized</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              ['Harsh Patel', 'Frontend', 'Blank.'],
              ['Sreenidhi', 'Frontend', 'Blank.'],
              ['Suhani Rana', 'Backend Manager', 'Blank.'],
              ['Krish Arora', 'Backend', 'Blank.'],
            ].map(([name, role, desc]) => (
              <div key={name} className="bg-white p-8 rounded-lg shadow text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center">
                  <i className="fas fa-user text-3xl text-slate-500"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-800">{name}</h3>
                <p className="text-indigo-600">{role}</p>
                <p className="text-slate-500 mt-2">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4 text-lg">Your.ai</h4>
            <p className="text-slate-400">Organize your life with smart calendar and note-taking features.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-300 text-slate-400">Home</a></li>
              <li><a href="#features" className="hover:text-indigo-300 text-slate-400">Features</a></li>
              <li><a href="#about" className="hover:text-indigo-300 text-slate-400">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-300 text-slate-400">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-300 text-slate-400">Contact</a></li>
              <li><a href="#" className="hover:text-indigo-300 text-slate-400">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Check us out</h4>
            <div className="flex space-x-4">
  <a href="#" className="text-slate-400 hover:text-indigo-300">
    <i className="fab fa-linkedin text-xl"></i>
  </a>
  <a href="https://acmutd.co" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-300">
    <img
      src="/images.png"
      alt="ACM UTD Logo"
      className="w-6 h-6 object-contain"
    />
  </a>
</div>

          </div>
        </div>
        <div className="text-center text-slate-500 mt-10 border-t border-slate-700 pt-6 flex items-center justify-center space-x-2">
  <img src="/acm.png" alt="ACM Logo" className="w-5 h-5" />
  <span>&copy; ACM. All rights reserved.</span>
</div>

      </footer>
    </div>
  )
}

export default LandingPage;
