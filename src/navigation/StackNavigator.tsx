import { createStackNavigator, RouteProp } from "@react-navigation/stack";
import {COLORS} from "../shared/constants"

import SurahListScreen from "../screens/SurahListScreen";
import SurahDetailScreen from "../screens/SurahDetailScreen";
const Stack = createStackNavigator();

export default function SurahStack() {
  const screenOptions = {
    headerStyle: {
      backgroundColor: COLORS.primary,
    },
    headerTintColor: COLORS.white,
    headerTitleStyle: {
      fontWeight: "bold",
    },
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="SurahList"
        component={SurahListScreen}
        options={{ title: "Surahs" }}
      />
      <Stack.Screen
        name="SurahDetail"
        component={SurahDetailScreen}
        options={({ route }: RouteProp) => ({
          title: (route.params as any)?.surahName || "Surah",
        })}
      />
    </Stack.Navigator>
  );
}
