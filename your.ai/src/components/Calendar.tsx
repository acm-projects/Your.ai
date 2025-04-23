import React, { useState, useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext'; // Adjust the path accordingly
import Sidebar from './Sidebar';
import CalendarView from './CalendarView';
import { CalendarClock } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';

const Calendar: React.FC = () => {
  const { events, fetchEvents, addEvent } = useCalendar(); // Accessing calendar data and fetch function from context
  const [view, setView] = useState<'Day' | 'Weekly' | 'Monthly'>('Weekly');
  const [searchTerm, setSearchTerm] = useState(''); // Search functionality
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs()); // Date selection functionality
  const [categories, setCategories] = useState({
    'School Work': true,
    Organization: true,
    Gym: false,
    Groceries: false,
    Research: false,
  }); // Category filters

  const handleCategoryChange = (key: string) => {
    setCategories({ ...categories, [key]: !categories[key] }); // Toggle category filters
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Filtered by search term

  useEffect(() => {
    fetchEvents(); 
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">Tasks Calendar</h1>
            <p className="text-gray-500">Your schedule and filters</p>
          </div>
          <button
            onClick={() => addEvent({ id: Date.now(), title: 'New Event', time: '12:00', category: 'Organization' })}
            className="inline-flex items-center gap-2 rounded-md text-sm font-medium bg-blue-600 text-white h-10 px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            <CalendarClock className="h-4 w-4" />
            Add Event
          </button>
        </div>

        {/* View & Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {['Day', 'Weekly', 'Monthly'].map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType as typeof view)}
                  className={`px-4 py-1 text-sm rounded-md ${
                    view === viewType ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {viewType}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Calendar View */}
        <CalendarView
          view={view}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          filteredEvents={filteredEvents}
          categories={categories}
          handleCategoryChange={handleCategoryChange}
        />
      </main>
    </div>
  );
};

export default Calendar;