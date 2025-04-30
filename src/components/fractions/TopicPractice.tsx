"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FractionTopic, ProblemTemplate, ProblemType } from '@/types/problemTemplates';
import { useFractionProgress } from '@/contexts/FractionProgressContext';
import { loadProblemsForTopic } from '@/utils/problemManager';
import ProblemRenderer from './problems/ProblemRenderer';
import { motion } from 'framer-motion';

interface TopicPracticeProps {
  topic: FractionTopic;
  onComplete: () => void;
  minProblems?: number;
}

const TopicPractice: React.FC<TopicPracticeProps> = ({ topic, onComplete, minProblems = 5 }) => {
  const [problems, setProblems] = useState<ProblemTemplate[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [results, setResults] = useState<{problemId: string, correct: boolean}[]>([]);
  
  const { updateTopicProgress } = useFractionProgress();
  
  // Using useCallback to memoize the function
  const handleProblemSubmit = useCallback((correct: boolean) => {
    // Record the attempt in our progress context
    updateTopicProgress(topic, correct);
    
    // Update our results
    setResults(prev => [...prev, { problemId: problems[currentProblemIndex].id, correct }]);
    
    // Update correct count if needed
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }
    
    // Add a small delay so users can see the explanation
    setTimeout(() => {
      // If we've reached the end, show results
      if (currentProblemIndex === problems.length - 1) {
        setIsComplete(true);
      } else {
        // Otherwise, move to the next problem
        setCurrentProblemIndex(prev => prev + 1);
      }
    }, 1500); // 1.5 second delay
  }, [topic, updateTopicProgress, currentProblemIndex, problems]);
  
  // Load problems for this topic
  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        // Make sure we're only passing the topic ID string to the API
        const topicId = typeof topic === 'object' ? topic.id : topic;
        
        if (!topicId) {
          console.error('No topic ID provided');
          setProblems([]);
          setIsLoading(false);
          return;
        }
        
        const fetchedProblems = await loadProblemsForTopic(topicId as FractionTopic);
        setProblems(fetchedProblems);
        // Reset the practice session
        setCurrentProblemIndex(0);
        setIsComplete(false);
        setCorrectCount(0);
        setResults([]);
      } catch (error) {
        console.error(`Error loading problems for topic ${typeof topic === 'object' ? topic.id : topic}:`, error);
        setProblems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProblems();
  }, [topic]);
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // When there are no problems available
  if (!problems || problems.length === 0) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Problems Available</h3>
        <p className="text-yellow-700 mb-4">
          We couldn't find any practice problems for topic "{typeof topic === 'object' ? topic.title || topic.id : topic}". Please try another topic.
        </p>
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          onClick={onComplete}
        >
          Back to Topics
        </button>
      </div>
    );
  }
  
  // Show results when the session is complete
  if (isComplete) {
    const percentage = Math.round((correctCount / problems.length) * 100);
    const feedbackMessage = percentage >= 70 
      ? "Great job! You're making excellent progress."
      : "Keep practicing! You'll get better with more attempts.";
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">Practice Complete!</h2>
        
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#EEEEEE"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={percentage >= 70 ? "#4ADE80" : "#FCD34D"}
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
              {percentage}%
            </div>
          </div>
        </div>
        
        <p className="text-center text-gray-700 mb-6">{feedbackMessage}</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Results Summary</h3>
          <div className="flex justify-between">
            <span>Correct answers:</span>
            <span className="font-medium">{correctCount} of {problems.length}</span>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mr-3"
            onClick={onComplete}
          >
            Back to Topics
          </button>
          <button
            className="px-6 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
            onClick={() => {
              setCurrentProblemIndex(0);
              setIsComplete(false);
              setCorrectCount(0);
              setResults([]);
            }}
          >
            Practice Again
          </button>
        </div>
      </div>
    );
  }
  
  // Render the current problem
  const currentProblem = problems[currentProblemIndex];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-indigo-800">
            {problems[0]?.topicDisplayName || (typeof topic === 'object' ? topic.title : topic) || "Practice"}
          </h2>
          <div className="text-sm text-gray-500">
            Problem {currentProblemIndex + 1} of {problems.length}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-1.5 rounded-full mb-6">
          <div 
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentProblemIndex) / problems.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Current problem */}
        <ProblemRenderer
          problem={currentProblem}
          onAnswerSubmit={handleProblemSubmit}
          showHints={true}
        />
      </div>
    </motion.div>
  );
};

export default TopicPractice; 