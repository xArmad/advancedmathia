import { readFileSync } from 'fs';
import { NextRequest } from 'next/server';
import { FractionTopic } from '@/types/problemTemplates';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { topic: string } }
) {
  try {
    // Extract the topic from params
    const topic = params.topic;
    
    // Check if topic exists
    if (!topic) {
      return Response.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }
    
    // Validate topic from the URL
    const validTopics: FractionTopic[] = [
      'introduction',
      'representation',
      'equivalent_fractions',
      'simplification',
      'comparison',
      'addition',
      'subtraction',
      'multiplication',
      'division',
      'mixed_numbers',
      'decimals'
    ];
    
    if (!validTopics.includes(topic as FractionTopic)) {
      return Response.json(
        { error: `Invalid topic: ${topic}` },
        { status: 400 }
      );
    }
    
    // Determine the path to the JSON file
    const filePath = path.join(process.cwd(), 'src', 'data', 'fractions', `${topic}.json`);
    
    // Read the file - in production this would be more robust with error handling
    try {
      const data = readFileSync(filePath, 'utf8');
      const problems = JSON.parse(data);
      
      return Response.json(problems);
    } catch (fileError) {
      console.error(`File error for topic ${topic}:`, fileError);
      // If file doesn't exist yet, return empty array
      return Response.json([]);
    }
  } catch (error) {
    console.error('Error loading problems:', error);
    return Response.json(
      { error: 'Failed to load problems' },
      { status: 500 }
    );
  }
} 