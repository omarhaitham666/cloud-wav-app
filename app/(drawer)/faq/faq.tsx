import CreativeBanner from "@/components/CreativeBanner";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import { AppFonts } from "@/utils/fonts";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View
      style={{
        borderRadius: 18,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      }}
      className="bg-purple-800 mb-4 p-4">
      <TouchableOpacity
        onPress={toggleExpand}
        className={`flex-row justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <Text
          className="text-white text-lg flex-1"
          style={{
            textAlign: isRTL ? 'right' : 'left',
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
            textAlign: isRTL ? 'right' : 'left',
            fontFamily: AppFonts.regular,
          }}
        >
          {answer}
        </Text>
      )}
    </View>
  );
};

const FAQPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <SafeAreaView className="flex-1 py-3 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <CreativeBanner
            titleKey="title"
            subtitleKey="subtitle"
            iconKey="icon"
            colors={["#8B5CF6", "#7C3AED", "#6D28D9"]}
            namespace="faq"
          />
        </View>

        <View className="px-4">

          <FAQItem
            question={t('faq.questions.whatIsCloudWav.question')}
            answer={t('faq.questions.whatIsCloudWav.answer')}
          />
          <FAQItem
            question={t('faq.questions.createAccount.question')}
            answer={t('faq.questions.createAccount.answer')}
          />
          <FAQItem
            question={t('faq.questions.artistAccount.question')}
            answer={t('faq.questions.artistAccount.answer')}
          />
          <FAQItem
            question={t('faq.questions.requestDedication.question')}
            answer={t('faq.questions.requestDedication.answer')}
          />
          <FAQItem
            question={t('faq.questions.bookArtist.question')}
            answer={t('faq.questions.bookArtist.answer')}
          />
          <FAQItem
            question={t('faq.questions.productionServices.question')}
            answer={t('faq.questions.productionServices.answer')}
          />
          <FAQItem
            question={t('faq.questions.socialMediaServices.question')}
            answer={t('faq.questions.socialMediaServices.answer')}
          />
          <FAQItem
            question={t('faq.questions.paymentMethods.question')}
            answer={t('faq.questions.paymentMethods.answer')}
          />
          <FAQItem
            question={t('faq.questions.refundPolicy.question')}
            answer={t('faq.questions.refundPolicy.answer')}
          />
          <FAQItem
            question={t('faq.questions.artistContract.question')}
            answer={t('faq.questions.artistContract.answer')}
          />
          <FAQItem
            question={t('faq.questions.customerSupport.question')}
            answer={t('faq.questions.customerSupport.answer')}
          />
          <FAQItem
            question={t('faq.questions.accountSuspension.question')}
            answer={t('faq.questions.accountSuspension.answer')}
          />

          <View className="border border-1 p-5 mt-6"
          style={{
        borderRadius: 18,
          }}
          >
            <Text
              className="text-base font-semibold mb-2 text-black"
              style={{
                textAlign: isRTL ? 'right' : 'left',
                fontFamily: AppFonts.semibold,
              }}
            >
              {t('faq.tips.title')}
            </Text>
            <Text
              className="text-sm text-gray-700 leading-relaxed"
              style={{
                textAlign: isRTL ? 'right' : 'left',
                fontFamily: AppFonts.semibold,
              }}
            >
              {t('faq.tips.content')}
            </Text>
          </View>

          <View className="bg-red-100 p-4 mt-4 rounded-lg">
            <Text
              className="text-base font-bold mb-1 text-red-700"
              style={{
                textAlign: isRTL ? 'right' : 'left',
                fontFamily: AppFonts.semibold,
              }}
            >
              {t('faq.legalWarning.title')}
            </Text>
            <Text
              className="text-sm text-gray-800"
              style={{
                textAlign: isRTL ? 'right' : 'left',
                fontFamily: AppFonts.semibold,
              }}
            >
              {t('faq.legalWarning.content')}
            </Text>
          </View>

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
              {t('faq.contactButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQPage;
