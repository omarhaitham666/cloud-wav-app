import { getToken } from "@/utils/secureStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { AppFonts } from "@/utils/fonts";


const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone number is required"),
  whatsapp: z.string().optional(),
  platform: z.string().optional(),
  social: z.string().optional(),
  details: z.string().optional(),
});

// Create a function to get translated schema
const getTranslatedSchema = (t: any) => z.object({
  name: z.string().min(1, t("services.platformManagement.modal.validation.nameRequired")),
  email: z.string().email(t("services.platformManagement.modal.validation.invalidEmail")),
  phone: z.string().min(1, t("services.platformManagement.modal.validation.phoneRequired")),
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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

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
    { name: "name", label: t("services.platformManagement.modal.fields.name.label"), placeholder: t("services.platformManagement.modal.fields.name.placeholder") },
    { name: "email", label: t("services.platformManagement.modal.fields.email.label"), placeholder: t("services.platformManagement.modal.fields.email.placeholder") },
    { name: "phone", label: t("services.platformManagement.modal.fields.phone.label"), placeholder: t("services.platformManagement.modal.fields.phone.placeholder") },
    {
      name: "whatsapp",
      label: t("services.platformManagement.modal.fields.whatsapp.label"),
      placeholder: t("services.platformManagement.modal.fields.whatsapp.placeholder"),
    },
    { name: "platform", label: t("services.platformManagement.modal.fields.platform.label"), placeholder: t("services.platformManagement.modal.fields.platform.placeholder") },
    {
      name: "social",
      label: t("services.platformManagement.modal.fields.social.label"),
      placeholder: t("services.platformManagement.modal.fields.social.placeholder"),
    },
    {
      name: "details",
      label: t("services.platformManagement.modal.fields.details.label"),
      placeholder: t("services.platformManagement.modal.fields.details.placeholder"),
      multiline: true,
    },
  ];
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <View className="bg-white rounded-2xl w-full max-h-[80%]">
          <View
            className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200"
            style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
          >
            <Text
              className="text-lg text-indigo-600"
              style={{
                textAlign: isRTL ? 'right' : 'left',
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("services.platformManagement.modal.title")}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-xl text-gray-600"
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >{t("services.platformManagement.modal.close")}</Text>
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
                      style={{
                        textAlign: isRTL ? 'right' : 'left',
                        textAlignVertical: 'top',
                        fontFamily: AppFonts.semibold,
                      }}
                    />
                  )}
                />
                {errors[field.name as keyof FormData] && (
                  <Text
                    className="text-red-500 text-xs mt-1"
                    style={{
                      textAlign: isRTL ? 'right' : 'left',
                      fontFamily: AppFonts.semibold,
                    }}
                  >
                    {errors[field.name as keyof FormData]?.message?.toString()}
                  </Text>
                )}
              </View>
            ))}

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="bg-indigo-600 py-4 rounded-full mt-4"
            >
              <Text className="text-white text-center text-base"
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : t("services.platformManagement.modal.submit")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
