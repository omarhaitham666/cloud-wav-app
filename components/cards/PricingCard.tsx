import { PricingPlan } from "@/utils/data";
import { AppFonts } from "@/utils/fonts";
import { Check } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export const PricingCard = ({
  isYearly,
  plan,
}: {
  isYearly: boolean;
  plan: PricingPlan;
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const period = isYearly ? t("pricing.periods.yearly") : t("pricing.periods.monthly");

  return (
    <View
      className={`bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden ${plan.isPopular
          ? "border-2 border-red-500 scale-105"
          : "border border-gray-100"
        }`}
      style={{
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      }}
    >
      <View className="mb-6">
        <Text
          className="text-2xl text-gray-800 mb-2"
          style={{ fontFamily: AppFonts.bold, textAlign: isRTL ? 'right' : 'left' }}
        >
          {t(plan.name)}
        </Text>

        <View className={`flex-row items-baseline mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Text
            className="text-3xl text-gray-800"
            style={{
              fontFamily: AppFonts.semibold,
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: isRTL ? 'rtl' : 'ltr'
            }}
          >
            $
          </Text>
          <Text
            className="text-5xl text-gray-800"
            style={{
              fontFamily: AppFonts.bold,
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: isRTL ? 'rtl' : 'ltr'
            }}
          >
            {price}
          </Text>
          <Text
            className={`text-lg text-gray-500 ${isRTL ? 'mr-2' : 'ml-2'}`}
            style={{
              fontFamily: AppFonts.medium,
              writingDirection: isRTL ? 'rtl' : 'ltr'
            }}
          >
            {period}
          </Text>
        </View>

        {isYearly && (
          <View className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <Text
              className="text-green-700 text-sm text-center"
              style={{
                fontFamily: AppFonts.medium,
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr'
              }}
            >
              {t("pricing.savings").replace("{{amount}}", (plan.monthlyPrice * 12 - plan.yearlyPrice).toString())}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        className={`rounded-2xl py-4 mb-6 bg-gray-50 border border-gray-200  `}
        activeOpacity={0.7}
      >
        <Text
          className="text-center text-gray-700"
          style={{ fontFamily: AppFonts.bold, }}
        >
          {t("pricing.getStarted")}
        </Text>
      </TouchableOpacity>

      <View className="gap-4">
        {plan.features.map((feature, index) => (
          <View key={index} className={`flex-row items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <View className="w-6 h-6 bg-red-500/20 items-center justify-center mt-0.5"
              style={{
                borderRadius: 24
              }}
            >
              <Check size={16} strokeWidth={2.5} />
            </View>
            <Text
              className="flex-1 text-sm text-gray-700 leading-6"
              style={{ fontFamily: AppFonts.regular, textAlign: isRTL ? 'right' : 'left' }}
            >
              {t(feature)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
