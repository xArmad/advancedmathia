"use client";

import { useState, useCallback } from 'react';
import { LessonType, OperationType } from '@/types';

// Collection of interactive lessons for different operation types
const lessons: Record<OperationType, LessonType[]> = {
  addition: [
    {
      id: 'add-same-denominator',
      title: 'Adding Fractions with the Same Denominator',
      content: 'When adding fractions with the same denominator, you simply add the numerators and keep the same denominator.',
      examples: [
        {
          problem: '2/5 + 1/5',
          solution: '3/5',
          explanation: 'Add the numerators (2 + 1 = 3) and keep the denominator (5).'
        },
        {
          problem: '3/8 + 2/8',
          solution: '5/8',
          explanation: 'Add the numerators (3 + 2 = 5) and keep the denominator (8).'
        }
      ],
      relatedOperation: 'addition',
      visualAids: [
        'pie-chart-addition-same-denominator',
        'number-line-addition'
      ]
    },
    {
      id: 'add-different-denominator',
      title: 'Adding Fractions with Different Denominators',
      content: 'To add fractions with different denominators, we need to find a common denominator first. The easiest way is to use the least common multiple (LCM) of the denominators.',
      examples: [
        {
          problem: '1/3 + 1/4',
          solution: '7/12',
          explanation: 'First, find the LCM of 3 and 4, which is 12. Convert 1/3 to 4/12 and 1/4 to 3/12. Then add: 4/12 + 3/12 = 7/12.'
        },
        {
          problem: '2/5 + 1/2',
          solution: '9/10',
          explanation: 'The LCM of 5 and 2 is 10. Convert 2/5 to 4/10 and 1/2 to 5/10. Then add: 4/10 + 5/10 = 9/10.'
        }
      ],
      relatedOperation: 'addition',
      visualAids: [
        'fraction-bars-different-denominators',
        'interactive-lcm-finder'
      ]
    }
  ],
  subtraction: [
    {
      id: 'subtract-same-denominator',
      title: 'Subtracting Fractions with the Same Denominator',
      content: 'When subtracting fractions with the same denominator, subtract the numerators and keep the denominator the same.',
      examples: [
        {
          problem: '7/8 - 3/8',
          solution: '4/8 = 1/2',
          explanation: 'Subtract the numerators (7 - 3 = 4) and keep the denominator (8). Then simplify: 4/8 = 1/2.'
        },
        {
          problem: '5/6 - 1/6',
          solution: '4/6 = 2/3',
          explanation: 'Subtract the numerators (5 - 1 = 4) and keep the denominator (6). Then simplify: 4/6 = 2/3.'
        }
      ],
      relatedOperation: 'subtraction',
      visualAids: [
        'fraction-blocks-subtraction',
        'pie-chart-subtraction'
      ]
    },
    {
      id: 'subtract-different-denominator',
      title: 'Subtracting Fractions with Different Denominators',
      content: 'To subtract fractions with different denominators, find a common denominator first, then subtract the numerators.',
      examples: [
        {
          problem: '3/4 - 1/3',
          solution: '5/12',
          explanation: 'The LCM of 4 and 3 is 12. Convert 3/4 to 9/12 and 1/3 to 4/12. Then subtract: 9/12 - 4/12 = 5/12.'
        },
        {
          problem: '5/6 - 1/4',
          solution: '10/12 - 3/12 = 7/12',
          explanation: 'The LCM of 6 and 4 is 12. Convert 5/6 to 10/12 and 1/4 to 3/12. Then subtract: 10/12 - 3/12 = 7/12.'
        }
      ],
      relatedOperation: 'subtraction',
      visualAids: [
        'fraction-bars-subtraction',
        'number-line-subtraction'
      ]
    }
  ],
  multiplication: [
    {
      id: 'multiply-fractions',
      title: 'Multiplying Fractions',
      content: 'To multiply fractions, multiply the numerators together and multiply the denominators together. Then simplify if possible.',
      examples: [
        {
          problem: '2/3 × 3/4',
          solution: '6/12 = 1/2',
          explanation: 'Multiply numerators: 2 × 3 = 6. Multiply denominators: 3 × 4 = 12. Result: 6/12 simplifies to 1/2.'
        },
        {
          problem: '1/2 × 2/5',
          solution: '2/10 = 1/5',
          explanation: 'Multiply numerators: 1 × 2 = 2. Multiply denominators: 2 × 5 = 10. Result: 2/10 simplifies to 1/5.'
        }
      ],
      relatedOperation: 'multiplication',
      visualAids: [
        'area-model-multiplication',
        'grid-multiplication'
      ]
    }
  ],
  division: [
    {
      id: 'divide-fractions',
      title: 'Dividing Fractions',
      content: 'To divide by a fraction, multiply by its reciprocal (flip the second fraction).',
      examples: [
        {
          problem: '2/3 ÷ 1/4',
          solution: '2/3 × 4/1 = 8/3',
          explanation: 'To divide by 1/4, multiply by its reciprocal (4/1). So, 2/3 × 4/1 = 8/3.'
        },
        {
          problem: '3/4 ÷ 1/2',
          solution: '3/4 × 2/1 = 6/4 = 3/2',
          explanation: 'To divide by 1/2, multiply by its reciprocal (2/1). So, 3/4 × 2/1 = 6/4 = 3/2.'
        }
      ],
      relatedOperation: 'division',
      visualAids: [
        'reciprocal-visualization',
        'fraction-division-model'
      ]
    }
  ],
  simplification: [
    {
      id: 'simplify-fractions',
      title: 'Simplifying Fractions',
      content: 'To simplify a fraction, find the greatest common divisor (GCD) of the numerator and denominator, then divide both by the GCD.',
      examples: [
        {
          problem: 'Simplify 8/12',
          solution: '2/3',
          explanation: 'The GCD of 8 and 12 is 4. Divide both numbers by 4: 8 ÷ 4 = 2 and 12 ÷ 4 = 3. So, 8/12 = 2/3.'
        },
        {
          problem: 'Simplify 15/25',
          solution: '3/5',
          explanation: 'The GCD of 15 and 25 is 5. Divide both numbers by 5: 15 ÷ 5 = 3 and 25 ÷ 5 = 5. So, 15/25 = 3/5.'
        }
      ],
      relatedOperation: 'simplification',
      visualAids: [
        'divisor-finder',
        'simplification-animation'
      ]
    }
  ],
  comparison: [
    {
      id: 'compare-fractions',
      title: 'Comparing Fractions',
      content: 'To compare fractions with different denominators, convert them to equivalent fractions with a common denominator or convert them to decimals.',
      examples: [
        {
          problem: 'Which is larger: 2/3 or 3/5?',
          solution: '2/3 is larger',
          explanation: 'Convert to a common denominator of 15. 2/3 = 10/15 and 3/5 = 9/15. Since 10/15 > 9/15, 2/3 > 3/5.'
        },
        {
          problem: 'Which is smaller: 5/8 or 2/3?',
          solution: '5/8 is smaller',
          explanation: 'Convert to a common denominator of 24. 5/8 = 15/24 and 2/3 = 16/24. Since 15/24 < 16/24, 5/8 < 2/3.'
        }
      ],
      relatedOperation: 'comparison',
      visualAids: [
        'comparison-number-line',
        'decimal-conversion-tool'
      ]
    }
  ]
};

