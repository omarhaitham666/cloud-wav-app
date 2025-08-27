import { LinearGradient } from "expo-linear-gradient";
import React from "react";
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
};

const services: Service[] = [
  {
    id: "1",
    title: "Music Distribution",
    desc: "We ensure your music reaches the right audience, wherever they are.",
    image: require("../assets/ser-1.png"),
    comingSoon: false,
    gradientColors: ["#8B5CF6", "#A855F7", "#C084FC"],
    icon: "🎵",
  },
  {
    id: "2",
    title: "Platform Management",
    desc: "Upload tracks, albums, and visuals to all major platforms.",
    image: require("../assets/ser-2.png"),
    comingSoon: false,
    gradientColors: ["#10B981", "#34D399", "#6EE7B7"],
    icon: "🚀",
  },
  {
    id: "3",
    title: "Social Media",
    desc: "Creative posts and stories to connect with fans.",
    image: require("../assets/ser-3.png"),
    comingSoon: false,
    gradientColors: ["#3B82F6", "#60A5FA", "#93C5FD"],
    icon: "📱",
  },
  {
    id: "4",
    title: "Clothes Store",
    desc: "Trendy fashion with fast delivery and easy returns.",
    image: require("../assets/ser-4.png"),
    comingSoon: true,
    gradientColors: ["#EF4444", "#F87171", "#FCA5A5"],
    icon: "👕",
  },
];

export default function ServicesSection() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-5 py-5 items-center">
        <View className="items-center">
          <Text className="text-3xl mb-3 font-extrabold text-slate-800 text-center tracking-tight">
            Satisfy Solution
          </Text>

          <Text className="text-base text-slate-500 text-center font-medium">
            The Best Services we provide
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
                <View className="absolute inset-0 opacity-10">
                  <View className="absolute w-30 h-30 rounded-full bg-white -top-7 -right-7" />
                  <View className="absolute w-20 h-20 rounded-full bg-white bottom-5 -left-5" />
                  <View className="absolute w-15 h-15 rounded-full bg-white top-1/2 right-5" />
                </View>

                <View className="flex-1 z-10">
                  <View className="flex-row justify-between items-center mb-10">
                    <View className="w-12 h-12 rounded-full bg-white/20 justify-center items-center">
                      <Text className="text-2xl">{item.icon}</Text>
                    </View>
                    {item.comingSoon && (
                      <View className="bg-white/20 px-3 py-1.5 rounded-2xl">
                        <Text className="text-white text-xs font-semibold">
                          Soon
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="mb-5 mt-6">
                    <Text className="text-white text-2xl font-bold mb-2 tracking-tight">
                      {item.title}
                    </Text>
                    <Text className="text-white/90 text-sm leading-5 font-medium">
                      {item.desc}
                    </Text>
                  </View>

                  <TouchableOpacity
                    className={`flex-row items-center self-start px-5 py-3 rounded-full ${
                      item.comingSoon ? "bg-white/30" : "bg-white"
                    }`}
                    style={
                      !item.comingSoon && {
                        elevation: 4,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                      }
                    }
                    disabled={item.comingSoon}
                  >
                    <Text className="text-slate-800 text-sm font-bold mr-2">
                      {item.comingSoon ? "Coming Soon" : "Learn More"}
                    </Text>
                    {!item.comingSoon && (
                      <Text className="text-slate-800 text-base font-bold">
                        →
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View
                  className="absolute -bottom-5 -right-5 z-0"
                  style={{
                    width: width * 0.4,
                    height: 160,
                  }}
                >
                  <View className="absolute bottom-0 left-0 right-0 h-10 bg-black/10 rounded-2xl scale-x-75" />
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
      <View className="flex-row justify-center items-center py-5 gap-2">
        {services.map((_, index) => (
          <View key={index} className="w-2 h-2 rounded-full bg-slate-300" />
        ))}
      </View>
    </SafeAreaView>
  );
}
