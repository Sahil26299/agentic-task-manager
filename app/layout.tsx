import type { Metadata } from "next";
import "./globals.css";
import { poppins, inter } from "@/src/utilities";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Task Manager",
  description:
    "Create, update, and manage all your tasks and notes effortlessly through the application or directly from WhatsApp.",
  keywords: [
    "Next.js task manager",
    "WhatsApp task creator",
    "notes management app",
    "task aggregator",
    "productivity tool",
    "real-time task updates",
    "Next.js notes app",
    "WhatsApp bot tasks",
    "task reminders",
    "task automation"
  ],
  openGraph: {
    title: "Task Manager",
    description:
      "Create, update, and manage all your tasks and notes effortlessly through the application or directly from WhatsApp.",
    type: "website",
    locale: "en_US",
    siteName: "Task Manager",

    // Ideal OG image size: 1200×630
    images: [
      {
        url: "https://agentic-task-manager.vercel.app/images/appImage.png",
        width: 1200,
        height: 630,
        alt: "Task Manager Logo",
      }
    ],
  },

  // Optional but recommended for SEO
  twitter: {
    card: "summary_large_image",
    title: "Task Manager",
    description:
      "Create, update, and manage all your tasks and notes effortlessly through the application or directly from WhatsApp.",
    images: ["https://agentic-task-manager.vercel.app/images/appImage.png", "https://agentic-task-manager.vercel.app/images/appLogo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} ${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            {children} <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
