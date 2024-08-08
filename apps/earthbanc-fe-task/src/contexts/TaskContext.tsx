// TaskProvider.tsx
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
      const storedTasks = localStorage.getItem('tasks');
      let fetchedTasks: Task[] = [];

      if (storedTasks) {
        fetchedTasks = JSON.parse(storedTasks);
      } else {
        const apiTasks = await fetchTasks();
        fetchedTasks = apiTasks.slice(0, 10);
        localStorage.setItem('tasks', JSON.stringify(fetchedTasks));
      }

      // Fetch new tasks from API and merge with stored tasks
      const apiTasks = await fetchTasks();
      const newApiTasks: Task[] = apiTasks.slice(0, 10);

      const mergedTasks = [
        ...newApiTasks.filter(apiTask => !fetchedTasks.some(task => task.id === apiTask.id)),
        ...fetchedTasks,
      ].sort((a, b) => b.id - a.id); // Sort by id in descending order

      setTasks(mergedTasks);
      localStorage.setItem('tasks', JSON.stringify(mergedTasks));
    };

    loadTasks();
  }, []);

  const addTask = (task: Omit<Task, 'id'>) => {
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
    const newTask = { ...task, id: maxId + 1 };
    const updatedTasks = [newTask, ...tasks].sort((a, b) => b.id - a.id); // Sort by id in descending order
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const removeTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id).sort((a, b) => b.id - a.id); // Sort by id in descending order
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};
