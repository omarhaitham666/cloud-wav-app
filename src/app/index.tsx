import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { slides } from "../utils/data";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/(drawer)/(tabs)");
    }
  };

  return (
    <View className="flex-1 pb-5 bg-red-600">
      <FlatList
        data={slides}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View
            className="flex-1 items-center justify-center px-6"
            style={{ width }}
          >
            <Image
              source={item.image}
              className="w-72 h-72 mb-8"
              resizeMode="contain"
            />
            <Text className="text-white text-2xl font-bold text-center mb-3">
              {item.title}
            </Text>
            <Text className="text-gray-100 text-center text-sm leading-5">
              {item.description}
            </Text>
          </View>
        )}
      />

      <View className="flex-row justify-center items-center mb-6">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full mx-1 ${
              index === currentIndex ? "w-6 bg-white" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </View>
      <View className="items-center justify-center mb-10">
        <TouchableOpacity
          className="bg-white px-10 py-2.5 rounded-full"
          onPress={handleNext}
        >
          <Text className="text-red-600 font-bold text-base">
            {currentIndex === slides.length - 1 ? "GET STARTED" : "NEXT"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
