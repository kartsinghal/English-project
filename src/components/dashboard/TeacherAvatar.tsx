import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TeacherAvatar({ username }) {
  const [wave, setWave] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWave(true);
      setTimeout(() => setWave(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      
      className="relative"
    >
      <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
        <motion.div
          animate={wave ? { rotate: [0, 14, -8, 14, -4, 10, 0] } : {}}
          transition={{ duration: 0.5, repeat: wave ? 1 : 0 }}
          className="text-6xl md:text-7xl"
        >
          👨‍🏫
        </motion.div>
      </div>
      
      {/* Pointing gesture */}
      <motion.div
        
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        
        className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-4xl"
      >
        👉
      </motion.div>

      {/* Sparkle effect */}
      <motion.div
        
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        
        className="absolute -top-2 -right-2 text-2xl"
      >
        ✨
      </motion.div>
    </motion.div>
  );
}