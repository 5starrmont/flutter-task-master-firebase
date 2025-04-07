
import React, { useState } from "react";
import { useTask } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

const NewTaskForm: React.FC = () => {
  const { addTask } = useTask();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask(title, description);
      setTitle("");
      setDescription("");
      setIsExpanded(false);
    }
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center">
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value && !isExpanded) {
                setIsExpanded(true);
              }
            }}
            placeholder="Add a new task..."
            className="flex-1"
            onFocus={() => setIsExpanded(true)}
          />
          <Button 
            type="submit" 
            className="ml-2"
            disabled={!title.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-3">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="resize-none"
              rows={2}
            />
          </div>
        )}
      </form>
    </Card>
  );
};

export default NewTaskForm;
