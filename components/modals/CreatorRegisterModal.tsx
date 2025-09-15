import { AppFonts } from "@/utils/fonts";
import { getToken } from "@/utils/secureStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { Checkbox } from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
  useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import Toast from "react-native-toast-message";
import { z } from "zod";
const GENRES_EN = [
  "Tiktokers",
  "Musician",
  "Youtuber",
  "Content creator",
  "Athlete",
  "public_figure",
];

const GENRES_AR = [
  "مبدعو تيك توك",
  "موسيقي",
  "مبدع يوتيوب",
  "مبدع محتوى",
  "رياضي",
  "شخصية عامة",
];
const createFormSchema = (t: any) =>
  z.object({
    fullName: z
      .string()
      .min(3, t("creatorRegister.validation.fullNameRequired")),
    email: z.string().email(t("creatorRegister.validation.invalidEmail")),
    phoneNumber: z
      .string()
      .min(8, t("creatorRegister.validation.phoneNumberRequired")),
    phoneCountryCode: z
      .string()
      .min(1, t("creatorRegister.validation.phoneCountryCodeRequired")),
    whatsappNumber: z
      .string()
      .min(8, t("creatorRegister.validation.whatsappNumberRequired")),
    whatsappCountryCode: z
      .string()
      .min(1, t("creatorRegister.validation.whatsappCountryCodeRequired")),
    division: z
      .string()
      .min(1, t("creatorRegister.validation.divisionRequired")),
    socialLink: z.string().url(t("creatorRegister.validation.invalidUrl")),
    privatePrice: z
      .string()
      .min(1, t("creatorRegister.validation.privatePriceRequired")),
    businessPrice: z
      .string()
      .min(1, t("creatorRegister.validation.businessPriceRequired")),
    additionalDetails: z.string().optional(),
    terms: z
      .boolean()
      .refine(
        (val) => val === true,
        t("creatorRegister.validation.termsRequired")
      ),
    profileImage: z
      .any()
      .refine(
        (val) => val !== null,
        t("creatorRegister.validation.profileImageRequired")
      ),
    idCard: z
      .any()
      .refine(
        (val) => val !== null,
        t("creatorRegister.validation.idCardRequired")
      ),
  });

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

type Props = {
  visible: boolean;
  onClose: () => void;
};

