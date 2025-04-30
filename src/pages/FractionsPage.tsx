import React from 'react';
import FractionsLearningModule from '../components/fractions/FractionsLearningModule';

const FractionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
            Learning Fractions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our friendly math buddy on an interactive journey to master fractions!
            Learn through visual animations and fun exercises.
          </p>
        </header>
        
        <FractionsLearningModule />
        
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Advanced Math IA - Interactive Learning Experience</p>
        </footer>
      </div>
    </div>
  );
};

export default FractionsPage; 