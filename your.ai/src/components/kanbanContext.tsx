import React, { createContext, useContext, useState, ReactNode } from "react";

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

type KanbanContextType = {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
};

type KanbanProviderProps = {
  children: ReactNode;
};

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider: React.FC<KanbanProviderProps> = ({ children }) => {
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", name: "To Do", tasks: [], color: "bg-blue-500", icon: "📋" },
    { id: "inProgress", name: "In Progress", tasks: [], color: "bg-amber-500", icon: "⚙️" },
    { id: "done", name: "Done", tasks: [], color: "bg-green-500", icon: "✅" },
  ]);

  return (
    <KanbanContext.Provider value={{ columns, setColumns }}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanbanContext = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanbanContext must be used within a KanbanProvider");
  }
  return context;
};
