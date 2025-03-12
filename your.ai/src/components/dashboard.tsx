import React, { useState } from 'react';
import { Link } from 'react-router-dom';


interface Event {
  id: string;
  title: string;
  time: string;
  attendees: number;
  type: 'meeting' | 'task' | 'session';
}

const Dashboard: React.FC = () => {
  const [view, setView] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly');
  const [currentDate] = useState('March 2025');

  const sampleEvents: Event[] = [
    { id: '1', title: 'Test for data structures', time: '09:00 AM - 10:30 AM', attendees: 3, type: 'task' },
    { id: '2', title: 'Finishing frontend Pages', time: '08:30 AM - 10:00 AM', attendees: 3, type: 'task' },
    { id: '3', title: 'Hang out with friends at starbucks', time: '10:30 AM - 12:00 PM', attendees: 3, type: 'session' },
    { id: '4', title: 'Interview for Apple', time: '11:35 AM - 01:00 AM', attendees: 3, type: 'meeting' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Your.ai" className="h-8 w-8" />
            <span className="text-xl font-bold text-indigo-600">Your.ai</span>
          </div>
        </div>

        <nav className="mt-8">
          <div className="px-4 font-medium text-gray-500 uppercase tracking-wider text-xs">
            MAIN MENU
          </div>
          <div className="mt-4">
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
              <i className="fas fa-th-large mr-3"></i>
              Dashboard
            </a>
            <a href="#" className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600">
              <i className="fas fa-mr-3"></i>
              My Calendar
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
              <i className="fas fa-sticky-note mr-3"></i>
              Newsletter
            </a>
            <Link to="/tasks" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
  Tasks
</Link>

          
          </div>

          <div className="mt-8 px-4 font-medium text-gray-500 uppercase tracking-wider text-xs">
            OTHERS
          </div>
          <div className="mt-4">
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
              <i className="fas fa-cog mr-3"></i>
              Settings
            </a>
            
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">My Calendar</h1>
              <div className="flex space-x-2">
                {['Weekly', 'Monthly', 'Yearly'].map((viewType) => (
                  <button
                    key={viewType}
                    onClick={() => setView(viewType as any)}
                    className={`px-4 py-1 text-sm rounded-md ${
                      view === viewType
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {viewType}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-3 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-50">
                <i className="fas fa-file-export mr-2"></i>
                Export
              </button>
              <button className="flex items-center px-3 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-50">
                <i className="fas fa-trash-alt mr-2"></i>
                Deleted Schedule
              </button>
              <button className="flex items-center px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                <i className="fas fa-plus mr-2"></i>
                Create Schedule
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center">
              {currentDate}
              <button className="ml-2 text-gray-400 hover:text-gray-600">
                <i className="fas fa-pen"></i>
              </button>
            </h2>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search now..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-7 gap-4 p-4 border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-gray-600">
                  {day}
                </div>
              ))}
            </div>
            <div className="divide-y">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex p-4">
                  <div className="w-20 text-gray-500">{`${(i + 9).toString().padStart(2, '0')}:00`}</div>
                  <div className="flex-1 relative">
                    {sampleEvents
                      .filter((event) => event.time.startsWith(`${(i + 9).toString().padStart(2, '0')}:`))
                      .map((event) => (
                        <div key={event.id} className={`absolute left-0 right-0 p-2 rounded-lg ${
                          event.type === 'meeting'
                            ? 'bg-red-50 border-l-4 border-red-500'
                            : event.type === 'task'
                            ? 'bg-green-50 border-l-4 border-green-500'
                            : 'bg-yellow-50 border-l-4 border-yellow-500'
                        }`}>
                          <span className="font-medium">{event.title}</span>
                          <div className="text-sm text-gray-500">{event.time}</div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
