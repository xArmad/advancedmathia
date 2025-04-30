"use client";

import React from 'react';
import { OrderingProblem as OProblem } from '@/types/problemTemplates';

interface OrderingProblemProps {
  problem: OProblem;
  onSubmit: (isCorrect: boolean) => void;
}

// This is a placeholder component that will need to be implemented
const OrderingProblem: React.FC<OrderingProblemProps> = ({ problem, onSubmit }) => {
  return (
    <div className="ordering-problem p-4 bg-yellow-50 rounded-lg text-center">
      <p className="text-yellow-700">
        This problem type (ordering fractions) is not yet implemented. Please check back later!
      </p>
      
      <div className="flex justify-center mt-6">
        <button
          onClick={() => onSubmit(false)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default OrderingProblem; 