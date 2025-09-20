import CustomHeader from "@/components/CustomHeader";
import ServicesSection from "@/components/ServicesSection";
import { SongCard } from "@/components/cards/SongCard";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useGetTrendSongQuery } from "@/store/api/global/song";
import { getResponsiveSpacing, getSafeAreaInsets } from "@/utils/animations";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { data, isLoading, refetch } = useGetTrendSongQuery();

  const spacing = getResponsiveSpacing();
  const safeArea = getSafeAreaInsets();

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopLoader />
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          refreshControl={refreshControl as any}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: safeArea.bottom + 20 }}
        >
          <View>
            <ImageBackground
              source={require("../../../assets/images/Rectangle.png")}
              resizeMode="cover"
              className="w-full justify-between"
              style={{
                height: 350,
                padding: spacing.padding.medium,
                paddingTop: safeArea.top + spacing.padding.medium,
              }}
            >
              <View>
                <CustomHeader transparent colorIcon="white" />
              </View>

              <View
                className="absolute"
                style={{
                  top: 120,
                  left: spacing.padding.medium,
                  right: spacing.padding.medium,
                }}
              >
                <Text
                  className="text-white mb-1"
                  style={{
                    fontSize: spacing.fontSize.small,
                    fontFamily: AppFonts.semibold,
                    textAlign: "left",
                  }}
                >
                  {t("home.brand")}
                </Text>

                <Text
                  className="text-white leading-7"
                  style={{
                    fontSize: spacing.fontSize.xlarge,
                    fontFamily: AppFonts.semibold,
                    textAlign: "left",
                  }}
                >
                  {t("home.hero.title")}
                </Text>

                <Text
                  className="text-white mb-4"
                  style={{
                    fontSize: spacing.fontSize.medium,
                    fontFamily: AppFonts.semibold,
                    textAlign: "left",
                  }}
                >
                  {t("home.hero.subtitle")}
                </Text>

                <View
                  className="flex-row items-center"
                  style={{ gap: spacing.margin.small }}
                >
                  <View>
                    <TouchableOpacity
                      onPress={() => router.push("/music")}
                      className="bg-white flex-row items-center gap-3 px-4 py-2.5 rounded-full shadow-lg"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                      }}
                    >
                      <Text
                        className="text-red-500"
                        style={{
                          fontSize: spacing.fontSize.small,
                          fontFamily: AppFonts.semibold,
                        }}
                      >
                        {t("home.buttons.play")}
                      </Text>
                      <Ionicons
                        name="play"
                        size={spacing.iconSize.small}
                        color="red"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>

          <View>
            <ServicesSection />
          </View>

          <View
            className="mb-16"
            style={{
              marginHorizontal: spacing.padding.medium,
              marginTop: spacing.margin.large,
            }}
          >
            <Text
              className="mb-4"
              style={{
                fontSize: spacing.fontSize.xlarge,
                fontFamily: AppFonts.semibold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("home.sections.trendingSongs")}
            </Text>

            {isLoading ? (
              <View className="flex-1 justify-center items-center my-8">
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: spacing.padding.medium }}
                renderItem={({ item, index }) => (
                  <View style={{ marginRight: spacing.margin.small }}>
                    <SongCard
                      id={item.id}
                      key={item.id}
                      title={item.title}
                      artist={item.artist}
                      audio_url={item.audio_url}
                      cover_url={item.cover_url}
                      debug_path={item.debug_path}
                      isInAlbom={false}
                    />
                  </View>
                )}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;
