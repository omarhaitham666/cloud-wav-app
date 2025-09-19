import CreativeBanner from "@/components/CreativeBanner";
import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    SafeAreaView,
    ScrollView,
    Text,
    View
} from "react-native";

const Terms = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const TermsSection = ({
    title,
    content,
    index,
  }: {
    title: string;
    content: string;
    index: number;
  }) => (
    <View className="mb-4">
      <View className="flex-row items-center mb-3 gap-3" style={{
        flexDirection: isRTL ? "row-reverse" : "row",
      }}>
        <LinearGradient
          colors={["#10B981", "#059669"]}
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
    </View>
  );

  return (
    <SafeAreaView className="flex-1 pt-12 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4">
          <CreativeBanner
            titleKey="title"
            subtitleKey="subtitle"
            iconKey="icon"
            colors={["#10B981", "#059669", "#047857"]}
            namespace="terms"
          />
        </View>

        <View className="px-4 mt-8">
          <View className="bg-white rounded-t-2xl p-6 shadow-md">
            <View className="mb-6">
              <Text
                className="text-sm text-gray-500 mb-2"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.regular,
                }}
              >
                {t("terms.lastUpdated")}
              </Text>
              <Text
                className="text-sm text-gray-500"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.regular,
                }}
              >
                {t("terms.owner")}
              </Text>
            </View>

            <Text
              className="text-gray-700 leading-6 mb-6"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.regular,
              }}
            >
              {t("terms.introduction")}
            </Text>

            <TermsSection
              title={t("terms.generalRegistration.title")}
              content={t("terms.generalRegistration.content")}
              index={1}
            />

            <TermsSection
              title={t("terms.artistRegistration.title")}
              content={t("terms.artistRegistration.content")}
              index={2}
            />

            <TermsSection
              title={t("terms.contracting.title")}
              content={t("terms.contracting.content")}
              index={3}
            />

            <TermsSection
              title={t("terms.videoPlatform.title")}
              content={t("terms.videoPlatform.content")}
              index={4}
            />

            <TermsSection
              title={t("terms.dataCollection.title")}
              content={t("terms.dataCollection.content")}
              index={5}
            />

            <TermsSection
              title={t("terms.dataUsage.title")}
              content={t("terms.dataUsage.content")}
              index={6}
            />

            <TermsSection
              title={t("terms.digitalRights.title")}
              content={t("terms.digitalRights.content")}
              index={7}
            />

            <TermsSection
              title={t("terms.advertising.title")}
              content={t("terms.advertising.content")}
              index={8}
            />

            <TermsSection
              title={t("terms.payments.title")}
              content={t("terms.payments.content")}
              index={9}
            />

            <TermsSection
              title={t("terms.dataProtection.title")}
              content={t("terms.dataProtection.content")}
              index={10}
            />

            <TermsSection
              title={t("terms.accountCancellation.title")}
              content={t("terms.accountCancellation.content")}
              index={11}
            />

            <TermsSection
              title={t("terms.modification.title")}
              content={t("terms.modification.content")}
              index={12}
            />

            <TermsSection
              title={t("terms.support.title")}
              content={t("terms.support.content")}
              index={13}
            />

            <TermsSection
              title={t("terms.security.title")}
              content={t("terms.security.content")}
              index={14}
            />

            <TermsSection
              title={t("terms.legalWarning.title")}
              content={t("terms.legalWarning.content")}
              index={15}
            />

            <TermsSection
              title={t("terms.contact.title")}
              content={t("terms.contact.content")}
              index={16}
            />

            <View className="mt-8 p-4 bg-gray-50 rounded-xl">
              <Text
                className="text-gray-600 text-center leading-6"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.regular,
                }}
              >
                {t("terms.footer")}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Terms;
