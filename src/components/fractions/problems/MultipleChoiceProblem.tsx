"use client";

import React, { useState, useEffect } from 'react';
import { MultipleChoiceProblem as MCProblem } from '@/types/problemTemplates';
import { motion } from 'framer-motion';

interface MultipleChoiceProblemProps {
  problem: MCProblem;
  onSubmit: (isCorrect: boolean) => void;
}

const MultipleChoiceProblem: React.FC<MultipleChoiceProblemProps> = ({ 
  problem, 
  onSubmit 
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset state when problem changes
  useEffect(() => {
    setSelectedIndex(null);
    setHasSubmitted(false);
  }, [problem.id]);

  const handleSelection = (index: number) => {
    if (hasSubmitted) return;
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null || hasSubmitted) return;
    
    const isCorrect = selectedIndex === problem.correctChoiceIndex;
    setHasSubmitted(true);
    onSubmit(isCorrect);
  };

  return (
    <div className="multiple-choice-problem">
      <div className="choices-container grid gap-3 mt-4 mb-6">
        {problem.choices.map((choice, index) => (
          <motion.div
            key={index}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition duration-200
              ${selectedIndex === index 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-indigo-300'
              }
              ${hasSubmitted && index === problem.correctChoiceIndex 
                ? 'border-green-500 bg-green-50' 
                : ''
              }
              ${hasSubmitted && selectedIndex === index && index !== problem.correctChoiceIndex 
                ? 'border-red-500 bg-red-50' 
                : ''
              }
            `}
            onClick={() => handleSelection(index)}
            whileHover={!hasSubmitted ? { scale: 1.02 } : {}}
            whileTap={!hasSubmitted ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center">
              <div className={`
                w-6 h-6 rounded-full mr-3 flex items-center justify-center text-sm font-semibold
                ${selectedIndex === index 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
                }
                ${hasSubmitted && index === problem.correctChoiceIndex 
                  ? 'bg-green-500 text-white' 
                  : ''
                }
                ${hasSubmitted && selectedIndex === index && index !== problem.correctChoiceIndex 
                  ? 'bg-red-500 text-white' 
                  : ''
                }
              `}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-gray-800">{choice}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          disabled={selectedIndex === null || hasSubmitted}
          className={`
            px-6 py-2 rounded-full font-semibold transition-all duration-200
            ${selectedIndex === null || hasSubmitted
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

export default MultipleChoiceProblem; 