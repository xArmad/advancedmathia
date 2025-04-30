import { readFileSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Determine the path to the JSON file
    const filePath = path.join(process.cwd(), 'src', 'data', 'fractions', 'topics_config.json');
    
    // Read the file
    try {
      const data = readFileSync(filePath, 'utf8');
      const config = JSON.parse(data);
      
      return NextResponse.json(config);
    } catch (fileError) {
      // If file doesn't exist, return empty array
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error loading topics configuration:', error);
    return NextResponse.json(
      { error: 'Failed to load topics configuration' },
      { status: 500 }
    );
  }
} 