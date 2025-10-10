import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { BookOpen, Sparkles } from "lucide-react";

const motivationalQuotes = [
  "Every expert was once a beginner. Keep going! 🌟",
  "Learning a language opens doors to new worlds! 🌍",
  "Practice makes progress, not perfection! 💪",
  "Your dedication today shapes your success tomorrow! 🚀",
  "Every word you learn is a step towards fluency! 📚",
  "Mistakes are proof that you're trying! 🎯",
  "Consistency is the key to mastery! 🔑",
  "Believe in yourself and your ability to learn! ✨",
];

interface IUser {
  username?: string;
  placement_test_completed?: boolean;
  phone?: string;
  age?: number | null;
}

export default function Loading() {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Pick a random motivational quote
    setQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );

    // Animate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    checkUserAndRedirect();

    return () => clearInterval(progressInterval);
  }, []);

  const checkUserAndRedirect = async () => {
    try {
      const user: IUser = await User.me();

      setProgress(100);

      setTimeout(() => {
        if (!user.placement_test_completed) {
          if (!user.username || !user.phone || !user.age) {
            navigate(createPageUrl("Welcome"));
          } else {
            navigate(createPageUrl("PlacementTest"));
          }
        } else {
          navigate(createPageUrl("Dashboard"));
        }
      }, 1000);
    } catch (error: unknown) {
      console.error("User not logged in:", error);
      setTimeout(() => {
        navigate(createPageUrl("Welcome"));
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200')] bg-cover bg-center opacity-5" />

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 max-w-md">
        <div className="relative">
          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <BookOpen className="w-16 h-16 text-white" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300 animate-spin" />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            EnglishMaster
          </h1>
          <p className="text-xl text-white/90 font-medium italic">{quote}</p>
        </div>

        {/* Progress bar */}
        <div className="space-y-3">
          <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/80 text-sm font-medium">
            {progress < 100 ? "Loading your journey..." : "Ready to start!"}
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style>
        {`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        `}
      </style>
    </div>
  );
}
