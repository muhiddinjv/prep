import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import AboutScreen from "../screens/AboutScreen";
import BookmarksScreen from "../screens/BookmarksScreen";
import {ROUTES, ICONS, COLORS} from "../shared/constants"
import SurahStack from "./StackNavigator"

const Tab = createBottomTabNavigator();

const tabs = {
  [ROUTES.quran]: SurahStack,
  [ROUTES.bookmarks]: BookmarksScreen,
  [ROUTES.about]: AboutScreen,
}

const getTabNavOptions = ({ route }: any) => ({
  tabBarIcon: ({ color, size }: {color: string, size: number}) => {
    let iconName: keyof typeof MaterialIcons.glyphMap;

    iconName = (ICONS[route.name] || ICONS[ROUTES.help]) as keyof typeof MaterialIcons.glyphMap;

    return <MaterialIcons name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: COLORS.primary, 
  tabBarInactiveTintColor: COLORS.gray,
  headerShown: false,
})

export type RootStackParamList = {
  SurahList: undefined;
  SurahDetail: { surahNumber: number; surahName: string; targetAyahNumber?: number };
  Bookmarks: undefined;
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={getTabNavOptions}>
       {Object.entries(tabs).map(([name, component])=>(
         <Tab.Screen key={name} name={name} component={component} />
       ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
