"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface BuddyCharacterProps {
  message: string;
  emotion?: 'happy' | 'thinking' | 'encouraging' | 'explaining';
  isVisible?: boolean;
  onMessageEnd?: () => void;
}

const BuddyCharacter: React.FC<BuddyCharacterProps> = ({
  message,
  emotion = 'happy',
  isVisible = true,
  onMessageEnd
}) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  // Character typing animation
  useEffect(() => {
    setCharIndex(0);
    setDisplayedMessage('');
    setIsTyping(true);
  }, [message]);

  useEffect(() => {
    if (charIndex < message.length) {
      const typingTimeout = setTimeout(() => {
        setDisplayedMessage(prev => prev + message[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 30); // Typing speed

      return () => clearTimeout(typingTimeout);
    } else {
      setIsTyping(false);
      if (onMessageEnd) {
        const endTimeout = setTimeout(() => {
          onMessageEnd();
        }, 1000);
        return () => clearTimeout(endTimeout);
      }
    }
  }, [charIndex, message, onMessageEnd]);

  // Character images based on emotion
  const characterImage = {
    happy: '/buddy/happy.png',
    thinking: '/buddy/thinking.png',
    encouraging: '/buddy/encouraging.png',
    explaining: '/buddy/explaining.png'
  }[emotion];

  // For now, we'll use a placeholder circle for the buddy
  // In a real implementation, you'd replace this with actual character images
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-4 right-4 flex items-end z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-white rounded-2xl p-4 mb-2 mr-4 max-w-xs shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-800">
              {displayedMessage}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>
          </motion.div>
          
          <motion.div 
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg ${
              emotion === 'happy' ? 'bg-green-500' : 
              emotion === 'thinking' ? 'bg-purple-500' : 
              emotion === 'encouraging' ? 'bg-yellow-500' : 
              'bg-blue-500'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Placeholder for character image */}
            {emotion === 'happy' && '😊'}
            {emotion === 'thinking' && '🤔'}
            {emotion === 'encouraging' && '🎉'}
            {emotion === 'explaining' && '👨‍🏫'}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuddyCharacter; 