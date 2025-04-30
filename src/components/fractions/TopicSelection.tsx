"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useFractionProgress } from '@/contexts/FractionProgressContext';
import { FractionTopic } from '@/types/problemTemplates';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TopicSelectionProps {
  onSelectTopic?: (topic: FractionTopic) => void;
}

export default function TopicSelection({ onSelectTopic }: TopicSelectionProps) {
  const [topicsConfig, setTopicsConfig] = useState<FractionTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mastered' | 'in-progress' | 'recommended'>('all');
  
  const { loadTopicsConfig, getTopicProgress, topicsToReview, nextTopicsToLearn } = useFractionProgress();
  
  // Memoize filtered topics to avoid recalculation on every render
  const filteredTopics = useMemo(() => {
    if (!topicsConfig.length) return [];
    
    return topicsConfig.filter(topic => {
      // Skip topics without id
      if (!topic?.id) return false;
      
      const progress = getTopicProgress(topic.id);
      const masteryLevel = progress?.masteryLevel || 0;
      
      switch (filter) {
        case 'mastered':
          return masteryLevel >= 0.8; // 80% mastery
        case 'in-progress':
          return progress && masteryLevel > 0 && masteryLevel < 0.8;
        case 'recommended':
          return topicsToReview.includes(topic.id) || nextTopicsToLearn.includes(topic.id);
        case 'all':
        default:
          return true;
      }
    });
  }, [topicsConfig, filter, getTopicProgress, topicsToReview, nextTopicsToLearn]);

  // Fetch topics configuration only once on component mount
  useEffect(() => {
    const fetchTopicsConfig = async () => {
      setIsLoading(true);
      try {
        const config = await loadTopicsConfig();
        setTopicsConfig(config);
      } catch (error) {
        console.error('Error loading topics configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopicsConfig();
    // Removed refreshRecommendations from dependency array to prevent the infinite loop
    // We only want to load topics once when the component mounts
  }, [loadTopicsConfig]);

  if (isLoading) {
    return <div className="flex justify-center my-8">
      <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
    </div>;
  }

  // Sort topics by orderNumber and id
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    // Handle missing orderNumber
    const orderA = a?.orderNumber ?? Number.MAX_SAFE_INTEGER;
    const orderB = b?.orderNumber ?? Number.MAX_SAFE_INTEGER;
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // Handle missing id 
    const idA = a?.id ?? '';
    const idB = b?.id ?? '';
    return idA.localeCompare(idB);
  });

  // Format topic cards with status
  const formatTopicCard = (topic: FractionTopic) => {
    if (!topic?.id) return null;
    
    const progress = getTopicProgress(topic.id);
    const masteryLevel = progress?.masteryLevel || 0;
    const isRecommended = topicsToReview.includes(topic.id) || nextTopicsToLearn.includes(topic.id);
    
    let statusText = 'Not started';
    let statusClass = 'text-gray-500';
    
    if (progress) {
      if (masteryLevel >= 0.8) {
        statusText = 'Mastered';
        statusClass = 'text-green-600 font-bold';
      } else if (masteryLevel > 0) {
        statusText = `In progress (${Math.round(masteryLevel * 100)}%)`;
        statusClass = 'text-blue-600';
      }
    }
    
    return (
      <div 
        key={topic.id} 
        className="block cursor-pointer" 
        onClick={() => onSelectTopic && onSelectTopic(topic)}
      >
        <Card className={`mb-3 hover:shadow-md transition-shadow ${isRecommended ? 'border-yellow-300 border-2' : ''}`}>
          <CardContent className="p-4">
            <h3 className="font-bold text-lg">{topic.title || 'Unnamed Topic'}</h3>
            <p className="text-gray-600 text-sm mb-2">{topic.description || 'No description available'}</p>
            <p className={`text-sm ${statusClass}`}>{statusText}</p>
            {isRecommended && <p className="text-yellow-600 text-sm font-semibold mt-1">✓ Recommended</p>}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Fraction Topics</h2>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Topics
        </Button>
        <Button 
          variant={filter === 'recommended' ? 'default' : 'outline'}
          onClick={() => setFilter('recommended')}
        >
          Recommended
        </Button>
        <Button 
          variant={filter === 'in-progress' ? 'default' : 'outline'}
          onClick={() => setFilter('in-progress')}
        >
          In Progress
        </Button>
        <Button 
          variant={filter === 'mastered' ? 'default' : 'outline'}
          onClick={() => setFilter('mastered')}
        >
          Mastered
        </Button>
      </div>
      
      {sortedTopics.length > 0 ? (
        <div className="grid gap-4">
          {sortedTopics.map(formatTopicCard)}
        </div>
      ) : (
        <p className="text-center text-gray-500 my-8">
          {filter === 'all' 
            ? 'No topics available.' 
            : `No ${filter} topics available.`}
        </p>
      )}
    </div>
  );
} 