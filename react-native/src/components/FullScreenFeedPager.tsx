import React, { useRef, useState, forwardRef, useImperativeHandle, memo } from 'react';
import { View, Dimensions, StyleSheet, NativeSyntheticEvent } from 'react-native';
import PagerView from 'react-native-pager-view';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

interface FullScreenFeedPagerProps {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactNode;
  onPageChange?: (page: number) => void;
  itemCount: number;
}

export interface FullScreenFeedPagerRef {
  setPage: (page: number) => void;
}

export const FullScreenFeedPager = memo(
  forwardRef<FullScreenFeedPagerRef, FullScreenFeedPagerProps>(
    ({ data, renderItem, onPageChange }, ref) => {
      const internalPagerRef = useRef<PagerView>(null);
      const [currentPage, setCurrentPage] = useState(0);

      useImperativeHandle(ref, () => ({
        setPage: (page: number) => {
          internalPagerRef.current?.setPage(page);
        },
      }));

      const handlePageSelected = (e: NativeSyntheticEvent<{ position: number }>) => {
        const newPage = e.nativeEvent.position;
        setCurrentPage(newPage);
        onPageChange?.(newPage);
      };

      return (
        <View style={styles.container}>
          <PagerView
            ref={internalPagerRef}
            style={styles.pager}
            orientation="vertical"
            initialPage={0}
            onPageSelected={handlePageSelected}
            pageMargin={0}
            offscreenPageLimit={1}
          >
            {data.map((item, index) => (
              <View key={index} style={styles.pageContainer}>
                {renderItem({ item, index })}
              </View>
            ))}
          </PagerView>
        </View>
      );
    }
  )
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  pager: {
    flex: 1,
  },
  pageContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default FullScreenFeedPager;
