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
import Toast from "react-native-toast-message";

const services = [
  {
    title: "Creating & Documenting Platforms",
    description:
      "We help you create and manage Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube, and more.",
    price: "$20",
    icon: <Lightbulb size={26} color="#6D28D9" />,
    type: "verify social media accounts",
  },
  {
    title: "Recover Closed Accounts",
    description:
      "We recover closed or deactivated accounts and restore deleted ones quickly.",
    price: "$30",
    icon: <ShieldCheck size={26} color="#6D28D9" />,
    type: "recover social media account",
  },
  {
    title: "Create Sponsored Ads",
    description:
      "We create ads on Google Ads, Facebook, TikTok, YouTube, Snapchat, and more.",
    price: "$15",
    icon: <Megaphone size={26} color="#6D28D9" />,
    type: "Sponsored ads",
  },
];

const SocialMedia = () => {
  const [visible, setVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const [Services, { isLoading }] = useServicesMutation();

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
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center px-5 pt-10">
          <TouchableOpacity
            onPress={() => router.push("/(drawer)/services/services")}
            className="p-2 bg-white/20 rounded-full"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold ml-4">
            Social Media
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5"
        >
          <Text className="text-white text-center my-4 text-lg font-semibold ml-4">
            Social Media Specialist
          </Text>
          <Text className="text-white text-base leading-6 mb-6 mt-4">
            Having a strong Social Media presence is essential—whether for a
            local startup or a global enterprise. Beyond posting, it’s about
            building trust, boosting visibility, and connecting deeply with your
            audience.
          </Text>

          <View className="flex-row justify-between mb-8">
            <TouchableOpacity
              onPress={() => {
                setSelectedService("account_creation");
                setVisible(true);
              }}
              className="bg-blue-600 px-4 py-3 rounded-xl w-[48%] items-center shadow"
            >
              <Text className="text-white text-base font-semibold">
                Get Started
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(drawer)/faq/faq")}
              className="bg-green-600 px-4 py-3 rounded-xl w-[48%] items-center shadow"
            >
              <Text className="text-white text-base font-semibold">FAQ</Text>
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
            <Text className="text-2xl font-bold text-gray-900 mt-10 mb-6">
              Why Choose Us?
            </Text>

            <View className="space-y-5">
              {services.map((service, idx) => (
                <View
                  key={idx}
                  className="bg-white rounded-2xl p-5 my-2 shadow-md border border-gray-100"
                >
                  <View className="flex-row items-center space-x-4 mb-3">
                    <View className="bg-purple-100 p-3 mx-2 rounded-xl">
                      {service.icon}
                    </View>
                    <Text className="text-lg font-semibold text-gray-900 flex-1">
                      {service.title}
                    </Text>
                    <Text className="text-purple-700 font-bold">
                      {service.price}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-600 leading-relaxed mb-4">
                    {service.description}
                  </Text>
                  <TouchableOpacity
                    className="bg-purple-600 px-5 py-2 rounded-full self-start"
                    onPress={() => {
                      setSelectedService(service.type);
                      setVisible(true);
                    }}
                  >
                    <Text className="text-white text-sm font-medium">
                      Get it now
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
