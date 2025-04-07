
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, SubTask } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  Timestamp, 
  DocumentData 
} from "firebase/firestore";

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

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    const tasksCollection = collection(db, "tasks");
    const tasksQuery = query(tasksCollection, where("userId", "==", user.id));

    // Set up real-time listener for tasks
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData: Task[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        
        // Convert Firestore timestamp to Date
        const createdAt = data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : new Date();
        
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          isCompleted: data.isCompleted,
          userId: data.userId,
          createdAt: createdAt,
          subTasks: data.subTasks || [],
        };
      });
      
      setTasks(tasksData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (title: string, description?: string) => {
    if (!user) return;
    
    try {
      const tasksCollection = collection(db, "tasks");
      await addDoc(tasksCollection, {
        title,
        description,
        isCompleted: false,
        userId: user.id,
        createdAt: serverTimestamp(),
        subTasks: []
      });
      
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      toast.info("Task deleted");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      const taskToUpdate = tasks.find(task => task.id === id);
      if (taskToUpdate) {
        await updateDoc(taskDoc, {
          isCompleted: !taskToUpdate.isCompleted
        });
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Failed to update task");
    }
  };

  const updateTask = async (id: string, title: string, description?: string) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      await updateDoc(taskDoc, { title, description });
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const addSubTask = async (taskId: string, time: string, details: string) => {
    try {
      const taskDoc = doc(db, "tasks", taskId);
      const taskToUpdate = tasks.find(task => task.id === taskId);
      
      if (taskToUpdate) {
        const newSubTask: SubTask = {
          id: `subtask-${Date.now()}`,
          time,
          details,
          isCompleted: false
        };
        
        const updatedSubTasks = [...(taskToUpdate.subTasks || []), newSubTask];
        
        await updateDoc(taskDoc, {
          subTasks: updatedSubTasks
        });
        
        toast.success("Sub-task added successfully!");
      }
    } catch (error) {
      console.error("Error adding sub-task:", error);
      toast.error("Failed to add sub-task");
    }
  };

  const deleteSubTask = async (taskId: string, subTaskId: string) => {
    try {
      const taskDoc = doc(db, "tasks", taskId);
      const taskToUpdate = tasks.find(task => task.id === taskId);
      
      if (taskToUpdate && taskToUpdate.subTasks) {
        const updatedSubTasks = taskToUpdate.subTasks.filter(
          subTask => subTask.id !== subTaskId
        );
        
        await updateDoc(taskDoc, {
          subTasks: updatedSubTasks
        });
        
        toast.info("Sub-task deleted");
      }
    } catch (error) {
      console.error("Error deleting sub-task:", error);
      toast.error("Failed to delete sub-task");
    }
  };

  const toggleSubTaskCompletion = async (taskId: string, subTaskId: string) => {
    try {
      const taskDoc = doc(db, "tasks", taskId);
      const taskToUpdate = tasks.find(task => task.id === taskId);
      
      if (taskToUpdate && taskToUpdate.subTasks) {
        const updatedSubTasks = taskToUpdate.subTasks.map(subTask => 
          subTask.id === subTaskId 
            ? { ...subTask, isCompleted: !subTask.isCompleted }
            : subTask
        );
        
        await updateDoc(taskDoc, {
          subTasks: updatedSubTasks
        });
      }
    } catch (error) {
      console.error("Error toggling sub-task completion:", error);
      toast.error("Failed to update sub-task");
    }
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
