import React from 'react';
import { User, Bot, Clock, AlertTriangle, Brain, Heart, Stethoscope } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    type?: 'symptom' | 'diagnosis' | 'recommendation' | 'disclaimer';
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'symptom':
        return <Stethoscope className="w-4 h-4 text-blue-500" />;
      case 'diagnosis':
        return <Brain className="w-4 h-4 text-purple-500" />;
      case 'recommendation':
        return <Heart className="w-4 h-4 text-green-500" />;
      case 'disclaimer':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getMessageStyle = (type?: string) => {
    switch (type) {
      case 'diagnosis':
        return 'bg-purple-50 border-purple-200 text-purple-900';
      case 'recommendation':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'disclaimer':
        return 'bg-red-50 border-red-200 text-red-900';
      default:
        return 'bg-white border-gray-200 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          message.isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
            : 'bg-gradient-to-br from-green-500 to-green-600'
        }`}>
          {message.isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`p-4 rounded-2xl shadow-sm border ${
              message.isUser
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                : `${getMessageStyle(message.type)} border`
            } ${message.isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}
          >
            {!message.isUser && message.type && (
              <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-200">
                {getMessageIcon(message.type)}
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {message.type === 'disclaimer' ? 'Important Notice' : 
                   message.type === 'diagnosis' ? 'Analysis' :
                   message.type === 'recommendation' ? 'Recommendations' : 'Assessment'}
                </span>
              </div>
            )}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          </div>
          
          {/* Timestamp */}
          <div className={`flex items-center mt-1 text-xs text-gray-500 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <Clock className="w-3 h-3 mr-1" />
            <span>{formatTime(message.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};