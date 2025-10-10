import React from "react";
import { motion } from "framer-motion";

export default function WheelComponent({ prizes, isSpinning, wonPrize }) {
  const segmentAngle = 360 / prizes.length;
  
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      <motion.div
        className="relative w-full h-full"
        animate={isSpinning ? { rotate: 360 * 5 + (wonPrize ? prizes.indexOf(wonPrize) * segmentAngle : 0) } : {}}
        transition={{ duration: 3, ease: "easeOut" }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {prizes.map((prize, index) => {
            const angle = (index * segmentAngle) - 90;
            const nextAngle = ((index + 1) * segmentAngle) - 90;
            
            const x1 = 200 + 180 * Math.cos((angle * Math.PI) / 180);
            const y1 = 200 + 180 * Math.sin((angle * Math.PI) / 180);
            const x2 = 200 + 180 * Math.cos((nextAngle * Math.PI) / 180);
            const y2 = 200 + 180 * Math.sin((nextAngle * Math.PI) / 180);

            const textAngle = angle + segmentAngle / 2;
            const textX = 200 + 120 * Math.cos((textAngle * Math.PI) / 180);
            const textY = 200 + 120 * Math.sin((textAngle * Math.PI) / 180);

            return (
              <g key={index}>
                <path
                  d={`M 200 200 L ${x1} ${y1} A 180 180 0 0 1 ${x2} ${y2} Z`}
                  fill={prize.color}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                >
                  {prize.label}
                </text>
              </g>
            );
          })}
          
          <circle cx="200" cy="200" r="30" fill="white" stroke="#6366F1" strokeWidth="3" />
          <text x="200" y="210" fill="#6366F1" fontSize="24" fontWeight="bold" textAnchor="middle">
            SPIN
          </text>
        </svg>
      </motion.div>

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-red-500" />
      </div>
    </div>
  );
}