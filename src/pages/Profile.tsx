import React, { useState, useEffect } from "react";
import { IUser, User } from "@/entities/User";
import { IAchievement, Achievement } from "@/entities/Achievement"; // ✅ Correct import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Trophy, Flame, Star, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState<IUser | null>(null);
  const [achievements, setAchievements] = useState<IAchievement[]>([]); // ✅ Typed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const userAchievements = await Achievement.filter({
        user_email: userData.email,
      });
      setAchievements(userAchievements);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  const levelProgress = ((user?.total_points || 0) % 1000) / 10;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* USER HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-4xl font-bold">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {user?.username || "User"}
                  </h1>
                  <p className="text-white/90 text-lg mb-4">
                    {user?.target_preparation || "English Learner"}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge className="bg-white/20 text-white border-white/30 capitalize">
                      {user?.level || "Beginner"}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30">
                      Age: {user?.age || "-"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* USER STATS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm text-gray-600 mb-1">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">{user?.total_points || 0}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-sm text-gray-600 mb-1">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{user?.current_streak || 0} days</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-gray-600 mb-1">Coins</p>
              <p className="text-2xl font-bold text-gray-900">{user?.coins || 0}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-sm text-gray-600 mb-1">Achievements</p>
              <p className="text-2xl font-bold text-gray-900">{achievements.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* PROGRESS BAR */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Progress to Next Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={levelProgress} className="h-3" />
            <p className="text-sm text-gray-600">
              {(user?.total_points || 0) % 1000} / 1000 points to next level
            </p>
          </CardContent>
        </Card>

        {/* ACHIEVEMENTS */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{achievement.badge_icon || "🏆"}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No achievements yet. Keep learning to unlock them!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* POWERUPS */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-600" />
              Powerups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg text-center">
                <p className="text-3xl mb-2">💡</p>
                <p className="font-semibold text-gray-900">Hints</p>
                <p className="text-2xl font-bold text-blue-600">
                  {user?.powerups?.hints || 0}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg text-center">
                <p className="text-3xl mb-2">⏸️</p>
                <p className="font-semibold text-gray-900">Time Freeze</p>
                <p className="text-2xl font-bold text-green-600">
                  {user?.powerups?.time_freeze || 0}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg text-center">
                <p className="text-3xl mb-2">✨</p>
                <p className="font-semibold text-gray-900">Multiplier</p>
                <p className="text-2xl font-bold text-orange-600">
                  {user?.powerups?.score_multiplier || 1}x
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
