import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Menu,
  MessageCircle,
  Shield,
} from "lucide-react";
import Footer from "../src/components/Footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans relative overflow-hidden flex flex-col">
      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <span>📋</span> TaskManager
        </Link>
        <div className="hidden sm:flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/20"
          >
            Sign Up
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="sm:hidden" >
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
              <Menu />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href="/login">Log In</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/signup">Sign Up</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Hero Section */}
      <main className="grow relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-32 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
            Manage Tasks <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Effortlessly
            </span>
          </h1>
          <p className="sm:text-xl text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Organize your life with our simple yet powerful task manager. Add
            notes, track progress, and even manage tasks directly via WhatsApp
            on the go.
          </p>
          <div className="flex flex-col sm:flex-row sm:gap-4 gap-6 justify-center items-center">
            <Link
              href="/signup"
              className="sm:px-8 sm:py-4 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold sm:text-lg text-base transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 transform hover:-translate-y-1"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link
              href="#features"
              className="sm:px-8 sm:py-4 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold sm:text-lg text-base border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle
                  className="text-blue-600 dark:text-blue-400"
                  size={24}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Smart Task Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create, organize, and track your daily tasks with ease. Set
                reminders and never miss a deadline.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:border-green-500/50 transition-all group">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle
                  className="text-green-600 dark:text-green-400"
                  size={24}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                WhatsApp Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add tasks and notes directly from WhatsApp. Just send a message
                and we'll handle the rest.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:border-purple-500/50 transition-all group">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield
                  className="text-purple-600 dark:text-purple-400"
                  size={24}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your data is encrypted and secure. We prioritize your privacy
                and data protection.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Developer Details */}
      <Footer />
    </div>
  );
}
