
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, SubTask } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description?: string) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  updateTask: (id: string, title: string, description?: string) => void;
  addSubTask: (taskId: string, time: string, details: string) => void;
  deleteSubTask: (taskId: string, subTaskId: string) => void;
  toggleSubTaskCompletion: (taskId: string, subTaskId: string) => void;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage
  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem("flutter_tasks");
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        // Filter tasks for current user
        const userTasks = parsedTasks.filter((task: Task) => task.userId === user.id);
        // Convert string dates back to Date objects
        const tasksWithDates = userTasks.map((task: Task) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(tasksWithDates);
      }
    } else {
      setTasks([]);
    }
    setIsLoading(false);
  }, [user]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (user) {
      // Get all tasks from localStorage
      const storedTasks = localStorage.getItem("flutter_tasks");
      let allTasks = storedTasks ? JSON.parse(storedTasks) : [];
      
      // Filter out current user's tasks
      allTasks = allTasks.filter((task: Task) => task.userId !== user.id);
      
      // Add current user's tasks
      localStorage.setItem("flutter_tasks", JSON.stringify([...allTasks, ...tasks]));
    }
  }, [tasks, user]);

  const addTask = (title: string, description?: string) => {
    if (!user) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      isCompleted: false,
      userId: user.id,
      createdAt: new Date(),
      subTasks: []
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast.success("Task added successfully!");
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast.info("Task deleted");
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, isCompleted: !task.isCompleted } 
          : task
      )
    );
  };

  const updateTask = (id: string, title: string, description?: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, title, description } 
          : task
      )
    );
    toast.success("Task updated successfully!");
  };

  const addSubTask = (taskId: string, time: string, details: string) => {
    const newSubTask: SubTask = {
      id: `subtask-${Date.now()}`,
      time,
      details,
      isCompleted: false
    };
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subTasks: [...(task.subTasks || []), newSubTask] 
            } 
          : task
      )
    );
    toast.success("Sub-task added successfully!");
  };

  const deleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subTasks: task.subTasks?.filter(st => st.id !== subTaskId) || [] 
            } 
          : task
      )
    );
    toast.info("Sub-task deleted");
  };

  const toggleSubTaskCompletion = (taskId: string, subTaskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subTasks: task.subTasks?.map(st => 
                st.id === subTaskId 
                  ? { ...st, isCompleted: !st.isCompleted }
                  : st
              ) || [] 
            } 
          : task
      )
    );
  };

  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        addTask, 
        deleteTask, 
        toggleTaskCompletion, 
        updateTask,
        addSubTask,
        deleteSubTask,
        toggleSubTaskCompletion,
        isLoading
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
