"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Buddy from './Buddy';
import FractionAnimation from './FractionAnimation';

interface Lesson {
  id: string;
  title: string;
  steps: LessonStep[];
}

interface LessonStep {
  id: string;
  message: string;
  buddyEmotion: 'happy' | 'teaching' | 'pointing' | 'excited' | 'encouraging' | 'surprised' | 'questioning';
  animation?: {
    numerator: number;
    denominator: number;
    type: 'introduction' | 'equivalent' | 'addition' | 'subtraction' | 'multiplication' | 'division' | 'comparison';
    interactive?: boolean;
  };
  userTask?: {
    type: 'select_parts' | 'input_fraction' | 'match_equivalent' | 'multiple_choice';
    data: any;
    correctAnswer: any;
  };
}

const lessons: Lesson[] = [
  {
    id: 'intro',
    title: 'Introduction to Fractions',
    steps: [
      {
        id: 'intro-1',
        message: "Hi there! I'm your Math Buddy. Today we're going to learn about fractions!",
        buddyEmotion: 'happy',
      },
      {
        id: 'intro-2',
        message: "A fraction represents a part of a whole. Like when you share a pizza with friends!",
        buddyEmotion: 'teaching',
        animation: {
          type: 'introduction',
          numerator: 1,
          denominator: 1
        }
      },
      {
        id: 'intro-3',
        message: "Let's see how we can divide something into 4 equal parts.",
        buddyEmotion: 'pointing',
        animation: {
          type: 'introduction',
          numerator: 4,
          denominator: 4
        }
      },
      {
        id: 'intro-4',
        message: "If you take 1 part, you've got 1/4 of the whole. The bottom number (4) is how many parts the whole is divided into.",
        buddyEmotion: 'teaching',
        animation: {
          type: 'introduction',
          numerator: 1,
          denominator: 4
        }
      },
      {
        id: 'intro-5',
        message: "The top number (1) tells us how many parts we're talking about.",
        buddyEmotion: 'pointing',
        animation: {
          type: 'introduction',
          numerator: 1,
          denominator: 4
        }
      },
      {
        id: 'intro-6',
        message: "If you take 2 parts, then you've got 2/4 of the whole!",
        buddyEmotion: 'excited',
        animation: {
          type: 'introduction',
          numerator: 2,
          denominator: 4
        }
      },
      {
        id: 'intro-7',
        message: "Now it's your turn! Try to select 3 parts out of 6 to create the fraction 3/6.",
        buddyEmotion: 'encouraging',
        animation: {
          type: 'introduction',
          numerator: 3,
          denominator: 6,
          interactive: true
        }
      },
    ]
  },
  {
    id: 'equivalent',
    title: 'Equivalent Fractions',
    steps: [
      {
        id: 'equiv-1',
        message: "Sometimes fractions can look different but actually represent the same amount!",
        buddyEmotion: 'happy',
      },
      {
        id: 'equiv-2',
        message: "Let's look at 1/2 (one half).",
        buddyEmotion: 'teaching',
        animation: {
          type: 'introduction',
          numerator: 1,
          denominator: 2
        }
      },
      {
        id: 'equiv-3',
        message: "Now let's see how 1/2 is equivalent to 2/4.",
        buddyEmotion: 'pointing',
        animation: {
          type: 'equivalent',
          numerator: 1,
          denominator: 2
        }
      },
      {
        id: 'equiv-4',
        message: "That means 1/2 and 2/4 are equivalent fractions! They represent the same portion of the whole.",
        buddyEmotion: 'excited',
        animation: {
          type: 'equivalent',
          numerator: 1,
          denominator: 2
        }
      },
      {
        id: 'equiv-5',
        message: "We can find more equivalent fractions. Let's see how 2/4 equals 3/6.",
        buddyEmotion: 'teaching',
        animation: {
          type: 'equivalent',
          numerator: 2,
          denominator: 4
        }
      },
    ]
  },
  {
    id: 'comparing',
    title: 'Comparing Fractions',
    steps: [
      {
        id: 'compare-1',
        message: "Now let's learn how to compare fractions to see which is larger!",
        buddyEmotion: 'happy',
      },
      {
        id: 'compare-2',
        message: "Let's compare 1/4 and 2/4. Which one do you think is larger?",
        buddyEmotion: 'questioning',
      },
      {
        id: 'compare-3',
        message: "Let's see them side by side!",
        buddyEmotion: 'teaching',
        animation: {
          type: 'comparison',
          numerator: 1,
          denominator: 4
        }
      },
      {
        id: 'compare-4',
        message: "When the denominators (bottom numbers) are the same, the fraction with the larger numerator (top number) is larger.",
        buddyEmotion: 'teaching',
      },
      {
        id: 'compare-5',
        message: "Now let's compare 1/2 and 1/4",
        buddyEmotion: 'pointing',
        animation: {
          type: 'comparison',
          numerator: 1,
          denominator: 2
        }
      },
      {
        id: 'compare-6',
        message: "When the numerators (top numbers) are the same, the fraction with the smaller denominator (bottom number) is larger.",
        buddyEmotion: 'teaching',
      },
    ]
  },
];

