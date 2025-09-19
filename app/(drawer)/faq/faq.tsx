import CreativeBanner from "@/components/CreativeBanner";
import {
  ANIMATION_DELAY,
  useFadeIn,
  useListItemAnimation,
  usePageTransition,
  useScaleIn,
  useSlideIn,
} from "@/utils/animations";
import { AppFonts } from "@/utils/fonts";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQItem = ({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { animatedStyle, startAnimation } = useListItemAnimation(
    index,
    ANIMATION_DELAY.MEDIUM
  );

  useEffect(() => {
    startAnimation();
  }, []);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <Animated.View
      style={[
        {
          borderRadius: 18,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        },
        animatedStyle,
      ]}
      className="bg-purple-800 mb-4 p-4"
    >
      <TouchableOpacity
        onPress={toggleExpand}
        className={`flex-row justify-between items-center ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <Text
          className="text-white text-lg flex-1"
          style={{
            textAlign: isRTL ? "right" : "left",
            fontFamily: AppFonts.semibold,
          }}
        >
          {question}
        </Text>
        <Ionicons
          name={expanded ? "remove-circle-outline" : "add-circle-outline"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
      {expanded && (
        <Text
          className="text-white mt-2 text-sm leading-relaxed"
          style={{
            textAlign: isRTL ? "right" : "left",
            fontFamily: AppFonts.regular,
          }}
        >
          {answer}
        </Text>
      )}
    </Animated.View>
  );
};

const FAQPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { animatedStyle: pageAnimatedStyle, enterPage } = usePageTransition();
  const {
    animatedStyle: bannerAnimatedStyle,
    startAnimation: startBannerAnimation,
  } = useSlideIn("down", ANIMATION_DELAY.NONE);
  const {
    animatedStyle: tipsAnimatedStyle,
    startAnimation: startTipsAnimation,
  } = useFadeIn(ANIMATION_DELAY.LARGE + 300);
  const {
    animatedStyle: warningAnimatedStyle,
    startAnimation: startWarningAnimation,
  } = useSlideIn("up", ANIMATION_DELAY.LARGE + 400);
  const {
    animatedStyle: buttonAnimatedStyle,
    startAnimation: startButtonAnimation,
  } = useScaleIn(ANIMATION_DELAY.LARGE + 500);

  useEffect(() => {
    enterPage();
    startBannerAnimation();
    startTipsAnimation();
    startWarningAnimation();
    startButtonAnimation();
  }, []);

  const faqItems = [
    {
      question: t("faq.questions.whatIsCloudWav.question"),
      answer: t("faq.questions.whatIsCloudWav.answer"),
    },
    {
      question: t("faq.questions.createAccount.question"),
      answer: t("faq.questions.createAccount.answer"),
    },
    {
      question: t("faq.questions.artistAccount.question"),
      answer: t("faq.questions.artistAccount.answer"),
    },
    {
      question: t("faq.questions.requestDedication.question"),
      answer: t("faq.questions.requestDedication.answer"),
    },
    {
      question: t("faq.questions.bookArtist.question"),
      answer: t("faq.questions.bookArtist.answer"),
    },
    {
      question: t("faq.questions.productionServices.question"),
      answer: t("faq.questions.productionServices.answer"),
    },
    {
      question: t("faq.questions.socialMediaServices.question"),
      answer: t("faq.questions.socialMediaServices.answer"),
    },
    {
      question: t("faq.questions.paymentMethods.question"),
      answer: t("faq.questions.paymentMethods.answer"),
    },
    {
      question: t("faq.questions.refundPolicy.question"),
      answer: t("faq.questions.refundPolicy.answer"),
    },
    {
      question: t("faq.questions.artistContract.question"),
      answer: t("faq.questions.artistContract.answer"),
    },
    {
      question: t("faq.questions.customerSupport.question"),
      answer: t("faq.questions.customerSupport.answer"),
    },
    {
      question: t("faq.questions.accountSuspension.question"),
      answer: t("faq.questions.accountSuspension.answer"),
    },
  ];

  return (
    <SafeAreaView className="flex-1 py-3 bg-gray-50">
      <Animated.View style={[{ flex: 1 }, pageAnimatedStyle]}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Animated.View style={bannerAnimatedStyle} className="p-4">
            <CreativeBanner
              titleKey="title"
              subtitleKey="subtitle"
              iconKey="icon"
              colors={["#8B5CF6", "#7C3AED", "#6D28D9"]}
              namespace="faq"
            />
          </Animated.View>

          <View className="px-4">
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                index={index}
              />
            ))}

            <Animated.View
              style={[
                tipsAnimatedStyle,
                {
                  borderRadius: 18,
                },
              ]}
              className="border border-1 p-5 mt-6"
            >
              <Text
                className="font-semibold mb-2 text-black"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.semibold,
                }}
              >
                {t("faq.tips.title")}
              </Text>
              <Text
                className="text-sm text-gray-700 leading-relaxed"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.semibold,
                }}
              >
                {t("faq.tips.content")}
              </Text>
            </Animated.View>

            <Animated.View
              style={warningAnimatedStyle}
              className="bg-red-100 p-4 mt-4 rounded-lg"
            >
              <Text
                className="font-bold mb-1 text-red-700"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.semibold,
                }}
              >
                {t("faq.legalWarning.title")}
              </Text>
              <Text
                className="text-sm text-gray-800"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.semibold,
                }}
              >
                {t("faq.legalWarning.content")}
              </Text>
            </Animated.View>

            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity
                onPress={() => router.push("/(drawer)/contact/contact")}
                className="mt-6 mb-16 bg-green-600 py-3 rounded-full"
              >
                <Text
                  className="text-center text-white text-base"
                  style={{
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  {t("faq.contactButton")}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default FAQPage;
