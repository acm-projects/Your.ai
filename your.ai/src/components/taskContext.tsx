import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the types for tasks and context state
interface Task {
  id: number;
  title: string;
  priority: string;
  dueDate: string;
}

interface TaskContextType {
  tasks: {
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  };
  setTasks: React.Dispatch<React.SetStateAction<{
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  }>>;
  addTask: (newTask: Task, status: "todo" | "inProgress" | "done") => void;
  moveTask: (taskId: number, from: "todo" | "inProgress" | "done", to: "todo" | "inProgress" | "done") => void;
}

// Create the context with default values
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Custom hook to use the TaskContext
export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

// Provider to wrap around your application
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, title: "Grocery shopping", priority: "medium", dueDate: "Today" },
      { id: 2, title: "Prepare presentation", priority: "high", dueDate: "Tomorrow" },
      { id: 3, title: "Call insurance company", priority: "low", dueDate: "This week" },
    ],
    inProgress: [
      { id: 4, title: "Research gym memberships", priority: "medium", dueDate: "Today" },
      { id: 5, title: "Draft email to professor", priority: "high", dueDate: "Today" },
    ],
    done: [
      { id: 6, title: "Pay rent", priority: "high", dueDate: "Yesterday" },
      { id: 7, title: "Schedule dentist appointment", priority: "medium", dueDate: "Yesterday" },
    ],
  });

  const addTask = (newTask: Task, status: "todo" | "inProgress" | "done") => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [status]: [...prevTasks[status], newTask],
    }));
  };

  const moveTask = (taskId: number, from: "todo" | "inProgress" | "done", to: "todo" | "inProgress" | "done") => {
    const task = tasks[from].find((task) => task.id === taskId);
    if (!task) return;

    setTasks((prevTasks) => ({
      ...prevTasks,
      [from]: prevTasks[from].filter((task) => task.id !== taskId),
      [to]: [...prevTasks[to], task],
    }));
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, addTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
};
