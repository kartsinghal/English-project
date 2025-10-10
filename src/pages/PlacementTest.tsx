import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

// 🧠 Define the question type
interface Question {
  question: string;
  options: string[];
  correct: number;
}

// ✨ All questions
const placementQuestions: Question[] = [
  {
    question: "Choose the correct form: 'She ___ to the store yesterday.'",
    options: ["go", "goes", "went", "going"],
    correct: 2,
  },
  {
    question: "Which sentence is grammatically correct?",
    options: [
      "He don't like pizza",
      "He doesn't likes pizza",
      "He doesn't like pizza",
      "He not like pizza",
    ],
    correct: 2,
  },
  {
    question: "What is the synonym of 'happy'?",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    correct: 1,
  },
  {
    question: "Choose the correct sentence:",
    options: [
      "I have been working here since 2020",
      "I have been working here from 2020",
      "I am working here since 2020",
      "I work here since 2020",
    ],
    correct: 0,
  },
  {
    question: "What does 'procrastinate' mean?",
    options: [
      "To do something quickly",
      "To delay or postpone",
      "To finish early",
      "To organize tasks",
    ],
    correct: 1,
  },
  {
    question: "Choose the correct preposition: 'She is good ___ mathematics.'",
    options: ["in", "at", "on", "with"],
    correct: 1,
  },
  {
    question: "Which is the passive voice of 'They are building a house'?",
    options: [
      "A house is being built by them",
      "A house is built by them",
      "A house was being built by them",
      "A house has been built by them",
    ],
    correct: 0,
  },
  {
    question: "What is the opposite of 'ancient'?",
    options: ["Old", "Modern", "Historic", "Traditional"],
    correct: 1,
  },
  {
    question:
      "Choose the correct article: '___ university is a place of learning.'",
    options: ["A", "An", "The", "No article"],
    correct: 0,
  },
  {
    question: "Which sentence uses the present perfect tense correctly?",
    options: [
      "I have saw that movie",
      "I have seen that movie",
      "I has seen that movie",
      "I seen that movie",
    ],
    correct: 1,
  },
];

export default function PlacementTest() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("");

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < placementQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = async () => {
    let correctAnswers = 0;
    placementQuestions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) {
        correctAnswers++;
      }
    });

    const finalScore = (correctAnswers / placementQuestions.length) * 100;
    setScore(finalScore);

    let userLevel = "beginner";
    if (finalScore >= 70) userLevel = "advanced";
    else if (finalScore >= 40) userLevel = "intermediate";
    setLevel(userLevel);

    try {
      await User.updateMyUserData?.({
        placement_test_completed: true,
        placement_test_score: Math.round(finalScore),
        level: userLevel,
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }

    setIsCompleted(true);
  };

  const handleStart = () => {
    navigate(createPageUrl("Dashboard"));
  };

  const progress = ((currentQuestion + 1) / placementQuestions.length) * 100;
  const question = placementQuestions[currentQuestion];

  // ✅ Completed screen
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0">
          <CardHeader className="text-center space-y-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg pb-8">
            <CheckCircle2 className="w-16 h-16 mx-auto" />
            <CardTitle className="text-3xl font-bold">Test Completed!</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {Math.round(score)}%
              </div>
              <p className="text-xl text-gray-600">Your Score</p>
            </div>

            <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg text-center space-y-2">
              <p className="text-gray-600 font-medium">Your Level</p>
              <p className="text-3xl font-bold capitalize bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {level}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-gray-700 text-center">
                {level === "advanced" && "Excellent! You have a strong command of English."}
                {level === "intermediate" && "Great job! You have a good foundation to build upon."}
                {level === "beginner" && "Welcome! Let's start your English learning journey together."}
              </p>
            </div>

            <Button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 h-12 text-lg font-semibold"
            >
              Start Learning
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Test question screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Placement Test
            </CardTitle>
            <span className="text-sm text-gray-500 font-medium">
              Question {currentQuestion + 1} of {placementQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <p className="text-lg font-medium text-gray-800">{question.question}</p>
          </div>

          <RadioGroup
            value={selectedAnswers[currentQuestion]?.toString()}
            onValueChange={(value) => handleAnswer(currentQuestion, parseInt(value))}
          >
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                  }`}
                  onClick={() => handleAnswer(currentQuestion, index)}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-gray-700 font-medium"
                  >
                    {option}
                  </Label>
                  {selectedAnswers[currentQuestion] === index && (
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex justify-between pt-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="px-8"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8"
            >
              {currentQuestion === placementQuestions.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
