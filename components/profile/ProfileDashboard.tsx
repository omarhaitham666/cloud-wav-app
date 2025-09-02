// components/ProfileDashboard.js
import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const ProfileDashboard = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const ProfileIcon = () => (
    <View className="w-24 h-24 bg-white/20 rounded-full justify-center items-center mb-4">
      <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
        <Path
          d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
          stroke="white"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );

  const StatCard = ({
    title,
    value,
    color,
  }: {
    title: string;
    value: string;
    color: string;
  }) => (
    <Animated.View
      className="bg-white/10 rounded-2xl p-4 m-2 flex-1 min-h-[100px] justify-center items-center"
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Text 
        className="text-white/70 text-sm mb-1"
        style={{ fontFamily: AppFonts.medium, textAlign: isRTL ? 'right' : 'left' }}
      >
        {title}
      </Text>
      <Text 
        className={`text-2xl text-${color}`}
        style={{ fontFamily: AppFonts.bold, textAlign: isRTL ? 'right' : 'left' }}
      >
        {value}
      </Text>
    </Animated.View>
  );

  const MenuButton = ({
    title,
    subtitle,
    onPress,
    color = "white",
  }: {
    title: string;
    subtitle?: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity
      className="bg-white/5 rounded-xl p-4 mb-3 flex-row justify-between items-center"
      activeOpacity={0.7}
      onPress={onPress}
      style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
    >
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text 
          className={`text-${color} text-lg`}
          style={{ fontFamily: AppFonts.semibold, textAlign: isRTL ? 'right' : 'left' }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text 
            className="text-white/60 text-sm mt-1"
            style={{ fontFamily: AppFonts.regular, textAlign: isRTL ? 'right' : 'left' }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="m9 18 6-6-6-6"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-dark-100">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={["#181C2E", "#2D3748", "#4A5568"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop:
            Platform.OS === "android" ? StatusBar?.currentHeight ?? 20 : 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          className="items-center px-6 mb-8"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <ProfileIcon />
          <Text 
            className="text-white text-2xl mb-1"
            style={{ fontFamily: AppFonts.bold, textAlign: isRTL ? 'right' : 'left' }}
          >
            {t("profile.dashboard.welcomeBack")}
          </Text>
          <Text 
            className="text-white/70 text-base"
            style={{ fontFamily: AppFonts.medium, textAlign: isRTL ? 'right' : 'left' }}
          >
            {t("profile.dashboard.defaultName")}
          </Text>
          <Text 
            className="text-white/50 text-sm"
            style={{ fontFamily: AppFonts.regular, textAlign: isRTL ? 'right' : 'left' }}
          >
            {t("profile.dashboard.defaultEmail")}
          </Text>
        </Animated.View>

        <View className="px-4 mb-8">
          <Text 
            className="text-white text-xl mb-4 px-2"
            style={{ fontFamily: AppFonts.bold, textAlign: isRTL ? 'right' : 'left' }}
          >
            {t("profile.dashboard.stats")}
          </Text>
          <View className="flex-row">
            <StatCard title={t("profile.dashboard.posts")} value="24" color="blue-400" />
            <StatCard title={t("profile.dashboard.followers")} value="1.2K" color="green-400" />
            <StatCard title={t("profile.dashboard.following")} value="486" color="purple-400" />
          </View>
        </View>
        <View className="px-6 mb-8">
          <Text 
            className="text-white text-xl mb-4"
            style={{ fontFamily: AppFonts.bold, textAlign: isRTL ? 'right' : 'left' }}
          >
            {t("profile.dashboard.menu")}
          </Text>

          <MenuButton
            title={t("profile.dashboard.editProfile")}
            subtitle={t("profile.dashboard.editProfileSubtitle")}
            onPress={() =>
              Alert.alert(t("profile.dashboard.alerts.editProfileTitle"), t("profile.dashboard.alerts.editProfileMessage"))
            }
          />

          <MenuButton
            title={t("profile.dashboard.settings")}
            subtitle={t("profile.dashboard.settingsSubtitle")}
            onPress={() => Alert.alert(t("profile.dashboard.alerts.settingsTitle"), t("profile.dashboard.alerts.settingsMessage"))}
          />

          <MenuButton
            title={t("profile.dashboard.notifications")}
            subtitle={t("profile.dashboard.notificationsSubtitle")}
            onPress={() =>
              Alert.alert(t("profile.dashboard.alerts.notificationsTitle"), t("profile.dashboard.alerts.notificationsMessage"))
            }
          />

          <MenuButton
            title={t("profile.dashboard.helpSupport")}
            subtitle={t("profile.dashboard.helpSupportSubtitle")}
            onPress={() => Alert.alert(t("profile.dashboard.alerts.helpTitle"), t("profile.dashboard.alerts.helpMessage"))}
          />

          <MenuButton
            title={t("profile.dashboard.about")}
            subtitle={t("profile.dashboard.aboutSubtitle")}
            onPress={() => Alert.alert(t("profile.dashboard.alerts.aboutTitle"), t("profile.dashboard.alerts.aboutMessage"))}
          />
        </View>

        <View className="px-6 pb-8">
          <TouchableOpacity
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 justify-center items-center"
            activeOpacity={0.8}
          >
            <Text 
              className="text-red-400 text-lg"
              style={{ fontFamily: AppFonts.semibold }}
            >
              {t("profile.dashboard.logout")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Animated.View
        className="absolute bottom-6"
        style={{
          opacity: fadeAnim,
          transform: [{ scale: fadeAnim }],
          [isRTL ? 'left' : 'right']: 24,
        }}
      >
        <TouchableOpacity
          className="w-14 h-14 rounded-full shadow-lg justify-center items-center"
          activeOpacity={0.8}
          onPress={() => Alert.alert(t("profile.dashboard.alerts.addTitle"), t("profile.dashboard.alerts.addMessage"))}
        >
          <LinearGradient
            colors={["#FE8C00", "#F83600"]}
            className="w-14 h-14 rounded-full justify-center items-center"
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 5v14M5 12h14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ProfileDashboard;
