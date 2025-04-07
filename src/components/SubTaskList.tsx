
import React from "react";
import { SubTask } from "@/types";
import { useTask } from "@/context/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SubTaskListProps {
  taskId: string;
  subTasks: SubTask[];
}

const SubTaskList: React.FC<SubTaskListProps> = ({ taskId, subTasks }) => {
  const { toggleSubTaskCompletion, deleteSubTask } = useTask();

  return (
    <div className="space-y-2 pl-1">
      {subTasks.map((subTask) => (
        <div key={subTask.id} className="flex items-start py-1 border-b border-gray-100 last:border-0">
          <div className="flex items-center h-6 mr-3">
            <Checkbox 
              checked={subTask.isCompleted}
              onCheckedChange={() => toggleSubTaskCompletion(taskId, subTask.id)}
              className="h-4 w-4"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-medium text-sm ${subTask.isCompleted ? 'completed-task' : ''}`}>
              {subTask.time}
            </div>
            <p className={`text-xs text-gray-500 ${subTask.isCompleted ? 'completed-task' : ''}`}>
              {subTask.details}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-red-500"
            onClick={() => deleteSubTask(taskId, subTask.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SubTaskList;
