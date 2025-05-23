import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Performance from 'react-native-performance';

export const PerformanceMonitor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Performance.setResourceLoggingEnabled(true);
      // @ts-ignore
      if (typeof Performance.onRenderPassReport === 'function') {
        // @ts-ignore
        Performance.onRenderPassReport((report: Performance.RenderPassReport) => {
          console.log('Render pass report:', report);
        });
      }
    }

    return () => {
      if (Platform.OS !== 'web') {
        Performance.setResourceLoggingEnabled(false);
      }
    };
  }, []);

  return <>{children}</>;
};
