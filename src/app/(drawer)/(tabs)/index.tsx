import CustomHeader from "@/src/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <ImageBackground
          source={require("../../../assets/Rectangle.png")}
          resizeMode="cover"
          className="h-96 w-full justify-between p-5"
        >
          <CustomHeader transparent colorIcon="white" />

          <View className="absolute top-28 left-6">
            <Text className="text-white text-xs mb-1">{t("cloudWav")}</Text>

            <Text className="text-white text-2xl font-bold leading-7">
              {t("Find Your Flow..")}
            </Text>

            <Text className="text-white text-base mb-4">
              - {t("Unleash your soundworld")}
            </Text>

            <View className="flex-row items-center space-x-3">
              <TouchableOpacity className="bg-white flex-row items-center gap-3 px-4 py-2.5 rounded-full">
                <Text className="text-red-500 font-bold text-sm">
                  {t("play")}
                </Text>
                <Ionicons name="play" size={18} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Page;
