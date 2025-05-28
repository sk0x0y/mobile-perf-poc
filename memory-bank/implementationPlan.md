# Implementation Plan: Improve Metric Display Layout in AutomatedFeedTest

## 1. Goal

Modify the `AutomatedFeedTest.tsx` component to prevent layout shifts in the metrics display area when video metrics are added or removed. This will be achieved by ensuring the metrics area maintains a consistent height regardless of the presence of video-specific information.

## 2. Problem Description

Currently, when video metrics are displayed in the "realtimeMetrics" and "results" sections of `AutomatedFeedTest.tsx`, the overall height of these sections changes. This causes layout shifts and potential re-renders, impacting user experience and potentially performance.

## 3. Proposed Solution

### 3.1. `realtimeMetrics` Section (`AutomatedFeedTest.tsx`)

- **Objective**: Ensure the real-time metrics display area maintains a consistent height.
- **Changes**:
  1.  The existing general performance metrics (FPS, Frame Drops, Memory Usage, Transition Delay) will continue to be displayed vertically.
  2.  A new dedicated horizontal row/area with a fixed `minHeight` will be added below the general metrics specifically for video performance metrics.
  3.  This new area will display video metrics (Load Time, Buffering Events, Buffering Duration, Dropped Frames) horizontally (e.g., using `flexDirection: 'row'`).
  4.  If no video metrics are available for the current item (e.g., it's not a video or metrics are still loading), this dedicated area will still occupy the same vertical space, possibly showing placeholder text like "비디오 정보 없음" or simply remaining blank but maintaining its height. This ensures no layout shift occurs.
  5.  The `realtimeMetrics` `View` style might need adjustment (e.g., `minHeight` or internal padding) to accommodate this new fixed-height row for video metrics without causing the overall section to resize.

### 3.2. `results` Section (`AutomatedFeedTest.tsx`)

- **Objective**: Ensure the test results summary area also maintains a consistent height.
- **Changes**:
  1.  Similar to the `realtimeMetrics` section, the area displaying video-related summary statistics (Video Average Load Time, Buffering Events, etc.) will be designed to have a consistent height.
  2.  Video-related results will also be displayed horizontally within a dedicated part of the `results` view.
  3.  If a test run does not include video items or video metrics, this part of the summary will still occupy its allocated space (e.g., showing "N/A" for video metrics) to prevent the `results` section from changing height.

## 4. Files to Modify

- `react-native/src/components/AutomatedFeedTest.tsx`:
  - Update the JSX structure for `realtimeMetrics` and `results` sections.
  - Update the `StyleSheet` for these sections to implement fixed heights/minHeights and horizontal layout for video metrics.

## 5. Expected Outcome

- Elimination of layout shifts in the metrics display area when video metrics appear or disappear.
- Potentially improved performance due to reduced re-renders.
- A more stable and visually consistent user interface during automated tests.

## 6. Visual Plan (Conceptual)

**Realtime Metrics Area:**

```
+--------------------------------------+
| FPS: 60                              |
| Frame Drops: 0                       |
| Memory: 100MB                        |
| Transition Delay: 10ms               |
+--------------------------------------+
| Video Load: 500ms | Buffering: 0 | ...|  <- Fixed height horizontal row
+--------------------------------------+
```

**Results Summary Area:**

```
+--------------------------------------+
| Average FPS: 59.8                    |
| Total Frame Drops: 5                 |
| ...                                  |
+--------------------------------------+
| Video Avg Load: 550ms | Total Buff: 2| ...| <- Fixed height horizontal row
+--------------------------------------+
```

(If no video data, the horizontal rows above would be present but show "N/A" or be blank, maintaining the space).
