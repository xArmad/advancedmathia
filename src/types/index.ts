export interface FractionType {
  numerator: number;
  denominator: number;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type OperationType = 
  | 'addition' 
  | 'subtraction' 
  | 'multiplication' 
  | 'division' 
  | 'simplification' 
  | 'comparison';

export type QuestionType = {
  id: string;
  operationType: OperationType;
  level: SkillLevel;
  fractions: FractionType[];
  correctAnswer: FractionType | boolean; // boolean for comparison questions
  userAnswer?: FractionType | boolean;
  isCorrect?: boolean;
  hints: string[];
};

export type StudentProgressType = {
  skillLevel: SkillLevel;
  masteredConcepts: OperationType[];
  strugglingConcepts: OperationType[];
  questionsAttempted: number;
  correctAnswers: number;
  streak: number;
};

export interface BuddyEmotion {
  happy: string;
  thinking: string;
  encouraging: string;
  explaining: string;
}

export interface LessonStepType {
  title: string;
  description: string;
  buddyMessage?: string;
  buddyEmotion?: keyof BuddyEmotion;
  operation?: OperationType;
  fractions?: FractionType[];
  expectedAnswer?: FractionType;
  showAnimation?: boolean;
}

export interface LessonType {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  steps: LessonStepType[];
} 