"use client";

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FractionType, OperationType, QuestionType, SkillLevel } from '@/types';
import { 
  addFractions, 
  subtractFractions, 
  multiplyFractions, 
  divideFractions, 
  simplifyFraction,
  compareFractions
} from '@/utils/fractionUtils';

// Generate random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random fraction based on skill level
const generateRandomFraction = (level: SkillLevel): FractionType => {
  let numerator: number, denominator: number;

  switch (level) {
    case 'beginner':
      // Simple fractions with small numbers
      numerator = getRandomInt(1, 5);
      denominator = getRandomInt(2, 10);
      break;
    case 'intermediate':
      // More complex fractions, may include improper fractions
      numerator = getRandomInt(1, 12);
      denominator = getRandomInt(2, 16);
      break;
    case 'advanced':
      // Complex fractions with larger numbers
      numerator = getRandomInt(1, 25);
      denominator = getRandomInt(2, 30);
      break;
    default:
      numerator = getRandomInt(1, 5);
      denominator = getRandomInt(2, 10);
  }

  return { numerator, denominator };
};

// Get hints for different operation types
const getHints = (operationType: OperationType, fractions: FractionType[]): string[] => {
  switch (operationType) {
    case 'addition':
    case 'subtraction':
      return [
        'Find a common denominator first',
        'Multiply each fraction to get the same denominator',
        'Add (or subtract) the numerators, keeping the common denominator',
        'Simplify the result if possible'
      ];
    case 'multiplication':
      return [
        'Multiply the numerators together',
        'Multiply the denominators together',
        'Simplify the result if possible'
      ];
    case 'division':
      return [
        'To divide by a fraction, multiply by its reciprocal',
        'Flip the second fraction and multiply',
        'Simplify the result if possible'
      ];
    case 'simplification':
      return [
        'Find the greatest common divisor (GCD) of the numerator and denominator',
        'Divide both the numerator and denominator by the GCD',
        'Make sure your answer has the smallest possible numerator and denominator'
      ];
    case 'comparison':
      return [
        'Convert to a common denominator to compare easily',
        'The fraction with the larger numerator (when denominators are the same) is larger',
        'You can also convert both to decimals to compare'
      ];
    default:
      return ['Think step by step'];
  }
};

// Generate a question
const generateQuestion = (
  skillLevel: SkillLevel,
  focusOperations: OperationType[] = []
): QuestionType => {
  // Select operation type based on focus or random
  let operationType: OperationType;
  
  if (focusOperations.length > 0) {
    // Prioritize operations that need focus
    operationType = focusOperations[Math.floor(Math.random() * focusOperations.length)];
  } else {
    // Random operation selection
    const operations: OperationType[] = ['addition', 'subtraction', 'multiplication', 'division', 'simplification', 'comparison'];
    
    // Adjust probabilities based on skill level
    let availableOperations: OperationType[] = [];
    
    if (skillLevel === 'beginner') {
      availableOperations = ['addition', 'subtraction', 'simplification'];
    } else if (skillLevel === 'intermediate') {
      availableOperations = ['addition', 'subtraction', 'multiplication', 'simplification', 'comparison'];
    } else {
      availableOperations = operations;
    }
    
    operationType = availableOperations[Math.floor(Math.random() * availableOperations.length)];
  }

  // Generate fractions based on operation type and skill level
  let fractions: FractionType[] = [];
  let correctAnswer: FractionType | boolean;

  switch (operationType) {
    case 'addition':
    case 'subtraction':
    case 'multiplication':
    case 'division':
      fractions = [generateRandomFraction(skillLevel), generateRandomFraction(skillLevel)];
      
      // Make sure we don't divide by zero for division operations
      if (operationType === 'division' && fractions[1].numerator === 0) {
        fractions[1].numerator = getRandomInt(1, 5);
      }
      
      // Compute the correct answer
      if (operationType === 'addition') {
        correctAnswer = addFractions(fractions[0], fractions[1]);
      } else if (operationType === 'subtraction') {
        correctAnswer = subtractFractions(fractions[0], fractions[1]);
      } else if (operationType === 'multiplication') {
        correctAnswer = multiplyFractions(fractions[0], fractions[1]);
      } else {
        correctAnswer = divideFractions(fractions[0], fractions[1]);
      }
      break;
      
    case 'simplification':
      // Create an unsimplified fraction
      const base = generateRandomFraction(skillLevel);
      const multiplier = getRandomInt(2, skillLevel === 'beginner' ? 3 : (skillLevel === 'intermediate' ? 5 : 10));
      
      fractions = [{
        numerator: base.numerator * multiplier,
        denominator: base.denominator * multiplier
      }];
      
      correctAnswer = simplifyFraction(fractions[0]);
      break;
      
    case 'comparison':
      fractions = [generateRandomFraction(skillLevel), generateRandomFraction(skillLevel)];
      
      // Make sure they're not equal for beginners to avoid confusion
      if (skillLevel === 'beginner') {
        while (compareFractions(fractions[0], fractions[1]) === 0) {
          fractions[1] = generateRandomFraction(skillLevel);
        }
      }
      
      correctAnswer = compareFractions(fractions[0], fractions[1]) > 0;
      break;
      
    default:
      fractions = [generateRandomFraction(skillLevel)];
      correctAnswer = simplifyFraction(fractions[0]);
  }

  return {
    id: uuidv4(),
    operationType,
    level: skillLevel,
    fractions,
    correctAnswer,
    hints: getHints(operationType, fractions)
  };
};

export const useAdaptiveQuestions = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);

  const generateNewQuestion = useCallback((
    skillLevel: SkillLevel, 
    struggleConcepts: OperationType[] = [],
    masteredConcepts: OperationType[] = []
  ) => {
    // Focus on concepts the student is struggling with
    const focusOperations = [...struggleConcepts];
    
    // Sometimes introduce mastered concepts to reinforce them
    if (masteredConcepts.length > 0 && Math.random() < 0.3) {
      const randomMastered = masteredConcepts[Math.floor(Math.random() * masteredConcepts.length)];
      focusOperations.push(randomMastered);
    }
    
    // If there's nothing to focus on, the generator will select a random operation
    const newQuestion = generateQuestion(skillLevel, focusOperations);
    setCurrentQuestion(newQuestion);
    return newQuestion;
  }, []);

  return { currentQuestion, generateNewQuestion };
};

export default useAdaptiveQuestions; 