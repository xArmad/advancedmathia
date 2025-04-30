import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// In a real app, this would interact with a database
// For now, we'll use cookies to store progress
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { topic, problemId, isCorrect, timestamp } = data;
    
    if (!topic || !problemId || isCorrect === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get existing progress from cookies
    const cookieStore = cookies();
    const progressCookie = cookieStore.get('fractionProgress');
    let progress = progressCookie ? JSON.parse(progressCookie.value) : {};
    
    // Initialize topic progress if it doesn't exist yet
    if (!progress[topic]) {
      progress[topic] = {
        topic,
        problemsAttempted: 0,
        problemsCorrect: 0,
        masteryLevel: 0,
        lastPracticed: timestamp,
        needsReview: false
      };
    }
    
    // Update progress
    progress[topic].problemsAttempted += 1;
    if (isCorrect) {
      progress[topic].problemsCorrect += 1;
    }
    progress[topic].lastPracticed = timestamp;
    
    // Calculate mastery level (0-100)
    const correctPercentage = (progress[topic].problemsCorrect / progress[topic].problemsAttempted) * 100;
    progress[topic].masteryLevel = Math.min(Math.round(correctPercentage), 100);
    
    // Reset the "needsReview" flag since they just practiced
    progress[topic].needsReview = false;
    
    // Save updated progress to cookies
    // In a real app, this would be stored in a database
    cookieStore.set('fractionProgress', JSON.stringify(progress), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      sameSite: 'strict'
    });
    
    return NextResponse.json({ success: true, progress: progress[topic] });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
} 