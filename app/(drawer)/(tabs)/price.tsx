import { PricingCard } from "@/components/cards/PricingCard";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { getResponsiveSpacing, getSafeAreaInsets } from "@/utils/animations";
import { pricingPlans } from "@/utils/data";
import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PricingScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isYearly, setIsYearly] = useState(false);

  const spacing = getResponsiveSpacing();
  const safeArea = getSafeAreaInsets();

  const { refreshControl, scrollViewRef, TopLoader } = usePullToRefresh({
    onRefresh: async () => {
      console.log("Refreshing pricing data...");
    },
    scrollToTopOnRefresh: true,
    showTopLoader: true,
  });

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#ffffff", "#f8fafc", "#f1f5f9"]}
        className="flex-1"
      >
        <TopLoader />
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: spacing.padding.medium,
            paddingBottom: safeArea.bottom + 100,
            paddingTop: spacing.padding.medium,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl as any}
        >
          <Animated.View
            entering={FadeIn.duration(500)}
            style={{
              alignItems: "center",
              marginTop: spacing.margin.medium,
              marginBottom: spacing.margin.large,
            }}
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

          <View
            style={{
              alignItems: "center",
              marginBottom: spacing.margin.large,
            }}
          >
            <View
              className="flex-row border border-gray-200 rounded-full bg-gray-50 shadow-sm overflow-hidden"
              style={{ width: 180, height: 50 }}
            >
              <TouchableOpacity
                onPress={() => setIsYearly(false)}
                activeOpacity={0.7}
                className={`flex-1 items-center justify-center ${
                  !isYearly ? "bg-red-500" : ""
                }`}
              >
                <Text
                  className={`font-semibold ${
                    !isYearly ? "text-white" : "text-gray-700"
                  }`}
                  style={{
                    fontSize: spacing.fontSize.small,
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  {t("pricing.toggle.monthly")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsYearly(true)}
                activeOpacity={0.7}
                className={`flex-1 items-center justify-center ${
                  isYearly ? "bg-red-500" : ""
                }`}
              >
                <Text
                  className={`font-semibold ${
                    isYearly ? "text-white" : "text-gray-700"
                  }`}
                  style={{
                    fontSize: spacing.fontSize.small,
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  {t("pricing.toggle.yearly")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {isYearly && (
            <View className="self-center mb-4 px-3 py-1 rounded-full bg-green-50 border border-green-200">
              <Text
                className="text-green-700 font-medium"
                style={{
                  fontSize: spacing.fontSize.small,
                  fontFamily: AppFonts.medium,
                }}
              >
                {t("pricing.toggle.savings")}
              </Text>
            </View>
          )}

          <View style={{ gap: spacing.margin.large }}>
            {pricingPlans.map((plan, index) => (
              <Animated.View
                key={plan.id}
                entering={FadeIn.delay(index * 100).duration(500)}
              >
                <TouchableOpacity activeOpacity={0.9}>
                  <PricingCard plan={plan} isYearly={isYearly} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
