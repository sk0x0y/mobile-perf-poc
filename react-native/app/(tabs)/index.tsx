import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { AutomatedFeedTest } from '@components/AutomatedFeedTest';

export default function HomeScreen() {
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const router = useRouter();

  const handleTestComplete = (testId: string, results: any) => {
    console.log(`Test ${testId} completed with results:`, results);
    setRunningTest(null);
    router.push('/metrics');
  };

  const startTest = (testName: string) => {
    setRunningTest(testName);
  };

  if (runningTest) {
    return (
      <AutomatedFeedTest
        testName={runningTest}
        itemCount={100}
        swipeDuration={500}
        onComplete={handleTestComplete}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>성능 테스트 앱</Text>
      <Text style={styles.subtitle}>각 리스트 컴포넌트별 성능 테스트 (이미지 및 비디오 포함)</Text>

      <View style={styles.buttonContainer}>
        <Button title="FlatList 테스트 시작" onPress={() => startTest('FlatList Test')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="FlashList 테스트 시작" onPress={() => startTest('FlashList Test')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="SectionList 테스트 시작" onPress={() => startTest('SectionList Test')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="VirtualizedList 테스트 시작"
          onPress={() => startTest('VirtualizedList Test')}
        />
      </View>

      <Text style={styles.note}>* 테스트에는 이미지 및 비디오 성능이 모두 포함됩니다.</Text>

      <Link href="/metrics" asChild>
        <Button title="측정 결과 보기" />
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
  },
  buttonContainer: {
    marginVertical: 8,
    width: '80%',
  },
  note: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
});
