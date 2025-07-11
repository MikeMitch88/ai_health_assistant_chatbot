import React from 'react';
import { TrendingUp, Users, Globe, Heart, Activity, Shield } from 'lucide-react';

export const HealthStats: React.FC = () => {
  const stats = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      label: "Users Helped Today",
      value: "2,847",
      change: "+12%"
    },
    {
      icon: <Activity className="w-6 h-6 text-green-500" />,
      label: "Symptoms Analyzed",
      value: "15,293",
      change: "+8%"
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      label: "Accuracy Rate",
      value: "94.2%",
      change: "+2%"
    }
  ];

  const healthTips = [
    {
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water daily to maintain optimal health.",
      icon: "💧"
    },
    {
      title: "Regular Exercise",
      description: "30 minutes of moderate exercise can boost your immune system.",
      icon: "🏃‍♂️"
    },
    {
      title: "Quality Sleep",
      description: "7-9 hours of sleep helps your body recover and fight infections.",
      icon: "😴"
    },
    {
      title: "Balanced Diet",
      description: "Include fruits, vegetables, and whole grains in your daily meals.",
      icon: "🥗"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Health Impact</h3>
          <Globe className="w-5 h-5 text-green-500" />
        </div>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {stat.icon}
                <div>
                  <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                  <p className="text-xs text-gray-500">Last 24 hours</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Daily Health Tips</h3>
          <Heart className="w-5 h-5 text-red-500" />
        </div>
        <div className="space-y-3">
          {healthTips.map((tip, index) => (
            <div key={index} className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{tip.icon}</span>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Alerts */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-sm border border-yellow-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Health Alerts</h3>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-3">
              <span className="text-xl">🦠</span>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Flu Season Alert</h4>
                <p className="text-xs text-gray-600">Flu activity is increasing in your area. Consider getting vaccinated.</p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-3">
              <span className="text-xl">🌡️</span>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Heat Wave Warning</h4>
                <p className="text-xs text-gray-600">High temperatures expected. Stay hydrated and avoid prolonged sun exposure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};