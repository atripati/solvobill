"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bell, Banknote, Trophy, TrendingUp, Clock } from 'lucide-react';
import { Menu } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase"; // make sure you have this


interface Transaction {
  id: string;
  date: string;
  item: string;
  amount: number;
  points: number;
  credit: number;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState({
    date: '',
    item: '',
    amount: ''
  });
  const [bankData, setBankData] = useState({
    fullName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: ''
  });
  
  const router = useRouter(); // ⬅️ You already have this
  const [showBankForm, setShowBankForm] = useState(false);
  const handleBankInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankData(prev => ({ ...prev, [name]: value }));
  };
  const handleLinkBank = async (e: React.FormEvent) => {
    e.preventDefault();
    const { bankName, accountNumber, routingNumber } = bankData;
    const uid = auth.currentUser?.uid;
  
    if (!uid || !bankName || !accountNumber || !routingNumber) {
      alert("Please fill in all bank details.");
      return;
    }
  
    try {
      await addDoc(collection(db, "bankAccounts"), {
        userId: uid,
        bankName,
        accountNumber,
        routingNumber,
        linkedAt: Timestamp.now()
      });
  
      alert("✅ Bank linked successfully!");
      setBankData({ bankName: '', accountNumber: '', routingNumber: '' });
    } catch (error) {
      console.error("Error linking bank:", error);
      alert("❌ Failed to link bank.");
    }
  };
  


  // ✅ Add this right below router
  const handleMenuAction = async (option: string) => {
    if (option.includes("Logout")) {
      await signOut(auth);
      router.push("/auth");
    } else if (option.includes("Documents")) {
      router.push("/documents");
    } else if (option.includes("Payments")) {
      router.push("/payments");
    }
  };


  // Calculate totals from transactions
  const totalPoints = transactions.reduce((sum, txn) => sum + txn.points, 0);
  const totalCredit = transactions.reduce((sum, txn) => sum + txn.credit, 0);
  const rewardTierThreshold = 1000;
  const progressPercent = Math.min((totalPoints / rewardTierThreshold) * 100, 100);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    
    if (!formData.date || !formData.item || isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid date, item, and amount.",
        variant: "destructive"
      });
      return;
    }

    // Calculate rewards: 10% of amount as points, 5% as tuition credit
    const points = Math.round(amount * 0.1);
    const credit = parseFloat((amount * 0.05).toFixed(2));

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: formData.date,
      item: formData.item,
      amount,
      points,
      credit
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    // Show success message with rewards earned
    toast({
      title: "Transaction Added! 🎉",
      description: `+${points} points earned | $${credit.toFixed(2)} tuition credit saved`,
      variant: "default"
    });

    // Reset form
    setFormData({ date: '', item: '', amount: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Solvo<span className="text-blue-500">Bill</span>
            </h1>
            <p className="text-slate-400 mt-1">Student Rewards Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6 text-slate-400 hover:text-white transition-colors cursor-pointer" />
            <Menu as="div" className="relative">
  <Menu.Button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold hover:bg-blue-600 transition">
    U
  </Menu.Button>
  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
    <div className="p-1">
      {["📄 Documents", "💳 Payments", "🚪 Logout"].map((option, idx) => (
        <Menu.Item key={idx}>
          {({ active }) => (
            <button
              onClick={() => handleMenuAction(option)}
              className={`w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}
            >
              {option}
            </button>
          )}
        </Menu.Item>
      ))}
    </div>
  </Menu.Items>
</Menu>

          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-slate-400">
            Here's a summary of your rewards and tuition savings so far.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Banknote className="h-8 w-8 text-blue-500" />
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Current Tuition Saved</p>
                  <p className="text-2xl font-bold text-white">${totalCredit.toFixed(2)}</p>
                  <p className="text-lg font-semibold text-blue-400">{totalPoints} Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Total Rewards Earned</p>
                  <p className="text-2xl font-bold text-white">{totalPoints} Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Next Reward Tier</p>
                  <p className="text-sm text-white">Spend ${((rewardTierThreshold - totalPoints) * 10).toFixed(0)} more to unlock +$30 tuition credit</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-8 w-8 text-purple-500" />
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Latest Activity</p>
                  {transactions[0] ? (
                    <p className="text-sm text-white">
                      {transactions[0].item} - {transactions[0].points} pts
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500">No recent activity</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction Form */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Add New Transaction</h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    📅 Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    🛒 Item
                  </label>
                  <input
                    type="text"
                    name="item"
                    value={formData.item}
                    onChange={handleInputChange}
                    placeholder="book"
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    💵 Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                ➕ Add Transaction
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700 mb-8">
  <CardContent className="p-6">
    <h3 className="text-xl font-semibold mb-4">🏦 Bank Linking</h3>

    {!showBankForm ? (
      <Button
        onClick={() => setShowBankForm(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        + Link Bank
      </Button>
    ) : (
      <form onSubmit={handleLinkBank} className="space-y-4 mt-4">
        <input
          type="text"
          name="fullName"
          value={bankData.fullName}
          onChange={handleBankInput}
          placeholder="Your Full Name"
          required
          className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
        />
        <input
          type="text"
          name="bankName"
          value={bankData.bankName}
          onChange={handleBankInput}
          placeholder="Bank Name"
          required
          className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
        />
        <input
          type="text"
          name="accountNumber"
          value={bankData.accountNumber}
          onChange={handleBankInput}
          placeholder="Account Number"
          required
          className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
        />
        <input
          type="text"
          name="routingNumber"
          value={bankData.routingNumber}
          onChange={handleBankInput}
          placeholder="Routing Number"
          required
          className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
        />
        <div className="flex space-x-3">
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
            Link Bank
          </Button>
          <Button
            type="button"
            onClick={() => setShowBankForm(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
          >
            Cancel
          </Button>
        </div>
      </form>
    )}
  </CardContent>
</Card>



        {/* Progress Bar */}
        <Card className="bg-gradient-to-r from-blue-900 to-blue-800 border-blue-700 mb-8">
          <CardContent className="p-6">
            <p className="text-blue-100 mb-3 font-medium">
              You're {Math.floor(progressPercent)}% toward unlocking your next ${(rewardTierThreshold * 0.1).toFixed(2)} tuition credit
            </p>
            <Progress value={progressPercent} className="h-3" />
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex justify-between items-center p-3 bg-slate-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">{transaction.item}</p>
                      <p className="text-sm text-slate-400">{formatDate(transaction.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">${transaction.amount.toFixed(2)}</p>
                      <p className="text-sm text-green-400">+{transaction.points} pts | +${transaction.credit.toFixed(2)} saved</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
