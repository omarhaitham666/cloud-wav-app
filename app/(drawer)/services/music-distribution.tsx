import MusicServiceModal from "@/components/MusicServiceModal";
import { services } from "@/utils/data";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MusicDistribution = () => {
  const [visible, setVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <LinearGradient
      colors={["#3B82F6", "#06B6D4", "#10B981"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center px-5 pt-10"
        >
          <TouchableOpacity
            onPress={() => router.push("/(drawer)/services/services")}
            className="p-2 bg-white/20 rounded-full"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold ms-4"
          >
            {t("services.musicDistribution.title")}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5"
        >
          <Text className="text-white text-center my-4 text-lg font-semibold ml-4">
            {t("services.musicDistribution.title")}
          </Text>
          <Text className="text-white text-base leading-6 mb-6 mt-4">
            {t("services.musicDistribution.description")}
          </Text>

          <View className="flex-row justify-between mb-8">
            <TouchableOpacity
              onPress={() => setVisible(true)}
              className="bg-blue-600 px-4 py-3 rounded-xl w-[48%] items-center shadow"
            >
              <Text className="text-white text-base font-semibold">
                {t("services.musicDistribution.pricing")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(drawer)/contact/contact")}
              className="bg-green-600 px-4 py-3 rounded-xl w-[48%] items-center shadow"
            >
              <Text className="text-white text-base font-semibold">
                {t("services.musicDistribution.contactUs")}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-8">
            <Text className="text-xl font-bold text-white mb-4"
            style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              {t("services.musicDistribution.ourServicesInclude")}
            </Text>
            {services.map((service, index) => (
              <View
                key={index}
                className="bg-white/10 p-4 rounded-xl mb-4 border border-white/20"
              >
                <View 
                  className="flex-row items-center mb-2"
                  style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                >
                  <Ionicons name={service.icon as any} size={22} color="#fff" />
                  <Text 
                    className="text-white font-semibold text-base"
                    style={{ 
                      marginLeft: isRTL ? 0 : 8,
                      marginRight: isRTL ? 8 : 0,
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                  >
                    {t(service.title)}
                  </Text>
                </View>
                <Text 
                  className="text-gray-600 text-sm leading-5"
                  style={{ textAlign: isRTL ? 'right' : 'left' }}
                >
                  {t(service.description)}
                </Text>
              </View>
            ))}
          </View>

          <View className="mb-8 items-center">
            <Image
              source={require("../../../assets/images/musicbg-DLfbtMqd.png")}
              className="w-full h-60 rounded-2xl"
              resizeMode="cover"
            />
          </View>

          <View className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <Text 
              className="text-lg font-bold text-gray-900 mb-4"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              {t("services.musicDistribution.letsTalkTitle")}
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
              placeholder={t("services.musicDistribution.form.name")}
              placeholderTextColor="#888"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
              placeholder={t("services.musicDistribution.form.email")}
              placeholderTextColor="#888"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 h-24 text-base"
              placeholder={t("services.musicDistribution.form.projectDetails")}
              placeholderTextColor="#888"
              multiline
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            />
            <TouchableOpacity className="bg-blue-600 py-3 rounded-xl items-center">
              <Text className="text-white text-base font-medium">
                {t("services.musicDistribution.form.sendMessage")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <MusicServiceModal
          visible={visible}
          onClose={() => setVisible(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MusicDistribution;
