import { memo } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

import { FeedItemData } from '@typedefs/feed';

const { width, height } = Dimensions.get('window');

interface FeedItemProps {
  item: FeedItemData;
}

export const FeedItem = memo(({ item }: FeedItemProps) => {
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

  const thumbnailUrl = displayData.thumbnailUrl;
  const contentText =
    displayData.content || (item.shortply?.hashtag ? `#${item.shortply.hashtag.name}` : '');

  return (
    <View style={styles.container}>
      {thumbnailUrl ? (
        <FastImage
          style={styles.thumbnail}
          source={{ uri: thumbnailUrl }}
          resizeMode={FastImage.resizeMode.cover}
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
});

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
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
    color: 'red',
    fontSize: 18,
  },
});

export default FeedItem;
