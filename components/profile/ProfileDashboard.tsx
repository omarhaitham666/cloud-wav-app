// components/ProfileDashboard.js
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
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
      <Text className="text-white/70 text-sm font-medium mb-1">{title}</Text>
      <Text className={`text-2xl font-bold text-${color}`}>{value}</Text>
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
    >
      <View>
        <Text className={`text-${color} text-lg font-semibold`}>{title}</Text>
        {subtitle && (
          <Text className="text-white/60 text-sm mt-1">{subtitle}</Text>
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
    <View className="flex-1 bg-slate-900">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={["#1e293b", "#334155", "#475569"]}
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
          <Text className="text-white text-2xl font-bold mb-1">
            Welcome Back!
          </Text>
          <Text className="text-white/70 text-base">John Doe</Text>
          <Text className="text-white/50 text-sm">john.doe@example.com</Text>
        </Animated.View>

        <View className="px-4 mb-8">
          <Text className="text-white text-xl font-bold mb-4 px-2">
            Your Stats
          </Text>
          <View className="flex-row">
            <StatCard title="Posts" value="24" color="blue-400" />
            <StatCard title="Followers" value="1.2K" color="green-400" />
            <StatCard title="Following" value="486" color="purple-400" />
          </View>
        </View>
        <View className="px-6 mb-8">
          <Text className="text-white text-xl font-bold mb-4">Menu</Text>

          <MenuButton
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() =>
              Alert.alert("Edit Profile", "Profile editing feature")
            }
          />

          <MenuButton
            title="Settings"
            subtitle="App preferences and privacy"
            onPress={() => Alert.alert("Settings", "Settings feature")}
          />

          <MenuButton
            title="Notifications"
            subtitle="Manage your notifications"
            onPress={() =>
              Alert.alert("Notifications", "Notifications feature")
            }
          />

          <MenuButton
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={() => Alert.alert("Help", "Help & Support feature")}
          />

          <MenuButton
            title="About"
            subtitle="App version and information"
            onPress={() => Alert.alert("About", "About feature")}
          />
        </View>

        <View className="px-6 pb-8">
          <TouchableOpacity
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 justify-center items-center"
            activeOpacity={0.8}
          >
            <Text className="text-red-400 text-lg font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Animated.View
        className="absolute bottom-6 right-6"
        style={{
          opacity: fadeAnim,
          transform: [{ scale: fadeAnim }],
        }}
      >
        <TouchableOpacity
          className="w-14 h-14 rounded-full shadow-lg justify-center items-center"
          activeOpacity={0.8}
          onPress={() => Alert.alert("Add", "Add new content feature")}
        >
          <LinearGradient
            colors={["#3b82f6", "#1d4ed8"]}
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
