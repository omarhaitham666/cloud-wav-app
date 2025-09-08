import CreatorCard from "@/components/cards/CreatorCard";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useSearchCreatorQuery } from "@/store/api/global/search";
import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
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
          <Text
            className="text-gray-900 text-3xl mb-2"
            style={{
              fontFamily: AppFonts.semibold,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("creators.title")}
          </Text>
          <Text
            className="text-gray-600 text-base"
            style={{
              fontFamily: AppFonts.semibold,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("creators.subtitle")}
          </Text>
        </Animated.View>

        <Animated.View
          className="px-6 mb-6"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View
            className={`bg-white rounded-2xl flex-row items-center px-4 py-2 shadow-sm border border-gray-200 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Icon name="search" size={20} color="#6B7280" />
            <TextInput
              className={`flex-1 text-gray-900 text-base ${
                isRTL ? "mr-3" : "ml-3"
              }`}
              placeholder={t("song.searchPlaceholder")}
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
              onSubmitEditing={() => refetch()}
              textAlign={isRTL ? "right" : "left"}
              style={{ fontFamily: AppFonts.semibold }}
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
          }}
        >
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="mb-8"
            contentContainerStyle={{ paddingHorizontal: 24 }}
            inverted={isRTL}
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item: category }) => (
              <TouchableOpacity
                onPress={() => handleCategoryPress(category.id)}
                className={`flex-row items-center px-4 py-3 rounded-full ${
                  isRTL ? "ml-3" : "mr-3"
                } ${
                  activeCategory === category.id ? "bg-blue-500" : "bg-white"
                } shadow-sm ${isRTL ? "flex-row-reverse" : ""}`}
                activeOpacity={0.8}
              >
                <Icon
                  name={category.icon}
                  size={16}
                  color={activeCategory === category.id ? "#ffffff" : "#374151"}
                  style={{
                    marginRight: isRTL ? 0 : 8,
                    marginLeft: isRTL ? 8 : 0,
                  }}
                />
                <Text
                  className={`${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                  style={{ fontFamily: AppFonts.semibold }}
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
          <Text
            className="text-gray-600 mt-2"
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
        <View className="items-center py-12">
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
            className="text-gray-600 text-center text-base leading-6"
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
      <View className="items-center py-12">
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
          className="text-gray-600 text-center text-base leading-6"
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
    <View className="px-6 mt-8 mb-20">
      <Text
        className="text-gray-900 text-xl mb-4"
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
          } bg-white rounded-xl p-4 shadow-sm border border-gray-200`}
        >
          <Icon
            name="video"
            size={24}
            color="#3B82F6"
            style={{ marginBottom: 8 }}
          />
          <Text
            className="text-gray-900"
            style={{ fontFamily: AppFonts.semibold }}
          >
            {t("song.categories.actor")}
          </Text>
          <Text
            className="text-gray-600 text-sm"
            style={{ fontFamily: AppFonts.semibold }}
          >
            {t("song.categoryDescriptions.actor")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePopularCategoryPress("musician")}
          className={`flex-1 ${
            isRTL ? "items-end ml-2" : "items-start mr-2"
          } bg-white rounded-xl p-4 shadow-sm border border-gray-200`}
        >
          <Icon
            name="music"
            size={24}
            color="#3B82F6"
            style={{ marginBottom: 8 }}
          />
          <Text
            className="text-gray-900"
            style={{ fontFamily: AppFonts.semibold }}
          >
            {t("song.categories.musician")}
          </Text>
          <Text
            className="text-gray-600 text-sm"
            style={{ fontFamily: AppFonts.semibold }}
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
          } bg-white rounded-xl p-4 shadow-sm border border-gray-200`}
        >
          <Icon
            name="play"
            size={24}
            color="#3B82F6"
            style={{ marginBottom: 8 }}
          />
          <Text
            className="text-gray-900"
            style={{ fontFamily: AppFonts.semibold }}
          >
            {t("song.categories.youtuber")}
          </Text>
          <Text
            className="text-gray-600 text-sm"
            style={{ fontFamily: AppFonts.semibold }}
          >
            {t("song.categoryDescriptions.youtuber")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePopularCategoryPress("tiktoker")}
          className={`flex-1 ${
            isRTL ? "items-end ml-2" : "items-start mr-2"
          } bg-white rounded-xl p-4 shadow-sm border border-gray-200`}
        >
          <Icon
            name="zap"
            size={24}
            color="#3B82F6"
            style={{ marginBottom: 8 }}
          />
          <Text
            className="text-gray-900"
            style={{ fontFamily: AppFonts.semibold }}
          >
            {t("song.categories.tiktoker")}
          </Text>
          <Text
            className="text-gray-600 text-sm"
            style={{ fontFamily: AppFonts.semibold }}
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
      <TopLoader />
      <FlatList
        ref={scrollViewRef as any}
        data={flatListData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={refreshControl as any}
      />
    </View>
  );
};

export default Search;