interface FractionsLearningModuleProps {
  onAnswerSubmit: (answer: FractionType | boolean, isCorrect: boolean) => void;
  currentQuestion: Question;
  showingLesson: boolean;
  currentLesson: LessonType | null;
}

export const FractionsLearningModule: React.FC<FractionsLearningModuleProps> = ({
  onAnswerSubmit,
  currentQuestion,
  showingLesson,
  currentLesson
}) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  
  const currentLesson = lessons[currentLessonIndex];
  const currentStep = currentLesson.steps[currentStepIndex];
  
  const handleNext = () => {
    if (currentStepIndex < currentLesson.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentStepIndex(0);
    }
  };
  
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setCurrentStepIndex(lessons[currentLessonIndex - 1].steps.length - 1);
    }
  };
  
  const handleAnimationComplete = () => {
    // Auto-advance if not interactive
    if (currentStep.animation && !currentStep.animation.interactive) {
      setTimeout(() => {
        if (currentStepIndex < currentLesson.steps.length - 1) {
          handleNext();
        }
      }, 2000);
    }
  };
  
  const isPreviousDisabled = currentLessonIndex === 0 && currentStepIndex === 0;
  const isNextDisabled = currentLessonIndex === lessons.length - 1 && 
                       currentStepIndex === currentLesson.steps.length - 1;

  return (
    <div className="fractions-learning-module max-w-5xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          {currentLesson.title}
        </h1>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-300 ease-in-out"
            style={{ 
              width: `${(currentStepIndex / (currentLesson.steps.length - 1)) * 100}%` 
            }}
          />
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 order-2 md:order-1">
          {currentStep.animation ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <FractionAnimation
                numerator={currentStep.animation.numerator}
                denominator={currentStep.animation.denominator}
                animationType={currentStep.animation.type}
                interactive={currentStep.animation.interactive}
                onComplete={handleAnimationComplete}
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-md p-6 flex items-center justify-center h-96">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl text-indigo-700 font-bold text-center"
              >
                {currentLesson.title}
              </motion.div>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/2 order-1 md:order-2">
          <div className="mb-8">
            <Buddy 
              message={currentStep.message} 
              emotion={currentStep.buddyEmotion}
            />
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={isPreviousDisabled}
              className={`px-6 py-2 rounded-lg font-medium ${
                isPreviousDisabled 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={isNextDisabled}
              className={`px-6 py-2 rounded-lg font-medium ${
                isNextDisabled 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-500">
        <p>
          Lesson {currentLessonIndex + 1} of {lessons.length} | 
          Step {currentStepIndex + 1} of {currentLesson.steps.length}
        </p>
      </div>
    </div>
  );
};

export default FractionsLearningModule; 