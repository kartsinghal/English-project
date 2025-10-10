// src/pages/Missions.tsx
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Mission, IMission } from "@/entities/Mission";
import { UserMission, IUserMission } from "@/entities/UserMission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Missions() {
  const [user, setUser] = useState<{ email: string; coins?: number } | null>(null);
  const [missions, setMissions] = useState<IMission[]>([]);
  const [userMissions, setUserMissions] = useState<IUserMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const today = new Date().toISOString().split("T")[0];
      const allMissions = await Mission.filter({ date: today });
      setMissions(allMissions);

      const userMissionData = await UserMission.filter({ user_email: userData.email });
      setUserMissions(userMissionData);
    } catch (error) {
      console.error("Error loading missions:", error);
    }
    setLoading(false);
  };

  const getMissionProgress = (missionId: string) => {
    const userMission = userMissions.find((um) => um.mission_id === missionId);
    return userMission || { progress: 0, completed: false };
  };

  const difficultyColors: Record<string, string> = {
    easy: "from-green-500 to-emerald-500",
    medium: "from-yellow-500 to-orange-500",
    hard: "from-red-500 to-pink-500",
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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Daily Missions
            </h1>
            <p className="text-gray-600 mt-2">
              Complete missions to earn rewards!
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Your Coins</p>
            <p className="text-2xl font-bold text-orange-600">
              🪙 {user?.coins || 0}
            </p>
          </div>
        </div>

        {missions.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Missions Today
              </h3>
              <p className="text-gray-500">
                Check back tomorrow for new challenges!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission: IMission, index: number) => {
              const progress = getMissionProgress(mission.id || "");
              const progressPercent =
                (progress.progress / mission.target_value) * 100;

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`border-0 shadow-lg hover:shadow-xl transition-all h-full ${
                      progress.completed ? "opacity-75" : ""
                    }`}
                  >
                    <div
                      className={`h-2 bg-gradient-to-r ${
                        difficultyColors[mission.difficulty]
                      }`}
                    />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            {mission.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {mission.description}
                          </p>
                        </div>
                        {progress.completed && (
                          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold">
                            {progress.progress} / {mission.target_value}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex gap-3">
                          <span className="text-sm font-semibold text-orange-600">
                            🪙 {mission.reward_coins}
                          </span>
                          <span className="text-sm font-semibold text-blue-600">
                            ⭐ {mission.reward_points}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium capitalize bg-gradient-to-r ${
                            difficultyColors[mission.difficulty]
                          } text-white`}
                        >
                          {mission.difficulty}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Daily Mission Rewards
                </h3>
                <p className="text-sm text-gray-600">
                  Complete all daily missions to earn bonus coins and unlock
                  special achievements!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
