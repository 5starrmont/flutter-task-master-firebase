
import { useAuth } from "@/context/AuthContext";
import { TaskProvider } from "@/context/TaskContext";
import AuthForm from "@/components/AuthForm";
import NewTaskForm from "@/components/NewTaskForm";
import TaskList from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-cyan-50 to-violet-50">
        <AuthForm />
      </div>
    );
  }

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-violet-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Flutter Task Master</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
          
          <NewTaskForm />
          <TaskList />
        </div>
      </div>
    </TaskProvider>
  );
};

export default Index;