export const useInteractiveLessons = () => {
  const [currentLesson, setCurrentLesson] = useState<LessonType | null>(null);

  const getLesson = useCallback((operationType: OperationType, lessonId?: string): LessonType => {
    const availableLessons = lessons[operationType];
    
    if (lessonId) {
      const specificLesson = availableLessons.find(lesson => lesson.id === lessonId);
      if (specificLesson) {
        setCurrentLesson(specificLesson);
        return specificLesson;
      }
    }
    
    // If no specific lesson ID or not found, return the first lesson for that operation
    const defaultLesson = availableLessons[0];
    setCurrentLesson(defaultLesson);
    return defaultLesson;
  }, []);

  // Get a lesson for a specific struggling concept
  const getLessonForStrugglingConcept = useCallback((operationType: OperationType): LessonType => {
    const operationLessons = lessons[operationType];
    const randomIndex = Math.floor(Math.random() * operationLessons.length);
    const lesson = operationLessons[randomIndex];
    
    setCurrentLesson(lesson);
    return lesson;
  }, []);

  // Get all available lessons
  const getAllLessons = useCallback((): Record<OperationType, LessonType[]> => {
    return lessons;
  }, []);

  return { 
    currentLesson, 
    getLesson, 
    getLessonForStrugglingConcept, 
    getAllLessons 
  };
};

export default useInteractiveLessons; 