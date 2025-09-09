"use client";

import { ServiceType, useServicesMutation } from "@/store/api/global/services";
import { getToken } from "@/utils/secureStore";
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
  "services.musicDistribution.modal.options.voiceRecording",
  "services.musicDistribution.modal.options.songWriting",
  "services.musicDistribution.modal.options.musicProduction",
  "services.musicDistribution.modal.options.videoFilming",
  "services.musicDistribution.modal.options.creatingFullSong",
  "services.musicDistribution.modal.options.creatingSongWithClip",
];

const singOptions = [
  "services.musicDistribution.modal.singOptions.singMyself",
  "services.musicDistribution.modal.singOptions.needSpecific",
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function MusicServiceModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      whatsapp_number: "",
      details: "",
      options: [],
      singOption: "",
    },
  });

  const options = watch("options");
  const [Services, { isLoading }] = useServicesMutation();

  const onSubmit = async (data: FormValues) => {
    const token = await getToken("access_token");

    if (!token) {
      router.replace("/(drawer)/(auth)/login");
      return;
    }

    await Services({
      type: "artist_service" as ServiceType,
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        whatsapp_number: data.whatsapp_number,
        details: data.details,
        options: [...data.options, data.singOption].filter(Boolean),
      },
    })
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Service Artist Sent Successfully",
        });
        onClose();
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: "Service Artist Failed",
          text2: e?.data?.message || "Something went wrong",
        });
      });
  };

  const toggleOption = (value: string) => {
    const newOptions = options.includes(value)
      ? options.filter((opt) => opt !== value)
      : [...options, value];
    setValue("options", newOptions);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/40 justify-center items-center pt-3 pb-3 px-6">
        <View className="bg-white rounded-2xl w-full h-full my-3">
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-bold text-indigo-600">
              {t("services.musicDistribution.modal.title")}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-xl text-gray-600">
                {t("services.musicDistribution.modal.close")}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            className="bg-white px-4"
            contentContainerStyle={{
              paddingBottom: 20,
              paddingTop: 20,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder={t("services.musicDistribution.modal.form.name")}
                  className="border border-gray-300 rounded p-3 mb-4"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder={t("services.musicDistribution.modal.form.email")}
                  className="border border-gray-300 rounded p-3 mb-4"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder={t("services.musicDistribution.modal.form.phone")}
                  className="border border-gray-300 rounded p-3 mb-4"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="whatsapp_number"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder={t(
                    "services.musicDistribution.modal.form.whatsappNumber"
                  )}
                  className="border border-gray-300 rounded p-3 mb-4"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="details"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder={t(
                    "services.musicDistribution.modal.form.details"
                  )}
                  className="border border-gray-300 rounded p-3 mb-4 h-20"
                  multiline
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Text className="text-base font-semibold mb-2">
              {t("services.musicDistribution.modal.form.selectOptions")}
            </Text>
            {servicesOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                className="flex-row items-center mb-2"
                onPress={() => toggleOption(opt)}
              >
                <View
                  className={`w-5 h-5 mr-3 rounded border ${
                    options.includes(opt)
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-400"
                  }`}
                />
                <Text>{t(opt)}</Text>
              </TouchableOpacity>
            ))}

            <Text className="text-base font-semibold mt-4 mb-2">
              {t("services.musicDistribution.modal.form.selectSingOption")}
            </Text>
            {singOptions.map((opt) => (
              <Controller
                key={opt}
                control={control}
                name="singOption"
                render={({ field: { value, onChange } }) => (
                  <TouchableOpacity
                    className="flex-row items-center mb-2"
                    onPress={() => onChange(opt)}
                  >
                    <View
                      className={`w-5 h-5 mr-3 rounded-full border ${
                        value === opt
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-400"
                      }`}
                    />
                    <Text>{t(opt)}</Text>
                  </TouchableOpacity>
                )}
              />
            ))}

            <TouchableOpacity
              className="bg-blue-600 p-4 rounded mt-6"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-white text-center font-semibold">
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  t("services.musicDistribution.modal.form.submit")
                )}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
