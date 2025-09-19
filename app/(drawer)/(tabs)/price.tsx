import { PricingCard } from "@/components/cards/PricingCard";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
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
import { pricingPlans } from "@/utils/data";
import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  BounceIn,
  interpolate,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PricingScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isYearly, setIsYearly] = useState(false);
  const toggleAnimation = useSharedValue(0);

  const spacing = getResponsiveSpacing();
  const safeArea = getSafeAreaInsets();

  const { animatedStyle: pageStyle, enterPage } = usePageTransition();
  const { animatedStyle: headerStyle, startAnimation: startHeaderAnimation } =
    useSlideIn("up", 0);
  const { animatedStyle: toggleStyle, startAnimation: startToggleAnimation } =
    useScaleIn(ANIMATION_DELAY.SMALL);
  const { animatedStyle: cardsStyle, startAnimation: startCardsAnimation } =
    useFadeIn(ANIMATION_DELAY.MEDIUM);

  const { animatedStyle: cardStyle, startAnimation: startCardAnimation } =
    useStaggerAnimation(pricingPlans.length, 150, ANIMATION_DELAY.MEDIUM + 200);

  const {
    animatedStyle: cardHoverStyle,
    onPressIn: onCardPressIn,
    onPressOut: onCardPressOut,
  } = useCardHover();

  const { refreshControl, scrollViewRef, TopLoader } = usePullToRefresh({
    onRefresh: async () => {
      console.log("Refreshing pricing data...");
    },
    scrollToTopOnRefresh: true,
    showTopLoader: true,
  });

  useEffect(() => {
    enterPage();
    startHeaderAnimation();
    startToggleAnimation();
    startCardsAnimation();
    startCardAnimation();
  }, [
    enterPage,
    startHeaderAnimation,
    startToggleAnimation,
    startCardsAnimation,
    startCardAnimation,
  ]);

  const setToMonthly = () => {
    setIsYearly(false);
    toggleAnimation.value = withTiming(0, { duration: 300 });
  };

  const setToYearly = () => {
    setIsYearly(true);
    toggleAnimation.value = withTiming(1, { duration: 300 });
  };

  const toggleSwitchStyle = useAnimatedStyle(() => {
    const translateX = interpolate(toggleAnimation.value, [0, 1], [4, 84]);
    const scale = interpolate(toggleAnimation.value, [0, 1], [1, 1.02]);
    return {
      transform: [{ translateX }, { scale }],
    };
  });

  return (
    <SafeAreaView className="flex-1" style={{ paddingTop: safeArea.top }}>
      <LinearGradient
        colors={["#ffffff", "#f8fafc", "#f1f5f9"]}
        className="flex-1"
      >
        <TopLoader />
        <ScrollView
          ref={scrollViewRef}
          style={[{ flex: 1 }, pageStyle]}
          contentContainerStyle={{
            paddingHorizontal: spacing.padding.medium,
            paddingBottom: safeArea.bottom + 100,
            paddingTop: spacing.padding.medium,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl as any}
        >
          <Animated.View
            style={[
              headerStyle,
              {
                alignItems: "center",
                marginTop: spacing.margin.medium,
                marginBottom: spacing.margin.large,
              },
            ]}
          >
            <Text
              className="text-gray-800 mb-4 text-center"
              style={{
                fontSize: spacing.fontSize.xlarge,
                fontFamily: AppFonts.bold,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("pricing.title")}
            </Text>
            <Text
              className="text-gray-600 text-center leading-6"
              style={{
                fontSize: spacing.fontSize.medium,
                fontFamily: AppFonts.medium,
                writingDirection: isRTL ? "rtl" : "ltr",
                paddingHorizontal: spacing.padding.small,
              }}
            >
              {t("pricing.subtitle")}
            </Text>
          </Animated.View>

          {isYearly && (
            <Animated.View
              entering={BounceIn.delay(400).springify()}
              className="self-center mb-4 px-3 py-1 rounded-full bg-green-50 border border-green-200"
            >
              <Text
                className="text-green-700 font-medium"
                style={{
                  fontSize: spacing.fontSize.small,
                  fontFamily: AppFonts.medium,
                  textAlign: "center",
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {t("pricing.toggle.savings")}
              </Text>
            </Animated.View>
          )}

          <Animated.View
            style={[
              toggleStyle,
              {
                alignItems: "center",
                marginBottom: spacing.margin.large,
              },
            ]}
          >
            <View
              className={`flex-row border border-gray-200 rounded-full relative bg-gray-50 shadow-sm`}
              style={{
                width: 180,
                height: 50,
              }}
            >
              <Animated.View
                style={[
                  toggleSwitchStyle,
                  {
                    position: "absolute",
                    zIndex: 1,
                    left: -2,
                  },
                ]}
                className="w-[6rem] h-12 mt-1 bg-red-500 rounded-full shadow-xl"
              />
              <TouchableOpacity
                onPress={setToMonthly}
                activeOpacity={0.7}
                className="flex-1 items-center justify-center z-10"
                style={{
                  transform: [{ scale: !isYearly ? 1 : 0.98 }],
                }}
              >
                <Text
                  className={`font-semibold ${
                    !isYearly ? "text-white" : "text-gray-700"
                  }`}
                  style={{
                    fontSize: spacing.fontSize.small,
                    fontFamily: AppFonts.semibold,
                    textAlign: "center",
                    writingDirection: "auto",
                  }}
                >
                  {t("pricing.toggle.monthly")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={setToYearly}
                activeOpacity={0.7}
                className="flex-1 items-center justify-center z-10"
                style={{
                  transform: [{ scale: isYearly ? 1 : 0.98 }],
                }}
              >
                <View className="items-center">
                  <Text
                    className={`font-semibold ${
                      isYearly ? "text-white" : "text-gray-700"
                    }`}
                    style={{
                      fontSize: spacing.fontSize.small,
                      fontFamily: AppFonts.semibold,
                      textAlign: "center",
                      writingDirection: isRTL ? "rtl" : "ltr",
                    }}
                  >
                    {t("pricing.toggle.yearly")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View style={[cardsStyle, { gap: spacing.margin.large }]}>
            {pricingPlans.map((plan, index) => (
              <Animated.View
                key={plan.id}
                style={[cardStyle, cardHoverStyle]}
                entering={SlideInUp.delay(500 + index * 150).springify()}
              >
                <TouchableOpacity
                  onPressIn={onCardPressIn}
                  onPressOut={onCardPressOut}
                  activeOpacity={0.9}
                >
                  <PricingCard plan={plan} isYearly={isYearly} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
