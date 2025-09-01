import ServiceRequestModal, {
  FormData,
} from "@/components/ServiceRequestModal";
import { useServicesMutation } from "@/store/api/global/services";
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
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const features = [
  {
    title: "Artist Profile",
    description: "Customize and showcase your artist profile on our platform.",
    icon: <User size={20} color="#7C3AED" />,
  },
  {
    title: "Providing Real Job",
    description: "Unlock real job opportunities through our platform.",
    icon: <Briefcase size={20} color="#7C3AED" />,
  },
  {
    title: "Direct Download",
    description: "Enjoy secure and fast direct downloads anytime.",
    icon: <Download size={20} color="#7C3AED" />,
  },
  {
    title: "Data Security",
    description:
      "Protect content and intellectual property with enterprise-level security.",
    icon: <ShieldCheck size={20} color="#7C3AED" />,
  },
  {
    title: "Ensuring Successful",
    description: "Guarantee safe and timely receipt of profits worldwide.",
    icon: <TrendingUp size={20} color="#7C3AED" />,
  },
];

const PlatformManagement = () => {
  const [visible, setVisible] = useState(false);
  const [Services, { isLoading }] = useServicesMutation();
  const handleFormSubmit = async (data: FormData) => {
    await Services({
      type: "platform management",
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
      .then(async (res) => {
        console.log(res);

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
            Platform Management
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5"
        >
          <Text className="text-white text-center my-4 text-lg font-semibold ml-4">
            Platform Management
          </Text>
          <Text className="text-white text-base leading-6 mb-6 mt-4">
            Create & manage platforms for independent artists, protecting
            ownership and securing their earnings with professional solutions.
          </Text>

          <View className="flex-row justify-between mb-8">
            <TouchableOpacity
              onPress={() => router.push("/(drawer)/(tabs)/price")}
              className="bg-blue-600 px-4 py-3 rounded-xl w-[48%] items-center shadow"
            >
              <Text className="text-white text-base font-semibold">
                pricing
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVisible(true)}
              className="bg-green-600 px-4 py-3 rounded-xl w-[48%] items-center shadow"
            >
              <Text className="text-white text-base font-semibold">
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mb-4 items-center">
            <Image
              source={require("../../../assets/images/platformImg-TiJCBwMF.png")}
              className="w-full h-72 rounded-2xl"
              resizeMode="cover"
            />
          </View>
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mt-10 mb-6">
              Why Choose Us?
            </Text>

            <View className="space-y-5">
              {features.map((item, idx) => (
                <View
                  key={idx}
                  className="bg-white/80 rounded-2xl my-1.5 p-5 shadow-md flex-row items-center space-x-5 border border-gray-100"
                  style={{
                    shadowColor: "#7C3AED",
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <View className="bg-purple-100 p-4 mx-2 rounded-2xl shadow-sm">
                    {item.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-gray-600 mt-1 leading-snug">
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <ServiceRequestModal
          visible={visible}
          isLoading={isLoading}
          onClose={() => setVisible(false)}
          onSubmitForm={handleFormSubmit}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PlatformManagement;
