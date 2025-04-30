"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FractionType, OperationType } from '@/types';
import FractionDisplay from './FractionDisplay';

interface InteractiveFractionAnimationProps {
  operationType: OperationType;
  fractions: FractionType[];
  correctAnswer?: FractionType;
  onAnimationComplete: () => void;
  isPlaying: boolean;
}

const InteractiveFractionAnimation: React.FC<InteractiveFractionAnimationProps> = ({
  operationType,
  fractions,
  correctAnswer,
  onAnimationComplete,
  isPlaying
}) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | null>(null);
  const [pieces, setPieces] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    // Reset animation when input changes
    setAnimationStep(0);
    setPieces([]);
    
    if (!isPlaying) {
      setIsPaused(true);
      return;
    } else {
      setIsPaused(false);
    }
  }, [operationType, fractions, isPlaying]);
  
  useEffect(() => {
    if (isPaused || !isPlaying) return;
    
    let step = animationStep;
    const totalSteps = getTotalSteps();
    
    // Animation timeline management
    const advanceAnimation = () => {
      if (step < totalSteps) {
        step++;
        setAnimationStep(step);
        animationRef.current = requestAnimationFrame(advanceAnimation);
      } else {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    };
    
    const timeoutId = setTimeout(() => {
      // Start animation after a brief delay
      animationRef.current = requestAnimationFrame(advanceAnimation);
    }, 1500); // Delay between steps
    
    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationStep, isPaused, isPlaying]);
  
  const getTotalSteps = () => {
    switch (operationType) {
      case 'addition':
        return 5;
      case 'subtraction':
        return 5;
      case 'multiplication':
        return 6;
      case 'division':
        return 7;
      case 'simplification':
        return 4;
      case 'comparison':
        return 3;
      default:
        return 3;
    }
  };
  
  const handlePausePlay = () => {
    setIsPaused(prev => !prev);
  };
  
  const renderAdditionAnimation = () => {
    const [fraction1, fraction2] = fractions;
    
    switch (animationStep) {
      case 0:
        return (
          <div className="flex flex-col items-center">
            <p className="text-lg mb-4">Let's add these fractions together!</p>
            <div className="flex items-center space-x-4">
              <FractionDisplay fraction={fraction1} size="large" animated />
              <span className="text-3xl">+</span>
              <FractionDisplay fraction={fraction2} size="large" animated />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col items-center">
            <p className="text-lg mb-4">First, we need a common denominator.</p>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FractionDisplay fraction={fraction1} size="large" animated />
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.2 }}
                  className="absolute -bottom-8 w-full text-center text-blue-600"
                >
                  {fraction2.denominator}
                </motion.div>
              </div>
              <span className="text-3xl">+</span>
              <div className="relative">
                <FractionDisplay fraction={fraction2} size="large" animated />
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.2 }}
                  className="absolute -bottom-8 w-full text-center text-blue-600"
                >
                  {fraction1.denominator}
                </motion.div>
              </div>
            </div>
          </div>
        );
      case 2:
        const lcd = fraction1.denominator * fraction2.denominator;
        const newNumerator1 = fraction1.numerator * fraction2.denominator;
        const newNumerator2 = fraction2.numerator * fraction1.denominator;
        
        return (
          <div className="flex flex-col items-center">
            <p className="text-lg mb-4">Now we have equivalent fractions with the same denominator.</p>
            <div className="flex items-center space-x-4">
              <div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-2 text-center"
                >
                  {fraction1.numerator} × {fraction2.denominator} = {newNumerator1}
                </motion.div>
                <FractionDisplay 
                  fraction={{ numerator: newNumerator1, denominator: lcd }} 
                  size="large" 
                  animated 
                />
              </div>
              <span className="text-3xl">+</span>
              <div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-2 text-center"
                >
                  {fraction2.numerator} × {fraction1.denominator} = {newNumerator2}
                </motion.div>
                <FractionDisplay 
                  fraction={{ numerator: newNumerator2, denominator: lcd }} 
                  size="large" 
                  animated 
                />
              </div>
            </div>
          </div>
        );
      case 3:
        const lcd3 = fraction1.denominator * fraction2.denominator;
        const newNumerator13 = fraction1.numerator * fraction2.denominator;
        const newNumerator23 = fraction2.numerator * fraction1.denominator;
        const sumNumerator = newNumerator13 + newNumerator23;
        
        return (
          <div className="flex flex-col items-center">
            <p className="text-lg mb-4">Now we add the numerators and keep the common denominator.</p>
            <div className="flex items-center space-x-4">
              <FractionDisplay 
                fraction={{ numerator: newNumerator13, denominator: lcd3 }} 
                size="large" 
                animated 
              />
              <span className="text-3xl">+</span>
              <FractionDisplay 
                fraction={{ numerator: newNumerator23, denominator: lcd3 }} 
                size="large" 
                animated 
              />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl"
              >
                =
              </motion.span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <FractionDisplay 
                  fraction={{ numerator: sumNumerator, denominator: lcd3 }} 
                  size="large" 
                  animated 
                  color="text-green-600"
                />
              </motion.div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center">
            <p className="text-lg mb-4">
              {correctAnswer && correctAnswer.numerator !== correctAnswer.denominator 
                ? "Finally, we can simplify our answer if needed."
                : "Our answer is in its simplest form!"}
            </p>
            <div className="flex items-center space-x-4">
              <FractionDisplay 
                fraction={correctAnswer || { numerator: 0, denominator: 1 }} 
                size="large" 
                animated 
                color="text-green-600"
              />
            </div>
          </div>
        );
      default:
        return <div>Animation complete!</div>;
    }
  };
  
  const renderSubtractionAnimation = () => {
    // Similar structure to addition with subtraction-specific steps
    const [fraction1, fraction2] = fractions;
    
    switch (animationStep) {
      case 0:
        return (
          <div className="flex flex-col items-center">
            <p className="text-lg mb-4">Let's subtract these fractions!</p>
            <div className="flex items-center space-x-4">
              <FractionDisplay fraction={fraction1} size="large" animated />
              <span className="text-3xl">-</span>
              <FractionDisplay fraction={fraction2} size="large" animated />
            </div>
          </div>
        );
      // Add more subtraction steps here (similar to addition)
      default:
        return <div>Animation complete!</div>;
    }
  };
  
  const renderMultiplicationAnimation = () => {
    // Multiplication-specific animation steps
    const [fraction1, fraction2] = fractions;
    
    switch (animationStep) {
      case 0:
        return (
          <div className="flex flex-col items-center">
            <p className="text-lg mb-4">Let's multiply these fractions!</p>
            <div className="flex items-center space-x-4">
              <FractionDisplay fraction={fraction1} size="large" animated />
              <span className="text-3xl">×</span>
              <FractionDisplay fraction={fraction2} size="large" animated />
            </div>
          </div>
        );
      // Add more multiplication steps here
      default:
        return <div>Animation complete!</div>;
    }
  };
  
  const renderAnimationByType = () => {
    switch (operationType) {
      case 'addition':
        return renderAdditionAnimation();
      case 'subtraction':
        return renderSubtractionAnimation();
      case 'multiplication':
        return renderMultiplicationAnimation();
      // Add other operation types as needed
      default:
        return (
          <div className="text-center">
            <p>Animation for {operationType} will be available soon!</p>
          </div>
        );
    }
  };
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg relative">
      <motion.div
        key={`animation-step-${animationStep}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-64 flex items-center justify-center"
      >
        {renderAnimationByType()}
      </motion.div>
      
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handlePausePlay}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {isPaused ? "▶ Play" : "⏸ Pause"}
        </button>
        
        <button
          onClick={() => setAnimationStep(prev => Math.max(0, prev - 1))}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          disabled={animationStep === 0}
        >
          ← Back
        </button>
        
        <button
          onClick={() => {
            if (animationStep < getTotalSteps()) {
              setAnimationStep(prev => prev + 1);
            } else {
              onAnimationComplete();
            }
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {animationStep < getTotalSteps() ? "Next →" : "Finish"}
        </button>
      </div>
    </div>
  );
};

export default InteractiveFractionAnimation; 