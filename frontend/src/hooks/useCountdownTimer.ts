import { useState, useEffect, useCallback, useRef } from 'react';

export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  isExpired: boolean;
  formatTime: (seconds: number) => string;
  getTimeColor: (seconds: number, totalSeconds: number) => string;
  getWarningLevel: (seconds: number, totalSeconds: number) => 'normal' | 'warning' | 'critical';
}

export interface UseCountdownTimerProps {
  initialSeconds: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export const useCountdownTimer = ({
  initialSeconds,
  onExpire,
  autoStart = true,
}: UseCountdownTimerProps): TimerState & {
  start: () => void;
  pause: () => void;
  reset: () => void;
  stop: () => void;
} => {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const onExpireRef = useRef(onExpire);

  // Update the onExpire ref when it changes
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Get color based on time remaining
  const getTimeColor = useCallback((seconds: number, totalSeconds: number): string => {
    const percentageRemaining = (seconds / totalSeconds) * 100;
    
    if (percentageRemaining <= 10) return 'text-red-600'; // Critical: less than 10%
    if (percentageRemaining <= 25) return 'text-orange-600'; // Warning: less than 25%
    return 'text-blue-600'; // Normal: more than 25%
  }, []);

  // Get warning level for additional styling
  const getWarningLevel = useCallback((seconds: number, totalSeconds: number): 'normal' | 'warning' | 'critical' => {
    const percentageRemaining = (seconds / totalSeconds) * 100;
    
    if (percentageRemaining <= 10) return 'critical';
    if (percentageRemaining <= 25) return 'warning';
    return 'normal';
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsExpired(true);
            // Call onExpire callback after state updates
            setTimeout(() => {
              onExpireRef.current?.();
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeRemaining]);

  // Control functions
  const start = useCallback(() => {
    if (!isExpired && timeRemaining > 0) {
      setIsRunning(true);
    }
  }, [isExpired, timeRemaining]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTimeRemaining(initialSeconds);
    setIsRunning(autoStart);
    setIsExpired(false);
  }, [initialSeconds, autoStart]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(0);
    setIsExpired(true);
  }, []);

  return {
    timeRemaining,
    isRunning,
    isExpired,
    formatTime,
    getTimeColor,
    getWarningLevel,
    start,
    pause,
    reset,
    stop,
  };
};