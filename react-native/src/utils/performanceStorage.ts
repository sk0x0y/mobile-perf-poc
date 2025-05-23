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
