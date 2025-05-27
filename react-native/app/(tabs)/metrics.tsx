import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import {
  getPerformanceTestResults,
  deletePerformanceResult,
  clearAllPerformanceResults,
} from '@utils/performanceStorage';

interface TestResult {
  id: string;
  metadata: {
    testName: string;
    itemCount: number;
    summary: {
      fps?: number;
      frameDrops?: number;
      memoryUsage?: number;
      transitionDelay?: number;
      renderTime?: number;
      videoAverageLoadTime?: number;
      videoBufferingEvents?: number;
      videoBufferingDuration?: number;
      videoDroppedFrames?: number;
      videoItemsCount?: number;
    };
  };
  detailData: any;
}

export default function MetricsScreen() {
  const [results, setResults] = useState<TestResult[]>([]);

  const loadResults = useCallback(async () => {
    const savedResults = await getPerformanceTestResults();
    setResults(savedResults);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadResults();
    }, [loadResults])
  );

  const handleDeleteResult = useCallback(
    (id: string) => {
      Alert.alert('결과 삭제', '정말로 이 테스트 결과를 삭제하시겠습니까?', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: async () => {
            const success = await deletePerformanceResult(id);
            if (success) {
              loadResults();
            } else {
              Alert.alert('오류', '결과 삭제에 실패했습니다.');
            }
          },
        },
      ]);
    },
    [loadResults]
  );

  const handleClearAllResults = useCallback(() => {
    Alert.alert('모든 결과 삭제', '정말로 모든 테스트 결과를 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '모두 삭제',
        onPress: async () => {
          const success = await clearAllPerformanceResults();
          if (success) {
            loadResults();
          } else {
            Alert.alert('오류', '모든 결과 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  }, [loadResults]);

  const renderResultItem = ({ item }: { item: TestResult }) => (
    <View style={styles.resultItem}>
      <View style={styles.resultHeader}>
        <Text style={styles.testName}>{item.metadata.testName}</Text>
        <TouchableOpacity onPress={() => handleDeleteResult(item.id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Text>항목 수: {item.metadata.itemCount}</Text>
      <Text>평균 FPS: {item.metadata.summary.fps?.toFixed(1) || 'N/A'}</Text>
      <Text>프레임 드롭: {item.metadata.summary.frameDrops || 'N/A'}</Text>
      <Text>메모리 사용량: {item.metadata.summary.memoryUsage?.toFixed(1) || 'N/A'}MB</Text>
      <Text>렌더링 시간: {item.metadata.summary.renderTime?.toFixed(1) || 'N/A'}ms</Text>
      <Text>전환 지연: {item.metadata.summary.transitionDelay?.toFixed(1) || 'N/A'}ms</Text>
      {item.metadata.summary.videoItemsCount && item.metadata.summary.videoItemsCount > 0 && (
        <>
          <Text style={styles.videoMetricsTitle}>비디오 성능 지표</Text>
          <Text>
            비디오 평균 로드 시간: {item.metadata.summary.videoAverageLoadTime?.toFixed(1) || 'N/A'}
            ms
          </Text>
          <Text>비디오 버퍼링 횟수: {item.metadata.summary.videoBufferingEvents || 'N/A'}회</Text>
          <Text>
            비디오 버퍼링 총 시간:{' '}
            {item.metadata.summary.videoBufferingDuration?.toFixed(1) || 'N/A'}ms
          </Text>
          <Text>비디오 드롭된 프레임: {item.metadata.summary.videoDroppedFrames || 'N/A'}개</Text>
          <Text>비디오 아이템 수: {item.metadata.summary.videoItemsCount || 'N/A'}개</Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>성능 측정 결과</Text>
        {results.length > 0 && (
          <TouchableOpacity onPress={handleClearAllResults} style={styles.clearButton}>
            <Ionicons name="trash-bin-outline" size={24} color="gray" />
            <Text style={styles.clearButtonText}>모두 지우기</Text>
          </TouchableOpacity>
        )}
      </View>

      {results.length > 0 ? (
        <FlatList data={results} renderItem={renderResultItem} keyExtractor={item => item.id} />
      ) : (
        <Text style={styles.noResultsText}>저장된 테스트 결과가 없습니다.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  clearButtonText: {
    marginLeft: 4,
    color: 'gray',
    fontWeight: 'bold',
  },
  resultItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoMetricsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});
