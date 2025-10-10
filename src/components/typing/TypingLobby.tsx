import React, { useState, useEffect } from "react";
import { TypingMatch } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, Play } from "lucide-react";
import { motion } from "framer-motion";

const typingTexts = [
  "The quick brown fox jumps over the lazy dog. Practice makes perfect when learning English. Every day brings new opportunities to improve your skills.",
  "Technology has transformed the way we communicate and learn. Mastering English opens doors to countless opportunities in the modern world.",
  "Consistency is the key to success in language learning. Set goals, track your progress, and celebrate small victories along the way.",
  "Reading regularly expands your vocabulary and improves comprehension. The more you practice, the more confident you become.",
  "Effective communication requires both speaking and listening skills. Pay attention to pronunciation and try to mimic native speakers."
];

export default function TypingLobby({ user, onJoinMatch, onCancel }) {
  const [countdown, setCountdown] = useState(5);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Simulate other players joining
    const simulatedPlayers = [
      { username: user?.username || "You", email: user?.email, isYou: true },
      { username: "Alex_Learner", email: "alex@example.com" },
      { username: "Sarah_M", email: "sarah@example.com" },
      { username: "Mike_Pro", email: "mike@example.com" }
    ];
    
    let playerIndex = 1;
    const interval = setInterval(() => {
      if (playerIndex < simulatedPlayers.length) {
        setPlayers(prev => [...prev, simulatedPlayers[playerIndex]]);
        playerIndex++;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (players.length >= 3) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            startMatch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [players]);

  const startMatch = () => {
    const match = {
      match_id: Date.now().toString(),
      text_content: typingTexts[Math.floor(Math.random() * typingTexts.length)],
      participants: players.map((p, index) => ({
        user_email: p.email,
        username: p.username,
        score: 0,
        accuracy: 0,
        wpm: 0,
        rank: index + 1
      })),
      status: "in_progress"
    };
    
    onJoinMatch(match);
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Waiting for Players
          </span>
          {players.length >= 3 && (
            <div className="flex items-center gap-2 text-purple-600">
              <Clock className="w-5 h-5" />
              <span className="text-2xl font-bold">{countdown}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-gray-600">
            {players.length < 3 
              ? "Waiting for more players to join..." 
              : "Match starting soon!"}
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= players.length ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {players.length}/4 players
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {players.map((player, index) => (
            <motion.div
              key={player.email}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className={`p-4 rounded-lg border-2 ${
                player.isYou 
                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {player.username[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {player.username}
                    {player.isYou && <span className="ml-2 text-xs text-purple-600">(You)</span>}
                  </p>
                  <p className="text-xs text-gray-500">Ready to compete</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {players.length < 4 && Array(4 - players.length).fill(0).map((_, i) => (
            <div key={`empty-${i}`} className="p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Waiting for player...</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {players.length < 3 && (
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full"
          >
            Cancel
          </Button>
        )}

        {countdown === 0 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Play className="w-8 h-8 text-white" />
            </div>
            <p className="text-xl font-bold text-purple-600">Starting Match...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}