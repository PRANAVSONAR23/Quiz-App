import React from 'react';
import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  formatTime: (seconds: number) => string;
  getTimeColor: (seconds: number, totalSeconds: number) => string;
  getWarningLevel: (seconds: number, totalSeconds: number) => 'normal' | 'warning' | 'critical';
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  totalTime,
  formatTime,
  getTimeColor,
  getWarningLevel,
  className = '',
}) => {
  const warningLevel = getWarningLevel(timeRemaining, totalTime);
  const timeColor = getTimeColor(timeRemaining, totalTime);
  const percentageRemaining = (timeRemaining / totalTime) * 100;

  const getIcon = () => {
    switch (warningLevel) {
      case 'critical':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getBackgroundClass = () => {
    switch (warningLevel) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getAnimation = () => {
    if (warningLevel === 'critical') {
      return 'animate-pulse';
    }
    return '';
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Timer Display */}
      <div
        className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-300 ${getBackgroundClass()} ${getAnimation()}`}
      >
        <div className={`flex items-center space-x-2 ${timeColor}`}>
          {getIcon()}
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">
              {formatTime(timeRemaining)}
            </span>
            <span className="text-xs opacity-75 leading-none mt-1">
              Time Left
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 max-w-32">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              warningLevel === 'critical'
                ? 'bg-red-500'
                : warningLevel === 'warning'
                ? 'bg-orange-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${Math.max(0, percentageRemaining)}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500 text-center">
          {Math.round(percentageRemaining)}%
        </div>
      </div>

      {/* Warning Messages */}
      {warningLevel === 'critical' && (
        <div className="hidden md:flex items-center text-red-600 text-sm font-medium">
          <AlertCircle className="h-4 w-4 mr-1" />
          Time Almost Up!
        </div>
      )}
      {warningLevel === 'warning' && (
        <div className="hidden md:flex items-center text-orange-600 text-sm font-medium">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Limited Time
        </div>
      )}
    </div>
  );
};

export default Timer;