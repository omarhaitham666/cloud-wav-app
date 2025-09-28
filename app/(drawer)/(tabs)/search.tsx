import CreatorCard from "@/components/cards/CreatorCard";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useSearchCreatorQuery } from "@/store/api/global/search";
import { getResponsiveSpacing, getSafeAreaInsets } from "@/utils/animations";
import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
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

  const spacing = getResponsiveSpacing();
  const safeArea = getSafeAreaInsets();

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
      setSearchQuery("all");
    } else {
      setSearchQuery(categoryId);
    }
  };

  const handlePopularCategoryPress = (categoryType: string) => {
    setActiveCategory(categoryType);
    setSearchQuery(categoryType);
  };

  const renderHeader = () => (
    <View style={{ minHeight: "auto" }}>
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
          paddingTop: safeArea.top + spacing.padding.medium,
          paddingBottom: spacing.padding.medium,
        }}
      >
        <View
          style={{
            paddingHorizontal: spacing.padding.medium,
            marginBottom: spacing.margin.large,
          }}
        >
          <Text
            className="text-gray-900 mb-2"
            style={{
              fontSize: spacing.fontSize.xlarge,
              fontFamily: AppFonts.semibold,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("creators.title")}
          </Text>
          <Text
            className="text-gray-600"
            style={{
              fontSize: spacing.fontSize.medium,
              fontFamily: AppFonts.semibold,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("creators.subtitle")}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: spacing.padding.medium,
            marginBottom: spacing.margin.medium,
          }}
        >
          <View
            className={`bg-white rounded-2xl flex-row items-center shadow-sm border border-gray-200 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            style={{
              paddingHorizontal: spacing.padding.medium,
              paddingVertical: spacing.padding.small,
            }}
          >
            <Icon
              name="search"
              size={spacing.iconSize.medium}
              color="#6B7280"
            />
            <TextInput
              className={`flex-1 text-gray-900 ${isRTL ? "mr-3" : "ml-3"}`}
              placeholder={t("song.searchPlaceholder")}
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
              onSubmitEditing={() => refetch()}
              textAlign={isRTL ? "right" : "left"}
              style={{
                fontFamily: AppFonts.semibold,
                fontSize: spacing.fontSize.medium,
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
        </View>

        <View style={{ marginBottom: spacing.margin.large }}>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: spacing.padding.medium,
              paddingBottom: spacing.padding.small,
            }}
            inverted={isRTL}
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item: category }) => (
              <View
                style={{
                  marginRight: isRTL ? 0 : spacing.margin.small,
                  marginLeft: isRTL ? spacing.margin.small : 0,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleCategoryPress(category.id)}
                  className={`flex-row items-center rounded-full ${
                    activeCategory === category.id ? "bg-blue-500" : "bg-white"
                  } shadow-sm ${isRTL ? "flex-row-reverse" : ""}`}
                  style={{
                    paddingHorizontal: spacing.padding.small,
                    paddingVertical: spacing.padding.small,
                  }}
                  activeOpacity={0.8}
                >
                  <Icon
                    name={category.icon}
                    size={spacing.iconSize.small}
                    color={
                      activeCategory === category.id ? "#ffffff" : "#374151"
                    }
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
                      fontSize: spacing.fontSize.small,
                    }}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View
          style={{
            minHeight: screenWidth * 0.6,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 40,
          }}
        >
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
        <View
          style={{
            minHeight: screenWidth * 0.6,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 40,
          }}
        >
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
      <View
        style={{
          minHeight: screenWidth * 0.6,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 40,
        }}
      >
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
    <View
      style={{
        paddingHorizontal: spacing.padding.medium,
        paddingTop: spacing.padding.large,
        paddingBottom: safeArea.bottom + spacing.padding.large,
        minHeight: screenWidth * 0.8,
      }}
      className={"mb-7"}
    >
      <Text
        className="text-gray-900 mb-6"
        style={{
          fontSize: spacing.fontSize.xlarge,
          fontFamily: AppFonts.semibold,
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {t("song.popularCategories")}
      </Text>

      <View className={`flex-row mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <View
          style={{
            flex: 1,
            marginRight: isRTL ? 0 : spacing.margin.small,
            marginLeft: isRTL ? spacing.margin.small : 0,
          }}
        >
          <TouchableOpacity
            onPress={() => handlePopularCategoryPress("actor")}
            className={`${
              isRTL ? "items-end" : "items-start"
            } bg-white rounded-xl shadow-sm border border-gray-200`}
            style={{
              padding: spacing.padding.medium,
              minHeight: 120,
            }}
          >
            <Icon
              name="video"
              size={spacing.iconSize.medium}
              color="#3B82F6"
              style={{ marginBottom: spacing.margin.small }}
            />
            <Text
              className="text-gray-900"
              style={{
                fontFamily: AppFonts.semibold,
                fontSize: spacing.fontSize.medium,
              }}
            >
              {t("song.categories.actor")}
            </Text>
            <Text
              className="text-gray-600"
              style={{
                fontFamily: AppFonts.semibold,
                fontSize: spacing.fontSize.small,
              }}
            >
              {t("song.categoryDescriptions.actor")}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            marginRight: isRTL ? 0 : spacing.margin.small,
            marginLeft: isRTL ? spacing.margin.small : 0,
          }}
        >
          <TouchableOpacity
            onPress={() => handlePopularCategoryPress("musician")}
            className={`${
              isRTL ? "items-end" : "items-start"
            } bg-white rounded-xl shadow-sm border border-gray-200`}
            style={{
              padding: spacing.padding.medium,
              minHeight: 120,
            }}
          >
            <Icon
              name="music"
              size={spacing.iconSize.medium}
              color="#3B82F6"
              style={{ marginBottom: spacing.margin.small }}
            />
            <Text
              className="text-gray-900"
              style={{
                fontFamily: AppFonts.semibold,
                fontSize: spacing.fontSize.medium,
              }}
            >
              {t("song.categories.musician")}
            </Text>
            <Text
              className="text-gray-600"
              style={{
                fontFamily: AppFonts.semibold,
                fontSize: spacing.fontSize.small,
              }}
            >
              {t("song.categoryDescriptions.musician")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className={`flex-row ${isRTL ? "flex-row-reverse" : ""}`}>
        <View
          style={{
            flex: 1,
            marginRight: isRTL ? 0 : spacing.margin.small,
            marginLeft: isRTL ? spacing.margin.small : 0,
          }}
        >
          <TouchableOpacity
            onPress={() => handlePopularCategoryPress("youtuber")}
            className={`${
              isRTL ? "items-end" : "items-start"
            } bg-white rounded-xl shadow-sm border border-gray-200`}
            style={{
              padding: spacing.padding.medium,
              minHeight: 120,
            }}
          >
            <Icon
              name="play"
              size={spacing.iconSize.medium}
              color="#3B82F6"
              style={{ marginBottom: spacing.margin.small }}
            />
            <Text
              className="text-gray-900"
              style={{
                fontFamily: AppFonts.semibold,
                fontSize: spacing.fontSize.medium,
              }}
            >
              {t("song.categories.youtuber")}
            </Text>
            <Text
              className="text-gray-600"
              style={{
                fontFamily: AppFonts.semibold,
                fontSize: spacing.fontSize.small,
              }}
            >
              {t("song.categoryDescriptions.youtuber")}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            marginRight: isRTL ? 0 : spacing.margin.small,
            marginLeft: isRTL ? spacing.margin.small : 0,
          }}
        >
          <TouchableOpacity
            onPress={() => handlePopularCategoryPress("tiktoker")}
            className={`${
              isRTL ? "items-end" : "items-start"
            } bg-white rounded-xl shadow-sm border border-gray-200`}
            style={{
              padding: spacing.padding.medium,
              minHeight: 120,
            }}
          >
            <Icon
              name="zap"
              size={spacing.iconSize.medium}
              color="#3B82F6"
              style={{ marginBottom: spacing.margin.small }}
            />
            <Text
              className="text-gray-900"
              style={{
                fontFamily: AppFonts.semibold,
                fontSize: spacing.fontSize.medium,
              }}
            >
              {t("song.categories.tiktoker")}
            </Text>
            <Text
              className="text-gray-600"
              style={{
                fontFamily: AppFonts.semibold,
                fontSize: spacing.fontSize.small,
              }}
            >
              {t("song.categoryDescriptions.tiktoker")}
            </Text>
          </TouchableOpacity>
        </View>
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
          <View
            style={{
              paddingHorizontal: spacing.padding.medium,
              marginBottom: spacing.margin.medium,
              minHeight: 120,
            }}
          >
            <View style={{ width: screenWidth - spacing.padding.medium * 2 }}>
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
          <View
            style={{
              paddingHorizontal: 24,
              minHeight: screenWidth * 0.7,
            }}
          >
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
          paddingBottom: safeArea.bottom + spacing.padding.medium,
        }}
        refreshControl={refreshControl as any}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: 120,
          offset: 120 * index,
          index,
        })}
      />
    </View>
  );
};

export default Search;
