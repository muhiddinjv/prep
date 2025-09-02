import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AboutScreen from "../screens/AboutScreen";
import BookmarksScreen from "../screens/BookmarksScreen";
import { ROUTERS } from "../shared/constants/routes";
import { getTabScreenOptions } from "./utils";
import SurahStack from "../screens/SurahStack";

const Tab = createBottomTabNavigator(); 
export type RootStackParamList = {
  SurahList: undefined;
  SurahDetail: { surahNumber: number; surahName: string; targetAyahNumber?: number };
  Bookmarks: undefined;
};

const tabs = {
  [ROUTERS.quran]: SurahStack,
  [ROUTERS.bookmarks]: BookmarksScreen,
  [ROUTERS.about]: AboutScreen,
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={getTabScreenOptions}>
        {Object.entries(tabs).map(([name, component]) => (
          <Tab.Screen key={name} name={name} component={component} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
