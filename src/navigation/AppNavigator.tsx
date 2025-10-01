import React from 'react';
import { View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AboutScreen from '@/screens/AboutScreen';
import BookmarksScreen from '@/screens/BookmarksScreen';
import SurahStack from '@/screens/SurahStack';
import { ROUTERS } from '@/shared/constants';
import { COLORS } from '@/shared/styles';

import { getTabScreenOptions } from './utils';

const Tab = createBottomTabNavigator();

const tabs = {
  [ROUTERS.quran]: SurahStack,
  [ROUTERS.bookmarks]: BookmarksScreen,
  [ROUTERS.about]: AboutScreen,
};

export default function AppNavigator() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <NavigationContainer>
          <Tab.Navigator screenOptions={getTabScreenOptions}>
            {Object.entries(tabs).map(([name, component]) => (
              <Tab.Screen key={name} component={component} name={name} />
            ))}
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </View>
  );
}
