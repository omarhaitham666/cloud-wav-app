import { useUpdatePriceVedioCreatersMutation } from "@/store/api/global/videoCreator";
import { AppFonts } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
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

const priceSchema = z.object({
  privatePrice: z
    .string()
    .min(1, "Private price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid price greater than 0",
    }),
  businessPrice: z
    .string()
    .min(1, "Business price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid price greater than 0",
    }),
});

const getTranslatedSchema = (t: any) =>
  z.object({
    privatePrice: z
      .string()
      .min(1, t("updatePrice.validation.privatePriceRequired"))
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: t("updatePrice.validation.priceMinValue"),
      }),
    businessPrice: z
      .string()
      .min(1, t("updatePrice.validation.businessPriceRequired"))
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: t("updatePrice.validation.priceMinValue"),
      }),
  });

export type PriceFormData = z.infer<typeof priceSchema>;

type Props = {
  visible: boolean;
  onClose: () => void;
  initialPrivatePrice?: string;
  initialBusinessPrice?: string;
  video_creator_id?: number;
};

function UpdatePriceModal({
  visible,
  onClose,
  initialPrivatePrice = "",
  initialBusinessPrice = "",
  video_creator_id,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [UpdatePriceVedioCreaters, { isLoading }] =
    useUpdatePriceVedioCreatersMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PriceFormData>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      privatePrice: initialPrivatePrice,
      businessPrice: initialBusinessPrice,
    },
  });

  const onSubmit = async (data: PriceFormData) => {
    await UpdatePriceVedioCreaters({
      id: video_creator_id?.toString() || "0",
      body: {
        private_price: Number(data.privatePrice),
        bussiness_price: Number(data.businessPrice),
      },
    })
      .unwrap()
      .then((res) => {
        console.log(res);
        Toast.show({
          type: "success",
          text1: t("updatePrice.alerts.updateSuccess"),
        });
        onClose();
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: t("updatePrice.alerts.updateFailed"),
          text2:
            e?.data?.message || t("updatePrice.alerts.updateFailedMessage"),
        });
      });
    reset();
  };

  const fields = [
    {
      name: "privatePrice",
      label: t("updatePrice.privatePrice"),
      placeholder: t("updatePrice.privatePricePlaceholder"),
    },
    {
      name: "businessPrice",
      label: t("updatePrice.businessPrice"),
      placeholder: t("updatePrice.businessPricePlaceholder"),
    },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent>
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
              {t("updatePrice.title")}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                className="text-xl text-gray-600"
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {fields.map((field) => (
              <View key={field.name} className="mb-4">
                <Text
                  className="text-gray-700 mb-2"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  {field.label}
                </Text>
                <Controller
                  control={control}
                  name={field.name as keyof PriceFormData}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder={field.placeholder}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      className="border border-indigo-300 rounded-lg px-4 py-3 text-base text-gray-800"
                      placeholderTextColor="#9CA3AF"
                      style={{
                        textAlign: isRTL ? "right" : "left",
                        fontFamily: AppFonts.semibold,
                      }}
                    />
                  )}
                />
                {errors[field.name as keyof PriceFormData] && (
                  <Text
                    className="text-red-500 text-xs mt-1"
                    style={{
                      textAlign: isRTL ? "right" : "left",
                      fontFamily: AppFonts.semibold,
                    }}
                  >
                    {errors[
                      field.name as keyof PriceFormData
                    ]?.message?.toString()}
                  </Text>
                )}
              </View>
            ))}

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="bg-indigo-600 py-4 rounded-full mt-4"
            >
              <Text
                className="text-white text-center text-base"
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  t("updatePrice.submit")
                )}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default UpdatePriceModal;
