import React, { useState, useCallback } from 'react';
import Buddy from './Buddy';
import FractionAnimation from './FractionAnimation';
import { motion } from 'framer-motion';

interface Fraction {
  numerator: number;
  denominator: number;
  color?: string;
}

interface LessonStep {
  message: string;
  emotion: string;
  fractions: Fraction[];
  operation?: string;
  result?: Fraction;
  showResult?: boolean;
  animationStep?: 'intro' | 'commonDenominator' | 'addition' | 'subtraction' | 'result';
  choices?: Array<{
    text: string;
    correct: boolean;
    feedback: string;
  }>;
}

interface LessonGuideProps {
  topic: 'intro' | 'addition' | 'subtraction' | 'multiplication' | 'division';
}

const LessonGuide: React.FC<LessonGuideProps> = ({ topic }) => {
  // Buddies' emotions
  const buddyEmotions: Record<string, string> = {
    neutral: '/images/buddy/neutral.png',
    happy: '/images/buddy/happy.png',
    excited: '/images/buddy/excited.png',
    thinking: '/images/buddy/thinking.png',
    explaining: '/images/buddy/explaining.png',
    confused: '/images/buddy/confused.png',
    worried: '/images/buddy/worried.png',
  };

  // Define lesson content based on topic
  const getLessonSteps = useCallback((): LessonStep[] => {
    switch (topic) {
      case 'intro':
        return [
          {
            message: "Hi there! I'm your fraction buddy. Today we're going to learn about fractions. A fraction represents a part of a whole.",
            emotion: 'happy',
            fractions: [],
          },
          {
            message: "Let's look at a simple fraction: 3/4. The top number (3) is called the numerator, and the bottom number (4) is the denominator.",
            emotion: 'explaining',
            fractions: [{ numerator: 3, denominator: 4, color: '#4F46E5' }],
          },
          {
            message: "The denominator (4) tells us how many equal parts the whole is divided into. The numerator (3) tells us how many of those parts we're talking about.",
            emotion: 'explaining',
            fractions: [{ numerator: 3, denominator: 4, color: '#4F46E5' }],
          },
          {
            message: "Let's try another example: 2/5. This means we have 2 out of 5 equal parts.",
            emotion: 'neutral',
            fractions: [{ numerator: 2, denominator: 5, color: '#10B981' }],
          },
          {
            message: "Can you tell me what the denominator is in this fraction?",
            emotion: 'thinking',
            fractions: [{ numerator: 2, denominator: 5, color: '#10B981' }],
            choices: [
              { text: "2", correct: false, feedback: "That's the numerator, which is on top. Let's try again!" },
              { text: "5", correct: true, feedback: "Correct! The denominator is 5, which means the whole is divided into 5 equal parts." },
            ]
          }
        ];
      
      case 'addition':
        return [
          {
            message: "Today we're going to learn how to add fractions. Let's start with a simple example.",
            emotion: 'excited',
            fractions: [],
          },
          {
            message: "Let's add 1/4 + 2/4. These fractions have the same denominator, which makes it easy!",
            emotion: 'explaining',
            fractions: [
              { numerator: 1, denominator: 4, color: '#4F46E5' },
              { numerator: 2, denominator: 4, color: '#10B981' }
            ],
            operation: '+',
          },
          {
            message: "When adding fractions with the same denominator, we add the numerators and keep the denominator the same.",
            emotion: 'explaining',
            fractions: [
              { numerator: 1, denominator: 4, color: '#4F46E5' },
              { numerator: 2, denominator: 4, color: '#10B981' }
            ],
            operation: '+',
            animationStep: 'addition',
          },
          {
            message: "So 1/4 + 2/4 = 3/4. We add 1 + 2 to get 3, and keep the denominator as 4.",
            emotion: 'happy',
            fractions: [
              { numerator: 1, denominator: 4, color: '#4F46E5' },
              { numerator: 2, denominator: 4, color: '#10B981' }
            ],
            operation: '+',
            result: { numerator: 3, denominator: 4, color: '#6D28D9' },
            showResult: true,
            animationStep: 'result',
          },
          {
            message: "Now, what if the denominators are different? Let's try 1/3 + 1/6.",
            emotion: 'thinking',
            fractions: [
              { numerator: 1, denominator: 3, color: '#4F46E5' },
              { numerator: 1, denominator: 6, color: '#10B981' }
            ],
            operation: '+',
          },
          {
            message: "First, we need to find a common denominator. The least common multiple of 3 and 6 is 6.",
            emotion: 'explaining',
            fractions: [
              { numerator: 1, denominator: 3, color: '#4F46E5' },
              { numerator: 1, denominator: 6, color: '#10B981' }
            ],
            operation: '+',
            animationStep: 'commonDenominator',
          },
          {
            message: "We convert 1/3 to 2/6 by multiplying both the numerator and denominator by 2.",
            emotion: 'explaining',
            fractions: [
              { numerator: 2, denominator: 6, color: '#4F46E5' },
              { numerator: 1, denominator: 6, color: '#10B981' }
            ],
            operation: '+',
          },
          {
            message: "Now we can add the numerators: 2/6 + 1/6 = 3/6, which simplifies to 1/2.",
            emotion: 'happy',
            fractions: [
              { numerator: 2, denominator: 6, color: '#4F46E5' },
              { numerator: 1, denominator: 6, color: '#10B981' }
            ],
            operation: '+',
            result: { numerator: 1, denominator: 2, color: '#6D28D9' },
            showResult: true,
            animationStep: 'result',
          }
        ];
      
      case 'subtraction':
        return [
          {
            message: "Let's learn how to subtract fractions. We'll start with an easy example.",
            emotion: 'excited',
            fractions: [],
          },
          {
            message: "Let's subtract 3/5 - 1/5. Since they have the same denominator, it's straightforward!",
            emotion: 'explaining',
            fractions: [
              { numerator: 3, denominator: 5, color: '#4F46E5' },
              { numerator: 1, denominator: 5, color: '#10B981' }
            ],
            operation: '-',
          },
          {
            message: "When subtracting fractions with the same denominator, we subtract the numerators and keep the denominator the same.",
            emotion: 'explaining',
            fractions: [
              { numerator: 3, denominator: 5, color: '#4F46E5' },
              { numerator: 1, denominator: 5, color: '#10B981' }
            ],
            operation: '-',
            animationStep: 'subtraction',
          },
          {
            message: "So 3/5 - 1/5 = 2/5. We subtract 1 from 3 to get 2, and keep the denominator as 5.",
            emotion: 'happy',
            fractions: [
              { numerator: 3, denominator: 5, color: '#4F46E5' },
              { numerator: 1, denominator: 5, color: '#10B981' }
            ],
            operation: '-',
            result: { numerator: 2, denominator: 5, color: '#6D28D9' },
            showResult: true,
            animationStep: 'result',
          },
          {
            message: "What about different denominators? Let's try 3/4 - 1/2.",
            emotion: 'thinking',
            fractions: [
              { numerator: 3, denominator: 4, color: '#4F46E5' },
              { numerator: 1, denominator: 2, color: '#10B981' }
            ],
            operation: '-',
          },
          {
            message: "Just like with addition, we need a common denominator. The least common multiple of 4 and 2 is 4.",
            emotion: 'explaining',
            fractions: [
              { numerator: 3, denominator: 4, color: '#4F46E5' },
              { numerator: 1, denominator: 2, color: '#10B981' }
            ],
            operation: '-',
            animationStep: 'commonDenominator',
          },
          {
            message: "We convert 1/2 to 2/4 by multiplying both the numerator and denominator by 2.",
            emotion: 'explaining',
            fractions: [
              { numerator: 3, denominator: 4, color: '#4F46E5' },
              { numerator: 2, denominator: 4, color: '#10B981' }
            ],
            operation: '-',
          },
          {
            message: "Now we can subtract: 3/4 - 2/4 = 1/4.",
            emotion: 'happy',
            fractions: [
              { numerator: 3, denominator: 4, color: '#4F46E5' },
              { numerator: 2, denominator: 4, color: '#10B981' }
            ],
            operation: '-',
            result: { numerator: 1, denominator: 4, color: '#6D28D9' },
            showResult: true,
            animationStep: 'result',
          }
        ];
        
      // Add other topics as needed
      default:
        return [
          {
            message: "Welcome to fraction lessons! Select a specific topic to get started.",
            emotion: 'neutral',
            fractions: [],
          }
        ];
    }
  }, [topic]);

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const lessonSteps = getLessonSteps();
  const currentLesson = lessonSteps[currentStep];

  const handleNextStep = () => {
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setFeedback('');
      setSelectedChoice(null);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setFeedback('');
      setSelectedChoice(null);
    }
  };

  const handleChoiceSelect = (choiceIndex: number) => {
    if (!currentLesson.choices) return;
    
    const choice = currentLesson.choices[choiceIndex];
    setSelectedChoice(choiceIndex);
    setFeedback(choice.feedback);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="flex flex-col items-center">
        {/* Animation Area */}
        <div className="w-full mb-8">
          <FractionAnimation
            fractions={currentLesson.fractions}
            operation={currentLesson.operation}
            result={currentLesson.result}
            showResult={currentLesson.showResult}
            step={currentLesson.animationStep}
          />
        </div>

        {/* Buddy Character */}
        <div className="w-full mb-8">
          <Buddy
            message={currentLesson.message}
            emotion={currentLesson.emotion}
            buddyEmotions={buddyEmotions}
          />
        </div>

        {/* Interactive Choices if available */}
        {currentLesson.choices && (
          <div className="w-full max-w-md mx-auto mt-6">
            <div className="grid grid-cols-1 gap-4">
              {currentLesson.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleChoiceSelect(index)}
                  className={`p-4 rounded-lg border-2 text-left font-medium ${
                    selectedChoice === index
                      ? choice.correct
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedChoice !== null}
                >
                  {choice.text}
                </motion.button>
              ))}
            </div>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg ${
                  selectedChoice !== null && currentLesson.choices && currentLesson.choices[selectedChoice].correct
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {feedback}
              </motion.div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between w-full max-w-md mt-8">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-full font-medium ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNextStep}
            disabled={currentStep === lessonSteps.length - 1 || (currentLesson.choices && selectedChoice === null)}
            className={`px-6 py-2 rounded-full font-medium ${
              currentStep === lessonSteps.length - 1 || (currentLesson.choices && selectedChoice === null)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonGuide; 