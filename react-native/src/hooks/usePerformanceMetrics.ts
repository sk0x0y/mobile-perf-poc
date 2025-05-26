import { useState, useRef, useCallback } from 'react';

import {
  measureRenderTime,
  measureJsFPS,
  measureTransitionDelay,
  measureMemoryUsage,
} from '@utils/performance';

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
    frameDrops: 0,
    transitionDelay: 0,
  });

  const renderTimeStopRef = useRef<(() => void) | null>(null);
  const fpsMeasurerRef = useRef<ReturnType<typeof measureJsFPS> | null>(null);
  const transitionMeasurerRef = useRef<ReturnType<typeof measureTransitionDelay> | null>(null);
  const memoryMeasurerRef = useRef<ReturnType<typeof measureMemoryUsage> | null>(null);

  const startMeasuring = useCallback(() => {
    setMetrics({
      renderTime: 0,
      memoryUsage: 0,
      fps: 0,
      frameDrops: 0,
      transitionDelay: 0,
    });

    renderTimeStopRef.current = measureRenderTime(
      () => {},
      time => setMetrics(prev => ({ ...prev, renderTime: time }))
    );

    fpsMeasurerRef.current = measureJsFPS();
    fpsMeasurerRef.current.start((fps: number, drops: number) => {
      setMetrics(prev => ({ ...prev, fps: fps, frameDrops: drops }));
    });

    transitionMeasurerRef.current = measureTransitionDelay();

    memoryMeasurerRef.current = measureMemoryUsage(memory => {
      setMetrics(prev => ({ ...prev, memoryUsage: memory }));
    });
    memoryMeasurerRef.current.start();
  }, []);

  const stopMeasuring = useCallback(() => {
    if (renderTimeStopRef.current) {
      renderTimeStopRef.current();
      renderTimeStopRef.current = null;
    }

    if (fpsMeasurerRef.current) {
      fpsMeasurerRef.current.stop();
      fpsMeasurerRef.current = null;
    }

    if (memoryMeasurerRef.current) {
      memoryMeasurerRef.current.stop();
      memoryMeasurerRef.current = null;
    }
  }, []);

  const getMemoryUsage = useCallback(() => {
    return memoryMeasurerRef.current?.getCurrentMemory() || 0;
  }, []);

  const getCurrentFps = useCallback(() => {
    return fpsMeasurerRef.current?.getCurrentFps() || 0;
  }, []);

  const getDroppedFrames = useCallback(() => {
    return fpsMeasurerRef.current?.getDroppedFrames() || 0;
  }, []);

  const getCurrentRenderTime = useCallback(() => {
    return metrics.renderTime;
  }, [metrics.renderTime]);

  const getCurrentTransitionDelay = useCallback(() => {
    return metrics.transitionDelay;
  }, [metrics.transitionDelay]);

  const startTransition = useCallback(() => {
    transitionMeasurerRef.current?.startTransition();
  }, []);

  const endTransition = useCallback(() => {
    const delay = transitionMeasurerRef.current?.endTransition();
    if (delay !== undefined) {
      setMetrics(prev => ({ ...prev, transitionDelay: delay }));
    }
  }, []);

  return {
    metrics,
    startMeasuring,
    stopMeasuring,
    startTransition,
    endTransition,
    getMemoryUsage,
    getCurrentFps,
    getDroppedFrames,
    getCurrentRenderTime,
    getCurrentTransitionDelay,
  };
}

export default usePerformanceMetrics;
