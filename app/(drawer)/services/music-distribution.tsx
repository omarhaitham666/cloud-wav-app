import { services } from "@/utils/data";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
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
            Music Distribution
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5"
        >
          <Text className="text-white text-center my-4 text-lg font-semibold ml-4">
            Music Distribution
          </Text>
          <Text className="text-white text-base leading-6 mb-6 mt-4">
            We provide everything you need to create your song from start to
            finish. Whether you’re an emerging artist or a professional, our
            services are designed to help you present your best self with the
            highest quality.
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
              onPress={() => router.push("/(drawer)/contact/contact")}
              className="bg-green-600 px-4 py-3 rounded-xl w-[48%] items-center shadow"
            >
              <Text className="text-white text-base font-semibold">
                Contact us
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-8">
            <Text className="text-xl font-bold text-white mb-4">
              Our Services Include:
            </Text>
            {services.map((service, index) => (
              <View
                key={index}
                className="bg-white/10 p-4 rounded-xl mb-4 border border-white/20"
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons name={service.icon as any} size={22} color="#fff" />
                  <Text className="text-white font-semibold text-base ml-2">
                    {service.title}
                  </Text>
                </View>
                <Text className="text-gray-600 text-sm leading-5">
                  {service.description}
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
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Let’s Talk About Something Special
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
              placeholder="Your Name"
              placeholderTextColor="#888"
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
              placeholder="Your Email"
              placeholderTextColor="#888"
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 h-24 text-base"
              placeholder="Project Details"
              placeholderTextColor="#888"
              multiline
            />
            <TouchableOpacity className="bg-blue-600 py-3 rounded-xl items-center">
              <Text className="text-white text-base font-medium">
                Send Message
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MusicDistribution;
