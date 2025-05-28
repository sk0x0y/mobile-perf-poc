import { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useVideoPlayer, VideoView, VideoPlayer } from 'expo-video';

import { FeedItemData } from '@typedefs/feed';
import { VideoMetrics } from '@typedefs/video-metrics';

const { width, height } = Dimensions.get('window');

interface VideoFeedItemProps {
  item: FeedItemData;
  isActive: boolean;
  onVideoLoad?: () => void;
  onVideoError?: (error: Error) => void;
  onMetricsUpdate?: (metrics: VideoMetrics) => void;
}

export const VideoFeedItem = ({
  item,
  isActive,
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

  const playerRef = useRef<VideoPlayer | null>(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;

      try {
        if (playerRef.current) {
          playerRef.current.pause();
          playerRef.current = null;
        }
      } catch (error) {
        console.log('Video cleanup on unmount error:', error);
      }
    };
  }, []);

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
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    if (!playerRef.current) return;

    const statusSubscription = playerRef.current.addListener(
      'statusChange',
      ({ status, error }) => {
        if (error) {
          onVideoError?.(error as any);
        }

        if (status === 'readyToPlay' && metrics.current.loadTime === 0) {
          metrics.current.loadTime = performance.now() - loadStartTime.current;
          onMetricsUpdate?.(metrics.current);
        }

        if (status === 'loading' && bufferingStartTime.current === 0) {
          bufferingStartTime.current = performance.now();
          metrics.current.bufferingEvents += 1;
        }

        if (status === 'readyToPlay' && bufferingStartTime.current > 0) {
          const duration = performance.now() - bufferingStartTime.current;
          metrics.current.bufferingDuration += duration;
          bufferingStartTime.current = 0;
          onMetricsUpdate?.(metrics.current);
        }
      }
    );

    return () => {
      statusSubscription.remove();
    };
  }, [playerRef.current, onMetricsUpdate, onVideoError]);

  useEffect(() => {
    if (!playerRef.current || !isMounted.current) return;

    try {
      if (isActive) {
        playerRef.current.play();
        setIsPlaying(true);
      } else {
        playerRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.log('Video playback control error:', error);
    }
  }, [isActive, playerRef.current, isMounted.current]);

  const togglePlayback = useCallback(() => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.pause();
        setIsPlaying(false);
      } else {
        playerRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Toggle playback error:', error);
    }
  }, [isPlaying, playerRef.current]);

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
