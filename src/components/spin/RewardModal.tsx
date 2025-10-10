import React from "react";
import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RewardModal({ prize, onClose }) {
  return (
    <motion.div
      
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-6">
          <motion.div
            
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 0.5, repeat: 3 }}
            
            className="text-8xl"
          >
            🎉
          </motion.div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">Congratulations!</h2>
            <div 
              className="text-6xl font-bold py-4 px-6 rounded-xl inline-block"
              style={{ backgroundColor: prize.color + '20', color: prize.color }}
            >
              {prize.label}
            </div>
            <p className="text-gray-600 text-lg">
              has been added to your account!
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-purple-600">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Keep collecting rewards!</span>
            <Sparkles className="w-5 h-5" />
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-12 text-lg font-semibold"
          >
            Awesome!
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}