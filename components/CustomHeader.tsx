import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView>
      <View
        className={`flex-row justify-between items-center  px-6 ${
          transparent ? "bg-transparent" : ""
        }`}
      >
        <TouchableOpacity onPress={toggleDrawer}>
          <Ionicons name="menu" size={26} color={colorIcon} />
        </TouchableOpacity>

        {/* {showLanguageSwitcher && <LanguageSwitcher />} */}
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
