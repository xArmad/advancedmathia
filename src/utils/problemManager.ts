"use client";

import { 
  FractionProblem, 
  FractionTopic,

  TopicProgress,
  TopicConfig,
  DifficultyLevel
} from "@/types/problemTemplates";

// Cache for problem data
let problemCache: Record<string, FractionProblem[]> = {};
let topicsConfig: TopicConfig[] = [];

/**
 * Loads problem data for a specific topic
 */
export const loadProblemsForTopic = async (topic: FractionTopic | string): Promise<FractionProblem[]> => {
  // Extract the topic ID if an object was passed
  const topicId = typeof topic === 'object' ? topic.id : String(topic);
  
  // Check cache first
  if (problemCache[topicId]) {
    return problemCache[topicId];
  }

  try {
    const response = await fetch(`/api/problems/${topicId}`);
    if (!response.ok) {
      console.error(`Failed to load problems for ${topicId}, status: ${response.status}`);
      return [];
    }
    
    const problems = await response.json();
    problemCache[topicId] = problems;
    return problems;
  } catch (error) {
    console.error(`Error loading problems for topic ${topicId}:`, error);
    return [];
  }
};

/**
 * Loads all topics configuration
 */
export const loadTopicsConfig = async (): Promise<TopicConfig[]> => {
  if (topicsConfig.length > 0) {
    return topicsConfig;
  }

  try {
    const response = await fetch('/api/topics/config');
    if (!response.ok) {
      throw new Error('Failed to load topics configuration');
    }
    
    const config = await response.json();
    topicsConfig = config;
    return config;
  } catch (error) {
    console.error('Error loading topics configuration:', error);
    return [];
  }
};

/**
 * Gets problems for a topic filtered by difficulty
 */
export const getProblemsForTopicByDifficulty = async (
  topic: FractionTopic, 
  difficulty?: DifficultyLevel
): Promise<FractionProblem[]> => {
  const problems = await loadProblemsForTopic(topic);
  
  if (!difficulty) {
    return problems;
  }
  
  return problems.filter(problem => problem.difficulty === difficulty);
};

/**
 * Gets problems for practice based on student's progress
 */
export const getProblemsForPractice = async (
  topic: FractionTopic,
  progress: TopicProgress
): Promise<FractionProblem[]> => {
  // Get all problems for the topic
  const allProblems = await loadProblemsForTopic(topic);
  
  // If mastery level is low, focus on easy problems
  if (progress.masteryLevel < 30) {
    return allProblems.filter(p => p.difficulty === 'easy');
  }
  
  // If mastery level is medium, mix easy and medium problems
  if (progress.masteryLevel < 70) {
    return allProblems.filter(p => p.difficulty === 'easy' || p.difficulty === 'medium');
  }
  
  // Otherwise, include all difficulty levels with emphasis on harder problems
  return allProblems;
};

/**
 * Gets topics that need review based on progress and review intervals
 */
export const getTopicsNeedingReview = async (
  progressByTopic: Record<FractionTopic, TopicProgress>
): Promise<FractionTopic[]> => {
  const config = await loadTopicsConfig();
  const topicsToReview: FractionTopic[] = [];
  
  for (const topicConfig of config) {
    const progress = progressByTopic[topicConfig.topic];
    
    // Skip if no progress exists or topic hasn't been practiced yet
    if (!progress || progress.problemsAttempted === 0) {
      continue;
    }
    
    // Check if topic needs review based on time since last practice
    const lastPracticed = new Date(progress.lastPracticed);
    const daysSinceLastPractice = Math.floor(
      (Date.now() - lastPracticed.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastPractice >= topicConfig.reviewInterval) {
      topicsToReview.push(topicConfig.topic);
    }
  }
  
  return topicsToReview;
};

/**
 * Gets the next topic(s) the student should learn based on prerequisites and current progress
 */
export const getNextTopicsToLearn = async (
  progressByTopic: Record<FractionTopic, TopicProgress>
): Promise<FractionTopic[]> => {
  const config = await loadTopicsConfig();
  const learnedTopics = Object.keys(progressByTopic)
    .filter(topic => {
      const progress = progressByTopic[topic as FractionTopic];
      return progress && progress.masteryLevel >= 70;
    }) as FractionTopic[];
  
  return config
    .filter(topicConfig => {
      // Skip if already learned
      if (learnedTopics.includes(topicConfig.topic)) {
        return false;
      }
      
      // Check if all prerequisites are satisfied
      return topicConfig.prerequisites.every(prereq => learnedTopics.includes(prereq));
    })
    .map(topic => topic.topic)
    .sort((a, b) => {
      const configA = config.find(t => t.topic === a);
      const configB = config.find(t => t.topic === b);
      return (configA?.recommendedOrder || 999) - (configB?.recommendedOrder || 999);
    });
};

/**
 * Updates the progress for a topic
 */
export const updateTopicProgress = async (
  topic: FractionTopic,
  problemId: string,
  isCorrect: boolean
): Promise<void> => {
  try {
    await fetch('/api/progress/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        problemId,
        isCorrect,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};

/**
 * Resets the problem cache
 */
export const resetProblemCache = (): void => {
  problemCache = {};
}; 