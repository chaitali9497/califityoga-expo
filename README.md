# Califitoga Expo

Califitoga is a wellness and habit-tracking mobile app built with Expo and React Native. The app combines habit creation, daily progress tracking, onboarding, mood logging, and simple reporting in a clean green-themed interface.

## Features

- Splash, welcome, login, and sign-up flow
- Multi-step onboarding flow for collecting daily routine preferences
- Create regular or one-time habits
- Daily, weekly, and monthly habit scheduling
- Morning, afternoon, and evening habit grouping
- Habit streak tracking
- Mood calendar with optional feeling tags
- Report screen with habit stats and visual summaries
- Account screen with profile and app settings UI
- Local persistence using AsyncStorage

## Tech Stack

- Expo 54
- React Native 0.81
- React 19
- Expo Router for file-based navigation
- TypeScript
- AsyncStorage for local data persistence

## Project Structure

```text
app/
  (auth)/          Authentication and entry screens
  (onboarding)/    Multi-step onboarding flow
  (tabs)/          Main app screens
src/
  components/      Reusable UI components
  context/         Habit and onboarding state providers
  store/           Local storage helpers
  theme/           Shared colors and theme tokens
  types/           Shared TypeScript types
assets/images/     App branding and illustration assets
```

## Main Screens

- `Home`: shows active habits, completed habits, and time-of-day filters
- `Create Regular Habit`: create habits with icon, color, repeat rule, and schedule
- `My Habits`: search, filter, and review saved habits
- `Mood Stat`: log moods in a calendar view with feeling labels
- `Report`: view completion summaries and chart-based insights
- `Account`: profile, plan, preferences, and logout UI

## App Flow

1. The app opens on a splash screen.
2. Users move through welcome, sign-in, or sign-up screens.
3. New users continue through onboarding steps.
4. Authenticated users land in the main tab flow.
5. Habits are stored locally and restored when the app reopens.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo development server:

   ```bash
   npm run start
   ```

3. Run on a specific platform if needed:

   ```bash
   npm run android
   npm run ios
   npm run web
   ```

## Available Scripts

- `npm run start` - start the Expo dev server
- `npm run android` - open the app on Android
- `npm run ios` - open the app on iOS
- `npm run web` - run the app in the browser
- `npm run lint` - run lint checks

## Data Storage

Habit data is currently stored locally with AsyncStorage through `src/store/habitStorage.ts`. The `HabitProvider` loads habits on startup and saves updates automatically.

## Current Notes

- Authentication is currently UI-driven and uses simulated flows
- Report charts contain placeholder and mock data in some sections
- Mood entries are currently stored in component state, not persistent storage
- The project uses Expo Router with hidden native tab bars and a custom bottom navigation component

## Future Improvements

- Connect login and sign-up screens to a real backend
- Persist mood logs and onboarding results
- Add edit and delete actions for habits
- Improve report calculations with real historical data
- Add reminders and notifications
