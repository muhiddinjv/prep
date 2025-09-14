# Interview Project: Quranic React Native App

## Overview
This is a completely blank implementation of a Quranic reading app prepared for an interview. Only the basic navigation structure is in place.

## Project Structure
```
src/
├── components/          # Create reusable UI components here
├── navigation/         
│   └── AppNavigator.tsx # Navigation configuration (already set up)
├── screens/            # Screen components (blank implementations)
│   ├── AboutScreen.tsx
│   ├── BookmarksScreen.tsx
│   ├── SurahDetailScreen.tsx
│   └── SurahListScreen.tsx
├── services/           # Create API services here
├── types/              # TypeScript type definitions (mostly empty)
│   └── index.ts
```

## Getting Started
1. Install dependencies: `npm install` or `yarn install`
2. Start the Metro bundler: `npm start` or `yarn start`
3. Run on iOS: `npm run ios` or `yarn ios`
4. Run on Android: `npm run android` or `yarn android`

## Fixed Bugs
- [project on expo-snack](https://snack.expo.dev/@muhiddin/prep)
- prevent bookmarking duplicate ayahs 
- add more room for swipe control buttons
- update the bookmark icon on bookmark click (HARD)
- auto-load 10 more surahs after surah 10 on SurahListScreen
- disable card swiping on reaching the 1st and the last ayah
- navigate to the bookmarked ayah from BookmarksScreen (HARD)
- update BookmarksScreen item on bookmark toggle on SurahDetailScreen
