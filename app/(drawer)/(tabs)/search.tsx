import CreatorCard from "@/components/CreatorCard";
import { useSearchCreatorQuery } from "@/store/api/global/search";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Fixed: Use searchQuery directly, don't skip empty queries
  const { data, refetch, isLoading } = useSearchCreatorQuery(searchQuery);

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
    { id: "actor", label: "Actors", emoji: "🎬" },
    { id: "musician", label: "Musicians", emoji: "🎵" },
    { id: "content", label: "Content Creators", emoji: "📹" },
    { id: "youtuber", label: "YouTubers", emoji: "📺" },
    { id: "athlete", label: "Athletes", emoji: "⚽" },
    { id: "public", label: "Public Figures", emoji: "👑" },
    { id: "tiktoker", label: "TikTokers", emoji: "🎪" },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Auto-trigger search after a delay
    if (query.length > 0) {
      setTimeout(() => {
        refetch();
      }, 500);
    }
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

  const CloseIcon = () => (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke="#6B7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const handleCategoryPress = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === "all") {
      setSearchQuery("");
    } else {
      setSearchQuery(categoryId);
    }
  };

  // Fixed: Handle popular category press
  const handlePopularCategoryPress = (categoryType: string) => {
    setActiveCategory(categoryType);
    setSearchQuery(categoryType);
  };

  // Header component
  const renderHeader = () => (
    <View>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <LinearGradient
        colors={["#F8FAFC", "#F1F5F9", "#E2E8F0"]}
        className="absolute inset-0"
      />

      <View
        style={{
          paddingTop:
            Platform.OS === "android"
              ? (StatusBar.currentHeight ?? 0) + 20
              : 60,
        }}
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
              placeholder="Search creators by name or category..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
              onSubmitEditing={() => refetch()}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="w-6 h-6 bg-gray-300 rounded-full justify-center items-center"
              >
                <CloseIcon />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-8"
            contentContainerStyle={{ paddingHorizontal: 24 }}
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item: category }) => (
              <TouchableOpacity
                onPress={() => handleCategoryPress(category.id)}
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
            )}
          />
        </Animated.View>
      </View>
    </View>
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center my-8">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-2">Searching creators...</Text>
        </View>
      );
    }

    if (searchQuery.length > 0) {
      return (
        <View className="items-center py-12">
          <View className="w-24 h-24 bg-gray-200 rounded-full justify-center items-center mb-6">
            <Text className="text-4xl">😔</Text>
          </View>
          <Text className="text-gray-900 text-xl font-bold mb-2">
            No Results Found
          </Text>
          <Text className="text-gray-600 text-center text-base leading-6">
            No creators found for &quot;{searchQuery}&quot;. Try a different
            search term.
          </Text>
        </View>
      );
    }

    return (
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
    );
  };
  const renderFooter = () => (
    <View className="px-6 mt-8 mb-20">
      <Text className="text-gray-900 text-xl font-bold mb-4">
        Popular Categories
      </Text>

      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => handlePopularCategoryPress("actor")}
          className="flex-1 bg-white rounded-xl p-4 mr-2 shadow-sm border border-gray-200"
        >
          <Text className="text-2xl mb-2">🎬</Text>
          <Text className="text-gray-900 font-medium">Actors</Text>
          <Text className="text-gray-600 text-sm">Movie & TV Stars</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePopularCategoryPress("musician")}
          className="flex-1 bg-white rounded-xl p-4 ml-2 shadow-sm border border-gray-200"
        >
          <Text className="text-2xl mb-2">🎵</Text>
          <Text className="text-gray-900 font-medium">Musicians</Text>
          <Text className="text-gray-600 text-sm">Artists & Singers</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row">
        <TouchableOpacity
          onPress={() => handlePopularCategoryPress("youtuber")}
          className="flex-1 bg-white rounded-xl p-4 mr-2 shadow-sm border border-gray-200"
        >
          <Text className="text-2xl mb-2">📺</Text>
          <Text className="text-gray-900 font-medium">YouTubers</Text>
          <Text className="text-gray-600 text-sm">Content Creators</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePopularCategoryPress("tiktoker")}
          className="flex-1 bg-white rounded-xl p-4 ml-2 shadow-sm border border-gray-200"
        >
          <Text className="text-2xl mb-2">🎪</Text>
          <Text className="text-gray-900 font-medium">TikTokers</Text>
          <Text className="text-gray-600 text-sm">Short Video Stars</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const flatListData = [
    { type: "header", id: "header" },
    ...(data && data.length > 0
      ? [
          { type: "results-header", id: "results-header" },
          ...data.map((item, index) => ({
            type: "creator",
            id: item.id?.toString() ?? index.toString(),
            data: item,
          })),
        ]
      : [{ type: "empty-state", id: "empty-state" }]),
    { type: "footer", id: "footer" },
  ];

  const renderItem = ({
    item,
  }: {
    item: { type: string; id: string; data?: any };
  }) => {
    switch (item.type) {
      case "header":
        return renderHeader();

      case "results-header":
        return (
          <View className="px-6 mb-4">
            <Text className="text-gray-900 text-xl font-bold">
              Search Results ({data?.length})
            </Text>
          </View>
        );

      case "creator":
        return (
          <View className="px-6 mb-4">
            <View style={{ width: screenWidth - 48 }}>
              <CreatorCard
                id={item.data.id?.toString() ?? ""}
                image={`https://api.cloudwavproduction.com/storage/${item.data.profile_image}`}
                name={item.data.name || "Unknown Creator"}
                price={`$${item.data.private_price || 0}`}
                bussiness_price={`$${item.data.bussiness_price || 0}`}
              />
            </View>
          </View>
        );

      case "empty-state":
        return <View className="px-6">{renderEmptyState()}</View>;

      case "footer":
        return renderFooter();

      default:
        return null;
    }
  };

  return (
    <View className="flex-1">
      <FlatList
        data={flatListData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};

export default Search;
