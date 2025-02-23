"use client"; // Add this line

import { useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  const [selectedUniversity, setSelectedUniversity] = useState("");

  const universities = [
    "Harvard University",
    "Stanford University",
    "MIT",
    "Yale University",
    "Princeton University",
    "University of Chicago",
    "Columbia University",
    "New York University",
    "University of California, Berkeley",
    "University of Michigan",
    "DePaul University",
  ];

  return (
    <>
      <Head>
        <title>SolvoBill - Reduce Your Tuition Costs</title>
        <meta
          name="description"
          content="Take control of your tuition costs with SolvoBill. Join today and start saving on your education expenses!"
        />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-700 text-white">
        <header className="w-full py-6 text-center text-4xl font-extrabold bg-white text-blue-700 shadow-md">
          🎓 SolvoBill - Take Control of Your Tuition Costs 🎓
        </header>

        <main className="flex flex-col items-center justify-center flex-1 px-6 text-center">
          <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">
            Reduce Your Tuition Costs – Your Way!
          </h1>
          <p className="text-lg mt-4 max-w-2xl opacity-90">
            SolvoBill helps students across the U.S. control and reduce their tuition costs. 
            Select your university and get started!
          </p>

          {/* University Selection Dropdown */}
          <select
            className="mt-6 p-3 text-black rounded-lg shadow-md bg-white"
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
          >
            <option value="">Select Your University</option>
            {universities.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>

          {/* Redirects user to Login/Register if university is selected */}
          <Link href={selectedUniversity ? `/auth?university=${selectedUniversity}` : "#"} legacyBehavior>
            <a
              className={`mt-6 px-8 py-3 font-semibold rounded-full shadow-lg transition duration-300 text-xl ${
                selectedUniversity ? "bg-yellow-400 text-black hover:bg-yellow-500" : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              🚀 Get Started Now
            </a>
          </Link>
        </main>

        <footer className="w-full bg-gray-900 py-4 text-center text-white text-sm opacity-75">
          © 2025 SolvoBill. All Rights Reserved.
        </footer>
      </div>
    </>
  );
}
