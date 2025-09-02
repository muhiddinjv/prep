# Quranic App - Complete Rebuild Guide

## Overview
This guide will help you rebuild the Quranic React Native app from scratch, step by step. This is perfect for interview preparation.

## Prerequisites
- Node.js (v16+)
- Expo CLI: `npm install -g @expo/cli`
- Android Studio (for Android) or Xcode (for iOS)
- Git

## Step 1: Project Setup

### 1.1 Create New Expo Project
```bash
npx create-expo-app@latest QuranicApp --template blank-typescript
cd QuranicApp
```

### 1.2 Install Dependencies
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-vector-icons @types/react-native-vector-icons
npm install axios @react-native-async-storage/async-storage
```

### 1.3 Project Structure
Create this folder structure:
```
src/
├── components/
├── hooks/
├── navigation/
├── screens/
├── services/
├── shared/
│   ├── constants/
│   └── styles/
└── types/
```

## Step 2: TypeScript Types Setup

### 2.1 Create types/index.ts
```typescript
// API Response Types
export interface QuranApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface SurahListResponse extends Array<Surah> {}

export interface SurahResponse extends Surah {}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface BookmarkedAyah {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  timestamp: number;
  note?: string;
}

export interface QuranData {
  number: number;
  language: string;
  reciter: string;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}
```

## Step 3: API Service Setup

### 3.1 Create services/api.ts
```typescript
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  QuranData, 
  QuranApiResponse, 
  SurahListResponse, 
  SurahResponse, 
  AyahResponse 
} from "../types";

const api: AxiosInstance = axios.create({
  baseURL: 'https://api.alquran.cloud/v1',
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout');
    }
    if (error.response) {
      throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
    }
    throw new Error('Network error');
  }
);

export const quranAPI = {
  getSurahs: (): Promise<QuranApiResponse<SurahListResponse>> => 
    api.get('/surah'),
  
  getSurah: ({ number, language, reciter }: QuranData): Promise<QuranApiResponse<SurahResponse>> => 
    api.get(`/surah/${number}/${language}.${reciter}`),
 
  getAyah: ({ number, language, reciter }: QuranData): Promise<QuranApiResponse<AyahResponse>> =>
    api.get(`/ayah/${number}/${language}.${reciter}`),
};
```

### 3.2 Create services/bookmarkService.ts
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookmarkedAyah } from '../types';

const BOOKMARKS_KEY = '@quranic_bookmarks';

export const bookmarkService = {
  saveBookmark: async (bookmark: BookmarkedAyah): Promise<void> => {
    try {
      const existingBookmarks = await bookmarkService.getBookmarks();
      const updatedBookmarks = [...existingBookmarks, bookmark];
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error saving bookmark:', error);
      throw error;
    }
  },

  removeBookmark: async (surahNumber: number, ayahNumber: number): Promise<void> => {
    try {
      const existingBookmarks = await bookmarkService.getBookmarks();
      const updatedBookmarks = existingBookmarks.filter(
        bookmark => !(bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber)
      );
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  },

  getBookmarks: async (): Promise<BookmarkedAyah[]> => {
    try {
      const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_KEY);
      return bookmarksJson ? JSON.parse(bookmarksJson) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  },

  isBookmarked: async (surahNumber: number, ayahNumber: number): Promise<boolean> => {
    try {
      const bookmarks = await bookmarkService.getBookmarks();
      return bookmarks.some(
        bookmark => bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber
      );
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  },

  clearAllBookmarks: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(BOOKMARKS_KEY);
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      throw error;
    }
  },
};
```

## Step 4: Custom Hooks

### 4.1 Create hooks/useApiState.ts
```typescript
import { useState, useCallback } from 'react';
import { LoadingState } from '../types';

export interface ApiState<T> extends LoadingState {
  data: T | null;
}

export function useApiState<T>(initialData: T | null = null) {
  const [state, setState] = useState<ApiState<T>>({
    loading: false,
    error: null,
    data: initialData,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: loading ? null : prev.error }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const setData = useCallback((data: T) => {
    setState({ loading: false, error: null, data });
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    setLoading,
    setError,
    setData,
    reset,
  };
}
```

