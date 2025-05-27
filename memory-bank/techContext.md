# Tech Context: Mobile Performance POC

## Technologies Used

- **React Native**: One of the core frameworks for building the mobile application.
- **Flutter**: The other core framework for building the mobile application for comparison.
- **Expo**: The development platform for React Native, providing tools and services.
- **Dart**: The programming language used for Flutter development.
- **TypeScript**: A typed superset of JavaScript used for React Native development.
- **PNPM**: A fast, disk space efficient package manager used for the React Native project.
- **ESLint**: A linting utility for React Native code.
- **Prettier**: A code formatter for React Native code.
- **Expo Router**: A file-based router for React Native navigation.
- **React Native Performance**: A library for measuring React Native performance.
- **FastImage**: A performant image loading component for React Native.
- **React Native Reanimated**: An animation library for React Native.
- **Zustand**: A state management solution for React Native.
- **Date-fns**: A date utility library for React Native.
- **Flutter DevTools**: Performance and debugging tools for Flutter.
- **Impeller**: Flutter's rendering engine.
- **`expo-video`**: 비디오 재생 기능을 위한 라이브러리.

## Development Setup

- **Node.js**: The JavaScript runtime environment.
- **PNPM**: Installed globally and used for project dependency management.
- **Expo CLI**: Installed globally for interacting with the Expo development platform.
- **VSCode**: The integrated development environment (IDE) with relevant extensions (ESLint, Prettier, TypeScript, React Native).
- **Android Studio / Xcode**: For running emulators or simulators.
- **Expo Go App**: Installed on a physical device or emulator for previewing the app.

## Technical Constraints

- **Cross-Platform Environment**: Development is constrained by the capabilities and limitations of both React Native/Expo and Flutter frameworks.
- **Performance Limitations**: Mobile device performance varies, and optimizing for a wide range of devices is a key challenge for both frameworks.
- **Data Size and Complexity**: The size and nested structure of the `docs/data.json` file can impact list rendering performance in both frameworks.
- **Third-Party Library Compatibility**: Ensuring compatibility between various third-party libraries and the respective framework versions.
- **Debugging Performance Issues**: Identifying and debugging performance bottlenecks can be complex in both environments, requiring specialized tools and techniques.

## Dependencies

- Refer to `react-native/package.json` for React Native dependencies (managed by PNPM).
- Refer to `flutter/pubspec.yaml` for Flutter dependencies (managed by Pub).

## Tool Usage Patterns

- **PNPM**: Used for installing, updating, and managing project dependencies.
- **Expo CLI**: Used for starting the development server, building the app, and interacting with emulators/devices.
- **ESLint & Prettier**: Integrated into the development workflow for linting and formatting code.
- **TypeScript Compiler**: Used for type checking the codebase.
- **React Native Debugger / Flipper**: Planned for debugging and profiling the application.
