import React, { useEffect, useState } from "react";
import { User, IUser } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

/**
 * Leaderboard Page
 * Displays user rankings based on total points and coins
 */
export default function Leaderboard() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const userList = await User.list();
      setUsers(userList);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading leaderboard...
      </div>
    );
  }

  // Sort by total_points (highest first)
  const sortedUsers = [...users].sort(
    (a, b) => (b.total_points || 0) - (a.total_points || 0)
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">🏆 Leaderboard</h1>

      <Tabs defaultValue="points" className="w-full">
        <TabsList className="flex justify-center mb-4 space-x-4">
          <TabsTrigger value="points">By Points</TabsTrigger>
          <TabsTrigger value="coins">By Coins</TabsTrigger>
        </TabsList>

        {/* Tab 1 — Points Leaderboard */}
        <TabsContent value="points">
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>Top Players (Points)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {sortedUsers.map((user, index) => (
                  <li
                    key={user.id}
                    className="flex justify-between items-center p-3 rounded-lg border hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg text-gray-700">
                        #{index + 1}
                      </span>
                      <span className="text-gray-800 font-medium">
                        {user.username}
                      </span>
                    </div>
                    <span className="font-semibold text-blue-600">
                      {user.total_points ?? 0} pts
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2 — Coins Leaderboard */}
        <TabsContent value="coins">
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>Top Players (Coins)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[...users]
                  .sort((a, b) => (b.coins || 0) - (a.coins || 0))
                  .map((user, index) => (
                    <li
                      key={user.id}
                      className="flex justify-between items-center p-3 rounded-lg border hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-lg text-gray-700">
                          #{index + 1}
                        </span>
                        <span className="text-gray-800 font-medium">
                          {user.username}
                        </span>
                      </div>
                      <span className="font-semibold text-yellow-600">
                        {user.coins ?? 0} coins
                      </span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
