"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, endpoints } from "@/src/utilities";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}${endpoints.AUTH_LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      toast("Login successful", { duration: 3000, style: { background: "#cfffe1ff", color: "#086600ff", fontSize: "14px" } });
      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* <Image width={450} height={450} src="/images/backgroundImage.png" alt="backgroundimage" /> */}
      <div
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800 "
        style={{
          backgroundImage: "url('/images/backgroundImage.png')",
          backgroundBlendMode: "multiply",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md dark:bg-red-900/30">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 h-[42px] mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/80 dark:border-gray-600 dark:text-white focus-within:backdrop-blur"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 "
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 h-[42px] mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/80 dark:border-gray-600 dark:text-white focus-within:backdrop-blur"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-[12px] underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 text-white hover:bg-blue-700 cursor-pointer mt-4 h-[42px]"
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
        <div className="text-sm text-center dark:text-shadow-white/40 font-medium">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
