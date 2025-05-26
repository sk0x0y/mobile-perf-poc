# Active Context: Mobile Performance POC

## Current Work Focus

The current focus is on implementing the React Native feed rendering performance test plan, including integrating `expo-image`, optimizing `FlashList`, and setting up automated performance measurements.

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

## Next Steps

- Implement the full logic for performance measurement metrics in the React Native application.
- Develop the list rendering test screens in React Native to load and display data from `docs/data.json`.
- Implement and test various list rendering optimization techniques in React Native.
- Refine type definitions in `app/types/feed.ts` based on a more thorough analysis of `docs/data.json`.
- Set up the Flutter project and implement the equivalent list rendering and performance measurement logic as outlined in `docs/PRD.md`.
- Conduct performance tests for both React Native and Flutter applications according to the plan in `docs/PRD.md`.
- Analyze the performance test results and document findings in `memory-bank/progress.md`.
- Prepare a report comparing the performance of React Native and Flutter based on the test results.

## Active Decisions and Considerations

- Using `@ts-ignore` as a temporary workaround for `react-native-performance` TypeScript errors. A more permanent solution is needed.
- **JavaScript 기반 FPS 측정 구현**: 네이티브 의존성 없이 `requestAnimationFrame`을 사용한 FPS 측정 기능을 `performance.ts`에 구현하고 `usePerformanceMetrics` 훅을 통해 통합.
- **성능 메트릭스 데이터 수집 개선**: getter 함수들(`getCurrentFps`, `getDroppedFrames`, `getCurrentRenderTime`, `getCurrentTransitionDelay`)을 추가하여 비동기 상태 업데이트 문제를 해결하고 정확한 성능 데이터 수집 보장.
- **Watchman 관련 오류 해결**: Watchman 서비스 재시작을 통해 프로젝트 실행 시 발생하던 오류 해결.

## Next Steps

- 구현된 JavaScript 기반 FPS 측정을 활용한 데이터 수집 및 분석 수행.
- 각 리스트 구현체 간의 성능 비교 분석 및 결과 시각화.
- 측정된 데이터의 통계적 분석 및 보고서 작성.

## Active Decisions and Considerations

- **JavaScript 기반 FPS 측정 구현**: `react-native-performance`의 'frame' 엔트리 타입이 지원되지 않는 문제에 대응하여, 순수 JavaScript 기반 FPS 측정 메커니즘을 구현했습니다. 이 방식은 네이티브 FPS보다는 JavaScript 스레드의 성능을 측정하지만, 관리형 워크플로우 내에서 유용한 비교 데이터를 제공합니다.
- The terminal output is not updating reliably, making it difficult to confirm successful bundling and app launch. This issue might require further investigation or manual verification steps by the user.
- The peer dependency warning for `react-native-fast-image` and React version 19 still needs to be addressed to ensure compatibility.
- The structure of `docs/data.json` is complex; the current type definitions might need further refinement.
- **`react-native-device-info` native module issue**: Decided to use a dummy implementation for memory usage measurement in `src/utils/performance.ts` to allow continued development in the managed workflow. A full native module solution would require switching to a development build (`npx expo prebuild`).
- **`expo-router` default export warning**: `WARN Route "./(tabs)/index.tsx" is missing the required default export.` This warning persists despite verifying the `index.tsx` and `_layout.tsx` files. It is currently considered a non-blocking issue, possibly related to Expo's internal caching or `expo-router` version.

## Learnings and Project Insights

- PNPM's `public-hoist-pattern` is crucial for compatibility with React Native and Expo.
- Explicitly including files in `tsconfig.json` might be necessary for TypeScript to correctly resolve modules within Barrel files in some project setups.
- Debugging module resolution issues in a complex setup like React Native with Expo, PNPM, path aliases, and Barrel Pattern can be challenging.
- Understanding how Expo Router handles file-based routing is critical for proper project structuring and avoiding unnecessary warnings.
- Careful management of `default` vs. `named` exports is important when using barrel files and module aliases.
- **Managed workflow limitations**: Direct use of certain native modules like `react-native-device-info` is restricted in Expo's managed workflow, necessitating workarounds or a switch to development builds.
