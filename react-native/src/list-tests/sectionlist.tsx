import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { AutomatedFeedTest } from '@components/AutomatedFeedTest';

export default function SectionListTest() {
  const { count = '100', swipeDuration = '800' } = useLocalSearchParams();
  const itemCount = parseInt(count as string, 10);
  const duration = parseInt(swipeDuration as string, 10);

  return (
    <View style={styles.container}>
      <AutomatedFeedTest
        testName="SectionList Test"
        itemCount={itemCount}
        swipeDuration={duration}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
