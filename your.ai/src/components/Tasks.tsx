import React, { useState, useEffect } from 'react';

// ✅ Activity Ring Component
const ActivityRing: React.FC<{ progress: number; color: string; size?: number; strokeWidth?: number }> = ({
  progress, 
  color, 
  size = 120, 
  strokeWidth = 12 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (56 / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle className="text-gray-200" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle className="transition-all duration-1000 ease-in-out" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke={color} fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold" style={{ color }}>
        {Math.round(45)}%
      </div>
    </div>
  );
};

const Tasks: React.FC = () => {
  const [completionRate, setCompletionRate] = useState(0);
  const [weeklyTasks, setWeeklyTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'inProgress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as const });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState<{ temperature: number; description: string; icon: string } | null>(null);

  useEffect(() => {
    if (weeklyTasks.length === 0) return;
    const completedTasks = weeklyTasks.filter((task) => task.completed).length;
    setCompletionRate((completedTasks / weeklyTasks.length) * 100);
  }, [weeklyTasks]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const API_KEY = 'YOUR_OPENWEATHER_API_KEY';
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
        const data = await response.json();
        setCurrentWeather({ temperature: Math.round(data.main.temp), description: data.weather[0].description, icon: data.weather[0].icon });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tasks</h1>

        {/* ✅ Weekly Progress Section with Activity Ring */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Progress</h2>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <ActivityRing progress={completionRate} color="#6366f1" size={160} strokeWidth={15} />
            </div>
            <div className="flex-1 pl-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Completed Tasks</p>
                  <p className="text-2xl font-bold text-indigo-600">{weeklyTasks.filter((task) => task.completed).length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-800">{weeklyTasks.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">{Math.round(completionRate)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Weather Widget */}
        {loading ? (
          <div className="p-4 bg-white rounded-lg shadow-md animate-pulse">
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        ) : (
          currentWeather && (
            <div className="p-4 bg-white rounded-lg shadow-md mb-8">
              <h3 className="text-lg font-semibold text-gray-800">Current Weather</h3>
              <p className="text-3xl font-bold text-gray-900">{currentWeather.temperature}°C</p>
              <p className="text-gray-600 capitalize">{currentWeather.description}</p>
              <img src={`http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`} alt={currentWeather.description} className="w-16 h-16" />
            </div>
          )
        )}

        {/* ✅ Kanban Board */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Task Board</h2>
            <button onClick={() => setIsAddingTask(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Add Task
            </button>
          </div>

          {/* ✅ Add Task Modal */}
          {isAddingTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
                <input type="text" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full p-2 border rounded-md mb-3" />
                <textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="w-full p-2 border rounded-md mb-3" rows={3} />
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setIsAddingTask(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                    Cancel
                  </button>
                  <button onClick={handleAddTask} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Kanban Columns */}
          <div className="grid grid-cols-3 gap-4">
            {columns.map((column) => (
              <div key={column.id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-4">{column.title}</h3>
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <div key={task.id} className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium text-gray-800">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
