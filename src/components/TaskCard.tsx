"use client";
import { Trash2, Edit, CheckCircle, Circle } from "lucide-react";
import { ITask } from "@/models/Task";
import dayjs from "dayjs";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { sup } from "framer-motion/client";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useMemo } from "react";

interface TaskCardProps {
  task: ITask;
  isUrgent: boolean;
  onDelete: (id: string) => void;
  onEdit: (task: ITask) => void;
  onToggleComplete: (task: ITask) => void;
  onClick: (task: ITask) => void;
  taskEditing: any | null;
}

const TaskCard = ({
  task,
  isUrgent,
  onDelete,
  onEdit,
  onToggleComplete,
  onClick,
  taskEditing,
}: TaskCardProps) => {
  const isTaskDeleteable = useMemo(() => {
    return dayjs().diff(dayjs(task?.createdAt), "day") <= 2;
  }, [task]);
  return (
    <div
      onClick={() => onClick(task)}
      className={`${
        isUrgent
          ? "border-2 border-red-800/40"
          : "border border-gray-200 dark:border-gray-700"
      } hover:scale-105 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition-all flex flex-col h-full group cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3
          className={`text-lg font-semibold line-clamp-1 font-inter ${
            task.isCompleted
              ? "text-gray-400 line-through"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {task.title}
        </h3>
        {taskEditing === task?._id ? (
          <>
            <Spinner role="status" className={cn("size-4 animate-spin")} />
          </>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task);
            }}
            className={`cursor-pointer text-gray-400 hover:text-green-500 transition-colors ${
              task.isCompleted ? "text-green-500" : ""
            }`}
            title={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.isCompleted ? (
              <CheckCircle size={20} />
            ) : (
              <Circle size={20} />
            )}
          </button>
        )}
      </div>

      <div
        className={`prose prose-sm leading-[1.5] dark:prose-invert mb-4 line-clamp-4 text-sm font-inter [&_p]:my-1 [&_h1]:my-1 [&_h2]:my-1 [&_ul]:my-1 [&_ol]:my-1 ${
          task.isCompleted ? "opacity-50" : ""
        }`}
        dangerouslySetInnerHTML={{ __html: task.body }}
      />

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {dayjs(task.createdAt).format("DD MMM, YYYY")}
        </span>

        <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="h-8 w-8 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <AlertDialog>
            {isTaskDeleteable && <AlertDialogTrigger
              title={`Delete (active till ${dayjs(task.createdAt).add(2, 'day').format('MMM DD, YYYY')})`}
              onClick={(e) => e.stopPropagation()}
              className="h-8 w-8 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
            >
              <Trash2 size={16} />
            </AlertDialogTrigger>}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task?._id as unknown as string);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
