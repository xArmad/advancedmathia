import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FractionAnimation from './FractionAnimation';
import Buddy from './Buddy';

// Define the lesson steps
const lessonSteps = [
  {
    id: 1,
    title: "Introduction to Fractions",
    message: "Hi! I'm your fraction buddy! Today we're going to learn about fractions. Fractions help us describe parts of a whole.",
    emotion: "happy",
    numerator: 0,
    denominator: 1,
    animation: false,
  },
  {
    id: 2,
    title: "What is a Fraction?",
    message: "A fraction has two parts: a numerator (top number) and a denominator (bottom number). The denominator tells us how many equal parts the whole is divided into.",
    emotion: "teaching",
    numerator: 0,
    denominator: 4,
    animation: true,
  },
  {
    id: 3,
    title: "The Denominator",
    message: "Let's look at this circle split into 4 equal parts. The denominator is 4, which means our whole is divided into 4 pieces.",
    emotion: "pointing",
    numerator: 0,
    denominator: 4,
    animation: true,
  },
  {
    id: 4,
    title: "The Numerator",
    message: "The numerator tells us how many parts we're talking about. If I select 1 part, we get the fraction 1/4 (one-fourth).",
    emotion: "teaching",
    numerator: 1,
    denominator: 4,
    animation: true,
    highlightSlices: [0],
  },
  {
    id: 5,
    title: "Another Example",
    message: "If I select 3 parts out of 4, we get the fraction 3/4 (three-fourths).",
    emotion: "excited",
    numerator: 3,
    denominator: 4,
    animation: true,
  },
  {
    id: 6,
    title: "Your Turn!",
    message: "Now it's your turn! Click on the circle to select parts and create your own fraction.",
    emotion: "encouraging",
    numerator: 0,
    denominator: 6,
    animation: true,
    interactive: true,
  },
  {
    id: 7,
    title: "Different Denominators",
    message: "We can divide our whole into any number of parts. Here's a circle divided into 8 equal parts.",
    emotion: "teaching",
    numerator: 0,
    denominator: 8,
    animation: true,
  },
  {
    id: 8,
    title: "Equivalent Fractions",
    message: "Did you know that 1/2 and 2/4 represent the same amount? These are called equivalent fractions!",
    emotion: "surprised",
    numerator: 2,
    denominator: 4,
    animation: true,
    extraContent: (
      <div className="mt-6">
        <FractionAnimation numerator={1} denominator={2} showNumbers={true} />
      </div>
    ),
  },
  {
    id: 9,
    title: "Congratulations!",
    message: "Great job learning about fractions today! You now know what numerators and denominators are, and how to read basic fractions.",
    emotion: "excited",
    numerator: 1,
    denominator: 1,
    animation: false,
  },
];

const FractionsLesson: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSlices, setSelectedSlices] = useState<number[]>([]);
  const [userNumerator, setUserNumerator] = useState(0);
  
  const step = lessonSteps[currentStep];
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedSlices([]);
      setUserNumerator(0);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedSlices([]);
      setUserNumerator(0);
    }
  };
  
  // Handle slice click for interactive steps
  const handleSliceClick = (index: number) => {
    setSelectedSlices(prev => {
      // If already selected, remove it
      if (prev.includes(index)) {
        const newSelected = prev.filter(i => i !== index);
        setUserNumerator(newSelected.length);
        return newSelected;
      } 
      // Otherwise add it
      else {
        const newSelected = [...prev, index];
        setUserNumerator(newSelected.length);
        return newSelected;
      }
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / (lessonSteps.length - 1)) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Buddy and message section */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
          
          <div className="mb-6">
            <Buddy message={step.message} emotion={step.emotion} />
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg ${
                currentStep === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-purple-200 hover:bg-purple-300'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNextStep}
              disabled={currentStep === lessonSteps.length - 1}
              className={`px-4 py-2 rounded-lg ${
                currentStep === lessonSteps.length - 1 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
        
        {/* Animation section */}
        <div className="md:w-1/2">
          {step.animation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              {step.interactive ? (
                <FractionAnimation
                  numerator={userNumerator}
                  denominator={step.denominator}
                  highlightSlices={selectedSlices}
                  onSliceClick={handleSliceClick}
                  interactive={true}
                  showNumbers={true}
                />
              ) : (
                <FractionAnimation
                  numerator={step.numerator}
                  denominator={step.denominator}
                  highlightSlices={step.highlightSlices || []}
                  showNumbers={true}
                />
              )}
              
              {step.interactive && (
                <div className="text-center mt-4">
                  <p className="text-lg font-medium">
                    Your fraction: {userNumerator}/{step.denominator}
                  </p>
                  {userNumerator > 0 && (
                    <p className="text-gray-600">
                      You've selected {userNumerator} out of {step.denominator} parts
                    </p>
                  )}
                </div>
              )}
              
              {step.extraContent && step.extraContent}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FractionsLesson; 