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
          <View className="flex-row justify-between items-center">
            <TouchableOpacity>
              <Ionicons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View className="absolute top-28 left-6">
            <Text className="text-white text-xs mb-1">{t("trending")}</Text>
            <Text className="text-white text-2xl font-bold leading-7">
              Akcent Feat Lidia Buble...
            </Text>
            <Text className="text-white text-base mb-4">- Kamelia</Text>

            <View className="flex-row space-x-3">
              <TouchableOpacity className="bg-white px-4 py-2 rounded-full">
                <Text className="text-red-500 font-bold text-sm">
                  {t("play")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="bg-white p-2 rounded-full">
                <Ionicons name="share-social-outline" size={18} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Page;
