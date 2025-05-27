export interface VideoMetrics {
  loadTime: number; // 비디오 로드에 걸린 시간 (ms)
  bufferingEvents: number; // 버퍼링 발생 횟수
  bufferingDuration: number; // 총 버퍼링 시간 (ms)
  droppedFrames: number; // 드롭된 프레임 수
}
