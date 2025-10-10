import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, AlertCircle, Zap, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function TypingResults({ results, onPlayAgain, onBackToMenu, isSoloMode }) {
  const getRankEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "🎖️";
  };

  const getRankText = (rank) => {
    if (isSoloMode) return "Practice Complete!";
    if (rank === 1) return "1st Place - Champion!";
    if (rank === 2) return "2nd Place - Great Job!";
    if (rank === 3) return "3rd Place - Well Done!";
    return `${rank}th Place - Keep Practicing!`;
  };

  const getReward = (rank) => {
    if (isSoloMode) {
      // Solo mode rewards based on performance
      if (results.accuracy >= 95 && results.wpm >= 60) {
        return { coins: 50, points: 100 };
      } else if (results.accuracy >= 85 && results.wpm >= 40) {
        return { coins: 30, points: 60 };
      } else {
        return { coins: 15, points: 30 };
      }
    } else {
      // Multiplayer rewards based on ranking
      const rewards = [
        { coins: 100, points: 200 },
        { coins: 75, points: 150 },
        { coins: 50, points: 100 },
        { coins: 25, points: 50 }
      ];
      return rewards[Math.min(rank - 1, 3)];
    }
  };

  const reward = getReward(results.rank);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <Card className={`border-0 shadow-2xl text-white overflow-hidden ${
          isSoloMode 
            ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500'
            : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500'
        }`}>
          <CardContent className="p-12 text-center space-y-6">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: isSoloMode ? [0, 0, 0] : [0, 10, -10, 0]
              }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-8xl"
            >
              {isSoloMode ? "✨" : getRankEmoji(results.rank)}
            </motion.div>
            
            <div>
              <h2 className="text-4xl font-bold mb-2">
                {isSoloMode ? "Practice Complete!" : "Match Complete!"}
              </h2>
              <p className="text-2xl text-white/90">{getRankText(results.rank)}</p>
            </div>

            <div className="flex justify-center gap-6 pt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-32">
                <p className="text-3xl font-bold mb-1">🪙 {reward.coins}</p>
                <p className="text-sm text-white/80">Coins Earned</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-32">
                <p className="text-3xl font-bold mb-1">⭐ {reward.points}</p>
                <p className="text-sm text-white/80">Points Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <Zap className="w-4 h-4" />
              Words Per Minute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{results.wpm}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <Target className="w-4 h-4" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{results.accuracy}%</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              Time Taken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{results.timeTaken}s</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <AlertCircle className="w-4 h-4" />
              Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{results.mistakes}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Award className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance Analysis</h3>
              <div className="space-y-1 text-sm text-gray-700">
                {results.wpm >= 60 && <p>✓ Excellent typing speed! You're a fast typist.</p>}
                {results.wpm < 60 && results.wpm >= 40 && <p>• Good typing speed. Keep practicing to improve!</p>}
                {results.wpm < 40 && <p>• Practice more to increase your typing speed.</p>}
                
                {results.accuracy >= 95 && <p>✓ Outstanding accuracy! Almost perfect.</p>}
                {results.accuracy < 95 && results.accuracy >= 85 && <p>• Good accuracy. Try to minimize mistakes.</p>}
                {results.accuracy < 85 && <p>• Focus on accuracy over speed for better results.</p>}
                
                {results.mistakes === 0 && <p>✓ Perfect! Zero mistakes is incredible!</p>}
                {results.mistakes > 0 && results.mistakes <= 5 && <p>• Very few mistakes. Great job!</p>}
                {results.mistakes > 5 && <p>• Take your time to reduce typing errors.</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={onPlayAgain}
          className={`flex-1 h-12 text-lg font-semibold ${
            isSoloMode
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
          }`}
        >
          Practice Again
        </Button>
        <Button
          onClick={onBackToMenu}
          variant="outline"
          className="flex-1 h-12 text-lg font-semibold"
        >
          Back to Menu
        </Button>
      </div>
    </div>
  );
}