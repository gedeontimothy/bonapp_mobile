# BonApp Mobile

Mobile application built with React Native.

---

# Requirements

Before running the project, make sure you have installed:

* JDK 17
* Node.js `>= v18`
* Android SDK

  * SDK 31 — Android 12
  * Android SDK Build Tools 31
* Android Emulator API Level 31 (optional)

Check your environment setup with:

```bash
npx react-native doctor
```

---

# Installation

```bash
npm install
```

---

# Run the Application

```bash
npx react-native run-android
```

---

# Technologies

* React Native
  [React Native 0.70 Documentation](https://reactnative-archive-august-2023.netlify.app/docs/0.70/getting-started?utm_source=chatgpt.com)

* Redux
  [Redux Documentation](https://redux.js.org/introduction/getting-started?utm_source=chatgpt.com)

* Realm
  [Realm React Native Documentation](https://www.mongodb.com/docs/atlas/device-sdks/sdk/react-native/?utm_source=chatgpt.com)

---

# Useful Resources

### Articles

* [Building a React Native App with Realm Database](https://dev.to/ajmal_hasan/building-a-react-native-app-with-realm-database-4ab4?utm_source=chatgpt.com)

### Tutorials

* [Realm Database, Expo SDK 49 and Expo Router - Getting Started](https://www.youtube.com/watch?v=uH-X37WPGYw&utm_source=chatgpt.com)

---

# Project Structure

```text
.
├── App.js
├── index.js
└── src/
    ├── api/
    ├── assets/
    ├── components/
    ├── config/
    ├── constants/
    ├── hooks/
    ├── layouts/
    ├── locales/
    ├── middleware/
    ├── navigation/
    ├── partials/
    ├── providers/
    ├── screens/
    ├── services/
    ├── store/
    │   ├── index.js
    │   └── features/
    └── utils/
```

---

# Useful Commands

## Check Environment

```bash
npx react-native doctor
```

## Start Metro Bundler

```bash
npx react-native start
```

## Run Android App

```bash
npx react-native run-android
```

## Reset Metro Cache

```bash
npx react-native start --reset-cache
```
