"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FractionQuestion from './FractionQuestion';
import InteractiveLesson from './InteractiveLesson';
import { useStudentProgress } from '@/contexts/StudentProgressContext';
import useAdaptiveQuestions from '@/hooks/useAdaptiveQuestions';
import useInteractiveLessons from '@/hooks/useInteractiveLessons';
import { FractionType, OperationType, LessonType } from '@/types';
import Confetti from 'react-confetti';

const FractionLearningApp: React.FC = () => {
  const { progress, recordAttempt, incrementStreak, resetStreak, addMasteredConcept, addStrugglingConcept } = useStudentProgress();
  const { currentQuestion, generateNewQuestion } = useAdaptiveQuestions();
  const { getLessonForStrugglingConcept } = useInteractiveLessons();
  
  const [showingLesson, setShowingLesson] = useState<boolean>(false);
  const [currentLesson, setCurrentLesson] = useState<LessonType | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Generate initial question only when needed
  useEffect(() => {
    if (!currentQuestion && !showingLesson) {
      generateNewQuestion(
        progress.skillLevel,
        progress.strugglingConcepts,
        progress.masteredConcepts
      );
    }
  }, [
    currentQuestion, 
    generateNewQuestion, 
    progress.skillLevel, 
    progress.strugglingConcepts, 
    progress.masteredConcepts,
    showingLesson
  ]);

  // Sync local streak state with context streak state
  useEffect(() => {
    setStreak(progress.streak);
  }, [progress.streak]);

  const handleAnswerSubmit = useCallback((answer: FractionType | boolean, isCorrect: boolean) => {
    // Record the attempt in the progress context
    recordAttempt(isCorrect);
    
    if (isCorrect) {
      // Increment streak
      incrementStreak();
      
      // Show confetti after 3 consecutive correct answers
      if (progress.streak >= 2) { // Will become 3 after increment
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      // After 5 correct answers for the same operation type, mark it as mastered
      if (currentQuestion && progress.streak >= 4) { // Will become 5 after increment
        addMasteredConcept(currentQuestion.operationType);
      }
      
      // Generate a new question after a short delay to let the user see the feedback
      setTimeout(() => {
        generateNewQuestion(
          progress.skillLevel,
          progress.strugglingConcepts,
          progress.masteredConcepts
        );
      }, 1500);
    } else {
      // Reset streak on wrong answer
      resetStreak();
      
      // Mark the operation type as struggling
      if (currentQuestion) {
        addStrugglingConcept(currentQuestion.operationType);
        
        // Show a lesson for this struggling concept
        const lesson = getLessonForStrugglingConcept(currentQuestion.operationType);
        setCurrentLesson(lesson);
        setShowingLesson(true);
      }
    }
  }, [
    recordAttempt, 
    incrementStreak, 
    resetStreak, 
    addMasteredConcept, 
    addStrugglingConcept, 
    currentQuestion, 
    generateNewQuestion,
    progress.skillLevel, 
    progress.strugglingConcepts, 
    progress.masteredConcepts,
    progress.streak,
    getLessonForStrugglingConcept
  ]);

  const handleLessonComplete = useCallback(() => {
    setShowingLesson(false);
    // Generate a new question focused on the concept just learned
    if (currentQuestion) {
      generateNewQuestion(
        progress.skillLevel,
        [currentQuestion.operationType], // Focus on the concept just learned
        progress.masteredConcepts
      );
    }
  }, [currentQuestion, generateNewQuestion, progress.skillLevel, progress.masteredConcepts]);

  return (
    <div className="container mx-auto px-4 py-8">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <motion.header 
        className="text-center mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">Fraction Explorer</h1>
        <p className="text-xl">Learn fractions interactively at your own pace</p>
      </motion.header>

      <motion.div
        className="flex justify-center items-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="bg-indigo-100 rounded-lg p-4 flex items-center space-x-4">
          <div>
            <span className="text-sm text-gray-600">Current Level:</span>
            <p className="font-bold text-indigo-700 capitalize">{progress.skillLevel}</p>
          </div>
          
          <div className="h-10 border-r border-indigo-300"></div>
          
          <div>
            <span className="text-sm text-gray-600">Streak:</span>
            <p className="font-bold text-indigo-700">{progress.streak} correct</p>
          </div>
          
          <div className="h-10 border-r border-indigo-300"></div>
          
          <div>
            <span className="text-sm text-gray-600">Mastered:</span>
            <p className="font-bold text-indigo-700">{progress.masteredConcepts.length} concepts</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {showingLesson && currentLesson ? (
          <motion.div
            key="lesson"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <InteractiveLesson 
              lesson={currentLesson} 
              onComplete={handleLessonComplete} 
            />
          </motion.div>
        ) : currentQuestion ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <FractionQuestion 
              question={currentQuestion} 
              onAnswerSubmit={handleAnswerSubmit} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            className="text-center p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="inline-block rounded-full h-16 w-16 bg-indigo-600 animate-pulse"></div>
            <p className="mt-4 text-lg">Loading your personalized learning experience...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.footer
        className="mt-16 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <p>Created with ♥ to help kids master fractions</p>
        <div className="mt-2 flex justify-center space-x-4">
          <button className="text-indigo-600 hover:underline">Reset Progress</button>
          <button className="text-indigo-600 hover:underline">About</button>
          <button className="text-indigo-600 hover:underline">Help</button>
        </div>
      </motion.footer>
    </div>
  );
};

export default FractionLearningApp; 