"use client";

import React, { useState } from 'react';
import { FractionTopic } from '@/types/problemTemplates';
import { FractionProgressProvider } from '@/contexts/FractionProgressContext';
import TopicSelection from './TopicSelection';
import TopicPractice from './TopicPractice';
import { motion, AnimatePresence } from 'framer-motion';

enum View {
  TOPICS,
  PRACTICE
}

const FractionsModule: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<FractionTopic | null>(null);
  
  const handleTopicSelect = (topic: FractionTopic) => {
    setSelectedTopic(topic);
    setCurrentView(View.PRACTICE);
  };
  
  const handlePracticeComplete = () => {
    setCurrentView(View.TOPICS);
  };
  
  return (
    <FractionProgressProvider>
      <div className="fractions-module max-w-6xl mx-auto p-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
            Learning Fractions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Master fractions through interactive practice and exercises. 
            Focus on areas where you need improvement and track your progress.
          </p>
        </header>
        
        <div className="main-content">
          <AnimatePresence mode="wait">
            {currentView === View.TOPICS && (
              <motion.div
                key="topics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TopicSelection onSelectTopic={handleTopicSelect} />
              </motion.div>
            )}
            
            {currentView === View.PRACTICE && selectedTopic && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="practice-header mb-6">
                  <button 
                    onClick={() => setCurrentView(View.TOPICS)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Topics
                  </button>
                </div>
                
                <TopicPractice 
                  topic={selectedTopic} 
                  onComplete={handlePracticeComplete}
                  minProblems={5}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </FractionProgressProvider>
  );
};

export default FractionsModule; 