"use client";

import React, { useState, useEffect } from 'react';
import { InteractiveShapeProblem as ISProblem } from '@/types/problemTemplates';
import { motion } from 'framer-motion';

interface InteractiveShapeProblemProps {
  problem: ISProblem;
  onSubmit: (isCorrect: boolean) => void;
}

// This is a stub implementation - you'll need to complete it
const InteractiveShapeProblem: React.FC<InteractiveShapeProblemProps> = ({ problem, onSubmit }) => {
  const [selectedParts, setSelectedParts] = useState<number[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Reset state when problem changes
  useEffect(() => {
    setSelectedParts([]);
    setHasSubmitted(false);
  }, [problem.id]);
  
  const handlePartClick = (index: number) => {
    if (hasSubmitted) return;
    
    // Toggle selection
    if (selectedParts.includes(index)) {
      setSelectedParts(selectedParts.filter(i => i !== index));
    } else {
      setSelectedParts([...selectedParts, index]);
    }
  };
  
  const handleSubmit = () => {
    if (hasSubmitted) return;
    
    // Check if the selected parts match the correct parts
    // We need to sort both arrays to compare them properly
    const sortedSelected = [...selectedParts].sort((a, b) => a - b);
    const sortedCorrect = [...problem.correctParts].sort((a, b) => a - b);
    
    const isCorrect = 
      sortedSelected.length === sortedCorrect.length && 
      sortedSelected.every((val, index) => val === sortedCorrect[index]);
    
    setHasSubmitted(true);
    onSubmit(isCorrect);
  };
  
  // Render different shapes based on problem configuration
  const renderShape = () => {
    const { totalParts, visualAids } = problem;
    const type = visualAids?.type || 'rectangle';
    const colors = visualAids?.colors || { 
      primary: '#ffd166', // Light yellow default for unselected parts 
      secondary: '#118ab2' // Blue default for selected parts
    };
    
    // For rectangle shape
    if (type === 'rectangle') {
      return (
        <div className="w-full h-32 flex bg-gray-100 rounded-lg overflow-hidden">
          {Array.from({ length: totalParts }).map((_, index) => {
            const isSelected = selectedParts.includes(index);
            const isCorrect = hasSubmitted && problem.correctParts.includes(index);
            const isIncorrect = hasSubmitted && isSelected && !problem.correctParts.includes(index);
            
            return (
              <motion.div
                key={index}
                className="h-full cursor-pointer relative flex items-center justify-center border border-white"
                style={{ 
                  width: `${100 / totalParts}%`,
                  backgroundColor: isSelected 
                    ? colors.secondary 
                    : isCorrect
                    ? '#4ade80' // green for correct answers after submission
                    : colors.primary
                }}
                onClick={() => handlePartClick(index)}
                whileHover={!hasSubmitted ? { scale: 1.05 } : {}}
                whileTap={!hasSubmitted ? { scale: 0.95 } : {}}
              >
                <span className={`font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>{index + 1}</span>
                {isIncorrect && (
                  <div className="absolute inset-0 bg-red-500 opacity-30"></div>
                )}
              </motion.div>
            );
          })}
        </div>
      );
    }
    
    // For circle shape (pie chart)
    if (type === 'circle') {
      return (
        <div className="w-64 h-64 relative mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {Array.from({ length: totalParts }).map((_, index) => {
              const isSelected = selectedParts.includes(index);
              const isCorrect = hasSubmitted && problem.correctParts.includes(index);
              const isIncorrect = hasSubmitted && isSelected && !problem.correctParts.includes(index);
              
              const angle = 360 / totalParts;
              const startAngle = index * angle - 90;
              const endAngle = (index + 1) * angle - 90;
              
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={isSelected 
                    ? colors.secondary 
                    : isCorrect
                    ? '#4ade80' // green for correct 
                    : colors.primary}
                  stroke="#fff"
                  strokeWidth="1"
                  onClick={() => handlePartClick(index)}
                  style={{ cursor: 'pointer' }}
                  className={`hover:opacity-80 ${isIncorrect ? 'opacity-70' : ''}`}
                />
              );
            })}
          </svg>
        </div>
      );
    }
    
    // Default fallback if shape type is not supported
    return (
      <div className="bg-yellow-100 p-4 rounded-lg text-center">
        <p className="text-yellow-700">Shape type "{type}" is not supported yet.</p>
      </div>
    );
  };
  
  return (
    <div className="interactive-shape-problem">
      <div className="shape-container my-6">
        {renderShape()}
      </div>
      
      <div className="instructions text-gray-600 text-center mb-4">
        Click on the parts to select or deselect them
      </div>
      
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={hasSubmitted || selectedParts.length === 0}
          className={`
            px-6 py-2 rounded-full font-semibold transition-all duration-200
            ${hasSubmitted || selectedParts.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }
          `}
        >
          {hasSubmitted ? 'Submitted' : 'Check Answer'}
        </button>
      </div>
    </div>
  );
};

export default InteractiveShapeProblem; 