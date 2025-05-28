import { memo } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Image } from 'expo-image';

import { FeedItemData } from '@typedefs/feed';
import { VideoMetrics } from '@typedefs/video-metrics';

import { VideoFeedItem } from './VideoFeedItem';

const { width, height } = Dimensions.get('window');

interface FeedItemProps {
  item: FeedItemData;
  index: number;
  focusedIndex?: number;
  isActive?: boolean;
  onVideoLoad?: () => void;
  onVideoError?: (error: Error) => void;
  onVideoMetricsUpdate?: (index: number, metrics: VideoMetrics) => void;
}

export const FeedItem = memo(
  ({
    item,
    index,
    focusedIndex,
    isActive = false,
    onVideoLoad,
    onVideoError,
    onVideoMetricsUpdate,
  }: FeedItemProps) => {
    // 피드 데이터 추출
    let displayData = null;
    if (item.feed) {
      displayData = item.feed;
    } else if (item.shortply && item.shortply.feedList && item.shortply.feedList.length > 0) {
      displayData = item.shortply.feedList[0];
    }

    if (!displayData) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Invalid item data</Text>
        </View>
      );
    }

    // 비디오 URL이 있는지 확인
    const hasVideo = Boolean(displayData.videoUrl);

    // 비디오가 있고 현재 활성 아이템인 경우에만 비디오 컴포넌트 렌더링
    if (hasVideo) {
      return (
        <VideoFeedItem
          item={item}
          isActive={isActive}
          onVideoLoad={onVideoLoad}
          onVideoError={onVideoError}
          onMetricsUpdate={metrics => onVideoMetricsUpdate?.(index, metrics)}
        />
      );
    }

    // 기존 이미지 표시 로직 유지
    const thumbnailUrl = displayData.thumbnailUrl;
    const contentText =
      displayData.content || (item.shortply?.hashtag ? `#${item.shortply.hashtag.name}` : '');

    return (
      <View style={styles.container}>
        {thumbnailUrl ? (
          <Image
            style={styles.thumbnail}
            source={{ uri: thumbnailUrl }}
            contentFit="cover"
            transition={1000}
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        {contentText ? (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>{contentText}</Text>
          </View>
        ) : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width,
    height,
  },
  thumbnailPlaceholder: {
    width,
    height,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 4,
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#f00',
    fontSize: 18,
  },
});
