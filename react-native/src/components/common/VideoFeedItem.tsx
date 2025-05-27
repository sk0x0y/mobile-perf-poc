import { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useVideoPlayer, VideoView, VideoPlayer } from 'expo-video';

import { FeedItemData } from '@typedefs/feed';
import { VideoMetrics } from '@typedefs/video-metrics';

const { width, height } = Dimensions.get('window');

interface VideoFeedItemProps {
  item: FeedItemData;
  isFocused: boolean;
  onVideoLoad?: () => void;
  onVideoError?: (error: Error) => void;
  onMetricsUpdate?: (metrics: VideoMetrics) => void;
}

export const VideoFeedItem = ({
  item,
  isFocused,
  onVideoLoad,
  onVideoError,
  onMetricsUpdate,
}: VideoFeedItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const loadStartTime = useRef<number>(0);
  const metrics = useRef<VideoMetrics>({
    loadTime: 0,
    bufferingEvents: 0,
    bufferingDuration: 0,
    droppedFrames: 0,
  });
  const bufferingStartTime = useRef<number>(0);

  let videoUrl: string | undefined;
  if (item.feed?.videoUrl) {
    videoUrl = item.feed.videoUrl;
  } else if (item.shortply?.feedList && item.shortply.feedList.length > 0) {
    videoUrl = item.shortply.feedList[0].videoUrl;
  }

  if (!videoUrl) {
    return null;
  }

  const player = useVideoPlayer(
    { uri: videoUrl, useCaching: true },
    useCallback((playerInstance: VideoPlayer) => {
      playerInstance.loop = true;

      loadStartTime.current = performance.now();
    }, [])
  );

  useEffect(() => {
    if (!player) return;

    const statusSubscription = player.addListener('statusChange', ({ status, error }) => {
      if (error) {
        onVideoError?.(error as any);
      }

      // 첫 프레임 로드 완료 시 로드 시간 측정
      if (status === 'readyToPlay' && metrics.current.loadTime === 0) {
        metrics.current.loadTime = performance.now() - loadStartTime.current;
        onMetricsUpdate?.(metrics.current);
      }

      // 버퍼링 시작
      if (status === 'loading' && bufferingStartTime.current === 0) {
        bufferingStartTime.current = performance.now();
        metrics.current.bufferingEvents += 1;
      }

      // 버퍼링 종료
      if (status === 'readyToPlay' && bufferingStartTime.current > 0) {
        const duration = performance.now() - bufferingStartTime.current;
        metrics.current.bufferingDuration += duration;
        bufferingStartTime.current = 0;
        onMetricsUpdate?.(metrics.current);
      }
    });

    return () => {
      statusSubscription.remove();
    };
  }, [player, onMetricsUpdate, onVideoError]);

  useEffect(() => {
    if (isFocused) {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }

    return () => {
      player.pause();
    };
  }, [isFocused, player]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  }, [isPlaying, player]);

  const toggleControls = useCallback(() => {
    setShowControls(prev => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} style={styles.videoContainer} onPress={toggleControls}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
          onFirstFrameRender={onVideoLoad}
        />

        {showControls && (
          <View style={styles.controls}>
            <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
              <Text style={styles.playButtonText}>{isPlaying ? '정지' : '재생'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {item.feed?.content && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>{item.feed.content}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});
