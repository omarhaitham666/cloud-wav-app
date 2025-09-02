import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ColorValue,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type Service = {
  id: string;
  title: string;
  desc: string;
  image: any;
  comingSoon: boolean;
  gradientColors: [ColorValue, ColorValue, ...ColorValue[]];
  icon?: string;
  route: string;
};

export default function ServicesSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const services: Service[] = [
    {
      id: "1",
      title: t("services.servicesSection.services.musicDistribution.title"),
      desc: t("services.servicesSection.services.musicDistribution.description"),
      image: require("../assets/images/ser-1.png"),
      comingSoon: false,
      gradientColors: ["#8B5CF6", "#A855F7", "#C084FC"],
      icon: "",
      route: "/services/music-distribution",
    },
    {
      id: "2",
      title: t("services.servicesSection.services.platformManagement.title"),
      desc: t("services.servicesSection.services.platformManagement.description"),
      image: require("../assets/images/ser-2.png"),
      comingSoon: false,
      gradientColors: ["#10B981", "#34D399", "#6EE7B7"],
      icon: "",
      route: "/services/platform-management",
    },
    {
      id: "3",
      title: t("services.servicesSection.services.socialMedia.title"),
      desc: t("services.servicesSection.services.socialMedia.description"),
      image: require("../assets/images/ser-3.png"),
      comingSoon: false,
      gradientColors: ["#3B82F6", "#60A5FA", "#93C5FD"],
      icon: "",
      route: "/services/social-media",
    },
    {
      id: "4",
      title: t("services.servicesSection.services.clothesStore.title"),
      desc: t("services.servicesSection.services.clothesStore.description"),
      image: require("../assets/images/ser-4.png"),
      comingSoon: false,
      gradientColors: ["#EF4444", "#F87171", "#FCA5A5"],
      icon: "",
      route: "",
    },
    {
      id: "5",
      title: t("services.servicesSection.services.tiktokAgency.title"),
      desc: t("services.servicesSection.services.tiktokAgency.description"),
      image: require("../assets/images/Kit-Ba0DSf7D.png"),
      comingSoon: true,
      gradientColors: ["#6366F1", "#4F46E5"],
      icon: "",
      route: "",
    },
  ];

  return (
    <SafeAreaView className="flex-1 ">
      <View className="px-5 pt-5 items-center">
        <View className="items-center">
          <Text
            className="text-3xl mb-3 text-slate-800 text-center tracking-tight"
            style={{
              textAlign: isRTL ? 'right' : 'left',
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("services.servicesSection.title")}
          </Text>

          <Text
            className="text-base text-slate-500 text-center"
            style={{
              textAlign: isRTL ? 'right' : 'left',
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("services.servicesSection.subtitle")}
          </Text>
        </View>
      </View>

      <View className="flex-1 justify-center">
        <Carousel
          loop
          width={width}
          height={320}
          autoPlay={true}
          autoPlayInterval={4000}
          data={services}
          scrollAnimationDuration={800}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          renderItem={({ item, index }) => (
            <View className="flex-1 mx-2">
              <LinearGradient
                colors={item.gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-1 rounded-3xl p-6 overflow-hidden"
                style={{
                  elevation: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                }}
              >
                {/* Background decorative circles - adjusted for RTL */}
                <View className="absolute inset-0 opacity-10">
                  <View
                    className={`absolute w-30 h-30 rounded-full bg-white ${isRTL ? '-top-7 -left-7' : '-top-7 -right-7'
                      }`}
                  />
                  <View
                    className={`absolute w-20 h-20 rounded-full bg-white ${isRTL ? 'bottom-5 -right-5' : 'bottom-5 -left-5'
                      }`}
                  />
                  <View
                    className={`absolute w-15 h-15 rounded-full bg-white ${isRTL ? 'top-1/2 left-5' : 'top-1/2 right-5'
                      }`}
                  />
                </View>

                <View className="flex-1 z-10">
                  {/* Header section with icon and coming soon badge */}
                  <View
                    className={`flex-row justify-between items-center mb-10 ${isRTL ? 'flex-row-reverse' : ''
                      }`}
                  >
                    <View className="w-12 h-12 rounded-full bg-white/20 justify-center items-center">
                      <Text className="text-2xl">{item.icon}</Text>
                    </View>
                    {item.comingSoon && (
                      <View className="bg-white/20 px-3 py-1.5 rounded-2xl">
                        <Text className="text-white text-xs font-semibold"
                        style={{
                          fontFamily: AppFonts.semibold,
                        }}
                        >
                          {t("services.servicesSection.buttons.comingSoon")}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Content section */}
                  <View className="mb-5 mt-6">
                    <Text
                      className="text-white text-2xl mb-2 tracking-tight"
                      style={{
                        textAlign: isRTL ? 'right' : 'left',
                        fontFamily: AppFonts.semibold,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      className="text-white/90 text-sm leading-5 font-medium"
                      style={{
                        textAlign: isRTL ? 'right' : 'left',
                        fontFamily: AppFonts.semibold,
                      }}
                    >
                      {item.desc}
                    </Text>
                  </View>

                  {/* Button section */}
                  <TouchableOpacity
                    className={`flex-row items-center px-5 py-3 rounded-full ${item.comingSoon ? "bg-transparent" : "bg-white"
                      }`}
                    onPress={() => router.push(item.route as any)}
                    style={
                      !item.comingSoon
                        ? {
                          elevation: 4,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 4,
                          alignSelf: isRTL ? "flex-end" : "flex-start",
                        }
                        : undefined
                    }
                    disabled={item.comingSoon}
                  >
                    {!item.comingSoon && !isRTL && (
                      <Text className="text-slate-800 text-sm mr-2"
                        style={{
                          fontFamily: AppFonts.semibold,
                        }}
                      >
                        {t("services.servicesSection.buttons.learnMore")}
                      </Text>
                    )}

                    {!item.comingSoon && (
                      <View className="text-slate-800">
                        {isRTL ? (
                          <ChevronLeft size={18} color="#1e293b" />
                        ) : (
                          <ChevronRight size={18} color="#1e293b" />
                        )}
                      </View>
                    )}

                    {!item.comingSoon && isRTL && (
                      <Text className="text-slate-800 text-sm ml-2"
                        style={{
                          fontFamily: AppFonts.semibold,
                        }}
                      >
                        {t("services.servicesSection.buttons.learnMore")}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Image section - positioned based on RTL */}
                <View
                  className={`absolute -bottom-5 z-0 ${isRTL ? '-left-5' : '-right-5'
                    }`}
                  style={{
                    width: width * 0.4,
                    height: 160,
                  }}
                >
                  <View
                    className={`absolute bottom-0 h-10 bg-black/10 rounded-2xl scale-x-75 ${isRTL ? 'right-0 left-0' : 'left-0 right-0'
                      }`}
                  />
                  <Image
                    source={item.image}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
              </LinearGradient>
            </View>
          )}
        />
      </View>

      {/* Pagination dots */}
      <View className="flex-row justify-center items-center py-5 gap-2">
        {services.map((_, index) => (
          <View key={index} className="w-2 h-2 rounded-full bg-slate-300" />
        ))}
      </View>
    </SafeAreaView>
  );
}
