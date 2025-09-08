import {
  FamousArtistRequest,
  useCreateFamousArtistRequestMutation,
} from "@/store/api/global/famousArtist";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FamousArtistRequestModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FamousArtistRequestModal({
  visible,
  onClose,
}: FamousArtistRequestModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [createFamousArtistRequest, { isLoading }] =
    useCreateFamousArtistRequestMutation();

  const [formData, setFormData] = useState<FamousArtistRequest>({
    famous_name: "",
    famous_email: "",
    famous_number: "",
    famous_whatsapp_number: "",
    famous_details: "",
    famous_id_card_image: "",
    famous_profile_image: "",
    famous_division: "",
    famous_social_links: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof FamousArtistRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.famous_name.trim()) {
      newErrors.famous_name = t("validation.nameRequired");
    }

    if (!formData.famous_email.trim()) {
      newErrors.famous_email = t("validation.emailRequired");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.famous_email)) {
        newErrors.famous_email = t("validation.emailInvalid");
      }
    }

    if (!formData.famous_number.trim()) {
      newErrors.famous_number = t("validation.phoneRequired");
    } else {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.famous_number.replace(/\s/g, ""))) {
        newErrors.famous_number = t("validation.phoneInvalid");
      }
    }

    if (formData.famous_whatsapp_number.trim()) {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (
        !phoneRegex.test(formData.famous_whatsapp_number.replace(/\s/g, ""))
      ) {
        newErrors.famous_whatsapp_number = t("validation.phoneInvalid");
      }
    }

    // Social links validation (if provided)
    if (formData.famous_social_links.trim()) {
      const urlRegex = /^https?:\/\/[^\s]+$/;
      if (!urlRegex.test(formData.famous_social_links)) {
        newErrors.famous_social_links = t("validation.urlInvalid");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async (type: "id_card" | "profile") => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "profile" ? [1, 1] : [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        if (type === "id_card") {
          setIdCardImage(imageUri);
          setFormData((prev) => ({ ...prev, famous_id_card_image: imageUri }));
        } else {
          setProfileImage(imageUri);
          setFormData((prev) => ({ ...prev, famous_profile_image: imageUri }));
        }
      }
    } catch (error) {
      Alert.alert(t("common.error"), t("common.imagePickerError"));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("famous_name", formData.famous_name.trim());
      formDataToSend.append(
        "famous_email",
        formData.famous_email.trim().toLowerCase()
      );
      formDataToSend.append("famous_number", formData.famous_number.trim());
      formDataToSend.append(
        "famous_whatsapp_number",
        formData.famous_whatsapp_number.trim()
      );
      formDataToSend.append("famous_details", formData.famous_details.trim());
      formDataToSend.append("famous_division", formData.famous_division.trim());
      formDataToSend.append(
        "famous_social_links",
        formData.famous_social_links.trim()
      );

      if (idCardImage) {
        formDataToSend.append("famous_id_card_image", {
          uri: idCardImage,
          type: "image/jpeg",
          name: "id_card.jpg",
        } as any);
      }

      if (profileImage) {
        formDataToSend.append("famous_profile_image", {
          uri: profileImage,
          type: "image/jpeg",
          name: "profile.jpg",
        } as any);
      }

      await createFamousArtistRequest(formDataToSend).unwrap();
      Alert.alert(t("common.success"), t("famousArtist.requestSubmitted"));
      resetForm();
      onClose();
    } catch (error: any) {
      console.log(error);

      const errorMessage =
        error?.data?.message || t("common.somethingWentWrong");
      Alert.alert(t("common.error"), errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      famous_name: "",
      famous_email: "",
      famous_number: "",
      famous_whatsapp_number: "",
      famous_details: "",
      famous_id_card_image: "",
      famous_profile_image: "",
      famous_division: "",
      famous_social_links: "",
    });
    setIdCardImage(null);
    setProfileImage(null);
    setErrors({});
  };

  const renderInput = (
    field: keyof FamousArtistRequest,
    label: string,
    placeholder: string,
    options?: {
      required?: boolean;
      multiline?: boolean;
      keyboardType?: any;
      autoCapitalize?: any;
    }
  ) => (
    <View className="mb-5">
      <View className="flex-row items-center mb-2">
        <Text
          className="text-gray-800 text-base"
          style={{ fontFamily: AppFonts.medium }}
        >
          {label}
        </Text>
        {options?.required && <Text className="text-red-500 ml-1">*</Text>}
      </View>
      <TextInput
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        className={`border rounded-xl px-4 py-4 text-gray-800 bg-gray-50 ${
          errors[field] ? "border-red-400" : "border-gray-200"
        } ${options?.multiline ? "h-24" : ""}`}
        style={{
          fontFamily: AppFonts.regular,
          textAlignVertical: options?.multiline ? "top" : "center",
        }}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={options?.multiline}
        keyboardType={options?.keyboardType}
        autoCapitalize={options?.autoCapitalize}
      />
      {errors[field] && (
        <Text
          className="text-red-500 text-sm mt-1"
          style={{ fontFamily: AppFonts.regular }}
        >
          {errors[field]}
        </Text>
      )}
    </View>
  );

  const renderImagePicker = (
    type: "id_card" | "profile",
    label: string,
    placeholder: string,
    image: string | null,
    iconName: string
  ) => (
    <View className="mb-5">
      <Text
        className="text-gray-800 text-base mb-2"
        style={{ fontFamily: AppFonts.medium }}
      >
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => pickImage(type)}
        className="border border-dashed border-gray-300 rounded-xl p-6 items-center bg-gray-50"
      >
        {image ? (
          <View className="items-center">
            <Image
              source={{ uri: image }}
              className={`${
                type === "profile"
                  ? "w-24 h-24 rounded-full"
                  : "w-32 h-24 rounded-lg"
              } mb-2`}
            />
            <Text
              className="text-green-600 text-sm"
              style={{ fontFamily: AppFonts.medium }}
            >
              {t("common.imageSelected")}
            </Text>
          </View>
        ) : (
          <View className="items-center">
            <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mb-3">
              <Ionicons name={iconName as any} size={24} color="#6B7280" />
            </View>
            <Text
              className="text-gray-600 text-center text-sm"
              style={{ fontFamily: AppFonts.regular }}
            >
              {placeholder}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-bold text-indigo-600">
              {t("famousArtist.modal.title")}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-xl text-gray-600">
                {t("famousArtist.modal.close")}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 px-6 pt-6"
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-6">
              <Text
                className="text-lg font-semibold text-gray-800 mb-4"
                style={{ fontFamily: AppFonts.semibold }}
              >
                {t("")}
              </Text>

              {renderInput(
                "famous_name",
                t("famousArtist.fields.name"),
                t("famousArtist.placeholders.name"),
                { required: true }
              )}
              {renderInput(
                "famous_email",
                t("famousArtist.fields.email"),
                t("famousArtist.placeholders.email"),
                {
                  required: true,
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                }
              )}
              {renderInput(
                "famous_number",
                t("famousArtist.fields.phone"),
                t("famousArtist.placeholders.phone"),
                { required: true, keyboardType: "phone-pad" }
              )}
              {renderInput(
                "famous_whatsapp_number",
                t("famousArtist.fields.whatsapp"),
                t("famousArtist.placeholders.whatsapp"),
                { keyboardType: "phone-pad" }
              )}
            </View>

            {/* Professional Information Section */}
            <View className="mb-6">
              <Text
                className="text-lg font-semibold text-gray-800 mb-4"
                style={{ fontFamily: AppFonts.semibold }}
              >
                {t("famousArtist.sections.professionalInfo")}
              </Text>

              {renderInput(
                "famous_division",
                t("famousArtist.fields.division"),
                t("famousArtist.placeholders.division")
              )}
              {renderInput(
                "famous_social_links",
                t("famousArtist.fields.socialLinks"),
                t("famousArtist.placeholders.socialLinks"),
                { keyboardType: "url", autoCapitalize: "none" }
              )}
              {renderInput(
                "famous_details",
                t("famousArtist.fields.details"),
                t("famousArtist.placeholders.details"),
                { multiline: true }
              )}
            </View>

            {/* Documents Section */}
            <View className="mb-8">
              <Text
                className="text-lg font-semibold text-gray-800 mb-4"
                style={{ fontFamily: AppFonts.semibold }}
              >
                {t("famousArtist.sections.documents")}
              </Text>

              {renderImagePicker(
                "profile",
                t("famousArtist.fields.profileImage"),
                t("famousArtist.placeholders.selectProfile"),
                profileImage,
                "person"
              )}
              {renderImagePicker(
                "id_card",
                t("famousArtist.fields.idCard"),
                t("famousArtist.placeholders.selectIdCard"),
                idCardImage,
                "card"
              )}
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`rounded-xl py-4 items-center mb-8 "bg-gradient-to-r from-red-500 to-red-600"
               `}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="black" />
                  <Text
                    className="text-black text-lg ml-2"
                    style={{ fontFamily: AppFonts.semibold }}
                  >
                    {t("famousArtist.submit")}
                  </Text>
                </View>
              ) : (
                <Text
                  className="text-black text-lg"
                  style={{ fontFamily: AppFonts.semibold }}
                >
                  {t("famousArtist.submit")}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
