"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Loader2,
  LogOut,
  UserRoundCog,
  Headset,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import TaskCard from "@/src/components/TaskCard";
import TaskForm from "@/src/components/TaskForm";
import TaskModal from "@/src/components/TaskModal";
import { ITask } from "@/models/Task";
import dayjs from "dayjs";
import WhatsAppBanner from "@/src/components/WhatsAppBanner";
import { useAuth } from "@/components/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import { API_BASE_URL, endpoints, generateUrlSlug } from "@/src/utilities";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function Home({ params }: any) {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskEditing, setTaskEditing] = useState<null | any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({
    phone: "",
    oldPassword: "",
    newPassword: "",
    submittingDetails: false,
  });
  const [updateProfileError, setUpdateProfileError] = useState("");

  const {
    token,
    logout,
    isAuthenticated,
    user,
    loading: authLoading,
  } = useAuth();
  const router = useRouter();
  const { slug } = useParams();
  const processedSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const slugKey = Array.isArray(slug) ? slug.join("/") : slug || null;
    if (
      slug &&
      tasks.length > 0 &&
      !loading &&
      slugKey !== processedSlugRef.current
    ) {
      fetchSingleTask(slug[1]);
      processedSlugRef.current = slugKey;
    } else if (!slug) {
      // Ensure modal is closed if no slug (and not just opened by user interaction which might not have updated URL yet if we do it async, but here we want to sync on load/back)
      setIsModalOpen(false);
      setSelectedTask(null);
      processedSlugRef.current = null;
    }
  }, [slug, tasks, loading]);

  useEffect(() => {
    const handlePopState = () => {
      // This handles browser back/forward buttons
      // The router.push/replace might not trigger this in all Next.js versions effectively for shallow routing without some setup,
      // but window.history.pushState does not trigger popstate.
      // popstate is triggered by back/forward actions.

      // We can rely on the Next.js router to update the params.slug, which triggers the effect above.
      // However, for purely client-side shallow updates that don't trigger a full navigation, we might need to listen to URL changes if we were not using Next.js router.
      // Since we are using window.history.pushState manually for the modal open/close to avoid re-render/fetch,
      // we need to handle the back button to close the modal if it was opened via pushState.

      // Actually, if we use window.history.pushState, the URL changes but Next.js might not know about it immediately to update `params`.
      // But if the user presses Back, the browser restores the previous URL.
      // If that previous URL was the dashboard root, we want to close the modal.

      const currentPath = window.location.pathname;
      if (currentPath === "/dashboard") {
        setIsModalOpen(false);
        setSelectedTask(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}${endpoints.TASKS}`, {
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

  const fetchSingleTask = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}${endpoints.TASKS}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setIsModalOpen(true);
        setSelectedTask(data);
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
      const res = await fetch(`${API_BASE_URL}${endpoints.TASKS}`, {
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
        `${API_BASE_URL}${endpoints.TASKS}/${
          editingTask._id as unknown as string
        }`,
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
    try {
      const res = await fetch(`${API_BASE_URL}${endpoints.TASKS}/${id}`, {
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
        `${API_BASE_URL}${endpoints.TASKS}/${task._id as unknown as string}`,
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
    const newPath = `/dashboard/${generateUrlSlug(
      task.title,
      task?._id as any
    )}`;
    window.history.pushState({ taskId: task._id }, "", newPath);
  };

  const handleSubmit = async () => {
    console.log("Form submitted");
    setUpdateProfileError("");
    setUserDetails((prev: any) => ({
      ...prev,
      submittingDetails: true
    }))
    try {
      if (!token) return;
      let data: any = {};
      if (userDetails.phone) {
        data.phone = userDetails.phone;
        data.countryCode = "+91";
      }
      if (userDetails.oldPassword) data.oldPassword = userDetails.oldPassword;
      if (userDetails.newPassword) data.password = userDetails.newPassword;
      const res = await fetch(`${API_BASE_URL}${endpoints.USER_DETAILS}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        setIsProfileOpen(false);
      }else {
        const data = await res.json();
        throw new Error(data?.error || "Failed to update profile details");
      }
    } catch (error: any) {
      setUpdateProfileError(
        error?.message || "Failed to update profile details"
      );
    }
    finally {
      setUserDetails((prev: any) => ({
        ...prev,
        submittingDetails: false,
        oldPassword: "",
        newPassword: "",
      }))
    }
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
        <header className="flex justify-between mb-10 border-b-2 border-slate-800 pb-4">
          <div className="w-2/3">
            <Link
              href="/dashboard"
              className="lg:text-4xl md:text-3xl text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2"
            >
              <Image
                src="./images/appLogo.svg"
                alt="App Logo"
                width={60}
                height={60}
              />{" "}
              My Tasks
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mt-2 lg:text-lg text-sm">
              Welcome, {user?.name}! Manage your notes and tasks efficiently. 🎯
            </p>
          </div>
          <div className="flex md:items-center items-start gap-4">
            <button
              onClick={openCreateModal}
              className="md:h-[45px] h-[40px] flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white md:px-6 px-3 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              <span className="md:flex hidden">New Task</span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size={"icon"}
                  className="ring-0 border-none outline-none md:h-[45px] h-[40px] flex items-center gap-2 bg-orange-700 hover:bg-orange-700 text-white md:px-6 px-5 py-3 rounded-xl font-semibold shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all transform hover:-translate-y-0.5"
                >
                  <UserRoundCog size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    My Account
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuGroup className="ml-2">
                  <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Headset size={18} /> Developer Support
                </DropdownMenuLabel>
                <DropdownMenuGroup className="ml-2">
                  <DropdownMenuItem>
                    <Link
                      href="mailto:sahillokhande94@gmail.com"
                      target="_blank"
                      className="w-full h-full"
                    >
                      Email
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="https://github.com/Sahil26299"
                      target="_blank"
                      className="w-full h-full"
                    >
                      GitHub
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="https://www.linkedin.com/in/sahillokhande26"
                      target="_blank"
                      className="w-full h-full"
                    >
                      Linkedin
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="https://my-portfolio-next-mauve.vercel.app/"
                      target="_blank"
                      className="w-full h-full"
                    >
                      Portfolio
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setIsLogoutOpen(true)}>
                  <div className="flex items-center gap-2">
                    <LogOut size={18} /> Log out
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DialogContent className="max-w-4xl min-w-2/5">
                <DialogHeader>
                  <DialogTitle>Edit profile (🚧 Under development)</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-gray-300">
                      Name
                    </Label>
                    <Input
                      id="name"
                      disabled
                      defaultValue={user?.name}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      disabled
                      defaultValue={user?.email}
                      className="col-span-3"
                    />
                  </div>
                  <div className="relative grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right text-gray-300">
                      What's app number
                    </Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <span className="text-white text-sm">+91</span>
                      <Input
                        id="phone"
                        placeholder="Eg. 9876543210 (Optional)"
                        defaultValue={user?.phone}
                        type="number"
                        onChange={(ev) =>
                          setUserDetails({
                            ...userDetails,
                            phone: ev.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <span className="text-[12px] text-gray-300">
                    <i>
                      For recieving updates on what's app. we recommend to add
                      your what's app number
                    </i>
                  </span>
                  <Separator className="my-4" />
                  <h4 className="text-base md:text-lg font-semibold flex items-center gap-2">
                    Change Password{" "}
                    <Button
                      size={"icon-sm"}
                      variant={"ghost"}
                      className="bg-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye /> : <EyeOff />}
                    </Button>
                  </h4>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="old-password" className="text-right">
                      Old Password
                    </Label>
                    <Input
                      id="old-password"
                      type={showPassword ? "text" : "password"}
                      onChange={(ev) =>{
                        setUpdateProfileError("");
                        setUserDetails({
                          ...userDetails,
                          oldPassword: ev.target.value,
                        })
                      }}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="new-password" className="text-right">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      onChange={(ev) =>{
                        setUpdateProfileError("");
                        setUserDetails({
                          ...userDetails,
                          newPassword: ev.target.value,
                        })
                      }}
                      className="col-span-3"
                    />
                  </div>
                </div>
                {updateProfileError && (
                  <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md dark:bg-red-900/30">
                    {updateProfileError}
                  </div>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={userDetails.submittingDetails}
                  >
                    {userDetails.submittingDetails ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={logout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
          onClose={() => {
            setIsModalOpen(false);
            window.history.pushState({}, "", "/dashboard");
          }}
        />
      </div>
    </main>
  );
}
