"use client";

import { ServiceType, useServicesMutation } from "@/store/api/global/services";
import { getToken } from "@/utils/secureStore";
import { router } from "expo-router";
import React, { useEffect } from "react";
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

import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  details: string;
  options: string[];
  singOption: string;
};

const servicesOptions = [
  { key: "services.musicDistribution.modal.options.voiceRecording", value: "voice recording" },
  { key: "services.musicDistribution.modal.options.songWriting", value: "songwriting" },
  { key: "services.musicDistribution.modal.options.musicProduction", value: "music production" },
  { key: "services.musicDistribution.modal.options.videoFilming", value: "music video" },
  { key: "services.musicDistribution.modal.options.creatingFullSong", value: "song creation" },
  { key: "services.musicDistribution.modal.options.creatingSongWithClip", value: "song clip" },
];

const singOptions = [
  { key: "services.musicDistribution.modal.singOptions.singMyself", value: "I Will Sing It Myself" },
  { key: "services.musicDistribution.modal.singOptions.needSpecific", value: "I Will Need A Specific" },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function MusicServiceModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { control, handleSubmit, watch, setValue, reset, formState: { errors, isValid } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      whatsapp_number: "",
      details: "",
      options: [],
      singOption: "",
    },
    mode: "onChange",
  });

  const options = watch("options");
  const [Services, { isLoading }] = useServicesMutation();

  const resetForm = () => {
    reset({
      name: "",
      email: "",
      phone: "",
      whatsapp_number: "",
      details: "",
      options: [],
      singOption: "",
    });
  };

  // Reset form when modal becomes visible
  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  const onSubmit = async (data: FormValues) => {
    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      Toast.show({
        type: "error",
        text1: t("services.musicDistribution.modal.alerts.validationTitle"),
        text2: t("services.musicDistribution.modal.alerts.validationMessage"),
      });
      return;
    }

    const token = await getToken("access_token");

    if (!token) {
      router.replace("/(drawer)/(auth)/login");
      return;
    }

    // Convert selected options to actual values (exact match with backend)
    const selectedServiceValues = data.options.map(optionKey => {
      const option = servicesOptions.find(opt => opt.key === optionKey);
      return option ? option.value : optionKey;
    });
    
    const selectedSingValue = singOptions.find(opt => opt.key === data.singOption)?.value || data.singOption;

    // Prepare the request data
    const requestData = {
      type: "artist_service" as ServiceType,
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        whatsapp_number: data.whatsapp_number?.trim() || "",
        details: data.details?.trim() || "",
        options: [...selectedServiceValues, selectedSingValue].filter(Boolean),
      },
    };

    try {
      await Services(requestData).unwrap();      
      Toast.show({
        type: "success",
        text1: t("services.musicDistribution.modal.alerts.successTitle"),
        text2: t("services.musicDistribution.modal.alerts.successMessage"),
      });
      resetForm(); // Clear form after successful submission
      onClose();
    } catch (error: any) {
      console.error("Request failed:", error);
      
      Toast.show({
        type: "error",
        text1: t("services.musicDistribution.modal.alerts.errorTitle"),
        text2: error?.data?.message || 
               error?.message || 
               t("services.musicDistribution.modal.alerts.errorMessage"),
      });
    }
  };

  const toggleOption = (value: string) => {
    const newOptions = options.includes(value)
      ? options.filter((opt) => opt !== value)
      : [...options, value];
    setValue("options", newOptions);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%] min-h-[70%]">
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-800">
              {t("services.musicDistribution.modal.title")}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                resetForm(); // Clear form when closing modal
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <Text className="text-lg text-gray-600 font-semibold">×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 px-6"
            contentContainerStyle={{
              paddingBottom: 30,
              paddingTop: 20,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Personal Information Section */}
            <View className="mb-6">
              
              <Controller
                control={control}
                name="name"
                rules={{ required: true, minLength: 2 }}
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      {t("services.musicDistribution.modal.form.name")} *
                    </Text>
                    <TextInput
                      placeholder={t("services.musicDistribution.modal.form.name")}
                      className={`border rounded-xl px-4 py-3 text-gray-800 ${
                        errors.name ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
                      }`}
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.name && (
                      <Text className="text-red-500 text-xs mt-1">
                        {t("services.musicDistribution.modal.form.nameRequired")}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="email"
                rules={{ 
                  required: true, 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email format"
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      {t("services.musicDistribution.modal.form.email")} *
                    </Text>
                    <TextInput
                      placeholder={t("services.musicDistribution.modal.form.email")}
                      className={`border rounded-xl px-4 py-3 text-gray-800 ${
                        errors.email ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
                      }`}
                      keyboardType="email-address"
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.email && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.email.type === "required" 
                          ? t("services.musicDistribution.modal.form.emailRequired")
                          : t("services.musicDistribution.modal.form.emailInvalid")
                        }
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="phone"
                rules={{ required: true, minLength: 10 }}
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      {t("services.musicDistribution.modal.form.phone")} *
                    </Text>
                    <TextInput
                      placeholder={t("services.musicDistribution.modal.form.phone")}
                      className={`border rounded-xl px-4 py-3 text-gray-800 ${
                        errors.phone ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
                      }`}
                      keyboardType="phone-pad"
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.phone && (
                      <Text className="text-red-500 text-xs mt-1">
                        {t("services.musicDistribution.modal.form.phoneRequired")}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="whatsapp_number"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      {t("services.musicDistribution.modal.form.whatsappNumber")}
                    </Text>
                    <TextInput
                      placeholder={t(
                        "services.musicDistribution.modal.form.whatsappNumber"
                      )}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-800"
                      keyboardType="phone-pad"
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="details"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      {t("services.musicDistribution.modal.form.details")}
                    </Text>
                    <TextInput
                      placeholder={t(
                        "services.musicDistribution.modal.form.details"
                      )}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-800 h-24"
                      multiline
                      textAlignVertical="top"
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
            </View>

            {/* Services Options Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                {t("services.musicDistribution.modal.form.selectOptions")}
              </Text>
              <View className="bg-gray-50 rounded-xl p-4">
                {servicesOptions.map((opt, index) => (
                  <TouchableOpacity
                    key={opt.key}
                    className={`flex-row items-center py-3 px-3 rounded-lg mb-2 ${
                      options.includes(opt.key) ? "bg-blue-50" : "bg-white"
                    }`}
                    onPress={() => toggleOption(opt.key)}
                  >
                    <View
                      className={`w-6 h-6 mr-4 rounded border-2 items-center justify-center ${
                        options.includes(opt.key)
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {options.includes(opt.key) && (
                        <Text className="text-white text-xs font-bold">✓</Text>
                      )}
                    </View>
                    <Text className={`flex-1 text-gray-800 ${
                      options.includes(opt.key) ? "font-medium" : "font-normal"
                    }`}>
                      {t(opt.key)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sing Options Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                {t("services.musicDistribution.modal.form.selectSingOption")}
              </Text>
              <View className="bg-gray-50 rounded-xl p-4">
                {singOptions.map((opt) => (
                  <Controller
                    key={opt.key}
                    control={control}
                    name="singOption"
                    render={({ field: { value, onChange } }) => (
                      <TouchableOpacity
                        className={`flex-row items-center py-3 px-3 rounded-lg mb-2 ${
                          value === opt.key ? "bg-blue-50" : "bg-white"
                        }`}
                        onPress={() => onChange(opt.key)}
                      >
                        <View
                          className={`w-6 h-6 mr-4 rounded-full border-2 items-center justify-center ${
                            value === opt.key
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {value === opt.key && (
                            <View className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </View>
                        <Text className={`flex-1 text-gray-800 ${
                          value === opt.key ? "font-medium" : "font-normal"
                        }`}>
                          {t(opt.key)}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`p-4 rounded-xl mt-4 mb-4 ${
                isLoading 
                  ? "bg-blue-400" 
                  : !isValid 
                    ? "bg-gray-400" 
                    : "bg-blue-600"
              }`}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading || !isValid}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text className="text-white text-center font-semibold ml-2">
                      {t("services.musicDistribution.modal.form.submitting")}
                    </Text>
                  </>
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    {t("services.musicDistribution.modal.form.submit")}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
