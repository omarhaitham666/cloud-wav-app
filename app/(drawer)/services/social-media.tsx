import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
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
} from "@/components/modals/ServiceRequestModal";
import { ServiceType, useServicesMutation } from "@/store/api/global/services";
import { AppFonts } from "@/utils/fonts";
import { 
  useFadeIn, 
  useSlideIn, 
  useScaleIn, 
  usePageTransition,
  useCardHover,
  getResponsiveSpacing,
  getSafeAreaInsets
} from "@/utils/animations";
import { Lightbulb, Megaphone, ShieldCheck } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import Animated from "react-native-reanimated";

const SocialMedia = () => {
  const [visible, setVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>(
    "account_creation"
  );
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [Services, { isLoading }] = useServicesMutation();

  const { animatedStyle: pageStyle, enterPage } = usePageTransition();
  const { animatedStyle: headerStyle, startAnimation: startHeaderAnimation } = useSlideIn("down", 0);
  const { animatedStyle: titleStyle, startAnimation: startTitleAnimation } = useFadeIn(200);
  const { animatedStyle: descriptionStyle, startAnimation: startDescriptionAnimation } = useFadeIn(400);
  const { animatedStyle: buttonsStyle, startAnimation: startButtonsAnimation } = useSlideIn("up", 600);
  const { animatedStyle: imageStyle, startAnimation: startImageAnimation } = useScaleIn(800);
  const { animatedStyle: servicesStyle, startAnimation: startServicesAnimation } = useFadeIn(1000);
  const spacing = getResponsiveSpacing();
  const safeArea = getSafeAreaInsets();

  useEffect(() => {
    enterPage();
    startHeaderAnimation();
    startTitleAnimation();
    startDescriptionAnimation();
    startButtonsAnimation();
    startImageAnimation();
    startServicesAnimation();
  }, []);

  const services = [
    {
      title: t("services.socialMedia.services.creatingPlatforms.title"),
      description: t(
        "services.socialMedia.services.creatingPlatforms.description"
      ),
      price: t("services.socialMedia.services.creatingPlatforms.price"),
      icon: <Lightbulb size={26} color="#6D28D9" />,
      type: "verify social media accounts",
    },
    {
      title: t("services.socialMedia.services.recoverAccounts.title"),
      description: t(
        "services.socialMedia.services.recoverAccounts.description"
      ),
      price: t("services.socialMedia.services.recoverAccounts.price"),
      icon: <ShieldCheck size={26} color="#6D28D9" />,
      type: "recover social media account",
    },
    {
      title: t("services.socialMedia.services.sponsoredAds.title"),
      description: t("services.socialMedia.services.sponsoredAds.description"),
      price: t("services.socialMedia.services.sponsoredAds.price"),
      icon: <Megaphone size={26} color="#6D28D9" />,
      type: "Sponsored ads",
    },
  ];

  const handleFormSubmit = async (data: FormData): Promise<void> => {
    const cleanPhoneNumber = (phone: string) => {
      return phone.replace(/^\+/, "").replace(/\D/g, "");
    };

    const requestData = {
      type: (data.serviceType || selectedService) as ServiceType,
      data: {
        name: data.name,
        email: data.email,
        phone: cleanPhoneNumber(data.phone),
        whatsapp_number: cleanPhoneNumber(data.whatsapp || ""),
        platform: data.platform || "",
        social_media_account: data.social || "",
        details: data.details || "",
      },
    };

    return Services(requestData)
      .unwrap()
      .then((response) => {
        Toast.show({
          type: "success",
          text1: "Service Request Sent Successfully",
        });
        setVisible(false);
      })
      .catch((error) => {
        console.log("Service Request Failed", error);
        Toast.show({
          type: "error",
          text1: "Service Request Failed",
          text2: error?.data?.message || "Something went wrong",
        });
        throw error;
      });
  };

  return (
    <LinearGradient
      colors={["#3B82F6", "#06B6D4", "#10B981"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 py-3" style={{ paddingTop: safeArea.top }}>
        <Animated.View style={[pageStyle, { flex: 1 }]}>
          <Animated.View style={[headerStyle]}>
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
                  fontSize: spacing.fontSize.large,
                }}
              >
                {t("services.socialMedia.title")}
              </Text>
            </View>
          </Animated.View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 px-5"
            contentContainerStyle={{ paddingBottom: safeArea.bottom + 40 }}
          >
            <Animated.Text
              className="text-white text-center my-4 text-lg"
              style={[
                titleStyle,
                {
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.semibold,
                  fontSize: spacing.fontSize.large,
                }
              ]}
            >
              {t("services.socialMedia.specialist")}
            </Animated.Text>
            <Animated.Text
              className="text-white leading-6 mb-6 mt-4"
              style={[
                descriptionStyle,
                {
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.semibold,
                  fontSize: spacing.fontSize.medium,
                }
              ]}
            >
              {t("services.socialMedia.description")}
            </Animated.Text>

            <Animated.View style={[buttonsStyle]}>
              <View
                className={`flex-row justify-between mb-8 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
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
                      textAlign: isRTL ? "right" : "left",
                      fontFamily: AppFonts.semibold,
                      fontSize: spacing.fontSize.medium,
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
                      textAlign: isRTL ? "right" : "left",
                      fontFamily: AppFonts.semibold,
                      fontSize: spacing.fontSize.medium,
                    }}
                  >
                    {t("services.socialMedia.faq")}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View style={[imageStyle]}>
              <View className="mb-4 items-center">
                <Image
                  source={require("../../../assets/images/Kit-Ba0DSf7D.png")}
                  className="w-full h-80 rounded-2xl"
                  resizeMode="cover"
                />
              </View>
            </Animated.View>

            <Animated.View style={[servicesStyle]}>
              <View className="mb-8">
                <Text
                  className="text-2xl text-gray-900 mt-10 mb-6"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                    fontSize: spacing.fontSize.xlarge,
                  }}
                >
                  {t("services.socialMedia.whyChooseUs")}
                </Text>

                <View className="space-y-5">
                  {services.map((service, idx) => {
                    const { animatedStyle: serviceStyle, startAnimation: startServiceAnimation } = useSlideIn("right", 1200 + idx * 100);
                    const { animatedStyle: cardStyle, onPressIn, onPressOut } = useCardHover();
                    
                    useEffect(() => {
                      startServiceAnimation();
                    }, []);

                    return (
                      <Animated.View key={idx} style={[serviceStyle]}>
                        <Animated.View
                          style={[cardStyle]}
                          className="bg-white rounded-2xl p-5 my-2 shadow-md border border-gray-100"
                        >
                          <View
                            className={`flex-row items-center space-x-4 mb-3 ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <View
                              className={`bg-purple-100 p-3 rounded-xl ${
                                isRTL ? "ml-2" : "mr-2"
                              }`}
                            >
                              {service.icon}
                            </View>
                            <Text
                              className="text-lg text-gray-900 flex-1"
                              style={{
                                textAlign: isRTL ? "right" : "left",
                                fontFamily: AppFonts.semibold,
                                fontSize: spacing.fontSize.large,
                              }}
                            >
                              {service.title}
                            </Text>
                            <Text
                              className="text-purple-700"
                              style={{
                                textAlign: isRTL ? "right" : "left",
                                fontFamily: AppFonts.semibold,
                                fontSize: spacing.fontSize.medium,
                              }}
                            >
                              {service.price}
                            </Text>
                          </View>
                          <Text
                            className="text-sm text-gray-600 leading-relaxed mb-4"
                            style={{
                              textAlign: isRTL ? "right" : "left",
                              fontFamily: AppFonts.semibold,
                              fontSize: spacing.fontSize.small,
                            }}
                          >
                            {service.description}
                          </Text>
                          <TouchableOpacity
                            className={`bg-purple-600 px-5 py-2 rounded-full ${
                              isRTL ? "self-end" : "self-start"
                            }`}
                            onPress={() => {
                              setSelectedService(service.type as ServiceType);
                              setVisible(true);
                            }}
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                          >
                            <Text
                              className="text-white text-sm font-medium"
                              style={{
                                textAlign: isRTL ? "right" : "left",
                                fontFamily: AppFonts.semibold,
                                fontSize: spacing.fontSize.small,
                              }}
                            >
                              {t("services.socialMedia.getItNow")}
                            </Text>
                          </TouchableOpacity>
                        </Animated.View>
                      </Animated.View>
                    );
                  })}
                </View>
              </View>
            </Animated.View>

            <ServiceRequestModal
              visible={visible}
              isLoading={isLoading}
              onClose={() => setVisible(false)}
              onSubmitForm={handleFormSubmit}
              serviceType={selectedService}
            />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SocialMedia;
