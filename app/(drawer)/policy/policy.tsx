import CreativeBanner from "@/components/CreativeBanner";
import {
  ANIMATION_DELAY,
  useFadeIn,
  useListItemAnimation,
  usePageTransition,
  useSlideIn,
} from "@/utils/animations";
import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Animated from "react-native-reanimated";

const Policy = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const PolicySection = ({
    title,
    content,
    index,
  }: {
    title: string;
    content: string;
    index: number;
  }) => {
    const { animatedStyle, startAnimation } = useListItemAnimation(
      index,
      ANIMATION_DELAY.MEDIUM
    );

    useEffect(() => {
      startAnimation();
    }, []);

    return (
      <Animated.View style={animatedStyle} className="mb-4">
        <View
          className="flex-row items-center mb-3 gap-3"
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <LinearGradient
            colors={["#6366F1", "#8B5CF6"]}
            className="w-8 h-8 items-center justify-center"
            style={{
              borderRadius: 100,
            }}
          >
            <Text
              className="text-white text-sm font-bold"
              style={{ fontFamily: AppFonts.bold }}
            >
              {index}
            </Text>
          </LinearGradient>
          <Text
            className="text-lg text-gray-800 flex-1"
            style={{
              textAlign: isRTL ? "right" : "left",
              fontFamily: AppFonts.bold,
            }}
          >
            {title}
          </Text>
        </View>
        <Text
          className="text-gray-600 leading-6"
          style={{
            textAlign: isRTL ? "right" : "left",
            fontFamily: AppFonts.regular,
          }}
        >
          {content}
        </Text>
      </Animated.View>
    );
  };

  const { animatedStyle: pageAnimatedStyle, enterPage } = usePageTransition();
  const {
    animatedStyle: bannerAnimatedStyle,
    startAnimation: startBannerAnimation,
  } = useSlideIn("down", ANIMATION_DELAY.NONE);
  const {
    animatedStyle: headerAnimatedStyle,
    startAnimation: startHeaderAnimation,
  } = useFadeIn(ANIMATION_DELAY.SMALL);
  const {
    animatedStyle: introAnimatedStyle,
    startAnimation: startIntroAnimation,
  } = useSlideIn("up", ANIMATION_DELAY.MEDIUM);
  const {
    animatedStyle: footerAnimatedStyle,
    startAnimation: startFooterAnimation,
  } = useFadeIn(ANIMATION_DELAY.LARGE + 500);

  useEffect(() => {
    enterPage();
    startBannerAnimation();
    startHeaderAnimation();
    startIntroAnimation();
    startFooterAnimation();
  }, []);

  return (
    <SafeAreaView className="flex-1 pt-12 bg-gray-50">
      <Animated.View style={[{ flex: 1 }, pageAnimatedStyle]}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Animated.View style={bannerAnimatedStyle} className="px-4">
            <CreativeBanner
              titleKey="title"
              subtitleKey="subtitle"
              iconKey="icon"
              colors={["#3B82F6", "#1D4ED8", "#1E40AF"]}
              namespace="policy"
            />
          </Animated.View>

          <View className="px-4 mt-8">
            <Animated.View
              style={headerAnimatedStyle}
              className="bg-white rounded-t-2xl p-6 shadow-md"
            >
              <View className="mb-6">
                <Text
                  className="text-sm text-gray-500 mb-2"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.regular,
                  }}
                >
                  {t("policy.lastUpdated")}
                </Text>
                <Text
                  className="text-sm text-gray-500"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.regular,
                  }}
                >
                  {t("policy.owner")}
                </Text>
              </View>

              <Animated.Text
                style={[
                  introAnimatedStyle,
                  {
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.regular,
                  },
                ]}
                className="text-gray-700 leading-6 mb-6"
              >
                {t("policy.introduction")}
              </Animated.Text>

              <PolicySection
                title={t("policy.aboutServices.title")}
                content={t("policy.aboutServices.content")}
                index={1}
              />

              <PolicySection
                title={t("policy.artistRegistration.title")}
                content={t("policy.artistRegistration.content")}
                index={2}
              />

              <PolicySection
                title={t("policy.dataCollection.title")}
                content={t("policy.dataCollection.content")}
                index={3}
              />

              <PolicySection
                title={t("policy.dataUsage.title")}
                content={t("policy.dataUsage.content")}
                index={4}
              />

              <PolicySection
                title={t("policy.digitalRights.title")}
                content={t("policy.digitalRights.content")}
                index={5}
              />

              <PolicySection
                title={t("policy.paidAds.title")}
                content={t("policy.paidAds.content")}
                index={6}
              />

              <PolicySection
                title={t("policy.userRights.title")}
                content={t("policy.userRights.content")}
                index={7}
              />

              <PolicySection
                title={t("policy.dataProtection.title")}
                content={t("policy.dataProtection.content")}
                index={8}
              />

              <PolicySection
                title={t("policy.policyChanges.title")}
                content={t("policy.policyChanges.content")}
                index={9}
              />

              <PolicySection
                title={t("policy.contact.title")}
                content={t("policy.contact.content")}
                index={10}
              />

              <Animated.View
                style={footerAnimatedStyle}
                className="mt-8 mb-8 p-4 bg-gray-50 rounded-xl"
              >
                <Text
                  className="text-gray-600 text-center leading-6"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.regular,
                  }}
                >
                  {t("policy.footer")}
                </Text>
              </Animated.View>
            </Animated.View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Policy;
