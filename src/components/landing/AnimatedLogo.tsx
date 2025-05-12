
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  textColor?: string;
  highlightColor?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  textColor = "currentColor", 
  highlightColor = "text-primary" 
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  // Restart animation every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
  };

  const coinVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        delay: 0.4,
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const splitVariants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: { 
      scaleX: 1,
      transition: { 
        delay: 0.6, 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const letters = ["B", "u", "d", "g", "e", "t"];

  return (
    <div className="flex items-center font-bold">
      <div className="flex">
        {isPlaying && letters.map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className={i === 0 ? highlightColor : textColor}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {isPlaying && (
        <motion.div
          className="relative mx-1"
          variants={coinVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={`w-5 h-5 rounded-full ${highlightColor.replace("text-", "bg-")} flex items-center justify-center text-xs text-white font-bold`}>
            $
          </div>
        </motion.div>
      )}

      {isPlaying && (
        <motion.div
          className="flex"
          variants={splitVariants}
          initial="hidden"
          animate="visible"
        >
          <span>Split</span>
        </motion.div>
      )}
      
      {!isPlaying && (
        <span className="font-bold">BudgetSplit</span>
      )}
    </div>
  );
};

export default AnimatedLogo;
