import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useKanbanContext } from "./kanbanContext";
import { useTaskContext } from "./taskContext";

type Task = {
  id: number;
  title: string;
  priority: string;
  dueDate: string;
};

type Column = {
  id: string;
  name: string;
  tasks: Task[];
  color: string;
  icon: string;
};

const Kanban: React.FC = () => {
  const { columns, setColumns } = useKanbanContext();
  const { tasks } = useTaskContext();
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync columns with context tasks
  useEffect(() => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === "todo") return { ...col, tasks: tasks.todo };
        if (col.id === "inProgress") return { ...col, tasks: tasks.inProgress };
        if (col.id === "done") return { ...col, tasks: tasks.done };
        return col;
      })
    );
  }, [tasks]);

  const handleAddTask = (columnId: string) => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle,
        priority: newTaskPriority,
        dueDate: "Today",
      };

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
        )
      );

      setNewTaskTitle("");
      setNewTaskPriority("medium");
      setIsAddingTask(null);
    }
  };

  const handleRemoveTask = (taskId: number, columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
          : col
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, columnId: string, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
    e.dataTransfer.setData("columnId", columnId);
    setDraggedItem(taskId);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    const taskId = parseInt(e.dataTransfer.getData("taskId"), 10);
    const sourceColumnId = e.dataTransfer.getData("columnId");

    if (!taskId || sourceColumnId === columnId) return;

    setColumns((prev) => {
      const newCols = [...prev];
      const sourceCol = newCols.find((c) => c.id === sourceColumnId);
      const targetCol = newCols.find((c) => c.id === columnId);
      if (!sourceCol || !targetCol) return prev;

      const taskIndex = sourceCol.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) return prev;

      const [movedTask] = sourceCol.tasks.splice(taskIndex, 1);
      targetCol.tasks.push(movedTask);
      return [...newCols];
    });

    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDragEnd = () => setDraggedItem(null);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      <Sidebar />
      <div className="kanban-board flex-grow min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-8 relative">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-center w-full">
            Task Flow
          </h1>
          <Link
            to="/dashboard"
            className="absolute top-2 right-4 text-sm bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-indigo-600 hover:text-indigo-800 hover:bg-white transition shadow-sm"
          >
            ⬅ Back to Dashboard
          </Link>
        </div>
        <div className="flex gap-6 min-w-fit">
          {columns.map((column) => (
            <div
              key={column.id}
              onDrop={(e) => handleDrop(e, column.id)}
              onDragOver={handleDragOver}
              className="w-80 bg-white p-6 rounded-xl border border-gray-200 flex-shrink-0"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{column.icon}</span>
                <h2 className="text-xl font-semibold text-gray-800">{column.name}</h2>
                <span className="ml-auto bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              <div className={`h-1 w-full ${column.color} rounded-full mb-4`}></div>
              <div className="flex flex-col gap-3 flex-grow overflow-y-auto max-h-[calc(100vh-300px)] pr-1 custom-scrollbar">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, column.id, task.id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white p-4 rounded-lg border-l-4 ${
                      draggedItem === task.id ? "opacity-50" : "opacity-100"
                    } transition-all duration-200 cursor-grab active:cursor-grabbing`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-gray-800 font-medium">{task.title}</h3>
                      <button
                        onClick={() => handleRemoveTask(task.id, column.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete task"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 border-blue-300 text-xs border">
                        {task.priority}
                      </span>
                      <span className="text-gray-500">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
                {column.tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 italic text-sm">No tasks yet</div>
                )}
              </div>
              {isAddingTask === column.id ? (
                <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
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
                      {["low", "medium", "high"].map((level) => (
                        <button
                          key={level}
                          onClick={() => setNewTaskPriority(level as "low" | "medium" | "high")}
                          className={`px-2 py-1 text-xs rounded-md ${
                            newTaskPriority === level
                              ? level === "low"
                                ? "bg-blue-500 text-white"
                                : level === "medium"
                                ? "bg-amber-500 text-white"
                                : "bg-red-500 text-white"
                              : level === "low"
                              ? "bg-blue-100 text-blue-800"
                              : level === "medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
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
                      onClick={() => setIsAddingTask(null)}
                      className="flex-1 bg-gray-200 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingTask(column.id)}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  + Add Task
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kanban;
