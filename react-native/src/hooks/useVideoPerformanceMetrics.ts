import { useState, useRef, useCallback } from 'react';

import { VideoMetrics } from '@typedefs/video-metrics';

export function useVideoPerformanceMetrics() {
  const [metricsData, setMetricsData] = useState<{ [index: number]: VideoMetrics }>({});
  const allMetricsRef = useRef<{ [index: number]: VideoMetrics }>({});

  const updateMetrics = useCallback((index: number, metrics: VideoMetrics) => {
    allMetricsRef.current[index] = metrics;
    setMetricsData({ ...allMetricsRef.current });
  }, []);

  const getAggregatedMetrics = useCallback(() => {
    const indices = Object.keys(allMetricsRef.current).map(Number);
    if (indices.length === 0) return null;

    const totalMetrics = {
      avgLoadTime: 0,
      totalBufferingEvents: 0,
      totalBufferingDuration: 0,
      avgBufferingDuration: 0,
      totalDroppedFrames: 0,
      itemsWithVideo: indices.length,
    };

    let videoLoadCount = 0;

    indices.forEach(index => {
      const metrics = allMetricsRef.current[index];
      if (metrics.loadTime > 0) {
        totalMetrics.avgLoadTime += metrics.loadTime;
        videoLoadCount++;
      }

      totalMetrics.totalBufferingEvents += metrics.bufferingEvents;
      totalMetrics.totalBufferingDuration += metrics.bufferingDuration;
      totalMetrics.totalDroppedFrames += metrics.droppedFrames;
    });

    if (videoLoadCount > 0) {
      totalMetrics.avgLoadTime /= videoLoadCount;
    }

    if (totalMetrics.totalBufferingEvents > 0) {
      totalMetrics.avgBufferingDuration =
        totalMetrics.totalBufferingDuration / totalMetrics.totalBufferingEvents;
    }

    return totalMetrics;
  }, []);

  const resetMetrics = useCallback(() => {
    allMetricsRef.current = {};
    setMetricsData({});
  }, []);

  return {
    metricsData,
    updateMetrics,
    getAggregatedMetrics,
    resetMetrics,
  };
}
