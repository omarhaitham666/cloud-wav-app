import { useLogoutMutation } from "@/store/api/user/user";
import { useAuth } from "@/store/auth-context";
import { useDrawerRefresh } from "@/store/drawerRefreshContext";
import { invalidateAllQueries } from "@/store/utils";
import { setDrawerRefreshTrigger } from "@/utils/appRefresh";
import { AppFonts } from "@/utils/fonts";
import { deleteToken, getToken } from "@/utils/secureStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { RelativePathString, router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Toast from "react-native-toast-message";
import Feather from "react-native-vector-icons/Feather";
import LanguageSwitcher from "./LanguageSwitcher";

const DrawerItem = React.memo(
  ({
    icon,
    label,
    isActive,
    onPress,
    component = null,
    isRtl = false,
  }: any) => {
    const itemStyle = useMemo(
      () => ({
        flexDirection: (isRtl ? "row-reverse" : "row") as "row" | "row-reverse",
        backgroundColor: isActive ? "#eef2ff" : "transparent",
        borderColor: isActive ? "#e0e7ff" : "transparent",
        borderWidth: isActive ? 1 : 0,
      }),
      [isRtl, isActive]
    );

    const textColor = useMemo(
      () => (isActive ? "#4f46e5" : "#475569"),
      [isActive]
    );

    if (component) {
      return (
        <TouchableOpacity
          onPress={onPress}
          className="items-center py-3 px-6 mx-3 rounded-lg"
          style={itemStyle}
          activeOpacity={0.7}
        >
          {component}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={onPress}
        className="items-center py-3 px-6 mx-3 rounded-lg"
        style={itemStyle}
        activeOpacity={0.7}
      >
        <View className={`${isRtl ? "ml-3" : "mr-3"} w-6 items-center`}>
          {icon}
        </View>
        <Text
          className="font-medium"
          style={{
            fontFamily: AppFonts.medium,
            color: textColor,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }
);

// ✅ fix display name warning
DrawerItem.displayName = "DrawerItem";

export default function DrawerContent({ state }: DrawerContentComponentProps) {
  const { t, i18n } = useTranslation();
  const currentRoute = state.routes[state.index]?.name;
  const [token, setToken] = useState<string | null>(null);
  const [logout, { isLoading }] = useLogoutMutation();
  const { user, setUser, triggerAuthRefresh } = useAuth();
  const { refreshKey, triggerDrawerRefresh } = useDrawerRefresh();
  const isArabic = i18n.language === "ar";

  const rowDirection: ViewStyle = useMemo(
    () => ({
      flexDirection: (isArabic ? "row-reverse" : "row") as
        | "row"
        | "row-reverse",
    }),
    [isArabic]
  );

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await getToken("access_token");
        setToken(storedToken);
      } catch (error) {
        console.error("Error fetching token:", error);
        setToken(null);
      }
    };
    fetchToken();
  }, [refreshKey, user?.id]);

  useEffect(() => {
    setDrawerRefreshTrigger(triggerDrawerRefresh);
    return () => setDrawerRefreshTrigger(null);
  }, [triggerDrawerRefresh]);

  // ✅ wrap in useCallback to avoid re-creation
  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap();

      await deleteToken("access_token");
      await deleteToken("refresh_token");
      await AsyncStorage.multiRemove([
        "token",
        "user",
        "auth_state",
        "refresh_token",
      ]);

      setUser(null);
      setToken(null);
      triggerAuthRefresh();
      triggerDrawerRefresh();
      invalidateAllQueries();

      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out",
      });
    } catch (e: any) {
      try {
        await deleteToken("access_token");
        await deleteToken("refresh_token");
        await AsyncStorage.multiRemove([
          "token",
          "user",
          "auth_state",
          "refresh_token",
        ]);
      } catch (clearError) {
        console.error("Error clearing local storage:", clearError);
      }

      setUser(null);
      setToken(null);
      triggerAuthRefresh();
      triggerDrawerRefresh();
      invalidateAllQueries();

      if (e?.status !== 401) {
        Toast.show({
          type: "error",
          text1: "Logout Failed",
          text2: e?.data?.message || "Something went wrong",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Logged Out",
          text2: "You have been successfully logged out",
        });
      }
    }
  }, [logout, setUser, triggerAuthRefresh, triggerDrawerRefresh]);

  const handleLoginNavigation = useCallback(() => {
    router.push("/(drawer)/(auth)/login");
  }, []);

  const drawerItems = useMemo(
    () => [
      {
        label: t("drawer.items.home"),
        route: "(tabs)",
        iconName: "home",
        displayName: "Home",
      },
      {
        label: t("drawer.items.contact"),
        route: "contact/contact",
        iconName: "phone",
        displayName: "Contact",
      },
      {
        label: t("drawer.items.faq"),
        route: "faq/faq",
        iconName: "help-circle",
        displayName: "FAQ",
      },
      {
        label: t("drawer.items.services"),
        route: "services/services",
        iconName: "grid",
        displayName: "Services",
      },
      {
        label: t("drawer.items.creators"),
        route: "creators/creators",
        iconName: "users",
        displayName: "Creators",
      },
    ],
    [t]
  );

  const secondaryItems = useMemo(() => {
    const languageSwitcherItem = {
      label: t("drawer.items.language"),
      route: null,
      iconName: "globe",
      component: (
        <View
          className="flex-1"
          style={[
            rowDirection,
            { alignItems: "center", justifyContent: "space-between" },
          ]}
        >
          <View style={{ flex: 1 }}>
            <LanguageSwitcher />
          </View>
        </View>
      ),
    };

    const isAuthenticated = token || user;

    if (isAuthenticated) {
      return [
        {
          label: t("drawer.items.profile"),
          route: null,
          iconName: "user",
          action: () => router.push("/(drawer)/(tabs)/profile"),
        },
        {
          label: isLoading
            ? t("drawer.items.loggingOut")
            : t("drawer.items.logout"),
          route: null,
          iconName: "log-out",
          action: handleLogout,
        },
        languageSwitcherItem,
      ];
    }

    return [
      {
        label: t("drawer.items.login"),
        route: null,
        iconName: "log-in",
        action: handleLoginNavigation,
      },
      {
        label: t("drawer.items.register"),
        route: "(auth)/register",
        iconName: "user-plus",
      },
      languageSwitcherItem,
    ];
  }, [
    token,
    user,
    isLoading,
    t,
    handleLogout,
    handleLoginNavigation,
    rowDirection,
  ]);

  const navigateTo = useCallback(
    (route: string | null, action?: () => void) => {
      if (action) {
        action();
      } else if (route) {
        try {
          const path = `/${route}` as RelativePathString;
          router.push(path);
        } catch (error) {
          console.error(`Navigation error for route: ${route}`, error);
          Alert.alert("Navigation Error", `Could not navigate to ${route}`);
        }
      }
    },
    []
  );

  const renderDrawerItem = useCallback(
    (item: {
      label: string;
      route: string | null;
      iconName: string;
      displayName?: string;
      action?: () => void;
      component?: React.ReactNode;
    }) => {
      const isActive = currentRoute === item.route;

      return (
        <DrawerItem
          key={item.displayName || item.route || item.label}
          icon={
            <Feather
              name={item.iconName}
              size={20}
              color={isActive ? "#4f46e5" : "#64748b"}
            />
          }
          label={item.label}
          isActive={isActive}
          onPress={() => navigateTo(item.route, item.action)}
          isRtl={isArabic}
          component={item.component}
        />
      );
    },
    [currentRoute, navigateTo, isArabic]
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center py-3">
          <View className="w-24 h-24 mt-10 items-center justify-center mb-3 bg-white">
            <Image
              source={require("../assets/images/logo.png")}
              style={{ width: 180, height: 180 }}
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="h-px bg-gray-200 my-2 mx-6" />

        <View className="py-2">
          <Text
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mx-6 mb-3"
            style={{
              fontFamily: AppFonts.semibold,
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {t("drawer.sections.navigation")}
          </Text>
          {drawerItems.map(renderDrawerItem)}
        </View>

        <View className="h-px bg-gray-200 my-2 mx-6" />

        <View className="py-2">
          <Text
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mx-6 mb-3"
            style={{
              fontFamily: AppFonts.semibold,
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {t("drawer.sections.account")}
          </Text>
          {secondaryItems.map(renderDrawerItem)}
        </View>

        <View className="flex-1" />
      </ScrollView>

      <View className="py-4 px-6 border-t border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text
              className="text-sm font-medium text-gray-700"
              style={{ fontFamily: AppFonts.medium }}
            >
              {t("drawer.footer.brand")}
            </Text>
            <Text
              className="text-xs text-gray-400"
              style={{ fontFamily: AppFonts.regular }}
            >
              {t("drawer.footer.version", { version: "1.0.0" })}
            </Text>
          </View>
          {(token || user) && (
            <TouchableOpacity onPress={handleLogout} className="p-2">
              <Feather name="log-out" size={18} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
