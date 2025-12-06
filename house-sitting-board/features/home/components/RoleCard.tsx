import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { homepageStyles as styles } from "../styles";

interface RoleCardProps {
  label: string;
  onPress: () => void;
}

const RoleCard = ({ label, onPress }: RoleCardProps) => {
  return (
    <TouchableOpacity
      style={styles.roleCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.roleTextContainer}>
        <Text style={styles.rolePrimaryText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RoleCard;
