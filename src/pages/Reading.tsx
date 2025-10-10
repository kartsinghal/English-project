import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const readingParagraphs = [
  {
    id: 1,
    title: "The Power of Learning",
    text: "Learning a new language opens doors to countless opportunities. It allows you to connect with people from different cultures, understand diverse perspectives, and expand your worldview. Every word you learn is a step towards becoming a global citizen.",
    difficulty: "beginner"
  },
  {
    id: 2,
    title: "Technology and Communication",
    text: "In today's digital age, effective communication has become more important than ever. Technology has transformed the way we interact, making it possible to connect with anyone, anywhere in the world. Mastering English gives you access to global conversations and opportunities.",
    difficulty: "intermediate"
  },
  {
    id: 3,
    title: "The Journey of Success",
    text: "Success is not a destination but a continuous journey of growth and learning. It requires dedication, perseverance, and the willingness to embrace challenges. Those who consistently work towards their goals, despite setbacks, ultimately achieve remarkable results. Remember, every expert was once a beginner.",
    difficulty: "advanced"
  }
];

export default function Reading() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentParagraph = readingParagraphs[currentIndex];

  const speakText = () => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(currentParagraph.text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser");
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleNext = () => {
    if (currentIndex < readingParagraphs.length - 1) {
      stopSpeaking();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      stopSpeaking();
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Reading Practice
          </h1>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-gray-600">Paragraph {currentIndex + 1} of {readingParagraphs.length}</p>
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
            currentParagraph.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
            currentParagraph.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {currentParagraph.difficulty}
          </span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-2xl">{currentParagraph.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <p className="text-lg leading-relaxed text-gray-700">
              {currentParagraph.text}
            </p>

            <div className="flex justify-center">
              <Button
                onClick={isSpeaking ? stopSpeaking : speakText}
                className={`px-8 h-12 text-lg font-semibold ${
                  isSpeaking 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                }`}
              >
                <Volume2 className="w-5 h-5 mr-2" />
                {isSpeaking ? 'Stop Reading' : 'Listen to Pronunciation'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            className="px-8"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex === readingParagraphs.length - 1}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8"
          >
            Next
          </Button>
        </div>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-6 text-center">
            <p className="text-gray-700">
              💡 <strong>Tip:</strong> Listen to the paragraph multiple times and try to read along silently. This helps improve your pronunciation and reading fluency!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}