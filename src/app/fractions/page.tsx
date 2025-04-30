import React from 'react';
import FractionsModule from '@/components/fractions/FractionsModule';

export default function FractionsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <FractionsModule />
        
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Advanced Math IA - Interactive Learning Experience</p>
        </footer>
      </div>
    </main>
  );
} 