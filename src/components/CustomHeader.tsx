import LanguageSwitcher from "@/src/components/LanguageSwitcher";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const CustomHeader = ({
  transparent,
  showLanguageSwitcher,
  colorIcon = "#000",
}: {
  transparent?: boolean;
  showLanguageSwitcher?: boolean;
  colorIcon?: string;
}) => {
  const navigation = useNavigation<any>();

  const toggleDrawer = () => {
    if ("toggleDrawer" in navigation || navigation.getParent()?.toggleDrawer) {
      navigation.dispatch(DrawerActions.toggleDrawer());
    }
  };

  return (
    <View
      className={`flex-row justify-between items-center px-4 py-3 ${
        transparent ? "bg-transparent" : "bg-white shadow-md"
      }`}
    >
      <TouchableOpacity onPress={toggleDrawer}>
        <Ionicons name="menu" size={26} color={colorIcon} />
      </TouchableOpacity>

      {showLanguageSwitcher && <LanguageSwitcher />}
    </View>
  );
};

export default CustomHeader;
