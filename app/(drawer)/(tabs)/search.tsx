import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
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

  const categories = [
    { id: "all", label: "All", emoji: "🎭" },
    { id: "actors", label: "Actors", emoji: "🎬" },
    { id: "musicians", label: "Musicians", emoji: "🎵" },
    { id: "content", label: "Content Creators", emoji: "📹" },
    { id: "youtubers", label: "YouTubers", emoji: "📺" },
    { id: "athletes", label: "Athletes", emoji: "⚽" },
    { id: "public", label: "Public Figures", emoji: "👑" },
    { id: "tiktokers", label: "TikTokers", emoji: "🎪" },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const SearchIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke="#6B7280" strokeWidth="2" />
      <Path
        d="m21 21-4.35-4.35"
        stroke="#6B7280"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  return (
    <View className="flex-1   bg-gray-50">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <LinearGradient
        colors={["#F8FAFC", "#F1F5F9", "#E2E8F0"]}
        className="absolute inset-0"
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop:
            Platform.OS === "android"
              ? (StatusBar.currentHeight ?? 0) + 20
              : 60,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          className="px-6 mb-8"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text className="text-gray-900 text-3xl font-bold mb-2">
            Find Creators
          </Text>
          <Text className="text-gray-600 text-base">
            Discover amazing video creators
          </Text>
        </Animated.View>

        <Animated.View
          className="px-6 mb-6"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 shadow-sm border border-gray-200">
            <SearchIcon />
            <TextInput
              className="flex-1 text-gray-900 text-base ml-3 placeholder:text-gray-500"
              placeholder="Search creators..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => handleSearch("")}
                className="w-6 h-6 bg-gray-300 rounded-full justify-center items-center"
              >
                <Text className="text-gray-600 text-xs">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Categories */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-8"
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setActiveCategory(category.id)}
                className={`flex-row items-center px-4 py-3 rounded-full mr-3 ${
                  activeCategory === category.id ? "bg-blue-500" : "bg-white"
                } shadow-sm`}
                activeOpacity={0.8}
              >
                <Text className="text-lg mr-2">{category.emoji}</Text>
                <Text
                  className={`font-medium ${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <View className="px-6 mt-12">
          <View className="items-center py-12">
            <View className="w-24 h-24 bg-gray-200 rounded-full justify-center items-center mb-6">
              <Text className="text-4xl">🔍</Text>
            </View>
            <Text className="text-gray-900 text-xl font-bold mb-2">
              Start Searching
            </Text>
            <Text className="text-gray-600 text-center text-base leading-6">
              Search for your favorite creators by name or browse by category
            </Text>
          </View>
        </View>

        <View className="px-6 mb-20">
          <Text className="text-gray-900 text-xl font-bold mb-4">
            Popular Categories
          </Text>

          <View className="flex-row mb-4">
            <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 mr-2 shadow-sm border border-gray-200">
              <Text className="text-2xl mb-2">🎬</Text>
              <Text className="text-gray-900 font-medium">Actors</Text>
              <Text className="text-gray-600 text-sm">Movie & TV Stars</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 ml-2 shadow-sm border border-gray-200">
              <Text className="text-2xl mb-2">🎵</Text>
              <Text className="text-gray-900 font-medium">Musicians</Text>
              <Text className="text-gray-600 text-sm">Artists & Singers</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row">
            <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 mr-2 shadow-sm border border-gray-200">
              <Text className="text-2xl mb-2">📺</Text>
              <Text className="text-gray-900 font-medium">YouTubers</Text>
              <Text className="text-gray-600 text-sm">Content Creators</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 ml-2 shadow-sm border border-gray-200">
              <Text className="text-2xl mb-2">🎪</Text>
              <Text className="text-gray-900 font-medium">TikTokers</Text>
              <Text className="text-gray-600 text-sm">Short Video Stars</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Search;
