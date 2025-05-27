import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export async function saveTestMetadata(testId: string, metadata: any) {
  try {
    const key = `perf_meta_${testId}`;
    await AsyncStorage.setItem(key, JSON.stringify(metadata));
    return key;
  } catch (e) {
    console.error('AsyncStorage 저장 실패:', e);
    return null;
  }
}

export async function deletePerformanceResult(testId: string) {
  try {
    const metaKey = `perf_meta_${testId}`;
    await AsyncStorage.removeItem(metaKey);

    const dataPath = `${FileSystem.documentDirectory}perf_data_${testId}.json`;
    await FileSystem.deleteAsync(dataPath, { idempotent: true });
    console.log(`테스트 결과 삭제 완료: ${testId}`);
    return true;
  } catch (e) {
    console.error(`테스트 결과 삭제 실패 (${testId}):`, e);
    return false;
  }
}

export async function clearAllPerformanceResults() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const metaKeys = keys.filter(k => k.startsWith('perf_meta_'));

    const fileDeletePromises = metaKeys.map(async key => {
      const testId = key.replace('perf_meta_', '');
      const dataPath = `${FileSystem.documentDirectory}perf_data_${testId}.json`;
      try {
        await FileSystem.deleteAsync(dataPath, { idempotent: true });
      } catch (e) {
        console.warn(`파일 시스템 데이터 삭제 실패 (${testId}):`, e);
      }
    });

    await Promise.all(fileDeletePromises);
    await AsyncStorage.multiRemove(metaKeys);

    console.log('모든 테스트 결과 삭제 완료');
    return true;
  } catch (e) {
    console.error('모든 테스트 결과 삭제 실패:', e);
    return false;
  }
}

export async function saveDetailedPerformanceData(testId: string, data: any) {
  try {
    const fileName = `${FileSystem.documentDirectory}perf_data_${testId}.json`;
    await FileSystem.writeAsStringAsync(fileName, JSON.stringify(data), {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return fileName;
  } catch (e) {
    console.error('파일 저장 실패:', e);
    return null;
  }
}

export async function getPerformanceTestResults() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const metaKeys = keys.filter(k => k.startsWith('perf_meta_'));
    const metadatas = await AsyncStorage.multiGet(metaKeys);

    return await Promise.all(
      metadatas.map(async ([key, value]) => {
        const meta = JSON.parse(value as string);
        const testId = key.replace('perf_meta_', '');
        const dataPath = `${FileSystem.documentDirectory}perf_data_${testId}.json`;

        let detailData = null;
        try {
          const dataExists = await FileSystem.getInfoAsync(dataPath);
          if (dataExists.exists) {
            const content = await FileSystem.readAsStringAsync(dataPath);
            detailData = JSON.parse(content);
          }
        } catch (e) {
          console.warn('상세 데이터 로드 실패:', e);
        }

        return {
          id: testId,
          metadata: meta,
          detailData,
        };
      })
    );
  } catch (e) {
    console.error('테스트 결과 로드 실패:', e);
    return [];
  }
}

export async function saveInitialLoadTime(loadTime: number) {
  try {
    const key = `perf_initial_load_time_${Date.now()}`;
    await AsyncStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), loadTime }));
    return key;
  } catch (e) {
    console.error('초기 로딩 시간 저장 실패:', e);
    return null;
  }
}
