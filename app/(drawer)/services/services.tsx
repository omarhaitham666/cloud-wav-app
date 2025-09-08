import GlobalToast from "@/components/GlobalToast";
import SocialServiesModal from "@/components/modals/SocialServiesModal";
import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Code,
  Monitor,
  Music,
  Share2,
  ShoppingBag,
  Video,
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ColorValue,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientColors: [ColorValue, ColorValue, ...ColorValue[]];
  isComingSoon?: boolean;
  route: string;
}

export default function ServicesScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [modalVisible, setModalVisible] = useState(false);

  const services: Service[] = [
    {
      id: "music-distribution",
      title: t("services.musicDistribution.title"),
      description: t("services.musicDistribution.subtitle"),
      icon: <Music size={28} color="#FFFFFF" />,
      gradientColors: ["#8B5CF6", "#3B82F6"],
      route: "/services/music-distribution",
    },
    {
      id: "platform-management",
      title: t("services.platformManagement.title"),
      description: t("services.platformManagement.subtitle"),
      icon: <Monitor size={28} color="#FFFFFF" />,
      gradientColors: ["#10B981", "#059669"],
      route: "/services/platform-management",
    },
    {
      id: "social-media",
      title: t("services.socialMedia.title"),
      description: t("services.socialMedia.subtitle"),
      icon: <Share2 size={28} color="#FFFFFF" />,
      gradientColors: ["#F59E0B", "#D97706"],
      route: "/services/social-media",
    },
    {
      id: "clothes-store",
      title: t("services.clothesStore.title"),
      description: t("services.clothesStore.subtitle"),
      icon: <ShoppingBag size={28} color="#FFFFFF" />,
      gradientColors: ["#EC4899", "#BE185D"],
      route: "/services/clothes-store",
    },
    {
      id: "programming-services",
      title: t("services.programmingServices.title"),
      description: t("services.programmingServices.subtitle"),
      icon: <Code size={28} color="#FFFFFF" />,
      gradientColors: ["#6366F1", "#4F46E5"],
      isComingSoon: true,
      route: "/services/programming-services",
    },
    {
      id: "tiktok-agency",
      title: t("services.tiktokAgency.title"),
      description: t("services.tiktokAgency.subtitle"),
      icon: <Video size={28} color="#FFFFFF" />,
      gradientColors: ["#EF4444", "#DC2626"],
      isComingSoon: true,
      route: "/services/tiktok-agency",
    },
  ];

  const handleServicePress = (service: Service) => {
    if (service.id === "clothes-store") {
      setModalVisible(true);
    } else if (!service.isComingSoon) {
      router.push(service.route as any);
    }
  };

  const renderServiceCard = (service: Service) => (
    <TouchableOpacity
      key={service.id}
      onPress={() => handleServicePress(service)}
      disabled={service.isComingSoon}
      className={`flex-row items-center rounded-2xl border px-5 py-5 shadow-md mb-4 
        ${
          service.isComingSoon
            ? "opacity-70 bg-gray-50 border-gray-200"
            : "bg-white border-gray-100"
        }
      `}
      style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
    >
      <LinearGradient
        colors={service.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`w-14 h-14 items-center justify-center shadow ${
          isRTL ? "ml-4" : "mr-4"
        }`}
        style={{ borderRadius: 24 }}
      >
        {service.icon}
      </LinearGradient>

      <View className="flex-1">
        <View
          className={`flex-row items-center mb-1 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <Text
            className={`flex-1 text-lg font-semibold 
              ${service.isComingSoon ? "text-gray-500" : "text-gray-900"}
            `}
            style={{
              textAlign: isRTL ? "right" : "left",
              fontFamily: AppFonts.semibold,
            }}
          >
            {service.title}
          </Text>
          {service.isComingSoon && (
            <View
              className={`bg-violet-600 px-2 py-1 rounded-md ${
                isRTL ? "mr-2" : "ml-2"
              }`}
            >
              <Text
                className="text-white text-[10px] font-semibold"
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >
                {t("services.main.comingSoon")}
              </Text>
            </View>
          )}
        </View>
        <Text
          className={`text-sm leading-5 
            ${service.isComingSoon ? "text-gray-400" : "text-gray-500"}
          `}
          style={{
            textAlign: isRTL ? "right" : "left",
            fontFamily: AppFonts.semibold,
          }}
        >
          {service.description}
        </Text>
      </View>

      {!service.isComingSoon && (
        <View style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>
          <ChevronRight
            size={20}
            color="#9CA3AF"
            style={{ transform: [{ rotate: isRTL ? "180deg" : "0deg" }] }}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#F8FAFC", "#EDE9FE", "#F1F5F9"]}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mt-5 mb-8">
            <Text
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("services.main.title")}
            </Text>
            <Text
              className="text-base text-gray-500 text-center leading-6 px-5"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("services.main.subtitle")}
            </Text>
          </View>

          <View className="gap-4">{services.map(renderServiceCard)}</View>
        </ScrollView>
        <SocialServiesModal
          onClose={() => setModalVisible(false)}
          visible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}
