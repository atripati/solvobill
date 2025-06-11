"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "@/firebase";
import { db } from "@/firebase"; // Make sure you have exported db from firebase.js

const universities = [
  "DePaul University",
  "University of Chicago",
  "Northwestern University",
  "Loyola University",
  "Illinois Institute of Technology"
];

export default function UniversityPage() {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    if (!selectedUniversity) {
      setError("Please select a university.");
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        router.push("/auth");
        return;
      }
  
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        await setDoc(userRef, {
          ...existingData,
          university: selectedUniversity,
        });
      } else {
        await setDoc(userRef, {
          email: user.email,
          university: selectedUniversity,
        });
      }
  
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black text-black dark:text-white">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Select Your University</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <select
          className="w-full p-3 rounded border bg-white text-black"
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
        >
          <option value="">-- Choose University --</option>
          {universities.map((uni) => (
            <option key={uni} value={uni}>
              {uni}
            </option>
          ))}
        </select>
        <button
          className="mt-4 w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
