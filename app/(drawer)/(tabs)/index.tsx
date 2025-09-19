import CustomHeader from "@/components/CustomHeader";
import ServicesSection from "@/components/ServicesSection";
import { SongCard } from "@/components/cards/SongCard";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useGetTrendSongQuery } from "@/store/api/global/song";
import {
  ANIMATION_DELAY,
  getResponsiveSpacing,
  getSafeAreaInsets,
  useCardHover,
  useFadeIn,
  usePageTransition,
  useScaleIn,
  useSlideIn,
  useStaggerAnimation,
} from "@/utils/animations";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
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
import Animated, {
  FadeIn,
  SlideInRight,
  SlideInUp,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { data, isLoading, refetch } = useGetTrendSongQuery();

  const spacing = getResponsiveSpacing();
  const safeArea = getSafeAreaInsets();

  const { animatedStyle: pageStyle, enterPage } = usePageTransition();
  const { animatedStyle: heroStyle, startAnimation: startHeroAnimation } =
    useSlideIn("up", 0);
  const { animatedStyle: brandStyle, startAnimation: startBrandAnimation } =
    useFadeIn(ANIMATION_DELAY.SMALL);
  const { animatedStyle: titleStyle, startAnimation: startTitleAnimation } =
    useSlideIn("up", ANIMATION_DELAY.MEDIUM);
  const {
    animatedStyle: subtitleStyle,
    startAnimation: startSubtitleAnimation,
  } = useSlideIn("up", ANIMATION_DELAY.LARGE);
  const { animatedStyle: buttonStyle, startAnimation: startButtonAnimation } =
    useScaleIn(ANIMATION_DELAY.LARGE + 100);
  const {
    animatedStyle: playButtonStyle,
    onPressIn: onPlayPressIn,
    onPressOut: onPlayPressOut,
  } = useCardHover();

  const {
    animatedStyle: songCardsStyle,
    startAnimation: startSongCardsAnimation,
  } = useStaggerAnimation(data?.length || 0, 100, ANIMATION_DELAY.LARGE + 200);

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
    enterPage();
    startHeroAnimation();
    startBrandAnimation();
    startTitleAnimation();
    startSubtitleAnimation();
    startButtonAnimation();

    const timer = setTimeout(() => {
      startSongCardsAnimation();
    }, 800);

    return () => clearTimeout(timer);
  }, [
    data,
    enterPage,
    startHeroAnimation,
    startBrandAnimation,
    startTitleAnimation,
    startSubtitleAnimation,
    startButtonAnimation,
    startSongCardsAnimation,
  ]);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: safeArea.top }}
    >
      <TopLoader />
      <Animated.View style={[{ flex: 1 }, pageStyle]}>
        <ScrollView
          ref={scrollViewRef}
          refreshControl={refreshControl as any}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: safeArea.bottom + 20 }}
        >
          <Animated.View style={heroStyle}>
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
                <Animated.Text
                  className="text-white mb-1"
                  style={[
                    brandStyle,
                    {
                      fontSize: spacing.fontSize.small,
                      fontFamily: AppFonts.semibold,
                      textAlign: "left",
                    },
                  ]}
                >
                  {t("home.brand")}
                </Animated.Text>

                <Animated.Text
                  className="text-white leading-7"
                  style={[
                    titleStyle,
                    {
                      fontSize: spacing.fontSize.xlarge,
                      fontFamily: AppFonts.semibold,
                      textAlign: "left",
                    },
                  ]}
                >
                  {t("home.hero.title")}
                </Animated.Text>

                <Animated.Text
                  className="text-white mb-4"
                  style={[
                    subtitleStyle,
                    {
                      fontSize: spacing.fontSize.medium,
                      fontFamily: AppFonts.semibold,
                      textAlign: "left",
                    },
                  ]}
                >
                  {t("home.hero.subtitle")}
                </Animated.Text>

                <Animated.View
                  className="flex-row items-center"
                  style={[buttonStyle, { gap: spacing.margin.small }]}
                >
                  <Animated.View style={playButtonStyle}>
                    <TouchableOpacity
                      onPress={() => router.push("/music")}
                      onPressIn={onPlayPressIn}
                      onPressOut={onPlayPressOut}
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
                  </Animated.View>
                </Animated.View>
              </View>
            </ImageBackground>
          </Animated.View>

          <Animated.View entering={SlideInUp.delay(400).springify()}>
            <ServicesSection />
          </Animated.View>

          <View
            className="mb-16"
            style={{
              marginHorizontal: spacing.padding.medium,
              marginTop: spacing.margin.large,
            }}
          >
            <Animated.Text
              className="mb-4"
              style={[
                {
                  fontSize: spacing.fontSize.xlarge,
                  fontFamily: AppFonts.semibold,
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
              entering={FadeIn.delay(600).springify()}
            >
              {t("home.sections.trendingSongs")}
            </Animated.Text>

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
                  <Animated.View
                    style={[
                      songCardsStyle,
                      { marginRight: spacing.margin.small },
                    ]}
                    entering={SlideInRight.delay(700 + index * 100).springify()}
                  >
                    <SongCard
                      id={item.id}
                      key={item.id}
                      title={item.title}
                      artist={item.artist}
                      audio_url={item.audio_url}
                      cover_url={item.cover_url}
                      debug_path={item.debug_path}
                    />
                  </Animated.View>
                )}
              />
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default HomePage;
