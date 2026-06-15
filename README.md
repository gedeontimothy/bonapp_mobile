# BonApp Mobile

Mobile application built with React Native.

The application uses a layered architecture based on:

* React Native
* Redux Toolkit
* Realm Database
* React Navigation
* React Hook Form
* Zod
* i18next

---

# Requirements

Before running the project, make sure you have installed:

* JDK 17
* Node.js `>= 18`
* Android SDK

  * SDK 31 (Android 12)
  * Android SDK Build Tools 31
* Android Emulator API Level 31 (optional)

Verify your environment:

```bash
npx react-native doctor
```

---

# Installation

Install dependencies:

```bash
npm install
```

---

# Run the Application

Start Metro (optional):

```bash
npx react-native start --reset-cache
```

Run Android application:

```bash
npx react-native run-android
```

---

# Architecture Overview

The application follows a layered architecture:

```text
UI
│
├─ Screens
├─ Partials
├─ Components
│
Hooks
│
Services
│
Repositories
│
Realm Database
```

### Responsibilities

#### Components

Reusable UI elements shared across the application.

Examples:

* AppText
* Button
* Dropdown
* Field
* PinField
* UserCard

#### Partials

Reusable screen composition blocks.

Examples:

* ThemeToggle
* LanguagePicker
* RecentProfiles

#### Screens

Application pages and user flows.

Examples:

* WelcomeScreen
* LoginScreen
* RegisterScreen

#### Hooks

Application business entry points.

Examples:

* useAuth
* useUser
* useUserActions
* usePerson
* usePersonActions
* useTheme
* useLanguage

#### Services

Business layer responsible for coordinating domain operations.

Examples:

* UserService
* PersonService

#### Repositories

Persistence abstraction layer over Realm.

Examples:

* UserRepository
* PersonRepository

#### Database

Realm models, embedded models, mappers and database-specific exceptions.

---

# Internationalization

The application uses i18next with namespace-based translations.

Supported languages:

* English
* French

Current namespaces:

* common
* errors
* feedback
* validations
* lang
* theme
* screens

---

# State Management

Redux Toolkit is used for global state management.

Current features:

* auth
* lang
* settings
* process
* users

The store is responsible for:

* authentication state
* user profiles
* application settings
* language selection
* async process tracking

---

# Local Database

The application uses Realm as its local database.

Current domains:

### Person

Stores personal information.

### User

Stores authentication and account information.

### UserPersonSnapshot

Embedded snapshot used to keep user-related display information synchronized without requiring joins.

---

# Technologies

* React Native
* Redux Toolkit
* React Navigation
* Realm
* React Hook Form
* Zod
* i18next

Useful documentation:

* [https://reactnative-archive-august-2023.netlify.app/docs/0.70/getting-started](https://reactnative-archive-august-2023.netlify.app/docs/0.70/getting-started)
* [https://redux-toolkit.js.org](https://redux-toolkit.js.org)
* [https://reactnavigation.org](https://reactnavigation.org)
* [https://www.mongodb.com/docs/atlas/device-sdks/sdk/react-native](https://www.mongodb.com/docs/atlas/device-sdks/sdk/react-native)
* [https://react-hook-form.com](https://react-hook-form.com)
* [https://zod.dev](https://zod.dev)
* [https://www.i18next.com](https://www.i18next.com)

---

# Project Structure

```text
src/
├── assets/
├── components/
│
├── database/
│   ├── errors/
│   │   └── *.exception.js
│   ├── mappers/
│   │   └── *Mapper.js
│   ├── models/
│   │   ├── embedded/
│   │   └── *.js
│   └── repositories/
│       └── *.js
│
├── forms/
│   └── */*.js
│
├── hooks/
│   └── *.js
│
├── i18n/
│   └── index.js
│
├── layouts/
│   └── *.layout.js
│
├── locales/
│   └── (en|fr)/
│       └── *.json
│
├── navigations/
│   └── *.js
│
├── partials/
│   └── */*.js
│
├── providers/
│   └── *.js
│
├── screens/
│   └── **/
│       └── *.js
│
├── services/
│   └── *.js
│
├── store/
│   ├── middleware/
│   │   └── *.js
│   └── features/
│       ├── index.js
│       └── */
│           ├── *.slice.js
│           └── *.selector.js
│
├── theme/
│   └── *.js
│
├── types/
│   └── *.types.js
│
└── utils/
    └── *.js
```

---

# Useful Commands

### Check Environment

```bash
npx react-native doctor
```

### Start Metro

```bash
npx react-native start
```

### Run Android

```bash
npx react-native run-android
```

### Reset Metro Cache

```bash
npx react-native start --reset-cache
```

### Clean Android Build

```bash
cd android
gradlew clean
```
