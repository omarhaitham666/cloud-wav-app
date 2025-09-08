import CustomHeader from "@/components/CustomHeader";
import ServicesSection from "@/components/ServicesSection";
import { SongCard } from "@/components/cards/SongCard";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useGetTrendSongQuery } from "@/store/api/global/song";
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
      <ScrollView ref={scrollViewRef} refreshControl={refreshControl as any}>
        <ImageBackground
          source={require("../../../assets/images/Rectangle.png")}
          resizeMode="cover"
          className="h-96 w-full justify-between p-5"
        >
          <View>
            <CustomHeader transparent colorIcon="white" />
          </View>

          <View className="absolute top-28 left-6">
            <Text
              className="text-white text-xs mb-1"
              style={{
                fontFamily: AppFonts.semibold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("home.brand")}
            </Text>

            <Text
              className="text-white text-2xl leading-7"
              style={{
                fontFamily: AppFonts.semibold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("home.hero.title")}
            </Text>

            <Text
              className="text-white text-base mb-4"
              style={{
                fontFamily: AppFonts.semibold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("home.hero.subtitle")}
            </Text>

            <View className="flex-row items-center space-x-3">
              <TouchableOpacity
                onPress={() => router.push("/music")}
                className="bg-white flex-row items-center gap-3 px-4 py-2.5 rounded-full"
              >
                <Text
                  className="text-red-500 text-sm"
                  style={{
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  {t("home.buttons.play")}
                </Text>
                <Ionicons name="play" size={18} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <ServicesSection />
        <View className=" mb-16 mx-3">
          <Text
            className="text-2xl mx-3 mb-4"
            style={{
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
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <SongCard
                  id={item.id}
                  key={item.id}
                  title={item.title}
                  artist={item.artist}
                  audio_url={item.audio_url}
                  cover_url={item.cover_url}
                  debug_path={item.debug_path}
                />
              )}
            />
          )}
        </View>
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;