### 4.2 Create hooks/useApiCall.ts
```typescript
import { useCallback } from 'react';
import { useApiState } from './useApiState';

export function useApiCall<T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>
) {
  const { loading, error, data, setLoading, setError, setData, reset } = useApiState<T>();

  const execute = useCallback(async (...args: P) => {
    try {
      setLoading(true);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    }
  }, [apiFunction, setLoading, setError, setData]);

  return {
    loading,
    error,
    data,
    execute,
    reset,
  };
}
```

### 4.3 Create hooks/useBookmarks.ts
```typescript
import { useState, useEffect, useCallback } from 'react';
import { BookmarkedAyah } from '../types';
import { bookmarkService } from '../services/bookmarkService';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedAyah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const savedBookmarks = await bookmarkService.getBookmarks();
      setBookmarks(savedBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBookmark = useCallback(async (bookmark: BookmarkedAyah) => {
    try {
      await bookmarkService.saveBookmark(bookmark);
      setBookmarks(prev => [...prev, bookmark]);
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }, []);

  const removeBookmark = useCallback(async (surahNumber: number, ayahNumber: number) => {
    try {
      await bookmarkService.removeBookmark(surahNumber, ayahNumber);
      setBookmarks(prev => 
        prev.filter(bookmark => 
          !(bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber)
        )
      );
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }, []);

  const toggleBookmark = useCallback(async (bookmark: BookmarkedAyah) => {
    const isBookmarked = bookmarks.some(
      b => b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber
    );

    if (isBookmarked) {
      await removeBookmark(bookmark.surahNumber, bookmark.ayahNumber);
    } else {
      await addBookmark(bookmark);
    }
  }, [bookmarks, addBookmark, removeBookmark]);

  const isBookmarked = useCallback((surahNumber: number, ayahNumber: number) => {
    return bookmarks.some(
      bookmark => bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber
    );
  }, [bookmarks]);

  const clearAllBookmarks = useCallback(async () => {
    try {
      await bookmarkService.clearAllBookmarks();
      setBookmarks([]);
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      throw error;
    }
  }, []);

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearAllBookmarks,
    refreshBookmarks: loadBookmarks,
  };
}
```

## Step 5: Shared Constants and Styles

### 5.1 Create shared/constants/routes.ts
```typescript
export const ROUTERS = {
  quran: 'Quran',
  bookmarks: 'Bookmarks',
  about: 'About',
  help: 'Help',
} as const;

export const ICONS = {
  [ROUTERS.quran]: 'book',
  [ROUTERS.bookmarks]: 'bookmark',
  [ROUTERS.about]: 'info',
  [ROUTERS.help]: 'help',
} as const;
```

### 5.2 Create shared/styles/colors.ts
```typescript
export const COLORS = {
  primary: '#2E7D32',
  secondary: '#666666',
  tertiary: '#999999',
  quaternary: '#cccccc',
  quinary: '#ffffff',
  background: '#f8f8f8',
  error: '#d32f2f',
  success: '#388e3c',
  warning: '#f57c00',
} as const;
```

## Step 6: Components

### 6.1 Create components/LoadingSpinner.tsx
```typescript
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

interface LoadingSpinnerProps {
  loading: boolean;
  error?: string | null;
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  children?: React.ReactNode;
}

export default function LoadingSpinner({ 
  loading, 
  error, 
  size = 'large', 
  color = '#2E7D32',
  text = 'Loading...',
  children 
}: LoadingSpinnerProps) {
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={size} color={color} />
        <Text style={styles.loadingText}>{text}</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
```

## Step 7: Navigation Setup

