import React from 'react';
import { AlertTriangle, Phone, Clock } from 'lucide-react';

interface UrgencyAlertProps {
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  symptoms: string[];
  onEmergencyCall?: () => void;
}

export const UrgencyAlert: React.FC<UrgencyAlertProps> = ({ 
  urgencyLevel, 
  symptoms, 
  onEmergencyCall 
}) => {
  if (urgencyLevel === 'low') return null;

  const getAlertConfig = () => {
    switch (urgencyLevel) {
      case 'emergency':
        return {
          bgColor: 'bg-red-100 border-red-500',
          textColor: 'text-red-900',
          iconColor: 'text-red-600',
          title: '🚨 MEDICAL EMERGENCY',
          message: 'Your symptoms may indicate a medical emergency. Call 911 immediately or go to the nearest emergency room.',
          action: 'Call 911 Now',
          actionColor: 'bg-red-600 hover:bg-red-700'
        };
      case 'high':
        return {
          bgColor: 'bg-orange-100 border-orange-500',
          textColor: 'text-orange-900',
          iconColor: 'text-orange-600',
          title: '⚠️ URGENT MEDICAL ATTENTION NEEDED',
          message: 'Your symptoms suggest you should seek medical attention promptly. Consider visiting an urgent care center or emergency room.',
          action: 'Find Urgent Care',
          actionColor: 'bg-orange-600 hover:bg-orange-700'
        };
      case 'medium':
        return {
          bgColor: 'bg-yellow-100 border-yellow-500',
          textColor: 'text-yellow-900',
          iconColor: 'text-yellow-600',
          title: '⚡ MEDICAL CONSULTATION RECOMMENDED',
          message: 'Your symptoms warrant medical evaluation. Consider scheduling an appointment with your healthcare provider.',
          action: 'Schedule Appointment',
          actionColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      default:
        return null;
    }
  };

  const config = getAlertConfig();
  if (!config) return null;

  return (
    <div className={`${config.bgColor} border-2 rounded-xl p-6 mb-6 shadow-lg animate-pulse`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <AlertTriangle className={`w-8 h-8 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${config.textColor} mb-2`}>
            {config.title}
          </h3>
          <p className={`${config.textColor} mb-4 leading-relaxed`}>
            {config.message}
          </p>
          
          {symptoms.length > 0 && (
            <div className="mb-4">
              <p className={`text-sm font-semibold ${config.textColor} mb-2`}>
                Concerning symptoms identified:
              </p>
              <ul className={`text-sm ${config.textColor} list-disc list-inside space-y-1`}>
                {symptoms.slice(0, 3).map((symptom, index) => (
                  <li key={index} className="capitalize">{symptom}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {urgencyLevel === 'emergency' && (
              <button
                onClick={() => window.open('tel:911')}
                className={`flex items-center justify-center px-6 py-3 ${config.actionColor} text-white rounded-lg font-semibold transition-colors shadow-md`}
              >
                <Phone className="w-5 h-5 mr-2" />
                {config.action}
              </button>
            )}
            
            <button
              onClick={onEmergencyCall}
              className="flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <Clock className="w-5 h-5 mr-2" />
              Find Healthcare Providers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};