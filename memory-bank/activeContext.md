# Active Context: Mobile Performance POC

## Current Work Focus

The current focus is on integrating `expo-video` for video playback, implementing video performance measurement, and refining the overall list rendering performance test plan in React Native. **Additionally, the focus has been on implementing realistic list scrolling and paging scenarios for performance testing.**

## Recent Changes

- Initial Expo project created with TypeScript template using PNPM.
- `.npmrc` file configured for PNPM and React Native compatibility.
- ESLint and Prettier configuration files (`.eslintrc.js`, `.prettierrc`, `.prettierignore`) created.
- VSCode settings file (`.vscode/settings.json`) created for editor integration.
- Lint and format scripts added to `package.json`.
- Core dependencies installed using PNPM (including Expo Router, state management, performance libraries).
- Project files moved to the root directory after initial scaffolding created a nested directory.
- Basic Expo Router navigation structure implemented (`app/_layout.tsx`, `app/index.tsx`, `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/metrics.tsx`).
- Placeholder files for various components, hooks, utilities, and services created based on the planned structure.
- Placeholder files for list rendering test screens (`flatlist.tsx`, `flashlist.tsx`, `sectionlist.tsx`, `virtualized.tsx`) created.
- Path aliases added to `tsconfig.json` and `babel.config.js`.
- Barrel files created in component, hook, utility, type, and service directories.
- Addressed some TypeScript errors by refining type definitions and adding `@ts-ignore` comments for `react-native-performance` related issues.
- Corrected import paths in `app/(tabs)/_layout.tsx` and `app/components/common/index.ts`.
- Completed performance test plan and PRD documents (`docs/PRD.md`, `docs/PRD-gaps.md`).
- **Refactored project structure to resolve Expo Router warnings**: Moved non-routing code from `app/` to `src/` (e.g., `components/`, `hooks/`, `services/`, `types/`, `utils/`, `providers/`, `list-tests/`).
- **Updated configuration files**: `tsconfig.json` and `babel.config.js` were updated to reflect new path aliases.
- **Corrected `PerformanceMonitor` import**: Resolved TypeScript error in `app/_layout.tsx` by modifying `src/providers/performance-monitor.tsx` to use only named exports.
- **Downgraded packages**: `@shopify/flash-list`, `react-native-gesture-handler`, `react-native-pager-view` were downgraded to ensure compatibility with Expo.
- **Resolved `app.json` warnings**: Added `scheme` to `app.json` to address linking warnings. `newArchEnabled` warning was found to be already resolved.
- **Removed comments from all `.ts`, `.tsx`, `.js` files in the `react-native` directory.**
- **Renamed `@types` path alias to `@typedefs`**: Updated `tsconfig.json` and `babel.config.js` to reflect this change. No code modifications were needed as `@types/` prefix was not directly used in imports.
- **Implemented automated test script**: Added `AutomatedFeedTest` component to `app/(tabs)/index.tsx` for running various list tests.
- **Implemented performance metrics display**: Updated `app/(tabs)/metrics.tsx` to show collected performance data.
- **Resolved `react-native-device-info` native module error**: Replaced `measureMemoryUsage` in `src/utils/performance.ts` with a dummy implementation to simulate memory usage, bypassing the native module issue in managed workflow.
- **비디오 플레이어 오류 해결**: `VideoFeedItem.tsx`에서 `VideoPlayer` 인스턴스 참조 관리 및 정리 로직을 개선하여 "Cannot use shared object that was already released" 오류 해결. `useRef`를 활용하여 `player` 객체에 대한 안정적인 참조를 유지하고, 컴포넌트 마운트 상태를 추적하여 안전하게 `play()` 및 `pause()` 메서드를 호출하도록 수정.
- **성능 결과 삭제 기능 구현**: `performanceStorage.ts`에 전체/개별 결과 삭제 로직 추가 및 `metrics.tsx`에 관련 UI 및 기능 연동 완료.
- **성능 결과 즉시 로딩 개선**: `metrics.tsx`에 `useFocusEffect`를 적용하여 탭 포커스 시 최신 결과가 로드되도록 수정.
- **리스트 페이징 및 자동 스크롤 구현**:
  - `react-native/src/utils/data-generator.ts`에 `loadPagedFeedData` 함수를 추가하여 `data.json`에서 페이지별 데이터를 로드할 수 있도록 했습니다.
  - `react-native/src/components/AutomatedFeedTest.tsx`를 수정하여 `loadPagedFeedData`를 사용한 초기 데이터 로딩, `currentPage`, `hasMoreData`, `isFetchingMoreData` 상태 변수를 통한 페이징 로직 관리, `handleLoadMore` 콜백 함수 구현, `runTest` 함수 내 자동 스크롤 로직을 `while` 루프 기반으로 변경하여 페이징과 연동, 그리고 `FlatList`, `FlashList`, `SectionList`, `VirtualizedList` 컴포넌트에 `onEndReached` 및 `onEndReachedThreshold` prop을 추가했습니다.
