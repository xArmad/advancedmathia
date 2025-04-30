"use client";

import React from 'react';
import { FractionType } from '@/types';
import { motion } from 'framer-motion';

interface FractionDisplayProps {
  fraction: FractionType;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

const FractionDisplay: React.FC<FractionDisplayProps> = ({
  fraction,
  color = 'text-indigo-600',
  size = 'medium',
  animated = false
}) => {
  const textSizeClass = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  }[size];

  const MotionComponent = animated ? motion.div : 'div';
  
  // Determine if this is a whole number
  const isWholeNumber = fraction.denominator === 1;

  if (isWholeNumber) {
    return (
      <MotionComponent 
        className={`font-bold ${color} ${textSizeClass}`}
        {...(animated ? {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.3 }
        } : {})}
      >
        {fraction.numerator}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent 
      className={`fraction-display ${color} ${textSizeClass}`}
      {...(animated ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.3 }
      } : {})}
    >
      <div className="fraction-numerator">{fraction.numerator}</div>
      <div className="fraction-line"></div>
      <div className="fraction-denominator">{fraction.denominator}</div>
    </MotionComponent>
  );
};

export default FractionDisplay; 