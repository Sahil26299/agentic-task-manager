"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

const Editor = ({ content, onChange, editable = true }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none p-4",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  if (!editable) {
    return <EditorContent editor={editor} className="w-full" />;
  }

  return (
    <div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
            editor.isActive("bold")
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-600 dark:text-gray-300"
          )}
          type="button"
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
            editor.isActive("italic")
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-600 dark:text-gray-300"
          )}
          type="button"
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
            editor.isActive("underline")
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-600 dark:text-gray-300"
          )}
          type="button"
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn(
            "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-600 dark:text-gray-300"
          )}
          type="button"
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-600 dark:text-gray-300"
          )}
          type="button"
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
            editor.isActive("bulletList")
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-600 dark:text-gray-300"
          )}
          type="button"
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
            editor.isActive("orderedList")
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-600 dark:text-gray-300"
          )}
          type="button"
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