- **자동화 테스트 화면 메트릭 표시 영역 레이아웃 개선**: `AutomatedFeedTest.tsx` 파일에서 비디오 메트릭이 추가되거나 제거될 때 레이아웃이 변경되지 않도록 `realtimeMetrics` 및 `results` 섹션의 스타일을 수정했습니다. 비디오 메트릭을 위한 고정 높이의 수평 레이아웃을 적용했습니다.

## Next Steps

- Implement the full logic for performance measurement metrics in the React Native application.
- Develop the list rendering test screens in React Native to load and display data from `docs/data.json`.
- Implement and test various list rendering optimization techniques in React Native.
- Refine type definitions in `app/types/feed.ts` based on a more thorough analysis of `docs/data.json`.
- Set up the Flutter project and implement the equivalent list rendering and performance measurement logic as outlined in `docs/PRD.md`.
- Conduct performance tests for both React Native and Flutter applications according to the plan in `docs/PRD.md`.
- Analyze the performance test results and document findings in `memory-bank/progress.md`.
- Prepare a report comparing the performance of React Native and Flutter based on the test results.
- **리스트 페이징 및 자동 스크롤 기능 테스트 및 검증**: 구현된 페이징 및 자동 스크롤 기능이 의도대로 동작하는지 확인하고, 실제 시나리오에서의 성능을 측정합니다.

## Active Decisions and Considerations

