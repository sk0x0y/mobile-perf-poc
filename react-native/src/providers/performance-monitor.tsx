import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Performance from 'react-native-performance';
import { SplashScreen } from 'expo-router';

import { measureInitialLoadTime } from '@utils/performance';
import { saveInitialLoadTime } from '@utils/performanceStorage';

export const PerformanceMonitor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialLoadMeasurer = useRef(measureInitialLoadTime());

  useEffect(() => {
    initialLoadMeasurer.current.start();

    const hideSplashScreen = SplashScreen.hideAsync;
    SplashScreen.hideAsync = async () => {
      await hideSplashScreen();
      const loadTime = initialLoadMeasurer.current.stop();
      if (loadTime > 0) {
        console.log('Initial Load Time:', loadTime.toFixed(2), 'ms');
        saveInitialLoadTime(loadTime);
      }
    };

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
      SplashScreen.hideAsync = hideSplashScreen;
    };
  }, []);

  return <>{children}</>;
};
