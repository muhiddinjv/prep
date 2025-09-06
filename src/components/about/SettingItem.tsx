import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { COLORS } from '@/shared/styles';

type Props = {
  icon: string;
  showSwitch?: boolean;
  subtitle?: string;
  switchValue?: boolean;
  title: string;

  action?: () => void;
};

export default function SettingItem({ icon, title, subtitle, action, showSwitch, switchValue }: Props) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={action} disabled={!action}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color={COLORS.primary} style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={action}
          trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
          thumbColor={switchValue ? COLORS.white : COLORS.quinary}
        />
      ) : (
        action && <Icon name="chevron-right" size={24} color={COLORS.secondary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  settingIcon: {
    marginRight: 16,
  },
  settingItem: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomColor: COLORS.quaternary,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  settingSubtitle: {
    color: COLORS.secondary,
    fontSize: 14,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
});
