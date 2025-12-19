"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDownIcon, Info, X } from "lucide-react";
import Editor from "./Editor";
import { ITask } from "@/models/Task";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";

interface TaskFormProps {
  task?: ITask | null;
  onSave: (data: {
    title: string;
    body: string;
    reminder?: any;
    reminderSent?: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

const TaskForm = ({ task, onSave, onCancel, isOpen }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [openDatePopover, setOpenDatePopover] = useState(false);
  const [date, setDate] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [dateChanged, setDateChanged] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setBody(task.body);
      setDate(
        task.reminder
          ? dayjs(new Date(task?.reminder)).format("MM/DD/YYYY")
          : undefined
      );
    } else {
      setTitle("");
      setBody("");
      setDate(undefined);
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSave({ title, body, reminder: dayjs(new Date(date)).add(9, "hour") || undefined, reminderSent: task ? !dateChanged : false});
      onCancel();
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setLoading(false);
    }
  };

  const isTaskEditable = useMemo(() => {
    return dayjs(task?.createdAt).diff(dayjs(), "day") >= -7;
  }, [task]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {task ? `Edit Task` : "New Task"}
            {task && (
              <span className="text-sm text-gray-500 font-medium ml-2">
                (editable till{" "}
                {dayjs(task.createdAt).add(7, "day").format("MMM DD, YYYY")})
              </span>
            )}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              disabled={!isTaskEditable}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-inter"
              placeholder="Enter a title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Details
            </label>
            <Editor
              content={body}
              onChange={setBody}
              editable={isTaskEditable}
            />
          </div>

          <div>
            <label
              htmlFor="reminder"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Reminder (Optional)
            </label>
            <div className="flex items-center gap-2">
              <Popover open={openDatePopover} onOpenChange={setOpenDatePopover}>
                <PopoverTrigger disabled={!isTaskEditable} asChild>
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="h-[40px] justify-between font-normal bg-white dark:bg-gray-800 rounded-md font-inter"
                  >
                    {date
                      ? dayjs(new Date(date)).format("DD MMM YYYY")
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    startMonth={new Date()}
                    endMonth={new Date(2030, 0)}
                    captionLayout="dropdown"
                    onSelect={(value) => {
                      if (value) {
                        setDate(dayjs(new Date(value)).format("MM/DD/YYYY"));
                        setOpenDatePopover(false);   
                        if(dayjs(task?.reminder).diff(new Date(value), "day") === 0){
                          setDateChanged(false)
                        }else{
                          setDateChanged(true)
                        }                        
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </form>

        {!isTaskEditable && (
          <div className="p-4 text-[12px] bg-red-100 text-red-600 font-semibold flex items-center gap-2">
            <Info size={18} /> Note: Content is editable only for 7 days from
            the creation date. However, you can still edit the available markup
            over the content.
          </div>
        )}

        <div className={`p-4 border-t border-gray-100 dark:border-gray-800 flex items-center ${task ? "justify-between" : "justify-end"} gap-3 bg-gray-50 dark:bg-gray-800/50`}>
          {task && <div className="text-sm text-gray-500 font-medium italic" >Created on {dayjs(task.createdAt).format("MMM DD, YYYY")} at {dayjs(task.createdAt).format("hh:mm A")}</div>}
          <div className="flex items-center">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
