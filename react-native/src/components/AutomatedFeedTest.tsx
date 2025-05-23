import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  SectionList,
  VirtualizedList,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { FeedItemData } from '@typedefs/feed';

import { saveTestMetadata, saveDetailedPerformanceData } from '@utils/performanceStorage';
import { loadFeedData, generateTestData } from '@utils/data-generator';

import { usePerformanceMetrics } from '@hooks/usePerformanceMetrics';

import { FeedItem } from '@components/common/FeedItem';

const { height } = Dimensions.get('window');

interface AutomatedFeedTestProps {
  testName: string;
  itemCount?: number;
  swipeDuration?: number;
  onComplete?: (testId: string, results: any) => void;
}

interface PerformanceDataItem {
  time: number;
  pageIndex: number;
  fps: number;
  frameDrops: number;
  memoryUsage: number;
  transitionDelay: number;
}

export function AutomatedFeedTest({
  testName,
  itemCount = 10,
  swipeDuration = 800,
  onComplete,
}: AutomatedFeedTestProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [feedData, setFeedData] = useState<FeedItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const listRef = useRef<
    FlatList | FlashList<FeedItemData> | SectionList | VirtualizedList<FeedItemData> | any
  >(null);

  const { metrics, startMeasuring, stopMeasuring, startTransition, endTransition } =
    usePerformanceMetrics();
  const performanceData = useRef<PerformanceDataItem[]>([]);
  const testStartTime = useRef(0);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = itemCount >= 1000 ? generateTestData(itemCount) : await loadFeedData();
        setFeedData(data);
        if (data.length < itemCount) {
          console.warn(
            `Loaded data count (${data.length}) is less than itemCount (${itemCount}). Adjusting itemCount.`
          );
        }
      } catch (error) {
        console.error('Failed to load feed data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [itemCount]);

  const runTest = async () => {
    if (isRunning || isLoading || feedData.length === 0) return;

    setIsRunning(true);
    setProgress(0);
    setCurrentIndex(0);
    performanceData.current = [];
    testStartTime.current = performance.now();

    startMeasuring();

    const actualItemCount = Math.min(itemCount, feedData.length);

    for (let i = 0; i < actualItemCount; i++) {
      setCurrentIndex(i);

      startTransition();

      if (listRef.current) {
        if (testName === 'SectionList Test') {
          listRef.current.scrollToLocation({
            sectionIndex: 0,
            itemIndex: i,
            animated: false,
            viewOffset: 0,
            viewPosition: 0,
          });
        } else {
          listRef.current.scrollToIndex({ index: i, animated: false });
        }
      }

      await new Promise(resolve => setTimeout(resolve, swipeDuration));

      endTransition();

      performanceData.current.push({
        time: performance.now() - testStartTime.current,
        pageIndex: i,
        fps: metrics.fps,
        frameDrops: metrics.frameDrops,
        memoryUsage: metrics.memoryUsage,
        transitionDelay: metrics.transitionDelay,
      });

      setProgress(Math.round(((i + 1) / actualItemCount) * 100));
    }

    stopMeasuring();

    const testId = `${testName}_${Date.now()}`;

    const metaData = {
      testName,
      timestamp: Date.now(),
      itemCount: actualItemCount,
      swipeDuration,
      summary: metrics,
    };

    await saveTestMetadata(testId, metaData);
    await saveDetailedPerformanceData(testId, performanceData.current);

    setResults(metrics);
    setIsRunning(false);
    onComplete?.(testId, metrics);
  };

  const renderFeedItem = useCallback(({ item, index }: { item: FeedItemData; index: number }) => {
    return <FeedItem item={item} />;
  }, []);

  const sectionListData = [{ title: 'Feed Items', data: feedData }];

  const getItem = useCallback((data: FeedItemData[], index: number) => data[index], []);
  const getItemCount = useCallback((data: FeedItemData[]) => data.length, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>데이터 로딩 중...</Text>
      </View>
    );
  }

  if (feedData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>피드 데이터를 로드할 수 없습니다.</Text>
      </View>
    );
  }

  const renderList = () => {
    switch (testName) {
      case 'FlatList Test':
        return (
          <FlatList
            ref={listRef}
            data={feedData}
            renderItem={renderFeedItem}
            keyExtractor={(item, index) =>
              `flatlist-${item.feed?.id || item.shortply?.id}-${index}`
            }
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => ({
              length: height,
              offset: height * index,
              index,
            })}
          />
        );
      case 'FlashList Test':
        return (
          <FlashList
            ref={listRef}
            data={feedData}
            renderItem={renderFeedItem}
            keyExtractor={(item, index) =>
              `flashlist-${item.feed?.id || item.shortply?.id}-${index}`
            }
            estimatedItemSize={height}
          />
        );
      case 'SectionList Test':
        return (
          <SectionList
            ref={listRef}
            sections={sectionListData}
            renderItem={renderFeedItem}
            keyExtractor={(item, index) =>
              `sectionlist-${item.feed?.id || item.shortply?.id}-${index}`
            }
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => ({
              length: height,
              offset: height * index,
              index,
            })}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
              </View>
            )}
          />
        );
      case 'VirtualizedList Test':
        return (
          <VirtualizedList
            ref={listRef}
            data={feedData}
            getItem={getItem}
            getItemCount={getItemCount}
            renderItem={renderFeedItem}
            keyExtractor={(item, index) =>
              `virtualizedlist-${item.feed?.id || item.shortply?.id}-${index}`
            }
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => ({
              length: height,
              offset: height * index,
              index,
            })}
          />
        );
      default:
        return <Text>알 수 없는 테스트 이름: {testName}</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{testName} 자동화 테스트</Text>

      {isRunning ? (
        <>
          <Text style={styles.status}>테스트 진행중: {progress}%</Text>
          <Text style={styles.status}>
            현재 항목: {currentIndex + 1}/{Math.min(itemCount, feedData.length)}
          </Text>
          <View style={styles.realtimeMetrics}>
            <Text>FPS: {metrics.fps.toFixed(1)}</Text>
            <Text>프레임 드롭: {metrics.frameDrops}</Text>
            <Text>메모리: {metrics.memoryUsage.toFixed(1)}MB</Text>
            <Text>전환 지연: {metrics.transitionDelay.toFixed(1)}ms</Text>
          </View>
        </>
      ) : (
        <Button
          title="테스트 시작"
          onPress={runTest}
          disabled={isRunning || isLoading || feedData.length === 0}
        />
      )}

      {results && (
        <View style={styles.results}>
          <Text style={styles.resultTitle}>테스트 결과 요약</Text>
          <Text>평균 FPS: {results.fps?.toFixed(1)}</Text>
          <Text>총 프레임 드롭: {results.frameDrops}</Text>
          <Text>최대 메모리 사용량: {results.memoryUsage?.toFixed(1)}MB</Text>
          <Text>평균 전환 지연: {results.transitionDelay?.toFixed(1)}ms</Text>
        </View>
      )}

      <View style={styles.listContainer}>{renderList()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  status: {
    fontSize: 16,
    marginVertical: 4,
  },
  realtimeMetrics: {
    marginTop: 8,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  results: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
  },
  feedItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  sectionHeader: {
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AutomatedFeedTest;
