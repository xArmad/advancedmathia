"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Define the prop types for the Buddy component
interface BuddyProps {
  message: string;
  emotion: 'happy' | 'teaching' | 'pointing' | 'excited' | 'encouraging' | 'surprised' | 'questioning';
}

const Buddy: React.FC<BuddyProps> = ({ message, emotion }) => {
  // Emotion-specific styling
  const getEmotionConfig = () => {
    switch(emotion) {
      case 'happy':
        return {
          backgroundColor: '#FFD166',
          emoji: '😊',
          handPosition: 'wave'
        };
      case 'teaching':
        return {
          backgroundColor: '#06D6A0',
          emoji: '🧠',
          handPosition: 'explain'
        };
      case 'pointing':
        return {
          backgroundColor: '#118AB2',
          emoji: '👉',
          handPosition: 'point'
        };
      case 'excited':
        return {
          backgroundColor: '#EF476F',
          emoji: '🎉',
          handPosition: 'up'
        };
      case 'encouraging':
        return {
          backgroundColor: '#9896F1',
          emoji: '👍',
          handPosition: 'thumbs-up'
        };
      case 'surprised':
        return {
          backgroundColor: '#FFB3C1',
          emoji: '😮',
          handPosition: 'shocked'
        };
      case 'questioning':
        return {
          backgroundColor: '#83C5BE',
          emoji: '🤔',
          handPosition: 'chin'
        };
      default:
        return {
          backgroundColor: '#FFD166',
          emoji: '😊',
          handPosition: 'wave'
        };
    }
  };
  
  const emotionConfig = getEmotionConfig();

  // Character appearance variants
  const characterVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 200,
        damping: 15 
      }
    }
  };

  // Speech bubble variants
  const speechBubbleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.2,
        duration: 0.4 
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Speech bubble */}
      <motion.div 
        className="relative bg-white p-4 rounded-xl shadow-md mb-4 w-full max-w-lg"
        variants={speechBubbleVariants}
        initial="initial"
        animate="animate"
      >
        <p className="text-lg">{message}</p>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-4 h-4 bg-white"></div>
      </motion.div>
      
      {/* Character */}
      <motion.div 
        className="relative"
        variants={characterVariants}
        initial="initial"
        animate="animate"
        key={emotion} // Re-animate when emotion changes
      >
        {/* Character body */}
        <motion.div 
          className="w-24 h-24 rounded-full flex items-center justify-center text-3xl"
          style={{ backgroundColor: emotionConfig.backgroundColor }}
        >
          {emotionConfig.emoji}
        </motion.div>
        
        {/* Hand animation for pointing, teaching, etc */}
        {emotionConfig.handPosition === 'point' && (
          <motion.div 
            className="absolute -right-8 top-1/2 transform -translate-y-1/2"
            initial={{ x: -5 }}
            animate={{ x: 5 }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 0.8 
            }}
          >
            <div className="text-3xl">👆</div>
          </motion.div>
        )}
        
        {emotionConfig.handPosition === 'wave' && (
          <motion.div 
            className="absolute -left-8 top-1/2 transform -translate-y-1/2"
            animate={{ 
              rotate: [0, 20, 0, 20, 0],
              transformOrigin: "bottom center"
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "loop", 
              duration: 1.5,
              repeatDelay: 2
            }}
          >
            <div className="text-3xl">👋</div>
          </motion.div>
        )}
        
        {emotionConfig.handPosition === 'explain' && (
          <motion.div 
            className="absolute -right-12 top-1/3"
            animate={{ 
              y: [0, -5, 0],
              x: [0, 3, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 1.2 
            }}
          >
            <div className="text-3xl">✋</div>
          </motion.div>
        )}
        
        {emotionConfig.handPosition === 'thumbs-up' && (
          <motion.div 
            className="absolute -right-8 top-1/2 transform -translate-y-1/2"
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 0.8 
            }}
          >
            <div className="text-3xl">👍</div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Buddy; 