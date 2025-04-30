"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { OperationType, SkillLevel, StudentProgressType } from '@/types';

type StudentProgressContextType = {
  progress: StudentProgressType;
  updateSkillLevel: (newLevel: SkillLevel) => void;
  addMasteredConcept: (concept: OperationType) => void;
  addStrugglingConcept: (concept: OperationType) => void;
  recordAttempt: (isCorrect: boolean) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
};

const defaultProgress: StudentProgressType = {
  skillLevel: 'beginner',
  masteredConcepts: [],
  strugglingConcepts: [],
  questionsAttempted: 0,
  correctAnswers: 0,
  streak: 0,
};

const StudentProgressContext = createContext<StudentProgressContextType | undefined>(undefined);

export const StudentProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<StudentProgressType>(() => {
    // Load from local storage if available
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('studentProgress');
      return savedProgress ? JSON.parse(savedProgress) : defaultProgress;
    }
    return defaultProgress;
  });

  // Save to local storage whenever progress changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('studentProgress', JSON.stringify(progress));
    }
  }, [progress]);

  // Automatically adjust skill level based on performance
  useEffect(() => {
    const correctPercentage = progress.questionsAttempted > 0 
      ? (progress.correctAnswers / progress.questionsAttempted) * 100 
      : 0;
    
    if (progress.questionsAttempted >= 10) {
      if (progress.skillLevel === 'beginner' && correctPercentage >= 80 && progress.streak >= 5) {
        setProgress(prev => ({ ...prev, skillLevel: 'intermediate' }));
      } else if (progress.skillLevel === 'intermediate' && correctPercentage >= 85 && progress.streak >= 7) {
        setProgress(prev => ({ ...prev, skillLevel: 'advanced' }));
      }
    }
  }, [progress.questionsAttempted, progress.correctAnswers, progress.streak]);

  const updateSkillLevel = (newLevel: SkillLevel) => {
    setProgress(prev => ({ ...prev, skillLevel: newLevel }));
  };

  const addMasteredConcept = (concept: OperationType) => {
    setProgress(prev => ({
      ...prev,
      masteredConcepts: [...new Set([...prev.masteredConcepts, concept])],
      strugglingConcepts: prev.strugglingConcepts.filter(c => c !== concept)
    }));
  };

  const addStrugglingConcept = (concept: OperationType) => {
    setProgress(prev => ({
      ...prev,
      strugglingConcepts: [...new Set([...prev.strugglingConcepts, concept])],
      masteredConcepts: prev.masteredConcepts.filter(c => c !== concept)
    }));
  };

  const recordAttempt = (isCorrect: boolean) => {
    setProgress(prev => ({
      ...prev,
      questionsAttempted: prev.questionsAttempted + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers
    }));
  };

  const incrementStreak = () => {
    setProgress(prev => ({ ...prev, streak: prev.streak + 1 }));
  };

  const resetStreak = () => {
    setProgress(prev => ({ ...prev, streak: 0 }));
  };

  return (
    <StudentProgressContext.Provider
      value={{
        progress,
        updateSkillLevel,
        addMasteredConcept,
        addStrugglingConcept,
        recordAttempt,
        incrementStreak,
        resetStreak
      }}
    >
      {children}
    </StudentProgressContext.Provider>
  );
};

export const useStudentProgress = (): StudentProgressContextType => {
  const context = useContext(StudentProgressContext);
  if (context === undefined) {
    throw new Error('useStudentProgress must be used within a StudentProgressProvider');
  }
  return context;
}; 