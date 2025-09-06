import { MaterialIcons } from '@expo/vector-icons';
import { ParamListBase, RouteProp } from '@react-navigation/native';

import { ICONS, ROUTERS } from '@/shared/constants';
import { COLORS } from '@/shared/styles';

export const getTabScreenOptions = ({ route }: { route: RouteProp<ParamListBase, string> }) => ({
  tabBarIcon: ({ color, size }: { color: string; size: number }) => {
    const iconName = ICONS?.[route.name as keyof typeof ICONS] || ICONS[ROUTERS.help];
    return (
      <MaterialIcons
        name={iconName as keyof typeof MaterialIcons.glyphMap}
        size={28}
        color={color}
        style={{ marginBottom: 0 }}
      />
    );
  },
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: COLORS.secondary,
  tabBarLabelStyle: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabBarStyle: {
    paddingBottom: 10,
    paddingTop: 10,
  },
  headerShown: false,
});
