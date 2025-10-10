import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, IUser } from "@/entities/User";
import { Mission } from "@/entities/Mission";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Target,
  Trophy,
  Settings,
  Sparkles,
  Award,
} from "lucide-react";

import TeacherAvatar from "../components/dashboard/TeacherAvatar";
import NewsHighlights from "../components/dashboard/NewsHighlights";
import QuickStats from "../components/dashboard/QuickStats";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";

interface IMission {
  id?: string;
  title: string;
  description: string;
  mission_type: "daily" | "weekly" | "special";
  target_value: number;
  reward_coins: number;
  reward_points: number;
  date: string;
  difficulty: "easy" | "medium" | "hard";
}

export default function Dashboard() {
  const [user, setUser] = useState<IUser | null>(null);
  const [missions, setMissions] = useState<IMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Load today's missions
      const today = new Date().toISOString().split("T")[0];
      const todayMissions = await Mission.filter({ date: today }, "-created_date", 5);
      setMissions(todayMissions);

      // Update streak
      await updateStreak(userData);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setLoading(false);
  };

  const updateStreak = async (userData: IUser) => {
    const today = new Date().toISOString().split("T")[0];
    const lastActivity = userData.last_activity_date;
    let newStreak = userData.current_streak || 0;

    if (lastActivity !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastActivity === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      await User.updateMyUserData({
        current_streak: newStreak,
        last_activity_date: today,
      });

      setUser({
        ...userData,
        current_streak: newStreak,
        last_activity_date: today,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <TeacherAvatar username={user?.username} />
              <div className="flex-1 text-center md:text-left space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                  Hello, {user?.username || "Student"}! 👋
                </h1>
                <p className="text-xl text-white/90 font-medium">
                  Let's start learning English today!
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link to={createPageUrl("StudentLevel")}>
                    <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Start Learning
                    </Button>
                  </Link>
                  <Link to={createPageUrl("SpinWheel")}>
                    <Button
                      className="bg-transparent border border-white text-white hover:bg-white/20"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Spin Wheel
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <QuickStats user={user} />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Missions */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="w-5 h-5 text-purple-600" />
                Today's Missions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {missions.length > 0 ? (
                missions.map((mission, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {mission.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {mission.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-purple-600">
                        🪙 {mission.reward_coins}
                      </p>
                      <p className="text-xs text-gray-500">
                        ⭐ {mission.reward_points}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No missions available today</p>
                  <Link to={createPageUrl("Missions")}>
                    <Button className="text-purple-600 underline bg-transparent hover:bg-purple-50">
                      View All Missions
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <UpcomingEvents />
        </div>

        {/* News Highlights */}
        <NewsHighlights />

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4">
          <QuickAction
            to="Missions"
            color="from-purple-50 to-purple-100"
            icon={<Target className="w-8 h-8 mx-auto text-purple-600" />}
            label="View Missions"
          />
          <QuickAction
            to="Leaderboard"
            color="from-blue-50 to-blue-100"
            icon={<Trophy className="w-8 h-8 mx-auto text-blue-600" />}
            label="Leaderboard"
          />
          <QuickAction
            to="Profile"
            color="from-pink-50 to-pink-100"
            icon={<Award className="w-8 h-8 mx-auto text-pink-600" />}
            label="My Profile"
          />
          <QuickAction
            to="Settings"
            color="from-orange-50 to-orange-100"
            icon={<Settings className="w-8 h-8 mx-auto text-orange-600" />}
            label="Settings"
          />
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  to,
  icon,
  label,
  color,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <Link to={createPageUrl(to)} className="block">
      <Card
        className={`border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br ${color}`}
      >
        <CardContent className="p-6 text-center space-y-3">
          {icon}
          <p className="font-semibold text-gray-800">{label}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
