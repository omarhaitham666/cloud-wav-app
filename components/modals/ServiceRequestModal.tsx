import { AppFonts } from "@/utils/fonts";
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
import Toast from "react-native-toast-message";
import { z } from "zod";

const getSchema = (t: any) =>
  z.object({
    name: z
      .string()
      .min(1, t("services.platformManagement.modal.validation.nameRequired")),
    email: z
      .string()
      .email(t("services.platformManagement.modal.validation.invalidEmail")),
    phone: z
      .string()
      .min(1, t("services.platformManagement.modal.validation.phoneRequired")),
    whatsapp: z.string().optional(),
    platform: z.string().optional(),
    social: z.string().optional(),
    details: z.string().optional(),
    serviceType: z.string().optional(),
  });

export type FormData = z.infer<ReturnType<typeof getSchema>>;

type Props = {
  visible: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmitForm: (data: FormData) => void;
  serviceType?: string;
};

export default function ServiceRequestModal({
  visible,
  isLoading,
  onClose,
  onSubmitForm,
  serviceType,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(getSchema(t)),
  });

  const onSubmit = async (data: FormData) => {
    const token = await getToken("access_token");

    if (!token) {
      router.replace("/(drawer)/(auth)/login");
      return;
    }

    try {
      // Include serviceType in the form data
      const formDataWithServiceType = {
        ...data,
        serviceType: serviceType || "",
      };
      
      await onSubmitForm(formDataWithServiceType);
      reset();
      onClose(); // Close the modal after successful submission
      Toast.show({
        type: "success",
        text1: t("services.platformManagement.modal.alerts.successTitle"),
        text2: t("services.platformManagement.modal.alerts.successMessage"),
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      
      // Extract specific validation errors
      let errorMessage = t("services.platformManagement.modal.alerts.errorMessage");
      
      if (error?.data?.errors) {
        const errors = error.data.errors;
        const errorMessages = [];
        
        if (errors.name) errorMessages.push(`Name: ${errors.name[0]}`);
        if (errors.email) errorMessages.push(`Email: ${errors.email[0]}`);
        if (errors.phone) errorMessages.push(`Phone: ${errors.phone[0]}`);
        if (errors.whatsapp_number) errorMessages.push(`WhatsApp: ${errors.whatsapp_number[0]}`);
        
        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join('\n');
        }
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }
      
      Toast.show({
        type: "error",
        text1: t("services.platformManagement.modal.alerts.errorTitle"),
        text2: errorMessage,
      });
    }
  };

  const fields = [
    {
      name: "name",
      label: t("services.platformManagement.modal.fields.name.label"),
      placeholder: t(
        "services.platformManagement.modal.fields.name.placeholder"
      ),
    },
    {
      name: "email",
      label: t("services.platformManagement.modal.fields.email.label"),
      placeholder: t(
        "services.platformManagement.modal.fields.email.placeholder"
      ),
    },
    {
      name: "phone",
      label: t("services.platformManagement.modal.fields.phone.label"),
      placeholder: t(
        "services.platformManagement.modal.fields.phone.placeholder"
      ),
    },
    {
      name: "whatsapp",
      label: t("services.platformManagement.modal.fields.whatsapp.label"),
      placeholder: t(
        "services.platformManagement.modal.fields.whatsapp.placeholder"
      ),
    },
    {
      name: "platform",
      label: t("services.platformManagement.modal.fields.platform.label"),
      placeholder: t(
        "services.platformManagement.modal.fields.platform.placeholder"
      ),
    },
    {
      name: "social",
      label: t("services.platformManagement.modal.fields.social.label"),
      placeholder: t(
        "services.platformManagement.modal.fields.social.placeholder"
      ),
    },
    {
      name: "details",
      label: t("services.platformManagement.modal.fields.details.label"),
      placeholder: t(
        "services.platformManagement.modal.fields.details.placeholder"
      ),
      multiline: true,
    },
  ];
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <View className="bg-white rounded-2xl w-full max-h-[80%]">
          <View
            className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200"
            style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
          >
            <Text
              className="text-lg text-indigo-600"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("services.platformManagement.modal.title")}
            </Text>
            <TouchableOpacity onPress={onClose} disabled={isLoading}>
              <Text
                className={`text-xl ${
                  isLoading ? "text-gray-400" : "text-gray-600"
                }`}
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >
                {t("services.platformManagement.modal.close")}
              </Text>
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
                      editable={!isLoading}
                      className={`border rounded-xl px-4 py-3 text-gray-800 ${
                        isLoading ? "bg-gray-100 border-gray-200" : "border-gray-200 bg-gray-50"
                      }`}
                      placeholderTextColor="#9CA3AF"
                      textAlignVertical={field.multiline ? "top" : "center"}
                      style={{
                        textAlign: isRTL ? "right" : "left",
                        fontFamily: AppFonts.semibold,
                      }}
                    />
                  )}
                />
                {errors[field.name as keyof FormData] && (
                  <Text
                    className="text-red-500 text-xs mt-1"
                    style={{
                      textAlign: isRTL ? "right" : "left",
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
              disabled={isLoading}
              className={`py-4 rounded-full mt-4 ${
                isLoading ? "bg-indigo-400" : "bg-indigo-600"
              }`}
            >
              {isLoading ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator color="#fff" size="small" />
                  <Text
                    className="text-white text-center ml-2"
                    style={{
                      fontFamily: AppFonts.semibold,
                    }}
                  >
                    {t("services.platformManagement.modal.sending")}
                  </Text>
                </View>
              ) : (
                <Text
                  className="text-white text-center text-base"
                  style={{
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  {t("services.platformManagement.modal.submit")}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
