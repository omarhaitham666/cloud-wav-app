import MusicServiceModal from "@/components/modals/MusicServiceModal";
import {
  getResponsiveSpacing,
  getSafeAreaInsets,
  useFadeIn,
  usePageTransition,
  useScaleIn,
  useSlideIn,
} from "@/utils/animations";
import { services } from "@/utils/data";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

const MusicDistribution = () => {
  const [visible, setVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { animatedStyle: pageStyle, enterPage } = usePageTransition();
  const { animatedStyle: headerStyle, startAnimation: startHeaderAnimation } =
    useSlideIn("down", 0);
  const { animatedStyle: titleStyle, startAnimation: startTitleAnimation } =
    useFadeIn(200);
  const {
    animatedStyle: descriptionStyle,
    startAnimation: startDescriptionAnimation,
  } = useFadeIn(400);
  const { animatedStyle: buttonsStyle, startAnimation: startButtonsAnimation } =
    useSlideIn("up", 600);
  const {
    animatedStyle: servicesStyle,
    startAnimation: startServicesAnimation,
  } = useFadeIn(800);
  const { animatedStyle: imageStyle, startAnimation: startImageAnimation } =
    useScaleIn(1000);
  const { animatedStyle: formStyle, startAnimation: startFormAnimation } =
    useSlideIn("up", 1200);
  const spacing = getResponsiveSpacing();
  const safeArea = getSafeAreaInsets();
  const hasAnimated = useRef(false);

  const startAnimations = useCallback(() => {
    if (!hasAnimated.current) {
      enterPage();
      startHeaderAnimation();
      startTitleAnimation();
      startDescriptionAnimation();
      startButtonsAnimation();
      startServicesAnimation();
      startImageAnimation();
      startFormAnimation();
      hasAnimated.current = true;
    }
  }, [
    enterPage,
    startHeaderAnimation,
    startTitleAnimation,
    startDescriptionAnimation,
    startButtonsAnimation,
    startServicesAnimation,
    startImageAnimation,
    startFormAnimation,
  ]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  return (
    <LinearGradient
      colors={["#3B82F6", "#06B6D4", "#10B981"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView
        className="flex-1 py-3"
        style={{ paddingTop: safeArea.top }}
      >
        <Animated.View style={[pageStyle, { flex: 1 }]}>
          <Animated.View style={[headerStyle]}>
            <View className="flex-row items-center px-5 pt-10">
              <TouchableOpacity
                onPress={() => router.push("/(drawer)/services/services")}
                className="p-2 bg-white/20 rounded-full"
              >
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <Text
                className="text-white text-lg ms-4"
                style={{
                  fontFamily: AppFonts.semibold,
                  fontSize: spacing.fontSize.large,
                }}
              >
                {t("services.musicDistribution.title")}
              </Text>
            </View>
          </Animated.View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 px-5"
            contentContainerStyle={{ paddingBottom: safeArea.bottom + 40 }}
          >
            <Animated.Text
              className="text-white text-center my-4 text-lg ml-4"
              style={[
                titleStyle,
                {
                  fontFamily: AppFonts.semibold,
                  fontSize: spacing.fontSize.large,
                },
              ]}
            >
              {t("services.musicDistribution.title")}
            </Animated.Text>
            <Animated.Text
              className="text-white leading-6 mb-6 mt-4"
              style={[
                descriptionStyle,
                {
                  fontFamily: AppFonts.semibold,
                  fontSize: spacing.fontSize.medium,
                },
              ]}
            >
              {t("services.musicDistribution.description")}
            </Animated.Text>

            <Animated.View style={[buttonsStyle]}>
              <View className="flex-row justify-between mb-8">
                <TouchableOpacity
                  onPress={() => setVisible(true)}
                  className="bg-blue-600 px-4 py-3 rounded-xl w-[48%] items-center shadow"
                >
                  <Text
                    className="text-white text-base"
                    style={{
                      fontFamily: AppFonts.semibold,
                      fontSize: spacing.fontSize.medium,
                    }}
                  >
                    {t("services.musicDistribution.pricing")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/(drawer)/contact/contact")}
                  className="bg-green-600 px-4 py-3 rounded-xl w-[48%] items-center shadow"
                >
                  <Text
                    className="text-white text-base"
                    style={{
                      fontFamily: AppFonts.semibold,
                      fontSize: spacing.fontSize.medium,
                    }}
                  >
                    {t("services.musicDistribution.contactUs")}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View style={[servicesStyle]}>
              <View className="mb-8">
                <Text
                  className="text-xl font-bold text-white mb-4"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                    fontSize: spacing.fontSize.large,
                  }}
                >
                  {t("services.musicDistribution.ourServicesInclude")}
                </Text>
                {services.map((service, index) => (
                  <Animated.View key={index}>
                    <View className="bg-white/10 p-4 rounded-xl mb-4 border border-white/20">
                      <View
                        className="flex-row items-center mb-2"
                        style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
                      >
                        <Ionicons
                          name={service.icon as any}
                          size={spacing.iconSize.medium}
                          color="#fff"
                        />
                        <Text
                          className="text-white text-base"
                          style={{
                            marginLeft: isRTL ? 0 : 8,
                            marginRight: isRTL ? 8 : 0,
                            textAlign: isRTL ? "right" : "left",
                            fontFamily: AppFonts.semibold,
                            fontSize: spacing.fontSize.medium,
                          }}
                        >
                          {t(service.title)}
                        </Text>
                      </View>
                      <Text
                        className="text-teal-100 text-sm leading-5"
                        style={{
                          textAlign: isRTL ? "right" : "left",
                          fontFamily: AppFonts.semibold,
                          fontSize: spacing.fontSize.small,
                        }}
                      >
                        {t(service.description)}
                      </Text>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            <Animated.View style={[imageStyle]}>
              <View className="mb-8 items-center">
                <Image
                  source={require("../../../assets/images/musicbg-DLfbtMqd.png")}
                  className="w-full h-60 rounded-2xl"
                  resizeMode="cover"
                />
              </View>
            </Animated.View>

            <Animated.View style={[formStyle]}>
              <View className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <Text
                  className="text-lg font-bold text-gray-900 mb-4"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                    fontSize: spacing.fontSize.large,
                  }}
                >
                  {t("services.musicDistribution.letsTalkTitle")}
                </Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-3 mb-4 bg-gray-50 text-gray-800"
                  placeholder={t("services.musicDistribution.form.name")}
                  placeholderTextColor="#9CA3AF"
                  textAlignVertical="center"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                    fontSize: spacing.fontSize.medium,
                  }}
                />
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-3 mb-4 bg-gray-50 text-gray-800"
                  placeholder={t("services.musicDistribution.form.email")}
                  placeholderTextColor="#9CA3AF"
                  textAlignVertical="center"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                    fontSize: spacing.fontSize.medium,
                  }}
                />
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-3 mb-4 bg-gray-50 text-gray-800 h-24"
                  placeholder={t(
                    "services.musicDistribution.form.projectDetails"
                  )}
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                    fontSize: spacing.fontSize.medium,
                  }}
                />
                <TouchableOpacity className="bg-blue-600 py-3 rounded-xl items-center">
                  <Text
                    className="text-white font-medium"
                    style={{
                      fontFamily: AppFonts.semibold,
                      fontSize: spacing.fontSize.medium,
                    }}
                  >
                    {t("services.musicDistribution.form.sendMessage")}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>
        <MusicServiceModal
          visible={visible}
          onClose={() => setVisible(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MusicDistribution;
