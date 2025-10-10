import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Award, Zap } from "lucide-react";

export default function QuickStats({ user }) {
  const stats = [
    {
      title: "Total Points",
      value: user?.total_points || 0,
      icon: Award,
      gradient: "from-yellow-400 to-orange-500",
      emoji: "⭐"
    },
    {
      title: "Current Streak",
      value: `${user?.current_streak || 0} Days`,
      icon: TrendingUp,
      gradient: "from-red-400 to-pink-500",
      emoji: "🔥"
    },
    {
      title: "Coins Balance",
      value: user?.coins || 0,
      icon: Zap,
      gradient: "from-blue-400 to-cyan-500",
      emoji: "🪙"
    },
    {
      title: "Your Level",
      value: user?.level || "Beginner",
      icon: Award,
      gradient: "from-purple-400 to-indigo-500",
      emoji: "🎯",
      capitalize: true
    }
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden"
        >
          <CardContent className="p-0">
            <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <span className="text-2xl">{stat.emoji}</span>
              </div>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent ${stat.capitalize ? 'capitalize' : ''}`}>
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}