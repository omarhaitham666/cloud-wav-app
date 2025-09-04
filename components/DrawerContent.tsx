import { useLogoutMutation } from "@/store/api/user/user";
import { useAuth } from "@/store/auth-context";
import { AppFonts } from "@/utils/fonts";
import { deleteToken, getToken } from "@/utils/secureStore";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { RelativePathString, router, useRootNavigation } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

const DrawerItem = ({
  icon,
  label,
  isActive,
  onPress,
  component = null,
  isRtl = false,
}: any) => {
  if (component) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`${
          isRtl ? "flex-row-reverse" : "flex-row"
        } items-center py-3 px-6 mx-3 rounded-lg ${
          isActive ? "bg-[#eef2ff] border border-[#e0e7ff]" : ""
        }`}
        activeOpacity={0.7}
      >
        {component}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${
        isRtl ? "flex-row-reverse" : "flex-row"
      } items-center py-3 px-6 mx-3 rounded-lg ${
        isActive ? "bg-[#eef2ff] border border-[#e0e7ff]" : ""
      }`}
      activeOpacity={0.7}
    >
      <View className={`${isRtl ? "ml-3" : "mr-3"} w-6 items-center`}>
        {icon}
      </View>
      <Text
        className={`text-base font-medium ${
          isActive ? "text-[#4f46e5]" : "text-[#475569]"
        }`}
        style={{ fontFamily: AppFonts.medium }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default function DrawerContent({ state }: DrawerContentComponentProps) {
  const { t, i18n } = useTranslation();
  const currentRoute = state.routes[state.index]?.name;
  const [token, setToken] = useState<string | null>(null);
  const [logout, { isLoading }] = useLogoutMutation();
  const { user, setUser } = useAuth();
  const isArabic = i18n.language === "ar";
  const navigation = useRootNavigation();

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
      const storedToken = await getToken("access_token");
      setToken(storedToken);
    };
    fetchToken();
  }, [state.index]);

  const handleLogout = async () => {
    try {
      await deleteToken("access_token");
      await logout().unwrap();
      
      // Clear auth context
      setUser(null);
      setToken(null);
      
      Toast.show({
        type: "success",
        text1: "Logout Successful",
        text2: "You have been logged out.",
      });

      // Force refresh by replacing the entire stack
      router.replace("/(drawer)/(auth)/login");
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: e?.data?.message || "Something went wrong",
      });
    }
  };

  const drawerItems = [
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
  ];

  const secondaryItems = (token || user)
    ? [
        {
          label: t("drawer.items.profile"),
          route: null,
          iconName: "user",
          action: () => Alert.alert("Profile", "Profile screen coming soon!"),
        },
        {
          label: isLoading
            ? t("drawer.items.loggingOut")
            : t("drawer.items.logout"),
          route: null,
          iconName: "log-out",
          action: handleLogout,
        },
      ]
    : [
        {
          label: t("drawer.items.login"),
          route: "(auth)/login",
          iconName: "log-in",
        },
        {
          label: t("drawer.items.register"),
          route: "(auth)/register",
          iconName: "user-plus",
        },
        {
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
        },
      ];

  const navigateTo = (route: string | null, action?: () => void) => {
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
  };

  const renderDrawerItem = (item: {
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
  };

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
