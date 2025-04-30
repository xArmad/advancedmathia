"use client";

import React, { useState, useEffect } from 'react';
import { FractionType } from '@/types';
import { motion } from 'framer-motion';

interface FractionInputProps {
  onFractionChange: (fraction: FractionType) => void;
  initialFraction?: FractionType;
  label?: string;
  error?: string;
}

const FractionInput: React.FC<FractionInputProps> = ({
  onFractionChange,
  initialFraction = { numerator: 1, denominator: 2 },
  label = 'Your answer:',
  error
}) => {
  const [numerator, setNumerator] = useState<string>(initialFraction.numerator.toString());
  const [denominator, setDenominator] = useState<string>(initialFraction.denominator.toString());
  const [shakeAnimation, setShakeAnimation] = useState(false);

  useEffect(() => {
    // If numerator and denominator are valid numbers, call the change handler
    const numValue = parseInt(numerator);
    const denomValue = parseInt(denominator);
    
    if (!isNaN(numValue) && !isNaN(denomValue) && denomValue !== 0) {
      onFractionChange({ numerator: numValue, denominator: denomValue });
    }
  }, [numerator, denominator, onFractionChange]);

  // When error changes, trigger shake animation if there's an error
  useEffect(() => {
    if (error) {
      setShakeAnimation(true);
      const timer = setTimeout(() => setShakeAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleNumeratorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input (as the user might be typing) or valid numbers
    if (value === '' || /^-?\d+$/.test(value)) {
      setNumerator(value);
    }
  };

  const handleDenominatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive integers (or empty) for denominator
    if (value === '' || /^\d+$/.test(value)) {
      setDenominator(value);
    }
  };

  return (
    <div className="my-4">
      {label && <label className="block text-lg font-semibold mb-2">{label}</label>}
      
      <motion.div 
        className="flex items-center"
        animate={shakeAnimation ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          value={numerator}
          onChange={handleNumeratorChange}
          className={`w-16 h-16 text-center text-xl border-2 ${error ? 'border-red-500' : 'border-indigo-300'} rounded-md focus:outline-none focus:border-indigo-500`}
          aria-label="Numerator"
        />
        
        <div className="mx-1 h-0.5 w-16 bg-black"></div>
        
        <input
          type="text"
          value={denominator}
          onChange={handleDenominatorChange}
          className={`w-16 h-16 text-center text-xl border-2 ${error ? 'border-red-500' : 'border-indigo-300'} rounded-md focus:outline-none focus:border-indigo-500`}
          aria-label="Denominator"
        />
      </motion.div>
      
      {error && (
        <motion.p 
          className="text-red-500 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FractionInput; 