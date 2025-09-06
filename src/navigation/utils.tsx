import { ParamListBase, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ICONS, ROUTERS } from '@/shared/constants';
import { COLORS } from '@/shared/styles';

export const getTabScreenOptions = ({ route }: { route: RouteProp<ParamListBase, string> }) => ({
  tabBarIcon: ({ color, size }: { color: string; size: number }) => {
    const iconName = ICONS?.[route.name as keyof typeof ICONS] || ICONS[ROUTERS.help];
    return <Icon name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: COLORS.secondary,
  headerShown: false,
});
