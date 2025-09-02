import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity, Switch } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../shared/styles/colors";

type Props = {
    icon: string;
    title: string;
    subtitle?: string;
    action?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
}

export default function SettingItem({
    icon,
    title,
    subtitle,
    action,
    showSwitch,
    switchValue
}: Props) {
    return (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={action}
      disabled={!action}
    >
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
    settingItem: {
      backgroundColor: COLORS.white,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.quaternary,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      marginRight: 16,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: COLORS.secondary,
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
      color: COLORS.secondary,
    },
  });