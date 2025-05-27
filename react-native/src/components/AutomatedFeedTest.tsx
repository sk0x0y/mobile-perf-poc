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
import { VideoMetrics } from '@typedefs/video-metrics';

import { saveTestMetadata, saveDetailedPerformanceData } from '@utils/performanceStorage';
import { loadFeedData, generateTestData, loadPagedFeedData } from '@utils/data-generator'; // loadPagedFeedData 추가

import { usePerformanceMetrics } from '@hooks/usePerformanceMetrics';
import { useVideoPerformanceMetrics } from '@hooks/useVideoPerformanceMetrics';

import { FeedItem } from '@components/common/FeedItem';

const { height } = Dimensions.get('window');

const INITIAL_PAGE_SIZE = 20; // 초기 로드할 아이템 수
const PAGE_SIZE = 10; // 한 번에 로드할 아이템 수

interface AutomatedFeedTestProps {
  testName: string;
  itemCount?: number;
  swipeDuration?: number;
  onComplete?: (testId: string, results: any) => void; // results 타입은 나중에 더 구체화
}

interface PerformanceDataItem {
  time: number;
  pageIndex: number;
  fps: number;
  frameDrops: number;
  memoryUsage: number;
  transitionDelay: number;
  renderTime: number;
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
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [hasMoreData, setHasMoreData] = useState(true); // 더 로드할 데이터가 있는지
  const [isFetchingMoreData, setIsFetchingMoreData] = useState(false); // 데이터 로드 중인지

  const listRef = useRef<
    FlatList | FlashList<FeedItemData> | SectionList | VirtualizedList<FeedItemData> | any
  >(null);

