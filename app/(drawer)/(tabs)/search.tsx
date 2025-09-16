import CreatorCard from "@/components/cards/CreatorCard";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useSearchCreatorQuery } from "@/store/api/global/search";
import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
import Icon from "react-native-vector-icons/Feather";

const { width: screenWidth } = Dimensions.get("window");

const Search = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const { data, refetch, isLoading } = useSearchCreatorQuery(searchQuery);

  useAuthRefresh(() => {
    refetch();
  });

  const { refreshControl, scrollViewRef, TopLoader } = usePullToRefresh({
    onRefresh: async () => {
      await refetch();
    },
    scrollToTopOnRefresh: true,
    showTopLoader: true,
  });

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
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    if (category) {
      setActiveCategory(category);
      setSearchQuery(category);
    }
  }, [category]);

  const categories = [
    { id: "all", label: t("song.categories.all"), icon: "grid" },
    { id: "actor", label: t("song.categories.actor"), icon: "video" },
    { id: "musician", label: t("song.categories.musician"), icon: "music" },
    { id: "content", label: t("song.categories.content"), icon: "camera" },
    { id: "youtuber", label: t("song.categories.youtuber"), icon: "play" },
    { id: "athlete", label: t("song.categories.athlete"), icon: "award" },
    { id: "public", label: t("song.categories.public"), icon: "users" },
    { id: "tiktoker", label: t("song.categories.tiktoker"), icon: "zap" },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setTimeout(() => {
        refetch();
      }, 500);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === "all") {
      setSearchQuery("");
    } else {
      setSearchQuery(categoryId);
    }
  };

  const handlePopularCategoryPress = (categoryType: string) => {
    setActiveCategory(categoryType);
    setSearchQuery(categoryType);
  };

  const renderHeader = () => (
    <View style={{ minHeight: 'auto' }}>
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
          paddingBottom: 20,
        }}
      >
        <Animated.View
          style={{
            paddingHorizontal: 24,
            marginBottom: screenWidth < 375 ? 24 : 32,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text
            className="text-gray-900 mb-2"
            style={{
              fontSize: screenWidth < 375 ? 24 : 28,
              fontFamily: AppFonts.semibold,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("creators.title")}
          </Text>
          <Text
            className="text-gray-600"
            style={{
              fontSize: screenWidth < 375 ? 14 : 16,
              fontFamily: AppFonts.semibold,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("creators.subtitle")}
          </Text>
        </Animated.View>

        <Animated.View
          style={{
            paddingHorizontal: 24,
            marginBottom: screenWidth < 375 ? 20 : 24,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View
            className={`bg-white rounded-2xl flex-row items-center shadow-sm border border-gray-200 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            style={{
              paddingHorizontal: 16,
              paddingVertical: screenWidth < 375 ? 12 : 16,
            }}
          >
            <Icon name="search" size={screenWidth < 375 ? 18 : 20} color="#6B7280" />
            <TextInput
              className={`flex-1 text-gray-900 ${
                isRTL ? "mr-3" : "ml-3"
              }`}
              placeholder={t("song.searchPlaceholder")}
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
              onSubmitEditing={() => refetch()}
              textAlign={isRTL ? "right" : "left"}
              style={{ 
                fontFamily: AppFonts.semibold,
                fontSize: screenWidth < 375 ? 14 : 16
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="w-6 h-6 bg-gray-300 rounded-full justify-center items-center"
              >
                <Icon name="x" size={12} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            marginBottom: screenWidth < 375 ? 20 : 32,
          }}
        >
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingHorizontal: 24,
              paddingBottom: 8
            }}
            inverted={isRTL}
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item: category }) => (
              <TouchableOpacity
                onPress={() => handleCategoryPress(category.id)}
                className={`flex-row items-center rounded-full ${
                  isRTL ? "ml-3" : "mr-3"
                } ${
                  activeCategory === category.id ? "bg-blue-500" : "bg-white"
                } shadow-sm ${isRTL ? "flex-row-reverse" : ""}`}
                style={{
                  paddingHorizontal: screenWidth < 375 ? 12 : 16,
                  paddingVertical: screenWidth < 375 ? 8 : 12,
                }}
                activeOpacity={0.8}
              >
                <Icon
                  name={category.icon}
                  size={screenWidth < 375 ? 14 : 16}
                  color={activeCategory === category.id ? "#ffffff" : "#374151"}
                  style={{
                    marginRight: isRTL ? 0 : 6,
                    marginLeft: isRTL ? 6 : 0,
                  }}
                />
                <Text
                  className={`${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                  style={{ 
                    fontFamily: AppFonts.semibold,
                    fontSize: screenWidth < 375 ? 12 : 14
                  }}
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
        <View style={{ 
          minHeight: screenWidth * 0.6, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingVertical: 40 
        }}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text
            className="text-gray-600 mt-4"
            style={{
              fontFamily: AppFonts.semibold,
              textAlign: "center",
            }}
          >
            {t("song.searchingCreators")}
          </Text>
        </View>
      );
    }

    if (searchQuery.length > 0) {
      return (
        <View style={{ 
          minHeight: screenWidth * 0.6, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingVertical: 40 
        }}>
          <View className="w-24 h-24 bg-gray-200 rounded-full justify-center items-center mb-6">
            <Icon name="search" size={32} color="#9CA3AF" />
          </View>
          <Text
            className="text-gray-900 text-xl mb-2"
            style={{
              fontFamily: AppFonts.semibold,
              textAlign: "center",
            }}
          >
            {t("song.noResultsFound")}
          </Text>
          <Text
            className="text-gray-600 text-center leading-6"
            style={{
              fontFamily: AppFonts.semibold,
              textAlign: "center",
            }}
          >
            {t("song.noResultsMessage", { query: searchQuery })}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ 
        minHeight: screenWidth * 0.6, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: 40 
      }}>
        <View className="w-24 h-24 bg-gray-200 rounded-full justify-center items-center mb-6">
          <Icon name="search" size={32} color="#fff" />
        </View>
        <Text
          className="text-gray-900 text-xl mb-2"
          style={{
            fontFamily: AppFonts.semibold,
            textAlign: "center",
          }}
        >
          {t("song.startSearching")}
        </Text>
        <Text
          className="text-gray-600 text-center leading-6"
          style={{
            fontFamily: AppFonts.semibold,
            textAlign: "center",
          }}
        >
          {t("song.startSearchingMessage")}
        </Text>
      </View>
    );
  };

  const renderFooter = () => (
    <View style={{ 
      paddingHorizontal: 24, 
      paddingTop: 32, 
      paddingBottom: Platform.OS === 'ios' ? 100 : 80,
      minHeight: screenWidth * 0.8
    }}>
      <Text
        className="text-gray-900 text-xl mb-6"
        style={{
          fontFamily: AppFonts.semibold,
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {t("song.popularCategories")}
      </Text>

      <View className={`flex-row mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <TouchableOpacity
          onPress={() => handlePopularCategoryPress("actor")}
          className={`flex-1 ${
            isRTL ? "items-end ml-2" : "items-start mr-2"
          } bg-white rounded-xl shadow-sm border border-gray-200`}
          style={{
            padding: screenWidth < 375 ? 12 : 16,
            minHeight: screenWidth < 375 ? 100 : 120
          }}
        >
          <Icon
            name="video"
            size={screenWidth < 375 ? 20 : 24}
            color="#3B82F6"
            style={{ marginBottom: screenWidth < 375 ? 6 : 8 }}
          />
          <Text
            className="text-gray-900"
            style={{ 
              fontFamily: AppFonts.semibold,
              fontSize: screenWidth < 375 ? 14 : 16
            }}
          >
            {t("song.categories.actor")}
          </Text>
          <Text
            className="text-gray-600"
            style={{ 
              fontFamily: AppFonts.semibold,
              fontSize: screenWidth < 375 ? 11 : 12
            }}
          >
            {t("song.categoryDescriptions.actor")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePopularCategoryPress("musician")}
          className={`flex-1 ${
            isRTL ? "items-end ml-2" : "items-start mr-2"
          } bg-white rounded-xl shadow-sm border border-gray-200`}
          style={{
            padding: screenWidth < 375 ? 12 : 16,
            minHeight: screenWidth < 375 ? 100 : 120
          }}
        >
          <Icon
            name="music"
            size={screenWidth < 375 ? 20 : 24}
            color="#3B82F6"
            style={{ marginBottom: screenWidth < 375 ? 6 : 8 }}
          />
          <Text
            className="text-gray-900"
            style={{ 
              fontFamily: AppFonts.semibold,
              fontSize: screenWidth < 375 ? 14 : 16
            }}
          >
            {t("song.categories.musician")}
          </Text>
          <Text
            className="text-gray-600"
            style={{ 
              fontFamily: AppFonts.semibold,
              fontSize: screenWidth < 375 ? 11 : 12
            }}
          >
            {t("song.categoryDescriptions.musician")}
          </Text>
        </TouchableOpacity>
      </View>

      <View className={`flex-row ${isRTL ? "flex-row-reverse" : ""}`}>
        <TouchableOpacity
          onPress={() => handlePopularCategoryPress("youtuber")}
          className={`flex-1 ${
            isRTL ? "items-end ml-2" : "items-start mr-2"
          } bg-white rounded-xl shadow-sm border border-gray-200`}
          style={{
            padding: screenWidth < 375 ? 12 : 16,
            minHeight: screenWidth < 375 ? 100 : 120
          }}
        >
          <Icon
            name="play"
            size={screenWidth < 375 ? 20 : 24}
            color="#3B82F6"
            style={{ marginBottom: screenWidth < 375 ? 6 : 8 }}
          />
          <Text
            className="text-gray-900"
            style={{ 
              fontFamily: AppFonts.semibold,
              fontSize: screenWidth < 375 ? 14 : 16
            }}
          >
            {t("song.categories.youtuber")}
          </Text>
          <Text
            className="text-gray-600"
            style={{ 
              fontFamily: AppFonts.semibold,
              fontSize: screenWidth < 375 ? 11 : 12
            }}
          >
            {t("song.categoryDescriptions.youtuber")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePopularCategoryPress("tiktoker")}
          className={`flex-1 ${
            isRTL ? "items-end ml-2" : "items-start mr-2"
          } bg-white rounded-xl shadow-sm border border-gray-200`}
          style={{
            padding: screenWidth < 375 ? 12 : 16,
            minHeight: screenWidth < 375 ? 100 : 120
          }}
        >
          <Icon
            name="zap"
            size={screenWidth < 375 ? 20 : 24}
            color="#3B82F6"
            style={{ marginBottom: screenWidth < 375 ? 6 : 8 }}
          />
          <Text
            className="text-gray-900"
            style={{ 
              fontFamily: AppFonts.semibold,
              fontSize: screenWidth < 375 ? 14 : 16
            }}
          >
            {t("song.categories.tiktoker")}
          </Text>
          <Text
            className="text-gray-600"
            style={{ 
              fontFamily: AppFonts.semibold,
              fontSize: screenWidth < 375 ? 11 : 12
            }}
          >
            {t("song.categoryDescriptions.tiktoker")}
          </Text>
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
            <Text
              className="text-gray-900 text-xl"
              style={{
                fontFamily: AppFonts.semibold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("song.searchResults")} ({data?.length})
            </Text>
          </View>
        );

      case "creator":
        return (
          <View style={{ 
            paddingHorizontal: 24, 
            marginBottom: 16,
            minHeight: 120
          }}>
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
        return (
          <View style={{ 
            paddingHorizontal: 24,
            minHeight: screenWidth * 0.7
          }}>
            {renderEmptyState()}
          </View>
        );

      case "footer":
        return renderFooter();

      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopLoader />
      <FlatList
        ref={scrollViewRef as any}
        data={flatListData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10
        }}
        refreshControl={refreshControl as any}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: 120, // Approximate item height
          offset: 120 * index,
          index,
        })}
      />
    </View>
  );
};

export default Search;
