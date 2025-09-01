import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Code,
  Facebook,
  Instagram,
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
  Linking,
  Modal,
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
  const isRTL = i18n.language === 'ar';
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

  const openApp = async (url: string, fallbackUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(fallbackUrl);
      }
    } catch (err) {
      console.error("Error opening app:", err);
    }
  };

  const renderServiceCard = (service: Service) => (
    <TouchableOpacity
      key={service.id}
      onPress={() => handleServicePress(service)}
      disabled={service.isComingSoon}
      className={`flex-row items-center rounded-2xl border px-5 py-5 shadow-md mb-4 
        ${service.isComingSoon
          ? "opacity-70 bg-gray-50 border-gray-200"
          : "bg-white border-gray-100"
        }
      `}
      style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
    >
      <LinearGradient
        colors={service.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`w-14 h-14 rounded-xl items-center justify-center shadow ${isRTL ? 'ml-4' : 'mr-4'}`}
      >
        {service.icon}
      </LinearGradient>

      <View className="flex-1">
        <View className={`flex-row items-center mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Text
            className={`flex-1 text-lg font-semibold 
              ${service.isComingSoon ? "text-gray-500" : "text-gray-900"}
            `}
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          >
            {service.title}
          </Text>
          {service.isComingSoon && (
            <View className={`bg-violet-600 px-2 py-1 rounded-md ${isRTL ? 'mr-2' : 'ml-2'}`}>
              <Text className="text-white text-[10px] font-semibold">{t("services.main.comingSoon")}</Text>
            </View>
          )}
        </View>
        <Text
          className={`text-sm leading-5 
            ${service.isComingSoon ? "text-gray-400" : "text-gray-500"}
          `}
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        >
          {service.description}
        </Text>
      </View>

      {!service.isComingSoon && (
        <View style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>
          <ChevronRight
            size={20}
            color="#9CA3AF"
            style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }}
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
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              {t("services.main.title")}
            </Text>
            <Text
              className="text-base text-gray-500 text-center leading-6 px-5"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              {t("services.main.subtitle")}
            </Text>
          </View>

          <View className="gap-4">{services.map(renderServiceCard)}</View>
        </ScrollView>
      </LinearGradient>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <Text
              className="text-lg font-bold text-gray-900 mb-4 text-center"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              {t("services.clothesStore.modal.title")}
            </Text>
            <View className="flex-row justify-around mb-6">
              <TouchableOpacity
                className="items-center"
                onPress={() =>
                  openApp(
                    "fb://profile/61573739062609",
                    "https://www.facebook.com/profile.php?id=61573739062609"
                  )
                }
              >
                <Facebook size={36} color="#1877F2" />
                <Text className="text-xs text-gray-700 mt-2">Facebook</Text>
              </TouchableOpacity>

              {/* Instagram */}
              <TouchableOpacity
                className="items-center"
                onPress={() =>
                  openApp(
                    "instagram://user?username=black_8_bear",
                    "https://www.instagram.com/black_8_bear"
                  )
                }
              >
                <Instagram size={36} color="#E4405F" />
                <Text className="text-xs text-gray-700 mt-2">Instagram</Text>
              </TouchableOpacity>

              {/* TikTok */}
              <TouchableOpacity
                className="items-center"
                onPress={() =>
                  openApp(
                    "snssdk1128://user/profile/___blackbear",
                    "https://www.tiktok.com/@___blackbear"
                  )
                }
              >
                <Video size={36} color="#000000" />
                <Text className="text-xs text-gray-700 mt-2">TikTok</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-purple-600 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                {t("services.clothesStore.modal.close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
