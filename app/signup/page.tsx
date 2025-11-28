"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { API_BASE_URL, endpoints } from "@/src/utilities";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({
    name: null,
    email: null,
    password: null,
  });
  const [error, setError] = useState("");
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
      const res = await fetch(`${API_BASE_URL}${endpoints.AUTH_SIGNUP}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

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
      <div
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        style={{
          backgroundImage: "url('/images/backgroundImage.png')",
          backgroundBlendMode: "multiply",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Create an Account
        </h2>
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md dark:bg-red-900/30">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              onBlur={() => {
                if (name.length < 3) {
                  setErrors({
                    ...errors,
                    name: "Name must be at least 3 characters long",
                  });
                } else {
                  setErrors({ ...errors, name: null });
                }
              }}
              className={`w-full px-3 h-[42px] mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/80 focus-within:backdrop-blur ${
                errors.name ? "border-red-500" : "dark:border-gray-600"
              } dark:text-white`}
            />
          </div>
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
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onBlur={() => {
                const regexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!regexp.test(email)) {
                  setErrors({ ...errors, email: "Invalid email format" });
                } else {
                  setErrors({ ...errors, email: null });
                }
              }}
              className={`w-full px-3 h-[42px] mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/80 focus-within:backdrop-blur ${
                errors.email ? "border-red-500" : "dark:border-gray-600"
              } dark:text-white`}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onBlur={() => {
                if (password.length < 6) {
                  setErrors({
                    ...errors,
                    password: "Password must be at least 6 characters long",
                  });
                } else {
                  setErrors({ ...errors, password: null });
                }
              }}
              className={`w-full px-3 h-[42px] mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/80 focus-within:backdrop-blur ${
                errors.password ? "border-red-500" : "dark:border-gray-600"
              } dark:text-white`}
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
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <div className="text-sm text-center dark:text-shadow-white/40 font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
