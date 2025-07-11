import React from 'react';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration?: string;
}

interface SymptomChartProps {
  symptoms: Symptom[];
}

export const SymptomChart: React.FC<SymptomChartProps> = ({ symptoms }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-yellow-500';
      case 'severe':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityWidth = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'w-1/3';
      case 'moderate':
        return 'w-2/3';
      case 'severe':
        return 'w-full';
      default:
        return 'w-1/4';
    }
  };

  const severityStats = symptoms.reduce((acc, symptom) => {
    acc[symptom.severity] = (acc[symptom.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (symptoms.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Symptom Analysis</h3>
          <BarChart3 className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No symptoms recorded yet</p>
          <p className="text-sm text-gray-400">Start describing your symptoms to see analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Symptom Analysis</h3>
        <BarChart3 className="w-5 h-5 text-blue-500" />
      </div>

      {/* Severity Overview */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Severity Distribution</h4>
        <div className="space-y-2">
          {Object.entries(severityStats).map(([severity, count]) => (
            <div key={severity} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(severity)}`}></div>
                <span className="text-sm capitalize text-gray-700">{severity}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Symptoms */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Reported Symptoms</h4>
        {symptoms.map((symptom) => (
          <div key={symptom.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 capitalize">
                {symptom.name.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full text-white ${getSeverityColor(symptom.severity)}`}>
                {symptom.severity}
              </span>
            </div>
            
            {/* Severity Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className={`h-2 rounded-full ${getSeverityColor(symptom.severity)} ${getSeverityWidth(symptom.severity)}`}></div>
            </div>
            
            {symptom.duration && (
              <div className="flex items-center text-xs text-gray-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                Duration: {symptom.duration}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Analysis Summary</p>
            <p className="text-xs text-blue-700 mt-1">
              {symptoms.length} symptom{symptoms.length !== 1 ? 's' : ''} reported. 
              {severityStats.severe && ` ${severityStats.severe} severe symptom${severityStats.severe !== 1 ? 's' : ''} require immediate attention.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};