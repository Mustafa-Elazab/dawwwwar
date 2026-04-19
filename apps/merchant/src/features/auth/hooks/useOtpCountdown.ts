import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOtpCountdownOptions {
  initialSeconds: number;
  autoStart?: boolean;
}

export function useOtpCountdown({
  initialSeconds,
  autoStart = true,
}: UseOtpCountdownOptions) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (newSeconds?: number) => {
      stop();
      setSeconds(newSeconds ?? initialSeconds);
      setIsRunning(true);
    },
    [stop, initialSeconds],
  );

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  return {
    seconds,
    isRunning,
    isExpired: seconds === 0,
    reset,
    stop,
  };
}
