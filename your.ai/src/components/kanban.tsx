import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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
    { id: "todo", name: "To Do", tasks: [] },
    { id: "inProgress", name: "In Progress", tasks: [] },
    { id: "done", name: "Done", tasks: [] },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAddTask = (columnId: string) => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
      };

      const targetColumn = columns.find((col) => col.id === columnId);
      if (targetColumn) {
        targetColumn.tasks.push(newTask);
        setColumns([...columns]);
        setNewTaskTitle("");
        inputRef.current?.blur();
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

  return (
    <div className="kanban-board min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative">
        <h1 className="text-4xl font-bold text-gray-800 text-center w-full">
          Kanban Board
        </h1>
        <Link
          to="/dashboard"
          className="absolute top-2 right-4 text-sm text-indigo-600 hover:text-indigo-800 transition"
        >
          ⬅ Back to Dashboard
        </Link>
      </div>

      {/* Columns */}
      <div className="flex flex-wrap justify-center gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
            className="w-80 bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl"
          >
            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
              {column.name}
            </h2>

            {/* Tasks */}
            <div className="flex flex-col gap-3">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, column.id, task.id)}
                  className="bg-white p-4 rounded-md shadow-md hover:bg-gray-100 flex justify-between items-center"
                >
                  <span className="text-gray-700 font-medium">{task.title}</span>
                  <button
                    onClick={() => handleRemoveTask(task.id, column.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* Add Task */}
            <div className="mt-6 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="New task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={() => handleAddTask(column.id)}
                className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
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
