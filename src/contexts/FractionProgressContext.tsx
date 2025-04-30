"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FractionTopic, TopicProgress } from '@/types/problemTemplates';
import { getTopicsNeedingReview, getNextTopicsToLearn } from '@/utils/topicRecommendation';
import { loadTopicsConfig } from '@/utils/problemManager';

interface FractionProgressContextType {
  progressByTopic: Record<string, TopicProgress>;
  updateTopicProgress: (topicId: string, isCorrect: boolean) => void;
  topicsToReview: string[];
  nextTopicsToLearn: string[];
  refreshRecommendations: () => Promise<void>;
  loadTopicsConfig: () => Promise<FractionTopic[]>;
  getTopicProgress: (topicId: string) => TopicProgress | null;
  isInitialized: boolean;
}

const FractionProgressContext = createContext<FractionProgressContextType | null>(null);

export const useFractionProgress = () => {
  const context = useContext(FractionProgressContext);
  if (!context) {
    throw new Error('useFractionProgress must be used within a FractionProgressProvider');
  }
  return context;
};

interface FractionProgressProviderProps {
  children: React.ReactNode;
}

export const FractionProgressProvider: React.FC<FractionProgressProviderProps> = ({ children }) => {
  const [progressByTopic, setProgressByTopic] = useState<Record<string, TopicProgress>>({});
  const [topicsToReview, setTopicsToReview] = useState<string[]>([]);
  const [nextTopicsToLearn, setNextTopicsToLearn] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize progress from localStorage
  useEffect(() => {
    const storedProgress = localStorage.getItem('fractionProgressByTopic');
    if (storedProgress) {
      setProgressByTopic(JSON.parse(storedProgress));
    }
    setIsInitialized(true);
  }, []);

  // Persist progress to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('fractionProgressByTopic', JSON.stringify(progressByTopic));
    }
  }, [progressByTopic, isInitialized]);

  // Memoize the refreshRecommendations function to prevent infinite loops
  const refreshRecommendations = useCallback(async (): Promise<void> => {
    try {
      const topicsToReview = await getTopicsNeedingReview(progressByTopic);
      setTopicsToReview(topicsToReview);

      const nextTopics = await getNextTopicsToLearn(progressByTopic);
      setNextTopicsToLearn(nextTopics);
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    }
  }, [progressByTopic]);

  // Memoize the loadTopicsConfig function as well
  const loadTopicsConfigMemoized = useCallback(async (): Promise<FractionTopic[]> => {
    return await loadTopicsConfig();
  }, []);

  // Update recommendations when progress changes
  useEffect(() => {
    if (isInitialized) {
      refreshRecommendations();
    }
  }, [progressByTopic, isInitialized, refreshRecommendations]);

  // Function to update progress for a topic
  const updateTopicProgress = (topicId: string, isCorrect: boolean) => {
    setProgressByTopic(prev => {
      // Get current progress or initialize if it doesn't exist
      const currentProgress = prev[topicId] || {
        topicId,
        masteryLevel: 0,
        totalAttempts: 0,
        correctAnswers: 0,
        lastAttemptDate: null,
        streakCount: 0
      };
      
      // Calculate new values
      const totalAttempts = currentProgress.totalAttempts + 1;
      const correctAnswers = currentProgress.correctAnswers + (isCorrect ? 1 : 0);
      
      // Update streak count
      let streakCount = currentProgress.streakCount;
      if (isCorrect) {
        streakCount += 1;
      } else {
        streakCount = 0;
      }
      
      // Calculate mastery level (0-1)
      // We weight recent answers more heavily and consider streak
      let masteryLevel = correctAnswers / totalAttempts;
      
      // Boost mastery for streaks of correct answers
      if (streakCount > 2) {
        const streakBonus = Math.min(0.2, streakCount * 0.05);
        masteryLevel = Math.min(1, masteryLevel + streakBonus);
      }
      
      // Cap masteryLevel at 1.0 (100%)
      masteryLevel = Math.min(1, masteryLevel);
      
      // Return updated progress
      return {
        ...prev,
        [topicId]: {
          topicId,
          masteryLevel,
          totalAttempts,
          correctAnswers,
          lastAttemptDate: new Date().toISOString(),
          streakCount
        }
      };
    });
  };

  // Helper function to get progress for a specific topic
  const getTopicProgress = (topicId: string): TopicProgress | null => {
    return progressByTopic[topicId] || null;
  };

  const value = {
    progressByTopic,
    updateTopicProgress,
    topicsToReview,
    nextTopicsToLearn,
    refreshRecommendations,
    loadTopicsConfig: loadTopicsConfigMemoized,
    getTopicProgress,
    isInitialized
  };

  return (
    <FractionProgressContext.Provider value={value}>
      {children}
    </FractionProgressContext.Provider>
  );
}; 