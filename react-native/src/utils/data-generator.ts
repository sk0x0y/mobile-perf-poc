import { FeedItemData } from '@typedefs/feed';

import localFeedData from '@docs/data.json';

export const loadFeedData = async (): Promise<FeedItemData[]> => {
  return localFeedData as FeedItemData[];
};

export const generateTestData = (count: number): FeedItemData[] => {
  if (count <= 0) {
    return [];
  }

  const baseData: FeedItemData[] = localFeedData as FeedItemData[];
  if (baseData.length === 0) {
    console.warn('Base data from data.json is empty. Cannot generate test data.');
    return [];
  }

  const testData: FeedItemData[] = [];
  for (let i = 0; i < count; i++) {
    const originalItem = baseData[i % baseData.length];
    const newItem = JSON.parse(JSON.stringify(originalItem));

    if (newItem.feed && originalItem.feed) {
      newItem.feed.id = originalItem.feed.id * 1000000 + i;
    } else if (newItem.shortply && originalItem.shortply) {
      newItem.shortply.id = originalItem.shortply.id * 1000000 + i;
    }
    testData.push(newItem);
  }
  return testData;
};
