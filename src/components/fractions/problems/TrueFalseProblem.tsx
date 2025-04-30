"use client";

import React, { useState } from 'react';
import { TrueFalseProblem as TFProblem } from '@/types/problemTemplates';
import { motion } from 'framer-motion';

interface TrueFalseProblemProps {
  problem: TFProblem;
  onSubmit: (isCorrect: boolean) => void;
}

const TrueFalseProblem: React.FC<TrueFalseProblemProps> = ({ problem, onSubmit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const handleSelection = (answer: boolean) => {
    if (hasSubmitted) return;
    setSelectedAnswer(answer);
  };
  
  const handleSubmit = () => {
    if (selectedAnswer === null || hasSubmitted) return;
    
    const isCorrect = selectedAnswer === problem.isTrue;
    setHasSubmitted(true);
    onSubmit(isCorrect);
  };
  
  return (
    <div className="true-false-problem">
      <div className="statement text-lg mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        {problem.statement}
      </div>
      
      <div className="choices-container grid grid-cols-2 gap-4 mt-6 mb-6">
        <motion.div
          className={`
            p-4 rounded-lg border-2 cursor-pointer text-center transition duration-200
            ${selectedAnswer === true
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-300'
            }
            ${hasSubmitted && problem.isTrue
              ? 'border-green-500 bg-green-50'
              : ''
            }
            ${hasSubmitted && selectedAnswer === true && !problem.isTrue
              ? 'border-red-500 bg-red-50'
              : ''
            }
          `}
          onClick={() => handleSelection(true)}
          whileHover={!hasSubmitted ? { scale: 1.03 } : {}}
          whileTap={!hasSubmitted ? { scale: 0.97 } : {}}
        >
          <span className="text-xl font-bold">True</span>
        </motion.div>
        
        <motion.div
          className={`
            p-4 rounded-lg border-2 cursor-pointer text-center transition duration-200
            ${selectedAnswer === false
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-300'
            }
            ${hasSubmitted && !problem.isTrue
              ? 'border-green-500 bg-green-50'
              : ''
            }
            ${hasSubmitted && selectedAnswer === false && problem.isTrue
              ? 'border-red-500 bg-red-50'
              : ''
            }
          `}
          onClick={() => handleSelection(false)}
          whileHover={!hasSubmitted ? { scale: 1.03 } : {}}
          whileTap={!hasSubmitted ? { scale: 0.97 } : {}}
        >
          <span className="text-xl font-bold">False</span>
        </motion.div>
      </div>
      
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null || hasSubmitted}
          className={`
            px-6 py-2 rounded-full font-semibold transition-all duration-200
            ${selectedAnswer === null || hasSubmitted
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }
          `}
        >
          {hasSubmitted ? 'Submitted' : 'Check Answer'}
        </button>
      </div>
    </div>
  );
};

export default TrueFalseProblem; 