  const {
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
  } = usePerformanceMetrics();
  const performanceData = useRef<PerformanceDataItem[]>([]);
  const testStartTime = useRef(0);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const data = await loadPagedFeedData(1, INITIAL_PAGE_SIZE);
      setFeedData(data);
      setCurrentPage(1);
      setHasMoreData(data.length === INITIAL_PAGE_SIZE); // 초기 로드된 데이터가 INITIAL_PAGE_SIZE와 같으면 더 있을 수 있음
    } catch (error) {
      console.error('Failed to load initial feed data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []); // itemCount 의존성 제거

  const handleLoadMore = useCallback(async () => {
    if (isFetchingMoreData || !hasMoreData) {
      return;
    }

    setIsFetchingMoreData(true);
    try {
      const nextPage = currentPage + 1;
      const newData = await loadPagedFeedData(nextPage, PAGE_SIZE);
      if (newData.length > 0) {
        setFeedData(prevData => [...prevData, ...newData]);
        setCurrentPage(nextPage);
        setHasMoreData(newData.length === PAGE_SIZE); // 로드된 데이터가 PAGE_SIZE와 같으면 더 있을 수 있음
      } else {
        setHasMoreData(false); // 더 이상 로드할 데이터가 없음
      }
    } catch (error) {
      console.error('Failed to load more feed data:', error);
      setHasMoreData(false); // 오류 발생 시 더 이상 로드하지 않음
    } finally {
      setIsFetchingMoreData(false);
    }
  }, [currentPage, hasMoreData, isFetchingMoreData]);

  const runTest = async () => {
    if (isRunning || isLoading || feedData.length === 0) return;

    setIsRunning(true);
    setProgress(0);
    setCurrentIndex(0);
    performanceData.current = [];
    testStartTime.current = performance.now();
    resetMetrics();

    startMeasuring();

    let currentScrollIndex = 0;
    const totalItemsToScroll = itemCount; // itemCount는 이제 스크롤할 총 아이템 수

    while (currentScrollIndex < totalItemsToScroll && hasMoreData) {
      setCurrentIndex(currentScrollIndex);

      startTransition();

      if (listRef.current) {
        if (testName === 'SectionList Test') {
          listRef.current.scrollToLocation({
            sectionIndex: 0,
            itemIndex: currentScrollIndex,
            animated: false,
            viewOffset: 0,
            viewPosition: 0,
          });
        } else {
          listRef.current.scrollToIndex({ index: currentScrollIndex, animated: false });
        }
      }

      await new Promise(resolve => setTimeout(resolve, swipeDuration));

      endTransition();

      performanceData.current.push({
        time: performance.now() - testStartTime.current,
        pageIndex: currentScrollIndex,
        fps: getCurrentFps(),
        frameDrops: getDroppedFrames(),
        memoryUsage: getMemoryUsage(),
        transitionDelay: getCurrentTransitionDelay(),
        renderTime: getCurrentRenderTime(),
      });

      currentScrollIndex++;
      setProgress(Math.round((currentScrollIndex / totalItemsToScroll) * 100));

      // 다음 페이지 로드가 필요한 시점 감지 및 호출
      // 예를 들어, 현재 스크롤 인덱스가 로드된 데이터의 끝에 가까워지면 handleLoadMore 호출
      if (
        currentScrollIndex >= feedData.length - PAGE_SIZE / 2 &&
        hasMoreData &&
        !isFetchingMoreData
      ) {
        await handleLoadMore(); // 데이터 로드를 기다림
      }
    }

    stopMeasuring();

    const totalFps = performanceData.current.reduce((sum, data) => sum + data.fps, 0);
    const totalFrameDrops = performanceData.current.reduce((sum, data) => sum + data.frameDrops, 0);
    const totalMemoryUsage = performanceData.current.reduce(
      (sum, data) => sum + data.memoryUsage,
      0
    );
    const totalTransitionDelay = performanceData.current.reduce(
      (sum, data) => sum + data.transitionDelay,
      0
    );
    const totalRenderTime = performanceData.current.reduce((sum, data) => sum + data.renderTime, 0);

    // 비디오 관련 지표 집계
    const videoMetrics = getAggregatedMetrics();

    const aggregatedMetrics = {
      fps: performanceData.current.length > 0 ? totalFps / performanceData.current.length : 0,
      frameDrops: totalFrameDrops,
      memoryUsage:
        performanceData.current.length > 0 ? totalMemoryUsage / performanceData.current.length : 0,
      transitionDelay:
        performanceData.current.length > 0
          ? totalTransitionDelay / performanceData.current.length
          : 0,
      renderTime:
        performanceData.current.length > 0 ? totalRenderTime / performanceData.current.length : 0,
      videoAverageLoadTime: videoMetrics?.avgLoadTime || 0,
      videoBufferingEvents: videoMetrics?.totalBufferingEvents || 0,
      videoBufferingDuration: videoMetrics?.totalBufferingDuration || 0,
      videoDroppedFrames: videoMetrics?.totalDroppedFrames || 0,
      videoItemsCount: videoMetrics?.itemsWithVideo || 0,
    };

    const testId = `${testName}_${Date.now()}`;

    const metaData = {
      testName,
      timestamp: Date.now(),
      itemCount: totalItemsToScroll, // 변경된 itemCount 사용
      swipeDuration,
      summary: aggregatedMetrics,
    };

    await saveTestMetadata(testId, metaData);
    await saveDetailedPerformanceData(testId, performanceData.current);

    setResults(aggregatedMetrics);
    setIsRunning(false);
    onComplete?.(testId, aggregatedMetrics);
  };

  const { metricsData, updateMetrics, getAggregatedMetrics, resetMetrics } =
    useVideoPerformanceMetrics();

  const renderFeedItem = useCallback(
    ({ item, index }: { item: FeedItemData; index: number }) => {
      return (
        <FeedItem
          item={item}
          index={index}
          focusedIndex={currentIndex}
          onVideoLoad={() => {
            // 필요시 비디오 로드 완료 시점 기록
          }}
          onVideoError={error => {
            console.error(`Video error at index ${index}:`, error);
          }}
          onVideoMetricsUpdate={updateMetrics}
        />
      );
    },
    [currentIndex, updateMetrics]
  );

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
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
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
            getItemType={item => {
              if (item.feed) {
                return 'feed';
              } else if (item.shortply) {
                return 'shortply';
              }
              return 'unknown';
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
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
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
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
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
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
            {metricsData[currentIndex] && (
              <>
                <Text>비디오 로드 시간: {metricsData[currentIndex].loadTime.toFixed(1)}ms</Text>
                <Text>비디오 버퍼링 횟수: {metricsData[currentIndex].bufferingEvents}</Text>
                <Text>
                  비디오 버퍼링 시간: {metricsData[currentIndex].bufferingDuration.toFixed(1)}ms
                </Text>
                <Text>비디오 드롭 프레임: {metricsData[currentIndex].droppedFrames}</Text>
              </>
            )}
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
          {results.videoItemsCount > 0 && (
            <>
              <Text>비디오 평균 로드 시간: {results.videoAverageLoadTime?.toFixed(1)}ms</Text>
              <Text>비디오 버퍼링 횟수: {results.videoBufferingEvents}</Text>
              <Text>비디오 버퍼링 총 시간: {results.videoBufferingDuration?.toFixed(1)}ms</Text>
              <Text>비디오 드롭된 프레임: {results.videoDroppedFrames}</Text>
              <Text>비디오 아이템 수: {results.videoItemsCount}</Text>
            </>
          )}
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
