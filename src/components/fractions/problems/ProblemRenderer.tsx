"use client";

import React, { useState } from 'react';
import { FractionProblem } from '@/types/problemTemplates';
import MultipleChoiceProblem from './MultipleChoiceProblem';
import FillInBlankProblem from './FillInBlankProblem';
import InteractiveShapeProblem from './InteractiveShapeProblem';
import MatchEquivalentsProblem from './MatchEquivalentsProblem';
import OrderingProblem from './OrderingProblem';
import TrueFalseProblem from './TrueFalseProblem';
import { motion } from 'framer-motion';

interface ProblemRendererProps {
  problem: FractionProblem;
  onAnswerSubmit: (isCorrect: boolean) => void;
  showHints?: boolean;
}

const ProblemRenderer: React.FC<ProblemRendererProps> = ({ 
  problem, 
  onAnswerSubmit,
  showHints = false
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  
  const handleAnswerSubmit = (correct: boolean) => {
    setIsCorrect(correct);
    setShowExplanation(true);
    onAnswerSubmit(correct);
  };
  
  const showNextHint = () => {
    if (currentHintIndex < problem.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };
  
  const renderProblem = () => {
    switch (problem.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceProblem 
            problem={problem} 
            onSubmit={handleAnswerSubmit} 
          />
        );
      case 'fill_in_blank':
        return (
          <FillInBlankProblem 
            problem={problem} 
            onSubmit={handleAnswerSubmit} 
          />
        );
      case 'interactive_shape':
        return (
          <InteractiveShapeProblem 
            problem={problem} 
            onSubmit={handleAnswerSubmit} 
          />
        );
      case 'match_equivalents':
        return (
          <MatchEquivalentsProblem 
            problem={problem} 
            onSubmit={handleAnswerSubmit} 
          />
        );
      case 'ordering':
        return (
          <OrderingProblem 
            problem={problem} 
            onSubmit={handleAnswerSubmit} 
          />
        );
      case 'true_false':
        return (
          <TrueFalseProblem 
            problem={problem} 
            onSubmit={handleAnswerSubmit} 
          />
        );
      default:
        return <div>Unknown problem type</div>;
    }
  };
  
  return (
    <div className="problem-renderer bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
      <h3 className="text-xl font-bold text-indigo-800 mb-4">{problem.question}</h3>
      
      {renderProblem()}
      
      {/* Hints Section */}
      {showHints && problem.hints.length > 0 && !showExplanation && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Hint:</h4>
          <p className="text-blue-700">{problem.hints[currentHintIndex]}</p>
          
          {currentHintIndex < problem.hints.length - 1 && (
            <button
              onClick={showNextHint}
              className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Need another hint?
            </button>
          )}
        </div>
      )}
      
      {/* Explanation Section - shows after answering */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`mt-6 p-4 rounded-lg ${
            isCorrect ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <h4 className={`font-semibold mb-2 ${
            isCorrect ? 'text-green-800' : 'text-red-800'
          }`}>
            {isCorrect ? 'Great job!' : 'Not quite right'}
          </h4>
          <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
            {problem.explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProblemRenderer; 