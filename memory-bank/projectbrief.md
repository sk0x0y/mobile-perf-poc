# Project Brief: Mobile Performance POC

## Project Goal

Develop React Native Expo and Flutter mobile applications to measure and compare list rendering performance using real-world data, and to inform the technical stack decision. This now includes evaluating video playback performance and stability.

## Key Requirements

- Utilize PNPM as the package manager.
- Implement ESLint and Prettier with a Google style guide base, incorporating React Native specific and performance-focused rules.
- Structure the project using Expo Router for navigation.
- Implement path aliases and the Barrel Pattern for improved code organization and import management.
- Create dedicated screens for testing different list rendering components (FlatList, FlashList, SectionList, VirtualizedList).
- Use the provided `docs/data.json` file as the data source for list rendering tests.
- Implement performance measurement metrics (render time, memory usage, FPS, **video load time, buffering events, buffering duration, dropped video frames**) and display them.
- Explore and apply React Native performance optimization techniques, especially for list rendering, image loading, and video playback.

## Current Status

- Project scaffolding is complete, including initial setup of PNPM, ESLint, Prettier, Expo Router, path aliases, and Barrel Pattern.
- Placeholder files for core components, hooks, utilities, services, and list test screens have been created.
- Basic navigation structure with tabs is in place.
- Performance test plan and PRD documents (`docs/PRD.md`, `docs/PRD-gaps.md`) have been completed.
- **`expo-video` 통합 및 비디오 성능 측정 기능 구현 완료.**
- **비디오 플레이어 오류 해결 완료.**

## Next Steps

- Address remaining TypeScript errors, particularly those related to `react-native-performance`.
- Implement the full logic for performance measurement metrics.
- Develop the list rendering test screens to load and display data from `docs/data.json`.
- Implement and test various list rendering optimization techniques.
- Refine type definitions based on the actual data structure.
- Investigate and resolve the peer dependency warning for `react-native-fast-image`.
- Document performance test results and optimization findings.
