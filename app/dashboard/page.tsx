"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, LogOut, MessageCircle } from "lucide-react";
import TaskCard from "@/src/components/TaskCard";
import TaskForm from "@/src/components/TaskForm";
import TaskModal from "@/src/components/TaskModal";
import { ITask } from "@/models/Task";
import dayjs from "dayjs";
import WhatsAppBanner from "@/src/components/WhatsAppBanner";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import ApiBase from "twilio/lib/rest/ApiBase";
import { endpoints } from "@/src/utilities";

export default function Home() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskEditing, setTaskEditing] = useState<null | any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    token,
    logout,
    isAuthenticated,
    user,
    loading: authLoading,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${ApiBase}${endpoints.TASKS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else if (res.status === 401) {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleCreateTask = async (data: {
    title: string;
    body: string;
    reminder?: any;
  }) => {
    if (!token) return;
    try {
      const res = await fetch(`${ApiBase}${endpoints.TASKS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleUpdateTask = async (data: {
    title: string;
    body: string;
    reminder?: any;
  }) => {
    if (!editingTask || !token) return;
    try {
      const res = await fetch(
        `${ApiBase}${endpoints.TASKS}/${editingTask._id as unknown as string}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`${ApiBase}${endpoints.TASKS}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setTasks(tasks.filter((t) => (t._id as unknown as string) !== id));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleToggleComplete = async (task: ITask) => {
    if (!token) return;
    setTaskEditing(task._id);
    try {
      const res = await fetch(
        `${ApiBase}${endpoints.TASKS}/${task._id as unknown as string}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isCompleted: !task.isCompleted }),
        }
      );
      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to toggle complete:", error);
    } finally {
      setTaskEditing(null);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEditModal = (task: ITask) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const openTaskModal = (task: ITask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const isUrgent = (task: ITask | null) => {
    if (!task) return false;
    if (!task.reminder) return false;
    const reminderDate = dayjs(task.reminder);
    const now = dayjs();
    const diffInMinutes = reminderDate.diff(now, "minute");
    return diffInMinutes <= 30 && diffInMinutes >= 0;
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 sm:p-10 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-10 border-b-2 border-slate-800 pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              📋 My Tasks
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Welcome, {user?.name}! Manage your notes and tasks efficiently. 🎯
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              New Task
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-orange-700 hover:bg-orange-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all transform hover:-translate-y-0.5"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : tasks.length === 0 ? (
          <div
            className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800"
            style={{
              backgroundImage: "url('/images/backgroundImage3.png')",
              backgroundBlendMode: "multiply",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur">
              <Plus className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-500 dark:text-white/70 font-medium shadow-black/80 max-w-md mx-auto mb-6">
              Create your first task to get started with your productivity
              journey.
            </p>
            <button
              onClick={openCreateModal}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Create a task now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks.map((task) => (
              <div key={task._id as unknown as string} className="h-full">
                <TaskCard
                  task={task}
                  isUrgent={isUrgent(task)}
                  onDelete={handleDeleteTask}
                  onEdit={openEditModal}
                  onToggleComplete={handleToggleComplete}
                  onClick={openTaskModal}
                  taskEditing={taskEditing}
                />
              </div>
            ))}
          </div>
        )}
        <hr className="my-16" />
        <div>
          <WhatsAppBanner />
        </div>

        <TaskForm
          isOpen={isFormOpen}
          onCancel={() => setIsFormOpen(false)}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
          task={editingTask}
        />

        <TaskModal
          task={selectedTask}
          isUrgent={isUrgent(selectedTask)}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </main>
  );
}
