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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
    Briefcase,
    Download,
    ShieldCheck,
    TrendingUp,
    User,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import Animated from "react-native-reanimated";

const PlatformManagement = () => {
  const [visible, setVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [Services, { isLoading }] = useServicesMutation();

  const { animatedStyle: pageStyle, enterPage } = usePageTransition();
  const { animatedStyle: headerStyle, startAnimation: startHeaderAnimation } = useSlideIn("down", 0);
  const { animatedStyle: titleStyle, startAnimation: startTitleAnimation } = useFadeIn(200);
  const { animatedStyle: descriptionStyle, startAnimation: startDescriptionAnimation } = useFadeIn(400);
  const { animatedStyle: buttonsStyle, startAnimation: startButtonsAnimation } = useSlideIn("up", 600);
  const { animatedStyle: imageStyle, startAnimation: startImageAnimation } = useScaleIn(800);
  const { animatedStyle: featuresStyle, startAnimation: startFeaturesAnimation } = useFadeIn(1000);
  const spacing = getResponsiveSpacing();
  const safeArea = getSafeAreaInsets();

  useEffect(() => {
    enterPage();
    startHeaderAnimation();
    startTitleAnimation();
    startDescriptionAnimation();
    startButtonsAnimation();
    startImageAnimation();
    startFeaturesAnimation();
  }, []);

  const features = [
    {
      title: t("services.platformManagement.features.artistProfile.title"),
      description: t(
        "services.platformManagement.features.artistProfile.description"
      ),
      icon: <User size={20} color="#7C3AED" />,
    },
    {
      title: t("services.platformManagement.features.providingRealJob.title"),
      description: t(
        "services.platformManagement.features.providingRealJob.description"
      ),
      icon: <Briefcase size={20} color="#7C3AED" />,
    },
    {
      title: t("services.platformManagement.features.directDownload.title"),
      description: t(
        "services.platformManagement.features.directDownload.description"
      ),
      icon: <Download size={20} color="#7C3AED" />,
    },
    {
      title: t("services.platformManagement.features.dataSecurity.title"),
      description: t(
        "services.platformManagement.features.dataSecurity.description"
      ),
      icon: <ShieldCheck size={20} color="#7C3AED" />,
    },
    {
      title: t("services.platformManagement.features.ensuringSuccessful.title"),
      description: t(
        "services.platformManagement.features.ensuringSuccessful.description"
      ),
      icon: <TrendingUp size={20} color="#7C3AED" />,
    },
  ];

  const handleFormSubmit = async (data: FormData) => {
    // Clean phone numbers by removing + prefix and any non-numeric characters except digits
    const cleanPhoneNumber = (phone: string) => {
      return phone.replace(/^\+/, '').replace(/\D/g, '');
    };

    const requestData = {
      type: (data.serviceType || "platform management") as ServiceType,
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

    await Services(requestData)
      .unwrap()
      .then(async (res) => {
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
                {t("services.platformManagement.title")}
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
              {t("services.platformManagement.title")}
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
              {t("services.platformManagement.description")}
            </Animated.Text>

            <Animated.View style={[buttonsStyle]}>
              <View
                className={`flex-row justify-between mb-8 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <TouchableOpacity
                  onPress={() => router.push("/(drawer)/(tabs)/price")}
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
                    {t("services.platformManagement.pricing")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setVisible(true)}
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
                    {t("services.platformManagement.getStarted")}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            <Animated.View style={[imageStyle]}>
              <View className="mb-4 items-center">
                <Image
                  source={require("../../../assets/images/platformImg-TiJCBwMF.png")}
                  className="w-full h-72 rounded-2xl"
                  resizeMode="cover"
                />
              </View>
            </Animated.View>
            <Animated.View style={[featuresStyle]}>
              <View className="mb-8">
                <Text
                  className="text-2xl font-bold text-gray-900 mt-10 mb-6"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                    fontSize: spacing.fontSize.xlarge,
                  }}
                >
                  {t("services.platformManagement.whyChooseUs")}
                </Text>

                <View className="space-y-5">
                  {features.map((item, idx) => {
                    const { animatedStyle: featureStyle, startAnimation: startFeatureAnimation } = useSlideIn("right", 1200 + idx * 100);
                    const { animatedStyle: cardStyle, onPressIn, onPressOut } = useCardHover();
                    
                    useEffect(() => {
                      startFeatureAnimation();
                    }, [startFeatureAnimation]);

                    return (
                      <Animated.View key={idx} style={[featureStyle]}>
                        <Animated.View
                          style={[
                            cardStyle,
                            {
                              shadowColor: "#7C3AED",
                              shadowOpacity: 0.1,
                              shadowRadius: 8,
                              elevation: 3,
                            }
                          ]}
                          className={`bg-white/80 rounded-2xl my-1.5 p-5 shadow-md border border-gray-100 ${
                            isRTL ? "flex-row-reverse" : "flex-row"
                          } items-center space-x-5`}
                        >
                          <View
                            className={`bg-purple-100 p-4 rounded-2xl shadow-sm ${
                              isRTL ? "ml-2" : "mr-2"
                            }`}
                          >
                            {item.icon}
                          </View>
                          <View className="flex-1">
                            <Text
                              className="text-lg text-gray-900"
                              style={{
                                textAlign: isRTL ? "right" : "left",
                                fontFamily: AppFonts.semibold,
                                fontSize: spacing.fontSize.large,
                              }}
                            >
                              {item.title}
                            </Text>
                            <Text
                              className="text-sm text-gray-600 mt-1 leading-snug"
                              style={{
                                textAlign: isRTL ? "right" : "left",
                                fontFamily: AppFonts.semibold,
                                fontSize: spacing.fontSize.small,
                              }}
                            >
                              {item.description}
                            </Text>
                          </View>
                        </Animated.View>
                      </Animated.View>
                    );
                  })}
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>
        <ServiceRequestModal
          visible={visible}
          isLoading={isLoading}
          onClose={() => setVisible(false)}
          onSubmitForm={handleFormSubmit}
          serviceType="platform management"
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PlatformManagement;
