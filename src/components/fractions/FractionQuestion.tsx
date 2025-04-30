"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionType, FractionType, OperationType } from '@/types';
import FractionDisplay from './FractionDisplay';
import FractionInput from './FractionInput';
import { simplifyFraction, compareFractions } from '@/utils/fractionUtils';

interface FractionQuestionProps {
  question: QuestionType;
  onAnswerSubmit: (answer: FractionType | boolean, isCorrect: boolean) => void;
  showHints?: boolean;
}

const FractionQuestion: React.FC<FractionQuestionProps> = ({
  question,
  onAnswerSubmit,
  showHints = true
}) => {
  const [userAnswer, setUserAnswer] = useState<FractionType | boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);
  const [showingAnswerFeedback, setShowingAnswerFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setUserAnswer(null);
    setError(null);
    setActiveHintIndex(-1);
    setShowingAnswerFeedback(false);
    setIsCorrect(false);
  }, [question.id]);

  const handleFractionChange = (fraction: FractionType) => {
    setUserAnswer(fraction);
    setError(null);
  };

  const handleComparisonChange = (isFirstLarger: boolean) => {
    setUserAnswer(isFirstLarger);
    setError(null);
  };

  const handleSubmit = () => {
    if (userAnswer === null) {
      setError('Please provide an answer');
      return;
    }

    let correct = false;

    if (typeof question.correctAnswer === 'boolean' && typeof userAnswer === 'boolean') {
      // Comparison question
      correct = userAnswer === question.correctAnswer;
    } else if (typeof question.correctAnswer !== 'boolean' && typeof userAnswer !== 'boolean') {
      // Fraction operation question
      const simplifiedUserAnswer = simplifyFraction(userAnswer);
      const simplifiedCorrectAnswer = simplifyFraction(question.correctAnswer as FractionType);
      
      correct = (
        simplifiedUserAnswer.numerator === simplifiedCorrectAnswer.numerator && 
        simplifiedUserAnswer.denominator === simplifiedCorrectAnswer.denominator
      );
    }

    setIsCorrect(correct);
    setShowingAnswerFeedback(true);
    
    // Fire the callback to the parent component
    onAnswerSubmit(userAnswer, correct);
  };

  const showNextHint = () => {
    if (activeHintIndex < question.hints.length - 1) {
      setActiveHintIndex(currentIndex => currentIndex + 1);
    }
  };

  const getOperationSymbol = (operation: OperationType): string => {
    switch (operation) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      case 'division': return '÷';
      case 'simplification': return '=';
      case 'comparison': return '?';
      default: return '';
    }
  };

  // Render the operation based on question type
  const renderOperation = () => {
    const { operationType, fractions } = question;

    if (operationType === 'simplification') {
      return (
        <div className="flex items-center justify-center space-x-4">
          <FractionDisplay fraction={fractions[0]} size="large" animated />
          <span className="text-2xl font-bold">→ ?</span>
        </div>
      );
    }
    
    if (operationType === 'comparison') {
      return (
        <div className="flex items-center justify-center space-x-4">
          <FractionDisplay fraction={fractions[0]} size="large" animated />
          <div className="flex flex-col justify-center items-center">
            <button 
              className={`mb-2 px-4 py-2 rounded-full ${userAnswer === true ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
              onClick={() => handleComparisonChange(true)}
              aria-label="First fraction is greater"
            >
              &gt;
            </button>
            <button 
              className={`px-4 py-2 rounded-full ${userAnswer === false ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
              onClick={() => handleComparisonChange(false)}
              aria-label="Second fraction is greater or equal"
            >
              &lt;
            </button>
          </div>
          <FractionDisplay fraction={fractions[1]} size="large" animated />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-4">
        <FractionDisplay fraction={fractions[0]} size="large" animated />
        <span className="text-3xl font-bold">{getOperationSymbol(operationType)}</span>
        <FractionDisplay fraction={fractions[1]} size="large" animated />
        <span className="text-3xl font-bold">=</span>
        <div className="w-20">
          {!showingAnswerFeedback ? (
            <FractionInput 
              onFractionChange={handleFractionChange} 
              error={error || undefined}
            />
          ) : (
            <FractionDisplay 
              fraction={question.correctAnswer as FractionType} 
              color={isCorrect ? 'text-green-600' : 'text-red-600'}
              size="large"
              animated 
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="card max-w-3xl mx-auto p-6 my-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-6 text-center">
        {question.operationType === 'simplification' 
          ? 'Simplify this fraction to lowest terms'
          : question.operationType === 'comparison'
          ? 'Compare these fractions'
          : `Solve this ${question.operationType} problem`}
      </h2>

      {renderOperation()}

      {question.operationType === 'simplification' && !showingAnswerFeedback && (
        <div className="mt-6 flex justify-center">
          <FractionInput 
            onFractionChange={handleFractionChange} 
            error={error || undefined}
          />
        </div>
      )}

      {!showingAnswerFeedback ? (
        <div className="mt-6 flex justify-center">
          <button 
            onClick={handleSubmit}
            className="btn-primary"
          >
            Check Answer
          </button>
        </div>
      ) : (
        <motion.div 
          className={`mt-6 p-4 rounded-lg text-center ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Correct! Great job! 🎉' : 'Not quite right. Try again!'}
          </h3>
        </motion.div>
      )}

      {showHints && !isCorrect && (
        <div className="mt-4">
          <AnimatePresence>
            {activeHintIndex >= 0 && question.hints.slice(0, activeHintIndex + 1).map((hint, index) => (
              <motion.div 
                key={`hint-${index}-${question.id}`}
                className="bg-yellow-100 p-3 rounded-lg mb-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-yellow-800">💡 {hint}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {activeHintIndex < question.hints.length - 1 && (
            <button 
              onClick={showNextHint}
              className="text-indigo-600 underline mt-2"
            >
              Need a hint?
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default FractionQuestion; 