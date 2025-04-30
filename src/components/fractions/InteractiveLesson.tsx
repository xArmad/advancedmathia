"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonType } from '@/types';
import Confetti from 'react-confetti';

interface InteractiveLessonProps {
  lesson: LessonType;
  onComplete: () => void;
}

const InteractiveLesson: React.FC<InteractiveLessonProps> = ({
  lesson,
  onComplete
}) => {
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Update container size for confetti only when needed
  useEffect(() => {
    if (containerRef.current && isLessonComplete) {
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
  }, [isLessonComplete]);
  
  // Initialize container size on mount
  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
  }, []);

  const handleNextExample = () => {
    if (currentExampleIndex < lesson.examples.length - 1) {
      setCurrentExampleIndex(prevIndex => prevIndex + 1);
      setShowSolution(false);
    } else {
      setIsLessonComplete(true);
      setShowConfetti(true);
      
      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  };

  const handlePrevExample = () => {
    if (currentExampleIndex > 0) {
      setCurrentExampleIndex(prevIndex => prevIndex - 1);
      setShowSolution(false);
    }
  };

  const currentExample = lesson.examples[currentExampleIndex];

  return (
    <motion.div 
      ref={containerRef}
      className="card max-w-4xl mx-auto p-8 my-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showConfetti && (
        <Confetti
          width={containerSize.width}
          height={containerSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <h2 className="text-2xl font-bold mb-4 text-indigo-700">{lesson.title}</h2>
      
      <div className="mb-6 text-lg">
        {lesson.content}
      </div>

      <AnimatePresence mode="wait">
        {!isLessonComplete ? (
          <motion.div
            key="example"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-indigo-50 p-6 rounded-xl mb-6">
              <h3 className="text-xl font-semibold mb-3">Example {currentExampleIndex + 1}:</h3>
              
              <div className="text-2xl font-bold mb-4 flex justify-center items-center">
                {currentExample.problem}
              </div>

              <AnimatePresence>
                {showSolution ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="border-t-2 border-indigo-200 pt-4 mt-4">
                      <div className="text-xl font-bold mb-2">Solution: {currentExample.solution}</div>
                      <div className="text-gray-700">{currentExample.explanation}</div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <button 
                      onClick={() => setShowSolution(true)}
                      className="btn-secondary"
                    >
                      See Solution
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between">
              <button 
                onClick={handlePrevExample}
                className={`px-4 py-2 rounded-lg ${currentExampleIndex > 0 
                  ? 'bg-gray-200 hover:bg-gray-300' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                disabled={currentExampleIndex === 0}
              >
                ← Previous
              </button>
              
              <button 
                onClick={handleNextExample}
                className={`px-4 py-2 rounded-lg ${showSolution 
                  ? 'btn-primary' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                disabled={!showSolution}
              >
                {currentExampleIndex < lesson.examples.length - 1 
                  ? 'Next Example →' 
                  : 'Complete Lesson →'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-green-600 mb-4">Lesson Complete!</h3>
            <p className="mb-6 text-lg">You've mastered the basics of {lesson.title.toLowerCase()}. Ready to test your knowledge?</p>
            
            <button 
              onClick={onComplete}
              className="btn-primary"
            >
              Practice What You Learned
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveLesson; 