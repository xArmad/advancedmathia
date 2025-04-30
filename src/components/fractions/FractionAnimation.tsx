"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FractionAnimationProps {
  numerator: number;
  denominator: number;
  animationType: 'introduction' | 'equivalent' | 'addition' | 'subtraction' | 'multiplication' | 'division' | 'comparison';
  onComplete?: () => void;
  interactive?: boolean;
}

const FractionAnimation: React.FC<FractionAnimationProps> = ({
  numerator,
  denominator,
  animationType,
  onComplete,
  interactive = false
}) => {
  const [animationStage, setAnimationStage] = useState(0);
  const [selectedParts, setSelectedParts] = useState<number[]>([]);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  
  // Determine colors based on animation type
  const getColors = () => {
    switch(animationType) {
      case 'introduction':
        return { primary: '#06D6A0', secondary: '#EF476F' };
      case 'equivalent':
        return { primary: '#118AB2', secondary: '#FFD166' };
      case 'addition':
        return { primary: '#073B4C', secondary: '#06D6A0' };
      case 'subtraction':
        return { primary: '#EF476F', secondary: '#FFD166' };
      case 'multiplication':
        return { primary: '#118AB2', secondary: '#06D6A0' };
      case 'division':
        return { primary: '#073B4C', secondary: '#EF476F' };
      case 'comparison':
        return { primary: '#FFD166', secondary: '#118AB2' };
      default:
        return { primary: '#06D6A0', secondary: '#EF476F' };
    }
  };
  
  const colors = getColors();

  useEffect(() => {
    if (!interactive && animationStage < 3) {
      const timer = setTimeout(() => {
        setAnimationStage(prev => prev + 1);
      }, 1200);
      
      return () => clearTimeout(timer);
    }
    
    if (animationStage === 3 && !isAnimationComplete) {
      setIsAnimationComplete(true);
      if (onComplete) onComplete();
    }
  }, [animationStage, interactive, isAnimationComplete, onComplete]);

  const handlePartClick = (index: number) => {
    if (!interactive) return;
    
    if (selectedParts.includes(index)) {
      setSelectedParts(selectedParts.filter(i => i !== index));
    } else if (selectedParts.length < numerator) {
      setSelectedParts([...selectedParts, index]);
    }
    
    // If correct number of parts selected
    if (selectedParts.length === numerator - 1) {
      setTimeout(() => {
        setAnimationStage(prev => prev + 1);
      }, 500);
    }
  };

  // Generate parts for the fraction visualization
  const renderFractionParts = () => {
    const parts = [];
    
    for (let i = 0; i < denominator; i++) {
      const isSelected = selectedParts.includes(i) || (!interactive && i < numerator && animationStage >= 2);
      const partStyle = {
        backgroundColor: isSelected ? colors.secondary : colors.primary,
        transition: 'background-color 0.3s ease'
      };
      
      parts.push(
        <motion.div
          key={i}
          className="fraction-part relative"
          style={{
            ...partStyle,
            width: `${100 / denominator}%`,
            height: '100%',
            display: 'inline-block',
            borderRadius: '4px',
            margin: '0 1px'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: animationStage >= 1 ? 1 : 0,
            scale: animationStage >= 1 ? 1 : 0.8 
          }}
          transition={{ 
            duration: 0.5,
            delay: i * 0.05 
          }}
          onClick={() => handlePartClick(i)}
        >
          {interactive && (
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer text-white font-bold">
              {i + 1}
            </div>
          )}
        </motion.div>
      );
    }
    
    return parts;
  };

  // Render different animations based on type
  const renderAnimation = () => {
    switch(animationType) {
      case 'introduction':
        return (
          <div className="w-full">
            <motion.div
              className="mb-8 flex justify-center items-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationStage >= 0 ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="text-6xl font-bold mx-4"
                initial={{ scale: 0.5 }}
                animate={{ scale: animationStage >= 0 ? 1 : 0.5 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                {numerator}
              </motion.div>
              <motion.div
                className="w-0.5 h-16 bg-black mx-2"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: animationStage >= 1 ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
              <motion.div
                className="text-6xl font-bold mx-4"
                initial={{ scale: 0.5 }}
                animate={{ scale: animationStage >= 1 ? 1 : 0.5 }}
                transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
              >
                {denominator}
              </motion.div>
            </motion.div>
            
            <div className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden flex">
              {renderFractionParts()}
            </div>
            
            <motion.div
              className="mt-8 text-center text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: animationStage >= 3 ? 1 : 0,
                y: animationStage >= 3 ? 0 : 20
              }}
              transition={{ duration: 0.5 }}
            >
              {numerator}/{denominator} means {numerator} parts out of {denominator} equal parts
            </motion.div>
          </div>
        );
        
      case 'equivalent':
        // First fraction
        const firstFraction = (
          <div className="w-full h-16 bg-gray-100 rounded-lg overflow-hidden flex mb-6">
            {renderFractionParts()}
          </div>
        );
        
        // Second fraction (with double the parts for showing equivalence)
        const secondFractionParts = [];
        const doubledDenominator = denominator * 2;
        const doubledNumerator = numerator * 2;
        
        for (let i = 0; i < doubledDenominator; i++) {
          const isSelected = i < doubledNumerator && animationStage >= 3;
          
          secondFractionParts.push(
            <motion.div
              key={i}
              style={{
                backgroundColor: isSelected ? colors.secondary : colors.primary,
                width: `${100 / doubledDenominator}%`,
                height: '100%',
                display: 'inline-block',
                borderRadius: '4px',
                margin: '0 1px'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: animationStage >= 2 ? 1 : 0,
                scale: animationStage >= 2 ? 1 : 0.8 
              }}
              transition={{ 
                duration: 0.5,
                delay: i * 0.03 
              }}
            />
          );
        }
        
        return (
          <div className="w-full">
            <motion.div
              className="mb-4 text-center text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationStage >= 0 ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              {numerator}/{denominator} = {numerator * 2}/{denominator * 2}
            </motion.div>
            
            {firstFraction}
            
            <div className="w-full h-16 bg-gray-100 rounded-lg overflow-hidden flex">
              {secondFractionParts}
            </div>
            
            <motion.div
              className="mt-8 text-center text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: animationStage >= 3 ? 1 : 0,
                y: animationStage >= 3 ? 0 : 20
              }}
              transition={{ duration: 0.5 }}
            >
              When we multiply both top and bottom by the same number, the fraction value stays the same
            </motion.div>
          </div>
        );
        
      case 'comparison':
        // Comparison animation with two fractions side by side
        return (
          <div className="w-full">
            <motion.div
              className="mb-4 text-center text-xl flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationStage >= 0 ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-2xl font-bold">{numerator}/{denominator}</span>
              <span className="mx-4">vs</span>
              <span className="text-2xl font-bold">{Math.min(numerator + 1, denominator)}/{denominator}</span>
            </motion.div>
            
            <div className="flex space-x-4">
              <div className="w-1/2">
                <div className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden flex">
                  {/* First fraction */}
                  {Array.from({ length: denominator }).map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        backgroundColor: i < numerator ? colors.secondary : colors.primary,
                        width: `${100 / denominator}%`,
                        height: '100%',
                        display: 'inline-block',
                        borderRadius: '4px',
                        margin: '0 1px'
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: animationStage >= 1 ? 1 : 0,
                        scale: animationStage >= 1 ? 1 : 0.8 
                      }}
                      transition={{ 
                        duration: 0.5,
                        delay: i * 0.05 
                      }}
                    />
                  ))}
                </div>
                <motion.div
                  className="mt-2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animationStage >= 2 ? 1 : 0 }}
                >
                  {numerator}/{denominator}
                </motion.div>
              </div>
              
              <div className="w-1/2">
                <div className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden flex">
                  {/* Second fraction */}
                  {Array.from({ length: denominator }).map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        backgroundColor: i < Math.min(numerator + 1, denominator) ? colors.secondary : colors.primary,
                        width: `${100 / denominator}%`,
                        height: '100%',
                        display: 'inline-block',
                        borderRadius: '4px',
                        margin: '0 1px'
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: animationStage >= 1 ? 1 : 0,
                        scale: animationStage >= 1 ? 1 : 0.8 
                      }}
                      transition={{ 
                        duration: 0.5,
                        delay: i * 0.05 + 0.3
                      }}
                    />
                  ))}
                </div>
                <motion.div
                  className="mt-2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animationStage >= 2 ? 1 : 0 }}
                >
                  {Math.min(numerator + 1, denominator)}/{denominator}
                </motion.div>
              </div>
            </div>
            
            <motion.div
              className="mt-8 text-center text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: animationStage >= 3 ? 1 : 0,
                y: animationStage >= 3 ? 0 : 20
              }}
              transition={{ duration: 0.5 }}
            >
              {numerator}/{denominator} {numerator < Math.min(numerator + 1, denominator) ? '<' : '='} {Math.min(numerator + 1, denominator)}/{denominator}
            </motion.div>
          </div>
        );
        
      default:
        return (
          <div className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden flex">
            {renderFractionParts()}
          </div>
        );
    }
  };

  return (
    <div className="fraction-animation-container w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {renderAnimation()}
      
      {interactive && (
        <div className="mt-4 text-center text-gray-600">
          {selectedParts.length < numerator ? 
            `Click to select ${numerator} parts out of ${denominator}` : 
            'Great! You selected the right amount.'}
        </div>
      )}
    </div>
  );
};

export default FractionAnimation; 