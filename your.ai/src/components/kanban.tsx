import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Types for tasks and columns
type Task = {
  id: string;
  title: string;
};

type Column = {
  id: string;
  name: string;
  tasks: Task[];
};

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', name: 'To Do', tasks: [] },
    { id: 'inProgress', name: 'In Progress', tasks: [] },
    { id: 'done', name: 'Done', tasks: [] },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const storedColumns = localStorage.getItem('kanbanColumns');
    if (storedColumns) {
      setColumns(JSON.parse(storedColumns));
    }
  }, []);

  // Save columns to localStorage whenever columns state changes
  useEffect(() => {
    localStorage.setItem('kanbanColumns', JSON.stringify(columns));
  }, [columns]);

  // Handle the start of the drag event
  const handleDragStart = (e: React.DragEvent, columnId: string, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('columnId', columnId);
  };

  // Handle the drop event to move tasks between columns
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('columnId');

    if (taskId && sourceColumnId !== columnId) {
      const sourceColumn = columns.find((col) => col.id === sourceColumnId);
      const targetColumn = columns.find((col) => col.id === columnId);

      if (sourceColumn && targetColumn) {
        const taskIndex = sourceColumn.tasks.findIndex((task) => task.id === taskId);
        const task = sourceColumn.tasks.splice(taskIndex, 1)[0];

        targetColumn.tasks.push(task);
        setColumns([...columns]); // Trigger state update to reflect changes
      }
    }
  };

  // Handle the drag over event to allow dropping
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Add a new task to a column
  const handleAddTask = (columnId: string) => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(), // Generate a unique ID based on current timestamp
        title: newTaskTitle,
      };

      // Find the target column
      const targetColumn = columns.find((col) => col.id === columnId);
      if (targetColumn) {
        // Add the new task to the target column
        targetColumn.tasks.push(newTask);

        // Update the state to trigger a re-render
        setColumns([...columns]);

        // Clear the input field after adding the task
        setNewTaskTitle('');
        inputRef.current?.blur(); // Remove focus from input
      }
    }
  };

  // Remove a task from a column
  const handleRemoveTask = (taskId: string, columnId: string) => {
    const targetColumn = columns.find((col) => col.id === columnId);
    if (targetColumn) {
      // Remove the task from the column
      targetColumn.tasks = targetColumn.tasks.filter((task) => task.id !== taskId);

      // Update the state to reflect the changes
      setColumns([...columns]);
    }
  };

  return (
    <div className="kanban-board container mx-auto p-6 space-y-6">
      {/* Header with the Kanban Board title */}
      <div className="flex justify-between items-center mb-6 relative">
        <h1 className="text-4xl font-bold text-gray-800 text-center w-full">Kanban Board</h1>
        <Link
          to="/dashboard"
          className="absolute top-2 right-4 text-sm text-blue-500 hover:text-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Kanban Board Columns */}
      <div className="flex space-x-8">
        {columns.map((column) => (
          <div
            key={column.id}
            className="kanban-column w-80 bg-gradient-to-tl from-blue-100 via-purple-100 to-pink-100 p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105"
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
          >
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">{column.name}</h2>

            {/* Render tasks in the column */}
            {column.tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, column.id, task.id)}
                className="kanban-task bg-white p-4 mb-4 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg">{task.title}</span>
                  {/* Delete button */}
                  <button
                    onClick={() => handleRemoveTask(task.id, column.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {/* Input field to add new tasks */}
            <div className="flex mt-4">
              <input
                ref={inputRef}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button
                onClick={() => handleAddTask(column.id)}
                className="ml-4 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;