function FormInput({
  name,
  control,
  label,
  placeholder,
  error,
  multiline = false,
  isRTL = false,
}: {
  name: keyof FormValues;
  control: any;
  label: string;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  isRTL?: boolean;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View className="mb-4">
          <Text
            className="mb-1 font-medium text-gray-700"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {label}
          </Text>
          <TextInput
            className={`border rounded-lg px-3 py-2 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            textAlign={isRTL ? "right" : "left"}
            style={{ textAlign: isRTL ? "right" : "left" }}
          />
          {error && (
            <Text
              className="text-red-500 mt-1"
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              {error}
            </Text>
          )}
        </View>
      )}
    />
  );
}

function FileInput({
  name,
  control,
  label,
  error,
  t,
  isRTL = false,
}: {
  name: keyof FormValues;
  control: any;
  label: string;
  error?: string;
  t: any;
  isRTL?: boolean;
}) {
  const pickImage = async (onChange: (file: any) => void) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `${name}_${Date.now()}.jpg`;
        const mimeType = asset.mimeType || "image/jpeg";

        const imageFile = {
          uri: asset.uri,
          name: fileName,
          type: mimeType,
          base64: asset.base64,
        };

        onChange(imageFile);
        Toast.show({
          type: "success",
          text1: t("creatorRegister.fileUpload.imageSelected"),
          text2: t("creatorRegister.fileUpload.uploadSuccess", { label }),
        });
      }
    } catch (error) {
      console.error(`Error picking ${name}:`, error);
      Toast.show({
        type: "error",
        text1: t("creatorRegister.fileUpload.selectionFailed"),
        text2: t("creatorRegister.fileUpload.unableToSelect", {
          label: label.toLowerCase(),
        }),
      });
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View className="mb-4">
          <Text
            className="mb-1 font-medium text-gray-700"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {label}
          </Text>
          <TouchableOpacity
            onPress={() => pickImage(onChange)}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center bg-gray-50"
          >
            {value ? (
              <View className="items-center">
                <Image
                  source={{ uri: value.uri }}
                  className="w-16 h-16 rounded-lg mb-2"
                  resizeMode="cover"
                />
                <Text
                  className="text-sm text-green-600 font-medium"
                  style={{ textAlign: isRTL ? "right" : "left" }}
                >
                  {value.name}
                </Text>
                <Text
                  className="text-xs text-gray-500 mt-1"
                  style={{ textAlign: isRTL ? "right" : "left" }}
                >
                  {t("creatorRegister.fileUpload.tapToChange")}
                </Text>
              </View>
            ) : (
              <View className="items-center">
                <Text className="text-2xl mb-2">📷</Text>
                <Text
                  className="text-sm text-gray-600 font-medium"
                  style={{ textAlign: isRTL ? "right" : "left" }}
                >
                  {t("creatorRegister.fileUpload.chooseImage", { label })}
                </Text>
                <Text
                  className="text-xs text-gray-500 mt-1"
                  style={{ textAlign: isRTL ? "right" : "left" }}
                >
                  {t("creatorRegister.fileUpload.tapToSelect")}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {error && (
            <Text
              className="text-red-500 mt-1"
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              {error}
            </Text>
          )}
        </View>
      )}
    />
  );
}

function getStringError(
  error:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined
): string | undefined {
  if (typeof error === "string") {
    return error;
  }
  return undefined;
}
export default function CreatorRegister({ visible, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isLoading, setIsLoading] = useState(false);

  const [phoneCountry, setPhoneCountry] = useState({
    cca2: "EG",
    callingCode: "20",
    name: "Egypt",
  });
  const [whatsappCountry, setWhatsappCountry] = useState({
    cca2: "EG",
    callingCode: "20",
    name: "Egypt",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createFormSchema(t)),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      phoneCountryCode: "20",
      whatsappNumber: "",
      whatsappCountryCode: "20",
      division: "",
      socialLink: "",
      privatePrice: "",
      businessPrice: "",
      additionalDetails: "",
      terms: false,
      profileImage: null,
      idCard: null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const token = await getToken("access_token");
    if (!token) {
      router.replace("/(drawer)/(auth)/login");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", data.fullName);
      formData.append("email", data.email);
      formData.append("number", `+${data.phoneCountryCode}${data.phoneNumber}`);
      formData.append(
        "whatsapp_number",
        `+${data.whatsappCountryCode}${data.whatsappNumber}`
      );
      formData.append("division", data.division);
      formData.append("social_links", data.socialLink);
      formData.append("details", data.additionalDetails || "");
      formData.append("private_price", data.privatePrice);
      formData.append("bussiness_price", data.businessPrice);

      if (data.profileImage && data.profileImage.base64) {
        const base64File = {
          uri: `data:${data.profileImage.type};base64,${data.profileImage.base64}`,
          type: data.profileImage.type || "image/jpeg",
          name: data.profileImage.name || `profile_image_${Date.now()}.jpg`,
        };
        formData.append("profile_image", base64File as any);
      } else if (data.profileImage) {
        const profileImageFile = {
          uri: data.profileImage.uri,
          type: data.profileImage.type || "image/jpeg",
          name: data.profileImage.name || `profile_image_${Date.now()}.jpg`,
        };
        formData.append("profile_image", profileImageFile as any);
      }

      if (data.idCard && data.idCard.base64) {
        const base64File = {
          uri: `data:${data.idCard.type};base64,${data.idCard.base64}`,
          type: data.idCard.type || "image/jpeg",
          name: data.idCard.name || `id_card_${Date.now()}.jpg`,
        };
        formData.append("id_card", base64File as any);
      } else if (data.idCard) {
        const idCardFile = {
          uri: data.idCard.uri,
          type: data.idCard.type || "image/jpeg",
          name: data.idCard.name || `id_card_${Date.now()}.jpg`,
        };
        formData.append("id_card", idCardFile as any);
      }

      const response = await fetch(
        "https://api.cloudwavproduction.com/api/video-creator-requests",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: "success",
          text1: t("creatorRegister.alerts.successTitle"),
        });
        onClose();
      }
    } catch (e: any) {
      console.log("Error:", e);
      console.log("Error response:", e.response?.data);
      Toast.show({
        type: "error",
        text1: t("creatorRegister.alerts.errorTitle"),
        text2:
          e?.response?.data?.message ||
          e?.response?.data ||
          t("creatorRegister.alerts.errorMessage"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <View className="bg-white rounded-2xl w-full max-h-[85%]">
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
              {t("creatorRegister.title")}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                className="text-xl text-gray-600"
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >
                {t("creatorRegister.close")}
              </Text>
            </TouchableOpacity>
          </View>

          <SafeAreaView className="bg-white">
            <ScrollView
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-2xl font-bold mb-6 text-center">
                {t("creatorRegister.title")}
              </Text>

              <FormInput
                name="fullName"
                control={control}
                label={t("creatorRegister.form.fullName")}
                placeholder={t("creatorRegister.placeholders.fullName")}
                error={errors.fullName?.message}
                isRTL={isRTL}
              />
              <FormInput
                name="email"
                control={control}
                label={t("creatorRegister.form.email")}
                placeholder={t("creatorRegister.placeholders.email")}
                error={errors.email?.message}
                isRTL={isRTL}
              />
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { value, onChange } }) => (
                  <View className="mb-4">
                    <Text
                      className="text-gray-700 mb-1"
                      style={{
                        fontFamily: AppFonts.medium,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("creatorRegister.form.phoneNumber")}
                    </Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg">
                      <CountryPicker
                        countryCode={phoneCountry.cca2 as any}
                        withCallingCode
                        withFlag
                        withFilter
                        withAlphaFilter
                        onSelect={(country) => {
                          setPhoneCountry({
                            cca2: country.cca2 as string,
                            callingCode: country.callingCode[0],
                            name: country.name as string,
                          });
                          control._formValues.phoneCountryCode =
                            country.callingCode[0];
                        }}
                        containerButtonStyle={{ paddingHorizontal: 10 }}
                      />
                      <Text className="px-2">+{phoneCountry.callingCode}</Text>
                      <TextInput
                        className="flex-1 p-3"
                        placeholder={t(
                          "creatorRegister.placeholders.phoneNumber"
                        )}
                        value={value}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                        textAlign={isRTL ? "right" : "left"}
                        style={{ textAlign: isRTL ? "right" : "left" }}
                      />
                    </View>
                    {errors.phoneNumber && (
                      <Text
                        className="text-red-500"
                        style={{ textAlign: isRTL ? "right" : "left" }}
                      >
                        {errors.phoneNumber.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={control}
                name="whatsappNumber"
                render={({ field: { value, onChange } }) => (
                  <View className="mb-4">
                    <Text
                      className="text-gray-700 mb-1"
                      style={{
                        fontFamily: AppFonts.medium,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("creatorRegister.form.whatsappNumber")}
                    </Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg">
                      <CountryPicker
                        countryCode={whatsappCountry.cca2 as any}
                        withCallingCode
                        withFlag
                        withFilter
                        withAlphaFilter
                        onSelect={(country) => {
                          setWhatsappCountry({
                            cca2: country.cca2 as string,
                            callingCode: country.callingCode[0],
                            name: country.name as string,
                          });
                          control._formValues.whatsappCountryCode =
                            country.callingCode[0];
                        }}
                        containerButtonStyle={{ paddingHorizontal: 10 }}
                      />
                      <Text className="px-2">
                        +{whatsappCountry.callingCode}
                      </Text>
                      <TextInput
                        className="flex-1 p-3"
                        placeholder={t(
                          "creatorRegister.placeholders.whatsappNumber"
                        )}
                        value={value}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                        textAlign={isRTL ? "right" : "left"}
                        style={{ textAlign: isRTL ? "right" : "left" }}
                      />
                    </View>
                    {errors.whatsappNumber && (
                      <Text
                        className="text-red-500"
                        style={{ textAlign: isRTL ? "right" : "left" }}
                      >
                        {errors.whatsappNumber.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <View className="mb-4">
                <Text
                  className="text-black mb-2"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("creatorRegister.form.division")}
                </Text>
                <Controller
                  control={control}
                  name="division"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={{
                        color: "black",
                        backgroundColor: "rgba(0,0,0,0.05)",
                        borderWidth: 1,
                        borderColor: "rgba(0,0,0,0.1)",
                        borderRadius: 12,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      <Picker.Item
                        label={t("creatorRegister.placeholders.selectGenre")}
                        value=""
                      />
                      {(isRTL ? GENRES_AR : GENRES_EN).map((genre, index) => (
                        <Picker.Item
                          key={isRTL ? GENRES_EN[index] : genre}
                          label={genre}
                          value={isRTL ? GENRES_EN[index] : genre}
                        />
                      ))}
                    </Picker>
                  )}
                />
              </View>
              <FormInput
                name="socialLink"
                control={control}
                label={t("creatorRegister.form.socialLink")}
                placeholder={t("creatorRegister.placeholders.socialLink")}
                error={errors.socialLink?.message}
                isRTL={isRTL}
              />

              <View
                className="flex-row gap-4"
                style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
              >
                <View className="flex-1">
                  <FormInput
                    name="privatePrice"
                    control={control}
                    label={t("creatorRegister.form.privatePrice")}
                    placeholder={t("creatorRegister.placeholders.privatePrice")}
                    error={errors.privatePrice?.message}
                    isRTL={isRTL}
                  />
                </View>
                <View className="flex-1">
                  <FormInput
                    name="businessPrice"
                    control={control}
                    label={t("creatorRegister.form.businessPrice")}
                    placeholder={t(
                      "creatorRegister.placeholders.businessPrice"
                    )}
                    error={errors.businessPrice?.message}
                    isRTL={isRTL}
                  />
                </View>
              </View>

              <FormInput
                name="additionalDetails"
                control={control}
                label={t("creatorRegister.form.additionalDetails")}
                placeholder={t(
                  "creatorRegister.placeholders.additionalDetails"
                )}
                multiline
                error={errors.additionalDetails?.message}
                isRTL={isRTL}
              />

              <FileInput
                name="profileImage"
                control={control}
                label={t("creatorRegister.form.profileImage")}
                error={getStringError(errors.profileImage?.message)}
                t={t}
                isRTL={isRTL}
              />
              <FileInput
                name="idCard"
                control={control}
                label={t("creatorRegister.form.idCard")}
                error={getStringError(errors.idCard?.message)}
                t={t}
                isRTL={isRTL}
              />

              <Controller
                control={control}
                name="terms"
                render={({ field: { value, onChange } }) => (
                  <View
                    className="flex-row items-center mb-4"
                    style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
                  >
                    <Checkbox value={value} onValueChange={onChange} />
                    <Text
                      className={isRTL ? "mr-2" : "ml-2"}
                      style={{ textAlign: isRTL ? "right" : "left" }}
                    >
                      {t("creatorRegister.form.terms")}
                    </Text>
                  </View>
                )}
              />
              {errors.terms && (
                <Text
                  className="text-red-500 mb-2"
                  style={{ textAlign: isRTL ? "right" : "left" }}
                >
                  {errors.terms.message}
                </Text>
              )}

              <TouchableOpacity
                className="bg-blue-600 py-3 rounded-full mt-4"
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    {t("creatorRegister.submit")}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}
