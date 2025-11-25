"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock } from "lucide-react";
import { ITask } from "@/models/Task";
import dayjs from "dayjs";

interface TaskModalProps {
  task: ITask | null;
  isUrgent: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const TaskModal = ({ task, isUrgent, isOpen, onClose }: TaskModalProps) => {
  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-inter">
                    {task.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      Created {dayjs(task.createdAt).format("MMM D, YYYY")}
                    </span>
                    {task.reminder && (
                      <span
                        className={`flex items-center gap-1 ${
                          isUrgent
                            ? "text-red-600 dark:text-red-400 font-semibold animate-pulse"
                            : "text-blue-600 dark:text-blue-400"
                        } font-inter`}
                      >
                        <Clock size={14} />
                        Due {dayjs(task.reminder).format("MMM D, h:mm A")}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div
                  className="prose prose-lg dark:prose-invert max-w-none font-inter text-slate-300 [&_strong]:text-slate-100 [&_p]:my-1 [&_h1]:my-1 [&_h2]:my-1 [&_ul]:my-1 [&_ol]:my-1"
                  dangerouslySetInnerHTML={{ __html: task.body }}
                />
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
