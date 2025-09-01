import { getToken } from "@/utils/secureStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone number is required"),
  whatsapp: z.string().optional(),
  platform: z.string().optional(),
  social: z.string().optional(),
  details: z.string().optional(),
});

export type FormData = z.infer<typeof schema>;

type Props = {
  visible: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmitForm: (data: FormData) => void;
};

export default function ServiceRequestModal({
  visible,
  isLoading,
  onClose,
  onSubmitForm,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const token = await getToken("access_token");

    if (!token) {
      router.replace("/(drawer)/(auth)/login");
      return;
    }

    onSubmitForm(data);
    reset();
  };

  const fields = [
    { name: "name", label: "Your Name", placeholder: "Enter your name" },
    { name: "email", label: "Your Email", placeholder: "Enter your email" },
    { name: "phone", label: "Phone Number", placeholder: "Enter your phone" },
    {
      name: "whatsapp",
      label: "WhatsApp Number",
      placeholder: "Enter WhatsApp",
    },
    { name: "platform", label: "Platform", placeholder: "Enter Platform" },
    {
      name: "social",
      label: "Social Media Links",
      placeholder: "Enter Social Links",
    },
    {
      name: "details",
      label: "Details",
      placeholder: "Enter additional details",
      multiline: true,
    },
  ];
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <View className="bg-white rounded-2xl w-full max-h-[80%]">
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-bold text-indigo-600">
              Service Request
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-xl text-gray-600">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {fields.map((field) => (
              <View key={field.name} className="mb-4">
                <Controller
                  control={control}
                  name={field.name as keyof FormData}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder={field.placeholder}
                      value={value}
                      onChangeText={onChange}
                      multiline={field.multiline || false}
                      className="border border-indigo-300 rounded-lg px-4 py-3 text-base text-gray-800"
                      placeholderTextColor="#9CA3AF"
                    />
                  )}
                />
                {errors[field.name as keyof FormData] && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors[field.name as keyof FormData]?.message?.toString()}
                  </Text>
                )}
              </View>
            ))}

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="bg-indigo-600 py-4 rounded-full mt-4"
            >
              <Text className="text-white text-center font-bold text-base">
                {isLoading ? <ActivityIndicator color="#fff" /> : "Send Now"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
