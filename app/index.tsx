import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { slides } from "../utils/data";

const { width } = Dimensions.get("window");

interface SlideItemProps {
  item: any;
  index: number;
  currentIndex: number;
  t: (key: string) => string;
}

interface ProgressDotsProps {
  currentIndex: number;
  slidesLength: number;
}

interface ProgressDotProps {
  index: number;
  currentIndex: number;
}

function ProgressDot({ index, currentIndex }: ProgressDotProps) {
  const dotStyle = useAnimatedStyle(() => {
    const isActive = currentIndex === index;
    return {
      width: withSpring(isActive ? 24 : 8),
      backgroundColor: isActive ? "white" : "#d1d5db",
    };
  });

  return (
    <Animated.View
      style={[{ height: 8, borderRadius: 4, marginHorizontal: 4 }, dotStyle]}
    />
  );
}

function ProgressDots({ currentIndex, slidesLength }: ProgressDotsProps) {
  return (
    <View className="flex-row justify-center items-center mb-6">
      {Array.from({ length: slidesLength }).map((_, index) => (
        <ProgressDot key={index} index={index} currentIndex={currentIndex} />
      ))}
    </View>
  );
}

function SlideItem({ item, index, currentIndex, t }: SlideItemProps) {
  const imageStyle = useAnimatedStyle(() => {
    const isActive = currentIndex === index;
    return {
      transform: [{ scale: withSpring(isActive ? 1 : 0.8) }],
      opacity: withTiming(isActive ? 1 : 0.3, { duration: 400 }),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const isActive = currentIndex === index;
    return {
      opacity: withTiming(isActive ? 1 : 0, { duration: 500 }),
      transform: [{ translateY: withSpring(isActive ? 0 : 30) }],
    };
  });

  return (
    <View className="flex-1 items-center justify-center px-6" style={{ width }}>
      <Animated.Image
        source={item.image}
        style={[{ width: 280, height: 280, marginBottom: 24 }, imageStyle]}
        resizeMode="contain"
      />
      <Animated.Text
        className="text-white text-2xl text-center font-noto-arabic-semibold mb-3"
        style={textStyle}
      >
        {t(item.title)}
      </Animated.Text>
      <Animated.Text
        className="text-gray-50 text-center text-sm leading-5 font-noto-arabic"
        style={textStyle}
      >
        {t(item.description)}
      </Animated.Text>
    </View>
  );
}

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const progress = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
    progress.value = index;
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/(drawer)/(tabs)");
    }
  };

  return (
    <View className="flex-1 py-5 bg-red-600 font-cairo">
      <View className={`w-full p-9 items-${isRTL ? "end" : "start"}`}>
        <LanguageSwitcher />
      </View>

      <FlatList
        data={slides}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item, index }) => (
          <SlideItem
            item={item}
            index={index}
            currentIndex={currentIndex}
            t={t}
          />
        )}
      />

      <ProgressDots currentIndex={currentIndex} slidesLength={slides.length} />

      <View className="items-center justify-center mb-10">
        <TouchableOpacity
          className="bg-white px-10 py-2.5 rounded-full"
          onPress={handleNext}
        >
          <Text className="text-red-600 font-noto-arabic-bold text-base">
            {currentIndex === slides.length - 1
              ? t("welcome.buttons.getStarted")
              : t("welcome.buttons.next")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
