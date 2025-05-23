import { View, Text, StyleSheet } from 'react-native';

interface PerformanceMetricsProps {
  renderTime: number;
  memoryUsage: number;
  fps: number;
}

export function PerformanceMetrics({ renderTime, memoryUsage, fps }: PerformanceMetricsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>렌더링 시간</Text>
        <Text style={styles.metricValue}>{renderTime.toFixed(2)}ms</Text>
      </View>

      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>메모리 사용량</Text>
        <Text style={styles.metricValue}>{memoryUsage}MB</Text>
      </View>

      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>FPS (추정)</Text>
        <Text style={styles.metricValue}>{fps.toFixed(1)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricLabel: {
    fontWeight: '600',
  },
  metricValue: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default PerformanceMetrics;
