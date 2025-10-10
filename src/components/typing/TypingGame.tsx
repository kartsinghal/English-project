import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Zap, Target, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TypingGame({ user, match, onComplete, isSoloMode }) {
  const [currentText, setCurrentText] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [otherPlayersProgress, setOtherPlayersProgress] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    
    // Only simulate other players if in multiplayer mode
    if (!isSoloMode) {
      const interval = setInterval(() => {
        setOtherPlayersProgress(prev => {
          const others = match.participants.filter(p => p.user_email !== user?.email);
          return others.map(p => ({
            ...p,
            progress: Math.min(100, (prev.find(pp => pp.user_email === p.user_email)?.progress || 0) + Math.random() * 5)
          }));
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [match, user, isSoloMode]);

  useEffect(() => {
    if (!isFinished) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isFinished]);

  const handleTextChange = (e) => {
    const input = e.target.value;
    const expected = match.text_content.slice(0, input.length);
    
    if (input !== expected) {
      setMistakes(prev => prev + 1);
    }
    
    setCurrentText(input);
    
    if (input === match.text_content) {
      finishMatch();
    }
  };

  const finishMatch = () => {
    setIsFinished(true);
    
    const wordsTyped = match.text_content.split(' ').length;
    const timeInMinutes = timeElapsed / 60;
    const wpm = Math.round(wordsTyped / timeInMinutes);
    const accuracy = Math.max(0, 100 - (mistakes / match.text_content.length) * 100);
    const score = Math.round((wpm * accuracy) / 100);
    
    let rank = 1;
    if (!isSoloMode) {
      // Determine rank in multiplayer (simulated - in real app would be from backend)
      const playersFinished = otherPlayersProgress.filter(p => p.progress >= 100).length + 1;
      rank = playersFinished;
    }
    
    setTimeout(() => {
      onComplete({
        rank,
        wpm,
        accuracy: Math.round(accuracy),
        mistakes,
        score,
        timeTaken: timeElapsed
      });
    }, 1000);
  };

  const progress = (currentText.length / match.text_content.length) * 100;

  const getCharacterClass = (index) => {
    if (index >= currentText.length) return "text-gray-400";
    if (currentText[index] === match.text_content[index]) return "text-green-600 bg-green-50";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <p className="text-2xl font-bold text-gray-900">{timeElapsed}s</p>
            <p className="text-xs text-gray-500">Time</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Target className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <p className="text-2xl font-bold text-gray-900">
              {Math.round((currentText.length / match.text_content.length) * 100)}%
            </p>
            <p className="text-xs text-gray-500">Progress</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-5 h-5 mx-auto mb-1 text-red-600" />
            <p className="text-2xl font-bold text-gray-900">{mistakes}</p>
            <p className="text-xs text-gray-500">Mistakes</p>
          </CardContent>
        </Card>
      </div>

      {/* Typing Area */}
      <Card className="border-0 shadow-xl">
        <CardHeader className={`bg-gradient-to-r ${isSoloMode ? 'from-blue-50 to-cyan-50' : 'from-purple-50 to-pink-50'}`}>
          <CardTitle className="flex items-center gap-2">
            <Zap className={`w-5 h-5 ${isSoloMode ? 'text-blue-600' : 'text-purple-600'}`} />
            Type the text below
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 min-h-32">
            <p className="text-lg leading-relaxed font-mono">
              {match.text_content.split('').map((char, index) => (
                <span
                  key={index}
                  className={`${getCharacterClass(index)} transition-all`}
                >
                  {char}
                </span>
              ))}
            </p>
          </div>

          <textarea
            ref={inputRef}
            value={currentText}
            onChange={handleTextChange}
            disabled={isFinished}
            className="w-full p-4 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 text-lg font-mono min-h-32 resize-none"
            placeholder="Start typing here..."
          />

          <Progress value={progress} className="h-3" />

          {isFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg"
            >
              <p className="text-2xl font-bold text-green-600 mb-2">🎉 Completed!</p>
              <p className="text-gray-600">Calculating your results...</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Other Players Progress - Only show in multiplayer */}
      {!isSoloMode && otherPlayersProgress.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Competitors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {otherPlayersProgress.map((player) => (
              <div key={player.user_email} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{player.username}</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(player.progress || 0)}%
                  </span>
                </div>
                <Progress value={player.progress || 0} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}