import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomHeader = ({
  transparent,
  colorIcon = "#000",
}: {
  transparent?: boolean;
  colorIcon?: string;
}) => {
  const navigation = useNavigation<any>();

  const toggleDrawer = useCallback(() => {
    try {
      const drawerNavigation = navigation.getParent?.() || navigation;
      if (drawerNavigation && typeof drawerNavigation.dispatch === "function") {
        drawerNavigation.dispatch(DrawerActions.toggleDrawer());
      } else {
        console.warn("Drawer navigation not available");
      }
    } catch (error) {
      console.error("Error toggling drawer:", error);
    }
  }, [navigation]);

  const headerStyle = useMemo(
    () => ({
      backgroundColor: transparent ? "transparent" : undefined,
    }),
    [transparent]
  );

  return (
    <View style={styles.topHeader}>
      <SafeAreaView style={{ backgroundColor: transparent ? "transparent" : undefined}}>
        <View
          className={`flex-row justify-between items-center px-6`}
          style={headerStyle}
        >
          <TouchableOpacity
            onPress={toggleDrawer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={26} color={colorIcon}
              style={{
                zIndex: 1000,
                backgroundColor: "transparent",
                borderWidth: 3,
                borderColor: "transparent",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 6,
              }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
  },
});

export default CustomHeader;
