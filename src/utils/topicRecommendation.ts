"use client";

import { FractionTopic, TopicProgress } from "@/types/problemTemplates";
import { loadTopicsConfig } from './problemManager';

/**
 * Gets topics that need review based on progress and time elapsed
 */
export const getTopicsNeedingReview = async (
  progressByTopic: Record<string, TopicProgress>
): Promise<string[]> => {
  const config = await loadTopicsConfig();
  const topicsToReview: string[] = [];
  
  for (const topicConfig of config) {
    const topicId = topicConfig.id || topicConfig.topic;
    const progress = progressByTopic[topicId];
    
    // Skip if no progress exists or topic hasn't been attempted yet
    if (!progress || progress.totalAttempts === 0) {
      continue;
    }
    
    // Check if topic needs review based on time since last practice
    // and the current mastery level
    const lastAttempt = progress.lastAttemptDate ? new Date(progress.lastAttemptDate) : null;
    
    if (!lastAttempt) continue;
    
    const daysSinceLastAttempt = Math.floor(
      (Date.now() - lastAttempt.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Topics with lower mastery need more frequent review
    const reviewInterval = progress.masteryLevel < 0.5 ? 2 : 
                          progress.masteryLevel < 0.8 ? 5 : 10;
    
    if (daysSinceLastAttempt >= reviewInterval && progress.masteryLevel < 0.95) {
      topicsToReview.push(topicId);
    }
  }
  
  return topicsToReview;
};

/**
 * Gets the next topic(s) the student should learn based on prerequisites and current progress
 */
export const getNextTopicsToLearn = async (
  progressByTopic: Record<string, TopicProgress>
): Promise<string[]> => {
  const config = await loadTopicsConfig();
  const masteredTopics = Object.keys(progressByTopic)
    .filter(topicId => {
      const progress = progressByTopic[topicId];
      return progress && progress.masteryLevel >= 0.7;
    });
  
  return config
    .filter(topicConfig => {
      const topicId = topicConfig.id || topicConfig.topic;
      
      // Skip if already mastered
      if (masteredTopics.includes(topicId)) {
        return false;
      }
      
      // Check if all prerequisites are satisfied
      if (topicConfig.prerequisites && Array.isArray(topicConfig.prerequisites)) {
        return topicConfig.prerequisites.every(prereq => masteredTopics.includes(prereq));
      }
      
      // If no prerequisites or not an array, consider it available
      return true;
    })
    .map(topicConfig => topicConfig.id || topicConfig.topic)
    .slice(0, 3); // Return top 3 recommended topics
}; 