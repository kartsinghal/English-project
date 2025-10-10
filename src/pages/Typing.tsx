import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { TypingMatch, LessonProgress } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Keyboard, User as UserIcon, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import TypingLobby from "../components/typing/TypingLobby";
import TypingGame from "../components/typing/TypingGame";
import TypingResults from "../components/typing/TypingResults";

export default function Typing() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState("menu"); // menu, lobby, playing, results
  const [currentMatch, setCurrentMatch] = useState(null);
  const [matchResults, setMatchResults] = useState(null);
  const [isSoloMode, setIsSoloMode] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleStartMultiplayer = () => {
    setIsSoloMode(false);
    setGameState("lobby");
  };

  const handleStartSolo = () => {
    setIsSoloMode(true);
    const typingTexts = [
      "The quick brown fox jumps over the lazy dog. Practice makes perfect when learning English. Every day brings new opportunities to improve your skills.",
      "Technology has transformed the way we communicate and learn. Mastering English opens doors to countless opportunities in the modern world.",
      "Consistency is the key to success in language learning. Set goals, track your progress, and celebrate small victories along the way.",
      "Reading regularly expands your vocabulary and improves comprehension. The more you practice, the more confident you become.",
      "Effective communication requires both speaking and listening skills. Pay attention to pronunciation and try to mimic native speakers."
    ];

    const soloMatch = {
      match_id: Date.now().toString(),
      text_content: typingTexts[Math.floor(Math.random() * typingTexts.length)],
      participants: [{
        user_email: user.email,
        username: user.username,
        score: 0,
        accuracy: 0,
        wpm: 0,
        rank: 1
      }],
      status: "in_progress"
    };
    
    setCurrentMatch(soloMatch);
    setGameState("playing");
  };

  const handleJoinMatch = (match) => {
    setCurrentMatch(match);
    setGameState("playing");
  };

  const handleMatchComplete = async (results) => {
    setMatchResults(results);
    setGameState("results");

    // Award coins and points based on ranking (for multiplayer) or performance (for solo)
    let coins = 0;
    let points = 0;

    if (isSoloMode) {
      // Solo mode rewards based on performance
      if (results.accuracy >= 95 && results.wpm >= 60) {
        coins = 50;
        points = 100;
      } else if (results.accuracy >= 85 && results.wpm >= 40) {
        coins = 30;
        points = 60;
      } else {
        coins = 15;
        points = 30;
      }
    } else {
      // Multiplayer rewards based on ranking
      const rewards = [
        { coins: 100, points: 200 }, // 1st place
        { coins: 75, points: 150 },  // 2nd place
        { coins: 50, points: 100 },  // 3rd place
        { coins: 25, points: 50 }    // 4th+ place
      ];
      const reward = rewards[Math.min(results.rank - 1, 3)];
      coins = reward.coins;
      points = reward.points;
    }
    
    await User.updateMyUserData({
      coins: (user.coins || 0) + coins,
      total_points: (user.total_points || 0) + points
    });

    // Save progress
    await LessonProgress.create({
      user_email: user.email,
      lesson_type: "typing",
      lesson_id: currentMatch?.match_id || "practice",
      score: results.score,
      accuracy: results.accuracy,
      time_taken: results.timeTaken,
      mistakes: results.mistakes,
      completed: true
    });
  };

  const handlePlayAgain = () => {
    setCurrentMatch(null);
    setMatchResults(null);
    setGameState("menu");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => gameState === "menu" ? navigate(-1) : setGameState("menu")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Typing {isSoloMode ? "Practice" : "Competition"}
          </h1>
        </div>

        {gameState === "menu" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                  <Keyboard className="w-10 h-10" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Master Your Typing Skills!
                </h2>
                <p className="text-white/90 text-lg">
                  Choose your mode: Practice solo or compete with others
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer group" onClick={handleStartSolo}>
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <UserIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 text-center">Solo Practice</h3>
                  <p className="text-gray-600 text-center">
                    Practice at your own pace without competition. Perfect for improving speed and accuracy.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">✓ No waiting for players</p>
                    <p className="flex items-center gap-2">✓ Track your personal best</p>
                    <p className="flex items-center gap-2">✓ Earn rewards based on performance</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                    Start Solo Practice
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer group" onClick={handleStartMultiplayer}>
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 text-center">Multiplayer Competition</h3>
                  <p className="text-gray-600 text-center">
                    Race against other players in real-time. Win big rewards based on your ranking!
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">✓ Compete with real players</p>
                    <p className="flex items-center gap-2">✓ Rank-based rewards (up to 100 coins)</p>
                    <p className="flex items-center gap-2">✓ Climb the leaderboard</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Join Competition
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-orange-600" />
                  Rewards System:
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Solo Practice:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• 95%+ accuracy & 60+ WPM: 50 coins, 100 points</li>
                      <li>• 85%+ accuracy & 40+ WPM: 30 coins, 60 points</li>
                      <li>• Participation: 15 coins, 30 points</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Multiplayer:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• 1st Place: 100 coins, 200 points</li>
                      <li>• 2nd Place: 75 coins, 150 points</li>
                      <li>• 3rd Place: 50 coins, 100 points</li>
                      <li>• 4th Place: 25 coins, 50 points</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {gameState === "lobby" && (
          <TypingLobby
            user={user}
            onJoinMatch={handleJoinMatch}
            onCancel={() => setGameState("menu")}
          />
        )}

        {gameState === "playing" && (
          <TypingGame
            user={user}
            match={currentMatch}
            onComplete={handleMatchComplete}
            isSoloMode={isSoloMode}
          />
        )}

        {gameState === "results" && (
          <TypingResults
            results={matchResults}
            onPlayAgain={handlePlayAgain}
            onBackToMenu={() => setGameState("menu")}
            isSoloMode={isSoloMode}
          />
        )}
      </div>
    </div>
  );
}