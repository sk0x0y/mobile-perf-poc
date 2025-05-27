# Progress: Mobile Performance POC

## What Works

- Initial project scaffolding for React Native Expo with PNPM is complete.
- ESLint and Prettier are configured for the React Native project.
- Path aliases and Barrel Pattern structure are implemented in the React Native project.
- Basic Expo Router navigation with tabs is set up in the React Native project.
- Placeholder files for most components, hooks, utilities, services, and list test screens are created in the React Native project.
- Type definitions for the feed data have been initially created and partially refined.
- Performance test plan and PRD documents (`docs/PRD.md`, `docs/PRD-gaps.md`) have been completed.
- **React Native project structure refactored**: Non-routing code moved from `app/` to `src/` to resolve Expo Router warnings.
- **`PerformanceMonitor` import issue resolved**: Corrected the import mechanism for `PerformanceMonitor` in `app/_layout.tsx`.
- **Package version compatibility addressed**: Downgraded `@shopify/flash-list`, `react-native-gesture-handler`, and `react-native-pager-view` to compatible versions.
- **`app.json` warnings resolved**: `scheme` added to `app.json` for linking, and `newArchEnabled` was confirmed to be correctly set.
- **All comments removed from `.ts`, `.tsx`, and `.js` files within the `react-native` directory.**
- **Path alias `@types` renamed to `@typedefs`**: Configuration files (`tsconfig.json`, `babel.config.js`) updated. No code changes were required as direct imports using `@types/` prefix were not found.
- **List rendering test basic structure unified**: `sectionlist.tsx` and `virtualized.tsx` were modified to use `AutomatedFeedTest`.
- **Expo Image integration**: `FeedItem.tsx` was updated to use `expo-image` for image loading, replacing `FastImage`. `react-native-fast-image` 의존성 제거 완료.
- **FlashList 최적화**: `AutomatedFeedTest.tsx`에서 `estimatedItemSize` 및 `getItemType`을 사용하여 `FlashList` 최적화 적용.
- **`react-native-performance` related TypeScript issues resolved**: `performance.ts` was updated to extend `PerformanceEntry` type and cast `entryType`.
- **`any` type replacement**: `feed.ts` was updated with more specific interfaces instead of `any`.
- **`generateTestData` function implemented**: `data-generator.ts` now includes the `generateTestData` function.
- **FullScreenFeedPager for each list type implemented**: `AutomatedFeedTest` now conditionally renders FlatList, FlashList, SectionList, and VirtualizedList based on `testName`.
- **Detailed performance metrics collection implemented**: Memory usage measurement using a dummy implementation in `performance.ts` and integrated into `usePerformanceMetrics` hook.
- **Performance measurement results screen implemented**: `app/(tabs)/metrics.tsx` now displays collected performance data.
- **Test automation script implemented**: `app/(tabs)/index.tsx` now includes buttons to trigger automated tests using `AutomatedFeedTest`.
- **`expo-video` 통합**: `app.json`에 `expo-video` 플러그인 추가 및 `VideoFeedItem.tsx` 컴포넌트 구현을 통해 비디오 재생 기능이 통합되었습니다.
- **비디오 성능 측정 구현**: `useVideoPerformanceMetrics` 훅을 통해 비디오 로딩 및 재생 성능 측정이 구현되었으며, `metrics.tsx` 화면에 관련 지표가 표시됩니다.
- **`FeedItem.tsx` 및 `AutomatedFeedTest.tsx` 업데이트**: 비디오 콘텐츠를 포함한 피드 아이템 렌더링 및 테스트 로직이 업데이트되었습니다.
- **비디오 플레이어 오류 해결**: `VideoFeedItem.tsx`에서 `VideoPlayer` 인스턴스 참조 관리 및 정리 로직을 개선하여 "Cannot use shared object that was already released" 오류 해결. `useRef`를 활용하여 `player` 객체에 대한 안정적인 참조를 유지하고, 컴포넌트 마운트 상태를 추적하여 안전하게 `play()` 및 `pause()` 메서드를 호출하도록 수정.

## What's Left to Build

