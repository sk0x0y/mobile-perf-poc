import { PerformanceObserver, PerformanceEntry } from 'react-native-performance';

declare module 'react-native-performance' {
  interface PerformanceEntry {
    duration: number;
  }
}

export const measureRenderTime = (
  startCallback: () => void,
  endCallback: (time: number) => void
) => {
  const startTime = performance.now();
  startCallback();
  return () => {
    const endTime = performance.now();
    endCallback(endTime - startTime);
  };
};

export const measureFPS = () => {
  let frameCount = 0;
  let dropCount = 0;
  let lastTime = performance.now();
  let observer: PerformanceObserver | null = null;

  const start = (setFps: (fps: number, drops: number) => void) => {
    frameCount = 0;
    dropCount = 0;
    lastTime = performance.now();

    observer = new PerformanceObserver(list => {
      list.getEntries().forEach((entry: PerformanceEntry) => {
        if ((entry.entryType as string) === 'frame') {
          frameCount++;
          const now = performance.now();
          const elapsed = now - lastTime;

          if (entry.duration > 16.7) {
            dropCount++;
          }

          if (elapsed >= 1000) {
            const fps = Math.round((frameCount * 1000) / elapsed);
            setFps(fps, dropCount);
            frameCount = 0;
            dropCount = 0;
            lastTime = now;
          }
        }
      });
    });

    observer.observe({ entryTypes: ['frame'] });
  };

  const stop = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  return { start, stop };
};

export const measureTransitionDelay = () => {
  let startTime = 0;

  const startTransition = () => {
    startTime = performance.now();
  };

  const endTransition = () => {
    const endTime = performance.now();
    return endTime - startTime;
  };

  return { startTransition, endTransition };
};

export const measureInitialLoadTime = () => {
  let startTime: number | null = null;

  const start = () => {
    startTime = performance.now();
  };

  const stop = () => {
    if (startTime === null) {
      console.warn('Initial load time measurement was stopped before it started.');
      return 0;
    }
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    startTime = null;
    return loadTime;
  };

  return { start, stop };
};

export const measureMemoryUsage = (setMemoryUsage: (memory: number) => void) => {
  let intervalId: NodeJS.Timeout | null = null;
  let currentMemory = 50 + Math.random() * 50; // 50-100MB 사이 초기값
  let startTime = 0;

  const start = () => {
    startTime = Date.now();
    setMemoryUsage(currentMemory);

    intervalId = setInterval(() => {
      const elapsedMinutes = (Date.now() - startTime) / (1000 * 60);
      const leakage = Math.min(elapsedMinutes * 2, 50);

      const fluctuation = (Math.random() - 0.5) * 10;

      currentMemory = Math.min(Math.max(currentMemory + leakage + fluctuation, 50), 150);

      setMemoryUsage(currentMemory);
    }, 1000);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const getCurrentMemory = () => {
    return currentMemory;
  };

  return { start, stop, getCurrentMemory };
};

export const measureJsFPS = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  let rafId: number | null = null;
  let fpsValue = 0;
  let droppedFrames = 0;

  const start = (setFps: (fps: number, drops: number) => void) => {
    frameCount = 0;
    droppedFrames = 0;
    lastTime = performance.now();

    const countFrames = () => {
      frameCount++;
      const now = performance.now();
      const elapsed = now - lastTime;

      if (elapsed >= 1000) {
        fpsValue = Math.round((frameCount * 1000) / elapsed);

        const expectedFrames = Math.round(elapsed / 16.7);
        const missedFrames = Math.max(0, expectedFrames - frameCount);
        droppedFrames += missedFrames;

        setFps(fpsValue, droppedFrames);
        frameCount = 0;
        lastTime = now;
      }

      rafId = requestAnimationFrame(countFrames);
    };

    rafId = requestAnimationFrame(countFrames);
  };

  const stop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const getCurrentFps = () => fpsValue;
  const getDroppedFrames = () => droppedFrames;

  return { start, stop, getCurrentFps, getDroppedFrames };
};
