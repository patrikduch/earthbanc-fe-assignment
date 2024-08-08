import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchTasks } from '../services/todoService';

interface Task {
  userId: number;
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

interface TaskContextProps {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  removeTask: (id: number) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const TaskProvider: React.FC<IProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const apiTasks = await fetchTasks();
      setTasks(apiTasks.slice(0, 10));
    };

    loadTasks();
  }, []);

  const addTask = (task: Omit<Task, 'id'>) => {
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
    const newTask = { ...task, id: maxId + 1 };
    setTasks([newTask, ...tasks]);
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};