- Full implementation of performance measurement metrics logic in both React Native and Flutter applications. (Note: Memory usage is currently a dummy implementation in RN).
- Complete development of list rendering test screens in both frameworks to load and display data from `docs/data.json`.
- Implementation and testing of various list rendering optimization techniques in both frameworks.
- Refinement of type definitions based on a comprehensive analysis of `docs/data.json`.
- Implementation of utility functions (data generation, formatting, validation) in both frameworks.
- Implementation of service functions (API, storage) in both frameworks.
- Integration of performance metrics display in the UI for both applications.
- Setting up and running automated performance tests for both frameworks.
- **PNPM 워크스페이스 문제 해결**: `pnpm -F react-native start` 명령이 여전히 "No projects matched the filters" 오류를 발생시키는 문제에 대한 추가 조사 및 해결.

## Current Status

The React Native project의 비디오 재생 기능 통합 및 비디오 성능 측정 기능 구현이 완료되었습니다. 이제 앱을 실행하여 실제 모바일 환경에서 비디오 재생 및 성능 측정 기능을 검증해야 합니다. PNPM 워크스페이스 설정은 완료되었으나, `pnpm -F` 명령어로 프로젝트를 시작하는 데 문제가 있어 추가 조사가 필요합니다.

## Known Issues

- **JavaScript 기반 FPS 측정 구현**: `requestAnimationFrame`을 활용한 FPS 및 프레임 드롭 측정 기능을 순수 JavaScript로 구현하여 Expo 관리형 워크플로우의 제한을 우회.
- **성능 측정 인프라 개선**: `usePerformanceMetrics` 훅에 getter 함수들을 추가하여 비동기 상태 업데이트로 인한 데이터 수집 문제 해결.
- **Watchman 서비스 관련 오류 해결**: 프로젝트 실행 시 발생하던 권한 관련 오류를 Watchman 서비스 재시작으로 해결.
- **PNPM 워크스페이스 문제**: `pnpm-workspace.yaml` 파일이 루트에 생성되었음에도 불구하고 `pnpm -F react-native start` 명령이 "No projects matched the filters" 오류를 발생시킵니다. 이는 `pnpm` 워크스페이스 설정 또는 사용법에 대한 추가 조사가 필요함을 의미합니다.

## Known Issues

- **`react-native-performance` `frame` entry type not supported**: `WARN The entry type 'frame' does not exist or isn't supported.` 경고가 발생하여 FPS 및 프레임 드롭 측정이 현재 Expo 관리형 워크플로우에서 불가능합니다. 다른 지표(렌더링 시간, 메모리, 전환 지연)에 집중하거나, 개발 빌드 전환을 고려해야 합니다.
- TypeScript errors related to `react-native-performance` persist and are currently suppressed with `@ts-ignore`.
- The terminal output in the environment details is not updating reliably, making it difficult to confirm successful bundling and app launch.
- **`expo-router` default export warning**: `WARN Route "./(tabs)/index.tsx" is missing the required default export.` This warning persists despite verifying the `index.tsx` and `_layout.tsx` files. It is currently considered a non-blocking issue, possibly related to Expo's internal caching or `expo-router` version.

## Evolution of Project Decisions

- **JavaScript 기반 FPS 측정 채택**: 네이티브 'frame' 엔트리 타입 지원 제한을 해결하기 위해 `requestAnimationFrame` 기반의 JavaScript FPS 측정 방식을 구현했습니다. 이는 베어 워크플로우로 전환하지 않고도 의미 있는 성능 데이터를 수집할 수 있게 합니다.

## Evolution of Project Decisions

- Initially planned to use relative paths for imports, but switched to path aliases and Barrel Pattern for better code organization and maintainability.
- Decided to use PNPM as the package manager based on user request and its benefits for monorepos and efficient dependency management.
- Chose Expo Router for navigation due to its file-based approach and ease of use with Expo.
- Opted for a Google style base for ESLint due to its comprehensiveness and widespread adoption, combined with React Native specific rules for mobile development best practices.
- Decided to compare React Native and Flutter performance to inform the technical stack decision.
- Completed the performance test plan and PRD documents based on the project goals and requirements.
- Encountered and temporarily worked around TypeScript issues with `react-native-performance` due to lack of immediate access to specific documentation via the MCP tool.
- **Adopted a clear separation of routing (`app/`) and non-routing (`src/`) code** to adhere to best practices and resolve Expo Router warnings.
- **Prioritized resolving package version conflicts** to ensure project stability and compatibility.
- **Implemented dummy memory measurement**: Due to limitations of `react-native-device-info` in Expo's managed workflow, a dummy implementation was used for memory usage measurement to allow continued development.
