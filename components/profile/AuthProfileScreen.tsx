// components/AuthScreen.js
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const AuthScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, [fadeAnim, slideAnim, scaleAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const AnimatedVector = () => (
    <Animated.View
      className="absolute z-10"
      style={{
        top: height * 0.15,
        left: (width - 300) / 2,
        transform: [{ rotate: spin }],
      }}
    >
      <Svg width={300} height={300} viewBox="0 0 300 300">
        <Circle
          cx="150"
          cy="150"
          r="80"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        <Circle
          cx="150"
          cy="150"
          r="60"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        <Polygon points="150,70 190,130 110,130" fill="rgba(255,255,255,0.1)" />
        <Polygon
          points="150,230 110,170 190,170"
          fill="rgba(255,255,255,0.1)"
        />
        <Circle cx="150" cy="150" r="20" fill="rgba(255,255,255,0.3)" />
      </Svg>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-indigo-500">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={["#667eea", "#764ba2", "#f093fb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      <View className="absolute inset-0">
        <View
          className="absolute w-32 h-32 bg-white/5 rounded-3xl"
          style={{
            top: height * 0.1,
            right: -50,
            transform: [{ rotate: "45deg" }],
          }}
        />
        <View
          className="absolute w-20 h-20 bg-white/5 rounded-full"
          style={{
            bottom: height * 0.3,
            left: -30,
          }}
        />
        <View
          className="absolute w-16 h-48 bg-white/5 rounded-3xl"
          style={{
            top: height * 0.4,
            left: width * 0.8,
            transform: [{ rotate: "15deg" }],
          }}
        />
      </View>

      <AnimatedVector />

      <Animated.View
        className="flex-1 justify-center items-center px-8 z-20"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        }}
      >
        <View className="items-center mb-16">
          <Text className="text-2xl text-white/80 font-light tracking-widest">
            Welcome to
          </Text>
          <Text className="text-5xl text-white font-bold my-2">YourApp</Text>
          <Text className="text-base text-white/70 text-center leading-6 mt-3 font-light">
            Discover amazing features and connect with the world
          </Text>
        </View>

        <View className="w-full mb-12">
          <TouchableOpacity
            className="w-full h-14 rounded-3xl mb-4 shadow-lg"
            activeOpacity={0.8}
            onPress={() => router.push("/(drawer)/(auth)/login")}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <LinearGradient
              colors={["#FF6B6B", "#FF8E53"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="flex-1 justify-center items-center rounded-3xl"
            >
              <Text className="text-white text-lg font-bold tracking-widest">
                LOGIN
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full h-14 rounded-3xl border-2 border-white justify-center items-center"
            activeOpacity={0.8}
            onPress={() => router.push("/(drawer)/(auth)/register")}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text className="text-white text-lg font-bold tracking-widest">
              REGISTER
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-white/60 text-xs text-center leading-5 mt-5">
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </Animated.View>

      <Animated.View
        className="absolute w-12 h-12 rounded-full bg-white/10"
        style={{
          top: height * 0.2,
          left: 30,
          transform: [{ rotate: spin }, { scale: scaleAnim }],
        }}
      />
      <Animated.View
        className="absolute w-8 h-8 rounded-full bg-white/10"
        style={{
          bottom: height * 0.2,
          right: 30,
          transform: [{ rotate: spin }, { scale: scaleAnim }],
        }}
      />
    </View>
  );
};

export default AuthScreen;
