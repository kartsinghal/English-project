import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Keyboard, Mic, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentLevel() {
  const gameModes = [
    {
      title: "Reading",
      description: "Practice reading paragraphs with audio pronunciation",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      available: true,
      path: "Reading",
    },
    {
      title: "Typing",
      description: "Compete with other players in typing challenges",
      icon: Keyboard,
      color: "from-purple-500 to-pink-500",
      available: true,
      path: "Typing",
    },
    {
      title: "Speaking",
      description: "Practice pronunciation with real-time feedback",
      icon: Mic,
      color: "from-green-500 to-emerald-500",
      available: false,
      path: null,
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Title Section */}
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            Student Level
          </motion.h1>
          <p className="text-xl text-gray-600">Choose your learning mode</p>
        </div>

        {/* Game Modes Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {gameModes.map((mode, index) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {mode.available ? (
                <Link to={createPageUrl(mode.path)}>
                  <Card className="border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer h-full overflow-hidden group">
                    <div className={`h-2 bg-gradient-to-r ${mode.color}`} />
                    <CardContent className="p-8 space-y-4">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${mode.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <mode.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {mode.title}
                      </h3>
                      <p className="text-gray-600">{mode.description}</p>
                      <div className="pt-4">
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-semibold">
                          Start Playing →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card className="border-0 shadow-xl h-full overflow-hidden opacity-75">
                  <div className="h-2 bg-gray-300" />
                  <CardContent className="p-8 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-300 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-600">
                      {mode.title}
                    </h3>
                    <p className="text-gray-500">{mode.description}</p>
                    <div className="pt-4">
                      <span className="inline-block px-4 py-2 bg-gray-300 text-gray-600 rounded-full text-sm font-semibold">
                        Coming Soon
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bonus Tip Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardContent className="p-6 text-center">
            <p className="text-gray-700 font-medium">
              💡 <strong>Tip:</strong> Complete lessons faster to earn bonus
              rewards! Finish in under 3 minutes for 2x rewards, or under 5
              minutes for 1.5x rewards.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
