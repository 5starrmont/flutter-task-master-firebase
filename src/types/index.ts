
export interface User {
  id: string;
  email: string;
}

export interface SubTask {
  id: string;
  time: string;
  details: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  userId: string;
  createdAt: Date;
  subTasks?: SubTask[];
}
