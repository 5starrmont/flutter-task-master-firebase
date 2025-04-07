
import React from "react";
import { useTask } from "@/context/TaskContext";
import TaskItem from "./TaskItem";
import { Skeleton } from "@/components/ui/skeleton";

const TaskList: React.FC = () => {
  const { tasks, isLoading } = useTask();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-start p-4 border rounded-md">
            <Skeleton className="h-5 w-5 mr-3" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-500">No tasks yet</h3>
        <p className="text-sm text-gray-400 mt-1">Add your first task using the form above</p>
      </div>
    );
  }

  // Sort tasks: incomplete first, then by creation date (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      {sortedTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
