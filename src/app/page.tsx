import React from 'react';
import Link from 'next/link';
import { StudentProgressProvider } from '@/contexts/StudentProgressContext';
import FractionLearningApp from '@/components/fractions/FractionLearningApp';

export default function Home() {
  return (
    <main className="min-h-screen">
      <StudentProgressProvider>
        <div className="container mx-auto px-4 py-12">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
              Advanced Math IA
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Interactive learning experiences for mathematics
            </p>
            
            <div className="flex justify-center gap-4">
              <Link 
                href="/fractions" 
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Fractions Learning Module
              </Link>
            </div>
          </header>
          
          <FractionLearningApp />
        </div>
      </StudentProgressProvider>
    </main>
  );
}