### 7.1 Create navigation/AppNavigator.tsx
```typescript
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialIcons";

import SurahListScreen from "../screens/SurahListScreen";
import SurahDetailScreen from "../screens/SurahDetailScreen";
import AboutScreen from "../screens/AboutScreen";
import BookmarksScreen from "../screens/BookmarksScreen";
import { ICONS, ROUTERS } from "../shared/constants/routes";
import { COLORS } from "../shared/styles/colors";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export type RootStackParamList = {
  SurahList: undefined;
  SurahDetail: { surahNumber: number; surahName: string; targetAyahNumber?: number };
  Bookmarks: undefined;
};

function SurahStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.quinary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="SurahList"
        component={SurahListScreen}
        options={{ title: "Surahs" }}
      />
      <Stack.Screen
        name="SurahDetail"
        component={SurahDetailScreen}
        options={({ route }) => ({
          title: (route.params as any)?.surahName || "Surah",
        })}
      />
    </Stack.Navigator>
  );
}

const getTabScreenOptions = ({ route }: { route: any }) => ({
  tabBarIcon: ({ color, size }: { color: string; size: number }) => {
    const iconName = ICONS?.[route.name as keyof typeof ICONS] || ICONS[ROUTERS.help];
    return <Icon name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: COLORS.secondary,
  headerShown: false,
});

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={getTabScreenOptions}>
        <Tab.Screen name={ROUTERS.quran} component={SurahStack} />
        <Tab.Screen name={ROUTERS.bookmarks} component={BookmarksScreen} />
        <Tab.Screen name={ROUTERS.about} component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

## Step 8: Screens Implementation

### 8.1 Create screens/SurahListScreen.tsx
```typescript
import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { quranAPI } from "../services/api";
import { useApiCall } from "../hooks/useApiCall";
import { Surah } from "../types";
import { RootStackParamList } from "../navigation/AppNavigator";
import LoadingSpinner from "../components/LoadingSpinner";

type SurahListNavigationProp = StackNavigationProp<RootStackParamList, 'SurahList'>;

export default function SurahListScreen() {
  const navigation = useNavigation<SurahListNavigationProp>();
  
  const { loading, error, data, execute } = useApiCall(quranAPI.getSurahs);

  useEffect(() => {
    execute();
  }, [execute]);

  const handleSurahPress = (surah: Surah) => {
    navigation.navigate('SurahDetail', {
      surahNumber: surah.number,
      surahName: surah.englishName,
    });
  };

  const renderSurahItem = ({ item }: { item: Surah }) => (
    <TouchableOpacity 
      style={styles.surahItem} 
      onPress={() => handleSurahPress(item)}
    >
      <View style={styles.surahNumber}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.englishName}</Text>
        <Text style={styles.surahTranslation}>{item.englishNameTranslation}</Text>
        <Text style={styles.surahDetails}>
          {item.revelationType} • {item.numberOfAyahs} verses
        </Text>
      </View>
      <Text style={styles.arabicName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LoadingSpinner 
        loading={loading} 
        error={error}
        text="Loading Surahs..."
      >
        <FlatList
          data={data?.data || []}
          renderItem={renderSurahItem}
          keyExtractor={(item) => item.number.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </LoadingSpinner>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  listContainer: {
    padding: 16,
  },
  surahItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  numberText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  surahTranslation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  surahDetails: {
    fontSize: 12,
    color: "#999",
  },
  arabicName: {
    fontSize: 16,
    color: "#2E7D32",
    fontWeight: "bold",
  },
});
```

## Step 9: Complete the Remaining Screens

### 9.1 Create screens/SurahDetailScreen.tsx
[Continue with the full implementation including bookmark functionality, auto-scroll, and performance optimizations]

### 9.2 Create screens/BookmarksScreen.tsx
[Implement with useFocusEffect, bookmark management, and navigation]

### 9.3 Create screens/AboutScreen.tsx
[Implement with settings, language selection, and developer info]

## Step 10: Testing and Debugging

### 10.1 Test Each Feature
- API calls and error handling
- Navigation between screens
- Bookmark functionality
- Auto-scroll to bookmarked ayahs
- Performance with large lists

### 10.2 Common Issues to Watch For
- TypeScript errors
- Navigation type mismatches
- AsyncStorage permissions
- FlatList performance
- Memory leaks

## Step 11: Interview Preparation

### 11.1 Practice Explaining
- Why you chose Axios over fetch
- How the bookmark sync works
- Performance optimizations
- Error handling strategies

### 11.2 Prepare for Questions
- "How would you add search?"
- "How would you handle offline mode?"
- "How would you test this?"
- "How would you scale this?"

## Tips for Success
1. **Build it yourself** - Don't copy-paste, understand each line
2. **Think aloud** - Practice explaining your decisions
3. **Handle edge cases** - Think about error scenarios
4. **Show your process** - Interviewers want to see how you think
5. **Be honest** - If you don't know something, say so

## Time Estimate
- **Setup**: 30 minutes
- **Core features**: 4-6 hours
- **Polish & testing**: 2-3 hours
- **Practice explaining**: 1-2 hours
- **Total**: 8-12 hours

Good luck with your interview! 🚀
