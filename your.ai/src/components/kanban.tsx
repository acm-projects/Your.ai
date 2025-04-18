import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type Task = {
  id: string;
  title: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
};

type Column = {
  id: string;
  name: string;
  tasks: Task[];
  color: string;
  icon: string;
};

const Kanban: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([
    { 
      id: "todo", 
      name: "To Do", 
      tasks: [], 
      color: "bg-blue-500",
      icon: "📋"
    },
    { 
      id: "inProgress", 
      name: "In Progress", 
      tasks: [], 
      color: "bg-amber-500",
      icon: "⚙️"
    },
    { 
      id: "done", 
      name: "Done", 
      tasks: [], 
      color: "bg-green-500",
      icon: "✅"
    },
  ]);
  
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedColumns = localStorage.getItem("kanbanColumns");
    if (storedColumns) setColumns(JSON.parse(storedColumns));
  }, []);

  useEffect(() => {
    localStorage.setItem("kanbanColumns", JSON.stringify(columns));
  }, [columns]);

  const handleDragStart = (
    e: React.DragEvent,
    columnId: string,
    taskId: string
  ) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("columnId", columnId);
    setDraggedItem(taskId);
    
    // Create a ghost image
    const ghostElement = document.createElement("div");
    ghostElement.classList.add("w-10", "h-10", "bg-transparent");
    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 0, 0);
    
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("columnId");

    if (taskId && sourceColumnId !== columnId) {
      const sourceColumn = columns.find((col) => col.id === sourceColumnId);
      const targetColumn = columns.find((col) => col.id === columnId);

      if (sourceColumn && targetColumn) {
        const taskIndex = sourceColumn.tasks.findIndex(
          (task) => task.id === taskId
        );
        const task = sourceColumn.tasks.splice(taskIndex, 1)[0];
        targetColumn.tasks.push(task);
        setColumns([...columns]);
      }
    }
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleAddTask = (columnId: string) => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        createdAt: new Date().toISOString(),
        priority: newTaskPriority
      };

      const targetColumn = columns.find((col) => col.id === columnId);
      if (targetColumn) {
        targetColumn.tasks.push(newTask);
        setColumns([...columns]);
        setNewTaskTitle("");
        setNewTaskPriority("medium");
        setIsAddingTask(null);
      }
    }
  };

  const handleRemoveTask = (taskId: string, columnId: string) => {
    const targetColumn = columns.find((col) => col.id === columnId);
    if (targetColumn) {
      targetColumn.tasks = targetColumn.tasks.filter(
        (task) => task.id !== taskId
      );
      setColumns([...columns]);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="kanban-board min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center mb-8 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-center w-full">
          Task Flow
        </h1>
        <Link
          to="/dashboard"
          className="absolute top-2 right-4 text-sm bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-indigo-600 hover:text-indigo-800 hover:bg-white transition shadow-sm"
        >
          ⬅ Back to Dashboard
        </Link>
      </motion.div>

      {/* Columns */}
      <div className="flex flex-wrap justify-center gap-6">
        {columns.map((column, colIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: colIndex * 0.1 }}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
            className="w-80 bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{column.icon}</span>
              <h2 className="text-xl font-semibold text-gray-800">
                {column.name}
              </h2>
              <span className="ml-auto bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {column.tasks.length}
              </span>
            </div>

            <div className={`h-1 w-full ${column.color} rounded-full mb-4`}></div>

            {/* Tasks */}
            <div className="flex flex-col gap-3 flex-grow overflow-y-auto max-h-[calc(100vh-300px)] pr-1 custom-scrollbar">
              {column.tasks.map((task) => (
                <motion.div
                  layout
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, column.id, task.id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md border-l-4 ${
                    draggedItem === task.id ? "opacity-50" : "opacity-100"
                  } ${
                    task.priority === "high" 
                      ? "border-l-red-500" 
                      : task.priority === "medium" 
                        ? "border-l-amber-500" 
                        : "border-l-blue-500"
                  } transition-all duration-200 cursor-grab active:cursor-grabbing`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-gray-800 font-medium">{task.title}</h3>
                    <button
                      onClick={() => handleRemoveTask(task.id, column.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)} text-xs border`}>
                      {task.priority}
                    </span>
                    <span className="text-gray-500">
                      {formatDate(task.createdAt)}
                    </span>
                  </div>
                </motion.div>
              ))}
              {column.tasks.length === 0 && (
                <div className="text-center py-8 text-gray-400 italic text-sm">
                  No tasks yet
                </div>
              )}
            </div>

            {/* Add Task */}
            {isAddingTask === column.id ? (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
                  autoFocus
                />
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-600">Priority:</label>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setNewTaskPriority("low")}
                      className={`px-2 py-1 text-xs rounded-md ${newTaskPriority === "low" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800"}`}
                    >
                      Low
                    </button>
                    <button 
                      onClick={() => setNewTaskPriority("medium")}
                      className={`px-2 py-1 text-xs rounded-md ${newTaskPriority === "medium" ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-800"}`}
                    >
                      Medium
                    </button>
                    <button 
                      onClick={() => setNewTaskPriority("high")}
                      className={`px-2 py-1 text-xs rounded-md ${newTaskPriority === "high" ? "bg-red-500 text-white" : "bg-red-100 text-red-800"}`}
                    >
                      High
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddTask(column.id)}
                    className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingTask(null);
                      setNewTaskTitle("");
                    }}
                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setIsAddingTask(column.id)}
                className="mt-4 w-full flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default Kanban;