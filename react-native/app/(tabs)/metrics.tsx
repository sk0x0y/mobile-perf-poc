import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import { getPerformanceTestResults } from '@utils/performanceStorage';

interface TestResult {
  id: string;
  metadata: {
    testName: string;
    itemCount: number;
    summary: {
      fps?: number;
      memoryUsage?: number;
    };
  };
  detailData: any;
}

export default function MetricsScreen() {
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const loadResults = async () => {
      const savedResults = await getPerformanceTestResults();
      setResults(savedResults);
    };

    loadResults();
  }, []);

  const renderResultItem = ({ item }: { item: TestResult }) => (
    <View style={styles.resultItem}>
      <Text style={styles.testName}>{item.metadata.testName}</Text>
      <Text>항목 수: {item.metadata.itemCount}</Text>
      <Text>평균 FPS: {item.metadata.summary.fps?.toFixed(1) || 'N/A'}</Text>
      <Text>메모리 사용량: {item.metadata.summary.memoryUsage?.toFixed(1) || 'N/A'}MB</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>성능 측정 결과</Text>

      {results.length > 0 ? (
        <FlatList data={results} renderItem={renderResultItem} keyExtractor={item => item.id} />
      ) : (
        <Text>저장된 테스트 결과가 없습니다.</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resultItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  testName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
