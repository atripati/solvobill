"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircleIcon, CurrencyDollarIcon, TrophyIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

export default function Dashboard() {
  const router = useRouter();
  const [user] = useState({
    name: "John Doe",
    university: "Stanford University",
    balance: "$1,250",
    rewardPoints: 3200,
    tuitionSaved: "$3,796",
    transactions: [
      { id: 1, type: "Payment", amount: "$250", date: "Feb 22, 2025" },
      { id: 2, type: "Reward Earned", amount: "+200 points", date: "Feb 21, 2025" },
    ],
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      {/* Dashboard Container */}
      <motion.div 
        className="w-full max-w-5xl bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-600 pb-4">
          <div className="flex items-center gap-4">
            <UserCircleIcon className="w-14 h-14 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold">👋 Hi, {user.name}!</h1>
              <p className="text-gray-400">{user.university}</p>
            </div>
          </div>
          <button 
            onClick={() => router.push("/auth")}
            className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" /> Logout
          </button>
        </div>

        {/* Finance Overview */}
        <div className="grid grid-cols-3 gap-6 mt-6 text-center">
          <motion.div className="p-6 bg-black/30 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
            <h3 className="text-xl font-semibold">💳 Balance</h3>
            <p className="text-3xl font-bold text-green-400">{user.balance}</p>
          </motion.div>

          <motion.div className="p-6 bg-black/30 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
            <h3 className="text-xl font-semibold">🏆 Rewards</h3>
            <p className="text-3xl font-bold text-yellow-400">{user.rewardPoints} pts</p>
          </motion.div>

          <motion.div className="p-6 bg-black/30 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
            <h3 className="text-xl font-semibold">🎓 Tuition Saved</h3>
            <p className="text-3xl font-bold text-blue-400">{user.tuitionSaved}</p>
          </motion.div>
        </div>

        {/* Transaction History */}
        <h2 className="text-xl font-bold mt-8">📜 Recent Transactions</h2>
        <div className="mt-4 space-y-2">
          {user.transactions.map((txn) => (
            <motion.div 
              key={txn.id} 
              className="flex justify-between p-3 bg-white/10 rounded-lg shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <span className="font-medium">{txn.type}</span>
              <span>{txn.amount}</span>
              <span className="text-gray-400 text-sm">{txn.date}</span>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-between">
          <motion.button 
            className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/add-funds")}
          >
            <CurrencyDollarIcon className="w-5 h-5" /> Add Funds
          </motion.button>

          <motion.button 
            className="flex items-center gap-2 bg-yellow-500 px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition"
            whileHover={{ scale: 1.05 }}
            onClick={() => alert('Redeem Rewards Coming Soon!')}
          >
            <TrophyIcon className="w-5 h-5" /> Redeem Rewards
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
