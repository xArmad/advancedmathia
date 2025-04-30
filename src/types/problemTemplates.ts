export type ProblemType = 
  | 'multiple_choice'
  | 'fill_in_blank'
  | 'interactive_shape' 
  | 'match_equivalents'
  | 'ordering'
  | 'true_false';

export type FractionTopic = 
  | 'introduction'
  | 'representation'
  | 'equivalent_fractions'
  | 'simplification'
  | 'comparison'
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'mixed_numbers'
  | 'decimals';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type ShapeType = 'circle' | 'rectangle' | 'number_line' | 'set';

export interface FractionValue {
  numerator: number;
  denominator: number;
  mixedWhole?: number; // For mixed numbers e.g., 1 2/3
}

export interface ProblemTemplate {
  id: string;
  topic: FractionTopic;
  subTopic?: string;
  type: ProblemType;
  difficulty: DifficultyLevel;
  question: string;
  explanation: string;
  hints: string[];
  visualAids?: {
    type: ShapeType;
    interactive?: boolean;
    colors?: {
      primary: string;
      secondary: string;
    }
  };
}

export interface MultipleChoiceProblem extends ProblemTemplate {
  type: 'multiple_choice';
  choices: string[];
  correctChoiceIndex: number;
}

export interface FillInBlankProblem extends ProblemTemplate {
  type: 'fill_in_blank';
  blanks: {
    id: string;
    correctValue: string | number;
  }[];
}

export interface InteractiveShapeProblem extends ProblemTemplate {
  type: 'interactive_shape';
  fractions: FractionValue[];
  totalParts: number;
  correctParts: number[];
}

export interface MatchEquivalentsProblem extends ProblemTemplate {
  type: 'match_equivalents';
  pairs: {
    left: FractionValue;
    right: FractionValue;
  }[];
}

export interface OrderingProblem extends ProblemTemplate {
  type: 'ordering';
  fractions: FractionValue[];
  correctOrder: number[]; // indices of fractions in correct order
}

export interface TrueFalseProblem extends ProblemTemplate {
  type: 'true_false';
  statement: string;
  isTrue: boolean;
}

export type FractionProblem = 
  | MultipleChoiceProblem
  | FillInBlankProblem
  | InteractiveShapeProblem
  | MatchEquivalentsProblem
  | OrderingProblem
  | TrueFalseProblem;

export interface TopicProgress {
  topic: FractionTopic;
  problemsAttempted: number;
  problemsCorrect: number;
  masteryLevel: number; // 0-100
  lastPracticed: string; // ISO date string
  needsReview: boolean;
}

export interface TopicConfig {
  topic: FractionTopic;
  displayName: string;
  description: string;
  recommendedOrder: number;
  prerequisites: FractionTopic[];
  reviewInterval: number; // in days
  mastery: {
    easy: number; // number of correct problems needed for mastery
    medium: number;
    hard: number;
  };
} 