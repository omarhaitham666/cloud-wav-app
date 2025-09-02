import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ServiceRequestModal, {
  FormData,
} from "@/components/ServiceRequestModal";
import { useServicesMutation } from "@/store/api/global/services";
import { Lightbulb, Megaphone, ShieldCheck } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { AppFonts } from "@/utils/fonts";


const SocialMedia = () => {
  const [visible, setVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [Services, { isLoading }] = useServicesMutation();

  const services = [
    {
      title: t("services.socialMedia.services.creatingPlatforms.title"),
      description: t("services.socialMedia.services.creatingPlatforms.description"),
      price: t("services.socialMedia.services.creatingPlatforms.price"),
      icon: <Lightbulb size={26} color="#6D28D9" />,
      type: t("services.socialMedia.services.creatingPlatforms.type"),
    },
    {
      title: t("services.socialMedia.services.recoverAccounts.title"),
      description: t("services.socialMedia.services.recoverAccounts.description"),
      price: t("services.socialMedia.services.recoverAccounts.price"),
      icon: <ShieldCheck size={26} color="#6D28D9" />,
      type: t("services.socialMedia.services.recoverAccounts.type"),
    },
    {
      title: t("services.socialMedia.services.sponsoredAds.title"),
      description: t("services.socialMedia.services.sponsoredAds.description"),
      price: t("services.socialMedia.services.sponsoredAds.price"),
      icon: <Megaphone size={26} color="#6D28D9" />,
      type: t("services.socialMedia.services.sponsoredAds.type"),
    },
  ];

  const handleFormSubmit = async (data: FormData) => {
    if (!selectedService) return;

    await Services({
      type: selectedService,
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        whatsapp_number: data.whatsapp || "",
        platform: data.platform || "",
        social_media_account: data.social || "",
        details: data.details || "",
      },
    })
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Service Request Sent Successfully",
        });
        setVisible(false);
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: "Service Request Failed",
          text2: e?.data?.message || "Something went wrong",
        });
      });
  };

  return (
    <LinearGradient
      colors={["#3B82F6", "#06B6D4", "#10B981"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 py-3">
        <View className={`flex-row items-center px-5 pt-10`}>
          <TouchableOpacity
            onPress={() => router.push("/(drawer)/services/services")}
            className="p-2 bg-white/20 rounded-full"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text
            className={`text-white text-lg ms-4`}
            style={{
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("services.socialMedia.title")}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5"
        >
          <Text
            className="text-white text-center my-4 text-lg"
            style={{
              textAlign: isRTL ? 'right' : 'left',
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("services.socialMedia.specialist")}
          </Text>
          <Text
            className="text-white text-base leading-6 mb-6 mt-4"
            style={{
              textAlign: isRTL ? 'right' : 'left',
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("services.socialMedia.description")}
          </Text>

          <View className={`flex-row justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <TouchableOpacity
              onPress={() => {
                setSelectedService("account_creation");
                setVisible(true);
              }}
              className="bg-blue-600 px-4 py-3 rounded-xl w-[48%] items-center shadow"
            >
              <Text
                className="text-white text-base"
                style={{
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: AppFonts.semibold,
                }}
              >
                {t("services.socialMedia.getStarted")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(drawer)/faq/faq")}
              className="bg-green-600 px-4 py-3 rounded-xl w-[48%] items-center shadow"
            >
              <Text
                className="text-white text-base"
                style={{
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: AppFonts.semibold,
                }}
              >
                {t("services.socialMedia.faq")}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4 items-center">
            <Image
              source={require("../../../assets/images/Kit-Ba0DSf7D.png")}
              className="w-full h-80 rounded-2xl"
              resizeMode="cover"
            />
          </View>

          <View className="mb-8">
            <Text
              className="text-2xl text-gray-900 mt-10 mb-6"
              style={{
                textAlign: isRTL ? 'right' : 'left',
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("services.socialMedia.whyChooseUs")}
            </Text>

            <View className="space-y-5">
              {services.map((service, idx) => (
                <View
                  key={idx}
                  className="bg-white rounded-2xl p-5 my-2 shadow-md border border-gray-100"
                >
                  <View className={`flex-row items-center space-x-4 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <View className={`bg-purple-100 p-3 rounded-xl ${isRTL ? 'ml-2' : 'mr-2'}`}>
                      {service.icon}
                    </View>
                    <Text
                      className="text-lg text-gray-900 flex-1"
                      style={{
                        textAlign: isRTL ? 'right' : 'left',
                        fontFamily: AppFonts.semibold,
                      }}
                    >
                      {service.title}
                    </Text>
                    <Text
                      className="text-purple-700"
                      style={{
                        textAlign: isRTL ? 'right' : 'left',
                        fontFamily: AppFonts.semibold,
                      }}
                    >
                      {service.price}
                    </Text>
                  </View>
                  <Text
                    className="text-sm text-gray-600 leading-relaxed mb-4"
                    style={{
                      textAlign: isRTL ? 'right' : 'left',
                      fontFamily: AppFonts.semibold,
                    }}
                  >
                    {service.description}
                  </Text>
                  <TouchableOpacity
                    className={`bg-purple-600 px-5 py-2 rounded-full ${isRTL ? 'self-end' : 'self-start'}`}
                    onPress={() => {
                      setSelectedService(service.type);
                      setVisible(true);
                    }}
                  >
                    <Text
                      className="text-white text-sm font-medium"
                      style={{
                        textAlign: isRTL ? 'right' : 'left',
                        fontFamily: AppFonts.semibold,
                      }}
                    >
                      {t("services.socialMedia.getItNow")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <ServiceRequestModal
            visible={visible}
            isLoading={isLoading}
            onClose={() => setVisible(false)}
            onSubmitForm={handleFormSubmit}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SocialMedia;
