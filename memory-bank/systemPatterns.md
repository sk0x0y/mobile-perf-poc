# System Patterns: Mobile Performance POC

## Architecture

The project involves two separate applications, one in React Native and one in Flutter, for performance comparison.

### React Native Architecture

Follows a component-based architecture with a clear separation of concerns:

- **App Entry Point**: `app/index.tsx` redirects to the main tab navigation.
- **Root Layout**: `app/_layout.tsx` sets up the root `Stack` navigator, `SafeAreaProvider`, `PerformanceMonitor` provider, and global `StatusBar`.
- **Tab Navigation**: `app/(tabs)/_layout.tsx` defines the tab bar using `expo-router`'s `Tabs` component.
- **Screens**: Individual screens for different sections of the app (e.g., `app/(tabs)/index.tsx`, `app/(tabs)/metrics.tsx`). Routing-related screens are located in `app/`, while non-routing components and utilities are in `src/`.
- **Components**: Reusable UI elements and logical components, organized into `src/components` with `ui`, `common`, and `screens` subdirectories.
- **Hooks**: Custom React hooks for encapsulating logic (e.g., `useColorScheme`, `usePerformanceMetrics`), located in `src/hooks`.
- **Utilities**: Helper functions for various tasks (e.g., performance measurement, data generation, formatting, validation, **and performance result persistence**), located in `src/utils`.
- **Services**: Modules for handling external interactions like API calls and local storage, located in `src/services`.
- **Types**: TypeScript type definitions for data structures and props, located in `src/types`.
- **Providers**: Context providers for global state or functionality (`PerformanceMonitor`), located in `src/providers`.

### Flutter Architecture

Will follow a similar component-based architecture, leveraging Flutter's widget tree and state management patterns.

- **Entry Point**: `lib/main.dart`
- **Navigation**: Using Flutter's built-in navigation or a package like `go_router`.
- **Screens/Pages**: Individual screens for different sections.
- **Widgets**: Reusable UI elements.
- **State Management**: Using a chosen state management solution (e.g., Provider, Riverpod, BLoC).
- **Utilities**: Helper functions.
- **Services**: Data handling.

## Performance Measurement Patterns

- **In-App Metrics Display**: Displaying key performance indicators directly on the UI during testing.
- **Logging and Data Export**: Recording detailed performance data to a file for later analysis.
- **Platform-Specific Profiling Tools**: Utilizing Xcode Instruments, Android Profiler, React DevTools Profiler, and Flutter DevTools for in-depth analysis.

## Data Handling Patterns

- Loading and parsing local JSON data (`docs/data.json`) **with support for page-based loading**.
- Providing data to list components efficiently.
- Managing (saving, loading, **deleting**) performance test results using AsyncStorage for metadata and FileSystem for detailed data.

## Key Technical Decisions

- **Expo Router**: Chosen for file-based routing and simplified navigation setup.
- **PNPM**: Selected as the package manager for efficient dependency management.
- **TypeScript**: Used for type safety and improved code maintainability.
- **ESLint & Prettier**: Configured for code quality enforcement and consistent formatting.
- **Path Aliases**: Implemented to simplify import paths and improve code readability. The `@types` alias was renamed to `@typedefs` for clarity and to avoid potential conflicts.
- **Barrel Pattern**: Applied to group related modules and streamline imports.
- **React Native Performance Libraries**: Integrated for measuring and monitoring app performance.
- **Expo Image**: Used for optimized image loading and caching, replacing `FastImage` due to better compatibility with Expo and ongoing maintenance.
- **Zustand**: Planned for state management (lightweight and flexible).
- **`expo-video` 통합**: `VideoFeedItem.tsx` 컴포넌트에서 `useVideoPlayer` 훅을 사용하여 비디오 재생 기능을 통합.

## Design Patterns

- **Component-Based Architecture**: Breaking down the UI into reusable components.
- **Container/Presentational Components**: Separating logic from UI rendering (implicitly followed in screen and component structure).
- **Hooks**: Encapsulating stateful logic and side effects.
- **Dependency Injection**: Services and utilities are imported where needed.
- **Barrel Pattern**: Module aggregation for cleaner imports.

## Critical Implementation Paths

- **List Rendering Pipeline**: Loading data from `docs/data.json` **in a paged manner**, passing it to list components, rendering items, and measuring performance during scrolling.
- **Performance Monitoring Integration**: Capturing performance metrics using `react-native-performance` and displaying them via the `PerformanceMetrics` component, **and managing their persistence (saving, loading, and deleting)**.
- **Navigation Flow**: Ensuring smooth transitions between tabs and list test screens using Expo Router.
- **비디오 재생 및 성능 측정**: `VideoFeedItem.tsx`에서 `useVideoPlayer`를 통해 비디오를 재생하고, `useVideoPerformanceMetrics` 훅을 통해 로드 시간, 버퍼링, 드롭된 프레임 등의 성능 지표를 측정.

## Important Patterns and Preferences

- Preference for functional components and React Hooks.
- Emphasis on performance optimization, especially for list rendering.
- Use of TypeScript for strong typing.
- Adherence to configured ESLint and Prettier rules.
- Organized imports using path aliases and Barrel Pattern.
- **비디오 플레이어 인스턴스 관리**: `VideoFeedItem.tsx` 내에서 `useRef`를 사용하여 `VideoPlayer` 인스턴스에 대한 안정적인 참조를 유지하고, 컴포넌트 마운트 상태를 추적하여 안전하게 `play()` 및 `pause()` 메서드를 호출하도록 구현. 컴포넌트 언마운트 시 `player` 리소스를 안전하게 정리.
