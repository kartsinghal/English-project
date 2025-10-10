import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, type IUser } from "@/entities/User";
import { SpinHistory, ISpinHistory } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Gift, ArrowLeft } from "lucide-react";
import {  AnimatePresence } from "framer-motion";

import WheelComponent from "../components/spin/WheelComponent";
import RewardModal from "../components/spin/RewardModal";

// 🏆 Define the prize wheel options
const prizes = [
  { type: "coins", amount: 50, label: "50 Coins", color: "#FFD700" },
  { type: "hints", amount: 2, label: "2 Hints", color: "#4F46E5" },
  { type: "coins", amount: 100, label: "100 Coins", color: "#F59E0B" },
  { type: "time_freeze", amount: 1, label: "Time Freeze", color: "#10B981" },
  { type: "2x_reward_3min", amount: 1, label: "2x Reward (3min)", color: "#EF4444" },
  { type: "coins", amount: 25, label: "25 Coins", color: "#8B5CF6" },
  { type: "score_multiplier", amount: 1, label: "Score x2", color: "#EC4899" },
  { type: "2x_reward_5min", amount: 1, label: "2x Reward (5min)", color: "#06B6D4" },
];

export default function SpinWheel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [canSpinFree, setCanSpinFree] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [wonPrize, setWonPrize] = useState<(typeof prizes)[0] | null>(null);

  // 🔄 Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Free spin available after 7-day streak
      setCanSpinFree(userData.current_streak >= 7);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleSpin = async () => {
    if (!user) return;

    if (!canSpinFree && user.coins < 10) {
      alert("You need at least 10 coins to spin!");
      return;
    }

    setIsSpinning(true);

    // Deduct coins if not a free spin
    if (!canSpinFree) {
      await User.updateMyUserData({
        coins: user.coins - 10,
      });
      setUser({ ...user, coins: user.coins - 10 });
    }

    // Random prize selection
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomIndex];

    // Simulate spin delay
    setTimeout(async () => {
      setIsSpinning(false);
      setWonPrize(prize);
      await awardPrize(prize);
      setShowReward(true);

      // Reset streak if used free spin
      if (canSpinFree) {
        await User.updateMyUserData({ current_streak: 0 });
        setUser({ ...user, current_streak: 0 });
        setCanSpinFree(false);
      }
    }, 3000);
  };

  const awardPrize = async (prize: (typeof prizes)[0]) => {
    if (!user) return;
    const updatedUser: IUser = { ...user };

    switch (prize.type) {
      case "coins":
        updatedUser.coins += prize.amount;
        break;
      case "hints":
        updatedUser.powerups.hints += prize.amount;
        break;
      case "time_freeze":
        updatedUser.powerups.time_freeze += prize.amount;
        break;
      case "score_multiplier":
        updatedUser.powerups.score_multiplier += prize.amount;
        break;
      default:
        break;
    }

    await User.updateMyUserData(updatedUser);
    setUser(updatedUser);

    // Save to spin history
    await SpinHistory.create({
      user_email: updatedUser.email,
     reward_type: prize.type as ISpinHistory["reward_type"],
      reward_amount: prize.amount,
      spin_date: new Date().toISOString(),
      was_free: canSpinFree,
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Spin & Win!
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 🎡 Wheel Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <WheelComponent
                  prizes={prizes}
                  isSpinning={isSpinning}
                  wonPrize={wonPrize}
                />

                <div className="mt-8 text-center space-y-4">
                  <Button
                    onClick={handleSpin}
                    disabled={isSpinning || (!canSpinFree && user.coins < 10)}
                    className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-14 px-8 text-lg font-bold"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    {isSpinning
                      ? "Spinning..."
                      : canSpinFree
                      ? "Spin for Free! 🎉"
                      : "Spin (10 Coins)"}
                  </Button>

                  {canSpinFree && (
                    <p className="text-green-600 font-semibold flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      7-day streak reward! Free spin available!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 🧮 Side Info */}
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <span className="font-medium">Coins</span>
                  <span className="font-bold text-orange-600">🪙 {user.coins}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span className="font-medium">Streak</span>
                  <span className="font-bold text-green-600">🔥 {user.current_streak}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Possible Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {prizes.map((prize, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: prize.color }}
                      />
                      <span>{prize.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReward && wonPrize && (
          <RewardModal prize={wonPrize} onClose={() => setShowReward(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
