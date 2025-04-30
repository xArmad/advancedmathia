import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Buddy from './Buddy';
import FractionAnimation from './FractionAnimation';

interface LessonStep {
  id: number;
  title: string;
  message: string;
  emotion: 'happy' | 'teaching' | 'pointing' | 'excited' | 'encouraging' | 'surprised';
  numerator: number;
  denominator: number;
  animation: 'highlight' | 'divide' | 'select' | 'compare';
  interaction?: 'click' | 'select' | 'none';
  question?: string;
  answers?: string[];
  correctAnswer?: number;
}

const lessonSteps: LessonStep[] = [
  {
    id: 1,
    title: "Welcome to Fractions!",
    message: "Hi there! Today we're going to learn about fractions. Fractions help us talk about parts of a whole.",
    emotion: 'happy',
    numerator: 0,
    denominator: 1,
    animation: 'highlight'
  },
  {
    id: 2,
    title: "What is a Fraction?",
    message: "A fraction represents a part of a whole. Let's start by dividing our shape into equal parts.",
    emotion: 'teaching',
    numerator: 0,
    denominator: 4,
    animation: 'divide'
  },
  {
    id: 3,
    title: "Equal Parts",
    message: "See how our circle is divided into 4 equal parts? Each part is exactly the same size.",
    emotion: 'pointing',
    numerator: 0,
    denominator: 4,
    animation: 'divide'
  },
  {
    id: 4,
    title: "Selecting Parts",
    message: "Now, let's select 1 part. This gives us the fraction 1/4 (one-fourth).",
    emotion: 'excited',
    numerator: 1,
    denominator: 4,
    animation: 'highlight'
  },
  {
    id: 5,
    title: "Numerator and Denominator",
    message: "In a fraction, the number on top (1) is called the numerator. It tells us how many parts we're talking about.",
    emotion: 'teaching',
    numerator: 1,
    denominator: 4,
    animation: 'highlight'
  },
  {
    id: 6,
    title: "Understanding the Denominator",
    message: "The number at the bottom (4) is the denominator. It tells us the total number of equal parts in the whole.",
    emotion: 'teaching',
    numerator: 1,
    denominator: 4,
    animation: 'highlight'
  },
  {
    id: 7,
    title: "Try Another Fraction",
    message: "Let's try another fraction. If we select 3 parts out of 4, we get 3/4 (three-fourths).",
    emotion: 'encouraging',
    numerator: 3,
    denominator: 4,
    animation: 'highlight'
  },
  {
    id: 8,
    title: "Interactive Time!",
    message: "Now it's your turn. Click the parts of the circle to create your own fraction. Try to make 2/4.",
    emotion: 'excited',
    numerator: 0,
    denominator: 4,
    animation: 'select',
    interaction: 'click',
    question: "Can you create the fraction 2/4?",
    correctAnswer: 2
  },
  {
    id: 9,
    title: "Different Denominators",
    message: "Great job! We can divide our whole into different numbers of parts. Let's try 6 parts.",
    emotion: 'encouraging',
    numerator: 0,
    denominator: 6,
    animation: 'divide'
  },
  {
    id: 10,
    title: "More Parts",
    message: "With 6 parts, if we select 3, we get the fraction 3/6 (three-sixths).",
    emotion: 'pointing',
    numerator: 3,
    denominator: 6,
    animation: 'highlight'
  },
  {
    id: 11,
    title: "Equivalent Fractions",
    message: "Interesting! 3/6 and 1/2 are actually the same amount. These are called equivalent fractions.",
    emotion: 'surprised',
    numerator: 3,
    denominator: 6,
    animation: 'highlight'
  },
  {
    id: 12,
    title: "Understanding Equivalent Fractions",
    message: "Equivalent fractions represent the same portion of a whole, even though they look different.",
    emotion: 'teaching',
    numerator: 2,
    denominator: 4,
    animation: 'highlight'
  },
  {
    id: 13,
    title: "Congratulations!",
    message: "You've learned the basics of fractions! Practice by creating more fractions on your own.",
    emotion: 'happy',
    numerator: 1,
    denominator: 1,
    animation: 'highlight'
  }
];

const FractionLesson: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSlices, setSelectedSlices] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const step = lessonSteps[currentStep];
  
  const handleNext = () => {
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedSlices([]);
      setIsCorrect(null);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedSlices([]);
      setIsCorrect(null);
    }
  };
  
  const handleSliceClick = (index: number) => {
    // Only handle clicks if the current step has click interaction
    if (step.interaction !== 'click') return;
    
    // Toggle selection of the clicked slice
    if (selectedSlices.includes(index)) {
      setSelectedSlices(selectedSlices.filter(i => i !== index));
    } else {
      setSelectedSlices([...selectedSlices, index]);
    }
    
    // Check if this is a step with a correct answer to verify
    if (step.correctAnswer !== undefined) {
      // We'll check if the number of selected slices matches the correct answer
      const newSelected = selectedSlices.includes(index) 
        ? selectedSlices.filter(i => i !== index) 
        : [...selectedSlices, index];
        
      setIsCorrect(newSelected.length === step.correctAnswer);
    }
  };
  
  // Progress indicator
  const progress = ((currentStep + 1) / lessonSteps.length) * 100;
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <motion.div 
          className="bg-blue-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Title */}
      <motion.h2 
        className="text-2xl font-bold text-center mb-6"
        key={`title-${currentStep}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {step.title}
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side: Animation */}
        <div className="flex justify-center">
          <FractionAnimation 
            numerator={step.numerator}
            denominator={step.denominator}
            step={currentStep}
            animation={step.animation}
            onSliceClick={handleSliceClick}
            selectedSlices={selectedSlices}
          />
        </div>
        
        {/* Right side: Buddy and controls */}
        <div className="flex flex-col items-center">
          <Buddy 
            message={step.message} 
            emotion={step.emotion}
          />
          
          {/* Interactive elements for questions */}
          {step.question && (
            <motion.div 
              className="mt-6 p-4 bg-gray-100 rounded-lg w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-semibold mb-2">{step.question}</h3>
              
              {isCorrect === true && (
                <motion.div 
                  className="mt-2 p-2 bg-green-100 text-green-700 rounded"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Correct! You got it!
                </motion.div>
              )}
              
              {isCorrect === false && (
                <motion.div 
                  className="mt-2 p-2 bg-red-100 text-red-700 rounded"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Not quite. Keep trying!
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex justify-between w-full mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentStep === lessonSteps.length - 1 || (step.correctAnswer !== undefined && isCorrect !== true)}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === lessonSteps.length - 1 || (step.correctAnswer !== undefined && isCorrect !== true)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {currentStep === lessonSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractionLesson; 