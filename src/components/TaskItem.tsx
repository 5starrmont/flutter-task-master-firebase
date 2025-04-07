
import React, { useState } from "react";
import { Task } from "@/types";
import { useTask } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Check, Trash2, Edit, Plus, X } from "lucide-react";
import SubTaskList from "./SubTaskList";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTaskCompletion, deleteTask, updateTask, addSubTask } = useTask();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSubTaskTime, setNewSubTaskTime] = useState("");
  const [newSubTaskDetails, setNewSubTaskDetails] = useState("");

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      updateTask(task.id, editTitle, editDescription);
      setIsEditing(false);
    }
  };

  const handleSubTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubTaskTime.trim() && newSubTaskDetails.trim()) {
      addSubTask(task.id, newSubTaskTime, newSubTaskDetails);
      setNewSubTaskTime("");
      setNewSubTaskDetails("");
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className={`task-item mb-3 overflow-hidden ${task.isCompleted ? 'bg-gray-50 border-gray-200' : 'bg-white'}`}>
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="p-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor={`edit-title-${task.id}`}>Task Title</Label>
              <Input
                id={`edit-title-${task.id}`}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-1"
                placeholder="Task title"
                required
              />
            </div>
            <div>
              <Label htmlFor={`edit-desc-${task.id}`}>Description (optional)</Label>
              <Textarea
                id={`edit-desc-${task.id}`}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="mt-1"
                placeholder="Task description"
                rows={2}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button type="submit" size="sm">
                <Check className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex items-start p-4">
          <div className="flex items-center h-6 mr-3">
            <Checkbox 
              checked={task.isCompleted}
              onCheckedChange={() => toggleTaskCompletion(task.id)}
              className="h-5 w-5"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-base ${task.isCompleted ? 'completed-task' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm text-gray-500 mt-1 ${task.isCompleted ? 'completed-task' : ''}`}>
                {task.description}
              </p>
            )}
            {(task.subTasks && task.subTasks.length > 0) && (
              <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="subtasks" className="border-0">
                  <AccordionTrigger className="py-1 text-sm">
                    Sub-tasks ({task.subTasks.filter(st => st.isCompleted).length}/{task.subTasks.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <SubTaskList taskId={task.id} subTasks={task.subTasks} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
          <div className="ml-auto flex items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Sub-task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubTaskSubmit} className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="subtask-time">Time Frame</Label>
                    <Input
                      id="subtask-time"
                      value={newSubTaskTime}
                      onChange={(e) => setNewSubTaskTime(e.target.value)}
                      className="mt-1"
                      placeholder="e.g., 9am - 10am"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtask-details">Details</Label>
                    <Input
                      id="subtask-details"
                      value={newSubTaskDetails}
                      onChange={(e) => setNewSubTaskDetails(e.target.value)}
                      className="mt-1"
                      placeholder="e.g., Complete homework"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Add Sub-task</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaskItem;
