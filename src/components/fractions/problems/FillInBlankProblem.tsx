"use client";

import React, { useState, useEffect } from 'react';
import { FillInBlankProblem as FIBProblem } from '@/types/problemTemplates';

interface FillInBlankProblemProps {
  problem: FIBProblem;
  onSubmit: (isCorrect: boolean) => void;
}

// This is a stub implementation - you'll need to complete it
const FillInBlankProblem: React.FC<FillInBlankProblemProps> = ({ problem, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset state when problem changes
  useEffect(() => {
    setAnswers({});
    setHasSubmitted(false);
  }, [problem.id]);

  const handleAnswerChange = (blankId: string, value: string) => {
    if (hasSubmitted) return;
    
    setAnswers({
      ...answers,
      [blankId]: value
    });
  };

  const handleSubmit = () => {
    if (hasSubmitted) return;
    
    // Check if all blanks are filled
    const allFilled = problem.blanks.every(blank => 
      answers[blank.id] && answers[blank.id].trim() !== ''
    );
    
    if (!allFilled) return;
    
    // Check if all answers are correct
    const isCorrect = problem.blanks.every(blank => {
      const userAnswer = answers[blank.id].trim().toLowerCase();
      const correctAnswer = String(blank.correctValue).toLowerCase();
      return userAnswer === correctAnswer;
    });
    
    setHasSubmitted(true);
    onSubmit(isCorrect);
  };

  // Replace blanks with input fields
  const renderQuestion = () => {
    const questionParts = problem.question.split('_____');
    const result = [];
    
    for (let i = 0; i < questionParts.length; i++) {
      result.push(<span key={`text-${i}`}>{questionParts[i]}</span>);
      
      if (i < questionParts.length - 1 && i < problem.blanks.length) {
        const blank = problem.blanks[i];
        result.push(
          <input
            key={`input-${blank.id}`}
            type="text"
            value={answers[blank.id] || ''}
            onChange={(e) => handleAnswerChange(blank.id, e.target.value)}
            className={`
              mx-1 px-2 py-1 border-b-2 w-20 text-center focus:outline-none
              ${hasSubmitted ? 
                (answers[blank.id]?.trim().toLowerCase() === String(blank.correctValue).toLowerCase() 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50') 
                : 'border-indigo-300 focus:border-indigo-500'
              }
            `}
            disabled={hasSubmitted}
          />
        );
      }
    }
    
    return result;
  };

  return (
    <div className="fill-in-blank-problem">
      <div className="question text-lg mb-6">
        {renderQuestion()}
      </div>
      
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={
            hasSubmitted || 
            !problem.blanks.every(blank => answers[blank.id] && answers[blank.id].trim() !== '')
          }
          className={`
            px-6 py-2 rounded-full font-semibold transition-all duration-200
            ${hasSubmitted || !problem.blanks.every(blank => answers[blank.id] && answers[blank.id].trim() !== '')
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

export default FillInBlankProblem; 