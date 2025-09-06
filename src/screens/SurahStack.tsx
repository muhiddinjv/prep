import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import SurahDetailScreen from './SurahDetailScreen';
import SurahListScreen from './SurahListScreen';
import { COLORS } from '../shared/styles/colors';
const Stack = createStackNavigator();

export default function SurahStack() {
  const screenOptions: StackNavigationOptions = {
    headerStyle: {
      backgroundColor: COLORS.primary,
    },
    headerTintColor: COLORS.quinary,
    headerTitleStyle: {
      fontWeight: 'bold' as const,
    },
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="SurahList" component={SurahListScreen} options={{ title: 'Surahs' }} />
      <Stack.Screen
        name="SurahDetail"
        component={SurahDetailScreen}
        options={({ route }) => ({
          title: (route.params as any)?.surahName || 'Surah',
        })}
      />
    </Stack.Navigator>
  );
}
