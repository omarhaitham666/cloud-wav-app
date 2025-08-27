import LanguageSwitcher from "@/src/components/LanguageSwitcher";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const CustomHeader = ({
  transparent,
  showLanguageSwitcher,
  colorIcon,
}: {
  transparent?: boolean;
  showLanguageSwitcher?: boolean;
  colorIcon?: string;
}) => {
  const navigation = useNavigation();

  return (
    <View
      className={`flex-row justify-between items-center px-4 py-3 ${
        transparent ? "bg-transparent" : "bg-white  shadow-md"
      }`}
    >
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      >
        <Ionicons name="menu" size={26} color={colorIcon} />
      </TouchableOpacity>
      {showLanguageSwitcher && <LanguageSwitcher />}
    </View>
  );
};

export default CustomHeader;
