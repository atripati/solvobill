"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/firebase";
import { motion } from "framer-motion";
import { LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 🔑 Handle login with email and password
  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // ✅ Redirect on successful login
    } catch (err: any) {
      console.error(err.code);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Handle login with Google
  const handleGoogleLogin = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <motion.div
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo & Branding */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold">SolvoBill</h1>
          <p className="text-gray-300 text-sm mt-2">Take Control of Your Tuition Costs</p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

        {/* Login Form */}
        <div className="mt-6 space-y-4">
          <div className="relative">
            <EnvelopeIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 pl-10 bg-black/30 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <LockClosedIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 pl-10 bg-black/30 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button
            className={`w-full p-3 rounded-lg shadow-md font-semibold transition-all duration-300 ${
              loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
            whileHover={{ scale: 1.05 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "🚀 Login"}
          </motion.button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-600"></div>
          <p className="text-gray-400 text-sm mx-4">or</p>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        {/* Google Login */}
        <motion.button
          className="w-full bg-white text-black flex items-center justify-center p-3 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          onClick={handleGoogleLogin}
        >
          <img
            src="https://img.icons8.com/color/48/000000/google-logo.png"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </motion.button>

        {/* Register Link */}
        <p className="text-gray-400 text-sm text-center mt-4">
          New to SolvoBill?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => router.push("/register")}
          >
            Create an account
          </span>
        </p>
      </motion.div>
    </div>
  );
}