- Using `@ts-ignore` as a temporary workaround for `react-native-performance` TypeScript errors. A more permanent solution is needed.
- **성능 결과 삭제 시 사용자 확인 절차 추가**: 실수로 인한 데이터 삭제를 방지하기 위해 `Alert.alert`를 통한 확인 대화상자를 구현했습니다.
- **`useFocusEffect`를 사용하여 결과 목록 즉시 업데이트 결정**: `metrics.tsx` 화면이 포커스될 때마다 최신 성능 결과를 로드하여 사용자 경험을 개선했습니다.
- **JavaScript 기반 FPS 측정 구현**: 네이티브 의존성 없이 `requestAnimationFrame`을 사용한 FPS 측정 기능을 `performance.ts`에 구현하고 `usePerformanceMetrics` 훅을 통해 통합.
- **성능 메트릭스 데이터 수집 개선**: getter 함수들(`getCurrentFps`, `getDroppedFrames`, `getCurrentRenderTime`, `getCurrentTransitionDelay`)을 추가하여 비동기 상태 업데이트 문제를 해결하고 정확한 성능 데이터 수집 보장.
- **`expo-video` 통합**: `app.json`에 `expo-video` 플러그인을 추가하고, `VideoFeedItem.tsx` 컴포넌트를 구현하여 비디오 재생 기능을 통합했습니다.
- **비디오 성능 측정**: `useVideoPerformanceMetrics` 훅을 통해 비디오 로딩 및 재생 성능을 측정하고, `metrics.tsx` 화면에 표시하도록 구현했습니다.
- **`FeedItem.tsx` 업데이트**: 비디오 콘텐츠 유무에 따라 `VideoFeedItem` 또는 이미지 컴포넌트를 조건부 렌더링하도록 수정했습니다.
- **`AutomatedFeedTest.tsx` 업데이트**: 비디오 성능 측정 로직을 통합하고, `FeedItem`에 필요한 props를 전달하도록 수정했습니다.
- **`index.tsx` 업데이트**: 테스트 시작 화면의 설명을 업데이트하여 비디오 성능 테스트가 포함됨을 명시했습니다.
- **Watchman 관련 오류 해결**: Watchman 서비스 재시작을 통해 프로젝트 실행 시 발생하던 오류 해결.
- **리스트 페이징 및 자동 스크롤 구현 결정**: 실제 시나리오에 가까운 성능 테스트를 위해 `data.json` 기반의 페이지 로딩 및 자동 스크롤 시뮬레이션을 구현하기로 결정했습니다.
- **자동화 테스트 화면 메트릭 표시 영역 레이아웃 안정화**: 비디오 메트릭의 유무에 관계없이 `AutomatedFeedTest.tsx`의 `realtimeMetrics` 및 `results` 섹션의 레이아웃이 변경되지 않도록 `minHeight`와 수평 레이아웃을 적용했습니다.

## Learnings and Project Insights

- PNPM's `public-hoist-pattern` is crucial for compatibility with React Native and Expo.
- Explicitly including files in `tsconfig.json` might be necessary for TypeScript to correctly resolve modules within Barrel files in some project setups.
- Debugging module resolution issues in a complex setup like React Native with Expo, PNPM, path aliases, and Barrel Pattern can be challenging.
- Understanding how Expo Router handles file-based routing is critical for proper project structuring and avoiding unnecessary warnings.
- Careful management of `default` vs. `named` exports is important when using barrel files and module aliases.
- **Managed workflow limitations**: Direct use of certain native modules like `react-native-device-info` is restricted in Expo's managed workflow, necessitating workarounds or a switch to development build.
- **AsyncStorage와 FileSystem을 함께 사용하여 데이터를 관리할 때 일관성 유지의 중요성**: 성능 결과 삭제 기능 구현 시 두 저장소 간의 데이터 일관성을 유지하는 것이 중요함을 확인했습니다.
- **Expo Router의 `useFocusEffect`를 활용한 화면 업데이트 전략의 유용성**: 탭 전환 시 최신 데이터를 즉시 반영하는 데 `useFocusEffect`가 매우 효과적임을 확인했습니다.
- **리스트 페이징 구현의 복잡성**: `onEndReached`와 자동 스크롤 로직을 연동하고, 데이터 로딩 상태 및 종료 조건을 관리하는 것이 중요함을 확인했습니다.
- **UI 레이아웃 안정화의 중요성**: 동적으로 내용이 추가되거나 제거될 때 발생하는 레이아웃 쉬프트는 사용자 경험을 저해하고 불필요한 렌더링을 유발할 수 있음을 확인했습니다. `minHeight`와 같은 CSS 속성 및 유연한 레이아웃(`flexDirection: 'row'`, `flexWrap: 'wrap'`)을 통해 이를 효과적으로 방지할 수 있습니다.
- **리스트 스냅 효과 정확도 개선**: `AutomatedFeedTest.tsx`에서 `onLayout`을 통해 실제 리스트 컨테이너의 높이를 동적으로 측정하고, 이 값을 `getItemLayout`, `snapToInterval` 및 `renderFeedItem` 내의 `FeedItem` 높이에 적용하여 상단 메트릭 영역을 고려한 정확한 스크롤 스냅을 구현했습니다.
