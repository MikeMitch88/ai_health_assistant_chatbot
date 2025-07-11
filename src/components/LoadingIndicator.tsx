import React from 'react';
import { Brain, Heart, Stethoscope } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
  type?: 'thinking' | 'analyzing' | 'searching';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "AI is thinking...", 
  type = 'thinking' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'analyzing':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'searching':
        return <Stethoscope className="w-5 h-5 text-blue-500" />;
      default:
        return <Heart className="w-5 h-5 text-green-500" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'analyzing':
        return 'from-purple-500 to-purple-600';
      case 'searching':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-green-500 to-green-600';
    }
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center animate-pulse`}>
          {getIcon()}
        </div>
        <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-gray-600">{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
};