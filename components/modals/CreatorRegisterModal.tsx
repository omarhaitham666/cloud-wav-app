import { useVideoCreatorMutation } from "@/store/api/global/videoCreator";
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
const GENRES = [
  "Tiktokers",
  "Musician",
  "Youtuber",
  "Content creator",
  "Athlete",
  "public_figure",
];
const formSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(8, "Phone number is required"),
  phoneCountryCode: z.string().min(1, "Country code is required"),
  whatsappNumber: z.string().min(8, "WhatsApp number is required"),
  whatsappCountryCode: z.string().min(1, "WhatsApp country code is required"),
  division: z.string().min(1, "Division is required"),
  socialLink: z.string().url("Enter a valid URL"),
  privatePrice: z.string().min(1, "Private price is required"),
  businessPrice: z.string().min(1, "Business price is required"),
  additionalDetails: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, "You must accept terms"),
  profileImage: z
    .any()
    .refine((val) => val !== null, "Profile image is required"),
  idCard: z.any().refine((val) => val !== null, "ID card is required"),
});

type FormValues = z.infer<typeof formSchema>;

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
}: {
  name: keyof FormValues;
  control: any;
  label: string;
  placeholder: string;
  error?: string;
  multiline?: boolean;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View className="mb-4">
          <Text className="mb-1 font-medium text-gray-700">{label}</Text>
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
          />
          {error && <Text className="text-red-500 mt-1">{error}</Text>}
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
}: {
  name: keyof FormValues;
  control: any;
  label: string;
  error?: string;
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
          text1: "Image Selected",
          text2: `${label} uploaded successfully`,
        });
      }
    } catch (error) {
      console.error(`Error picking ${name}:`, error);
      Toast.show({
        type: "error",
        text1: "Selection Failed",
        text2: `Unable to select ${label.toLowerCase()}. Please try again.`,
      });
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View className="mb-4">
          <Text className="mb-1 font-medium text-gray-700">{label}</Text>
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
                <Text className="text-sm text-green-600 font-medium">
                  {value.name}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Tap to change image
                </Text>
              </View>
            ) : (
              <View className="items-center">
                <Text className="text-2xl mb-2">📷</Text>
                <Text className="text-sm text-gray-600 font-medium">
                  Choose {label}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Tap to select image
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {error && <Text className="text-red-500 mt-1">{error}</Text>}
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
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [videoCreator, { isLoading }] = useVideoCreatorMutation();

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
    resolver: zodResolver(formSchema),
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

    try {
      const formData = new FormData();

      // Append basic fields
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
      formData.append("bussiness_price", data.businessPrice); // Note: keep the typo if that's what the API expects

      // Handle profile image - React Native specific
      if (data.profileImage) {
        // For React Native, you need to append the file differently
        formData.append("profile_image", {
          uri: data.profileImage.uri,
          type: data.profileImage.type || "image/jpeg",
          name: data.profileImage.name || `profile_image_${Date.now()}.jpg`,
        } as any);
      }

      // Handle ID card - React Native specific
      if (data.idCard) {
        formData.append("id_card", {
          uri: data.idCard.uri,
          type: data.idCard.type || "image/jpeg",
          name: data.idCard.name || `id_card_${Date.now()}.jpg`,
        } as any);
      }

      // Debug: Log what's being sent
      console.log("Form data being sent:");
      console.log("name:", data.fullName);
      console.log("email:", data.email);
      console.log("division:", data.division);
      console.log("profileImage exists:", !!data.profileImage);
      console.log("idCard exists:", !!data.idCard);

      const response = await videoCreator(formData).unwrap();

      Toast.show({
        type: "success",
        text1: "Video Content Creator Sent Successfully",
      });
      onClose();
    } catch (e: any) {
      console.log("Full error object:", JSON.stringify(e, null, 2));

      // More detailed error handling
      let errorMessage = "Something went wrong";
      if (e?.data?.message) {
        errorMessage = e.data.message;
      } else if (e?.data?.errors) {
        // Handle validation errors
        const errors = Object.entries(e.data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`
          )
          .join("\n");
        errorMessage = errors;
      }

      Toast.show({
        type: "error",
        text1: "Video Content Creator Failed",
        text2: errorMessage,
      });
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
              Register Video Content Creator
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                className="text-xl text-gray-600"
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>

          <SafeAreaView className="bg-white">
            <ScrollView
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-2xl font-bold mb-6 text-center">
                Register Video Content Creator
              </Text>

              <FormInput
                name="fullName"
                control={control}
                label="Full Name"
                placeholder="Enter your full name"
                error={errors.fullName?.message}
              />
              <FormInput
                name="email"
                control={control}
                label="Email"
                placeholder="example@domain.com"
                error={errors.email?.message}
              />
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { value, onChange } }) => (
                  <View className="mb-4">
                    <Text className="text-gray-700 mb-1">Phone Number</Text>
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
                        placeholder="1234567890"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                      />
                    </View>
                    {errors.phoneNumber && (
                      <Text className="text-red-500">
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
                    <Text className="text-gray-700 mb-1">WhatsApp Number</Text>
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
                        placeholder="1234567890"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                      />
                    </View>
                    {errors.whatsappNumber && (
                      <Text className="text-red-500">
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
                  Division
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
                      }}
                    >
                      <Picker.Item label="Select Genre" value="" />
                      {GENRES.map((genre) => (
                        <Picker.Item key={genre} label={genre} value={genre} />
                      ))}
                    </Picker>
                  )}
                />
              </View>
              <FormInput
                name="socialLink"
                control={control}
                label="Social Media Link"
                placeholder="https://facebook.com/youraccount"
                error={errors.socialLink?.message}
              />

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <FormInput
                    name="privatePrice"
                    control={control}
                    label="Private Price"
                    placeholder="400"
                    error={errors.privatePrice?.message}
                  />
                </View>
                <View className="flex-1">
                  <FormInput
                    name="businessPrice"
                    control={control}
                    label="Business Price"
                    placeholder="400"
                    error={errors.businessPrice?.message}
                  />
                </View>
              </View>

              <FormInput
                name="additionalDetails"
                control={control}
                label="Additional Details"
                placeholder="Any extra info..."
                multiline
                error={errors.additionalDetails?.message}
              />

              <FileInput
                name="profileImage"
                control={control}
                label="Profile Image"
                error={getStringError(errors.profileImage?.message)}
              />
              <FileInput
                name="idCard"
                control={control}
                label="ID Card"
                error={getStringError(errors.idCard?.message)}
              />

              <Controller
                control={control}
                name="terms"
                render={({ field: { value, onChange } }) => (
                  <View className="flex-row items-center mb-4">
                    <Checkbox value={value} onValueChange={onChange} />
                    <Text className="ml-2">
                      I agree to the{" "}
                      <Text className="text-blue-600 underline">
                        Terms and Conditions
                      </Text>
                    </Text>
                  </View>
                )}
              />
              {errors.terms && (
                <Text className="text-red-500 mb-2">
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
                    Send Now
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
