import { FamousArtistRequest } from "@/store/api/global/famousArtist";
import { AppFonts } from "@/utils/fonts";
import { getToken } from "@/utils/secureStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
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
import CountryPicker from "react-native-country-picker-modal";
import Toast from "react-native-toast-message";

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
  const [isLoading, setIsLoading] = useState(false);
  const screenHeight = Dimensions.get('window').height;

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
  const [idCardImage, setIdCardImage] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<any>(null);
  const [showDivisionPicker, setShowDivisionPicker] = useState(false);

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

  const divisions = [
    { key: "Rap", label: t("famousArtist.divisions.rap") },
    { key: "Pop", label: t("famousArtist.divisions.pop") },
    { key: "Blues", label: t("famousArtist.divisions.blues") },
    { key: "Rock", label: t("famousArtist.divisions.rock") },
    { key: "Mahraganat", label: t("famousArtist.divisions.mahraganat") },
    { key: "Jazz", label: t("famousArtist.divisions.jazz") },
    { key: "Metal & Heavy Metal", label: t("famousArtist.divisions.metal") },
    { key: "Sonata", label: t("famousArtist.divisions.sonata") },
    { key: "Symphony", label: t("famousArtist.divisions.symphony") },
    { key: "Orchestra", label: t("famousArtist.divisions.orchestra") },
    { key: "Concerto", label: t("famousArtist.divisions.concerto") },
  ];

  const handleInputChange = (
    field: keyof FamousArtistRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDivisionSelect = (division: string) => {
    setFormData((prev) => ({ ...prev, famous_division: division }));
    setShowDivisionPicker(false);
    if (errors.famous_division) {
      setErrors((prev) => ({ ...prev, famous_division: "" }));
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
    }

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
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `${type}_${Date.now()}.jpg`;
        const mimeType = asset.mimeType || "image/jpeg";

        const imageFile = {
          uri: asset.uri,
          name: fileName,
          type: mimeType,
          base64: asset.base64,
        };

        if (type === "id_card") {
          setIdCardImage(imageFile);
          setFormData((prev) => ({ ...prev, famous_id_card_image: asset.uri }));
        } else {
          setProfileImage(imageFile);
          setFormData((prev) => ({ ...prev, famous_profile_image: asset.uri }));
        }

        Toast.show({
          type: "success",
          text1: t("famousArtist.imageSelected") || "Image Selected",
          text2:
            t("famousArtist.uploadSuccess", {
              type:
                type === "id_card"
                  ? t("famousArtist.fields.idCard")
                  : t("famousArtist.fields.profileImage"),
            }) ||
            `${
              type === "id_card"
                ? t("famousArtist.fields.idCard")
                : t("famousArtist.fields.profileImage")
            } ${t("famousArtist.imageSelected")}`,
          visibilityTime: 3000,
          topOffset: 100,
          position: "top",
        });
      }
    } catch (error) {
      console.error(`Error picking ${type} image:`, error);
      Toast.show({
        type: "error",
        text1: t("famousArtist.selectionFailed") || "Selection Failed",
        text2:
          t("famousArtist.unableToSelect", {
            type:
              type === "id_card"
                ? t("famousArtist.fields.idCard")
                : t("famousArtist.fields.profileImage"),
          }) ||
          `${t("famousArtist.unableToSelect", {
            type:
              type === "id_card"
                ? t("famousArtist.fields.idCard")
                : t("famousArtist.fields.profileImage"),
          })}. ${t("common.retry")}`,
        visibilityTime: 3000,
        topOffset: 100,
        position: "top",
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const token = await getToken("access_token");
    if (!token) {
      router.replace("/(drawer)/(auth)/login");
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("famous_name", formData.famous_name.trim());
      formDataToSend.append(
        "famous_email",
        formData.famous_email.trim().toLowerCase()
      );

      const cleanPhoneNumber = formData.famous_number.replace(/\D/g, "");
      formDataToSend.append("famous_number", cleanPhoneNumber);

      const cleanWhatsappNumber = formData.famous_whatsapp_number.replace(
        /\D/g,
        ""
      );
      formDataToSend.append("famous_whatsapp_number", cleanWhatsappNumber);
      formDataToSend.append("famous_details", formData.famous_details.trim());
      formDataToSend.append("famous_division", formData.famous_division.trim());
      formDataToSend.append(
        "famous_social_links",
        formData.famous_social_links.trim()
      );

      if (profileImage && profileImage.base64) {
        const base64File = {
          uri: `data:${profileImage.type};base64,${profileImage.base64}`,
          type: profileImage.type || "image/jpeg",
          name: profileImage.name || `famous_profile_${Date.now()}.jpg`,
        };
        formDataToSend.append("famous_profile_image", base64File as any);
      } else if (profileImage) {
        const profileImageFile = {
          uri: profileImage.uri,
          type: profileImage.type || "image/jpeg",
          name: profileImage.name || `famous_profile_${Date.now()}.jpg`,
        };
        formDataToSend.append("famous_profile_image", profileImageFile as any);
      }

      if (idCardImage && idCardImage.base64) {
        const base64File = {
          uri: `data:${idCardImage.type};base64,${idCardImage.base64}`,
          type: idCardImage.type || "image/jpeg",
          name: idCardImage.name || `famous_id_card_${Date.now()}.jpg`,
        };
        formDataToSend.append("famous_id_card_image", base64File as any);
      } else if (idCardImage) {
        const idCardImageFile = {
          uri: idCardImage.uri,
          type: idCardImage.type || "image/jpeg",
          name: idCardImage.name || `famous_id_card_${Date.now()}.jpg`,
        };
        formDataToSend.append("famous_id_card_image", idCardImageFile as any);
      }

      console.log("Submitting famous artist request...");
      console.log("Form data prepared with fields:", formDataToSend);

      const response = await fetch(
        "https://api.cloudwavproduction.com/api/famous-artist-requests",
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: "success",
          text1: t("famousArtist.alerts.successTitle") || "Request Submitted",
          text2:
            t("famousArtist.alerts.successMessage") ||
            "Your famous artist request has been submitted successfully",
          visibilityTime: 3000,
          topOffset: 100,
          position: "top",
        });
        resetForm();
        onClose();
      } else {
        let errorMessage =
          t("famousArtist.alerts.errorMessage") || "Request failed";
        try {
          const errorData = await response.json();
          console.log("Error response data:", errorData);

          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            if (typeof errorData.error === "string") {
              errorMessage = errorData.error;
            } else if (
              errorData.error.famous_number ||
              errorData.error.famous_whatsapp_number
            ) {
              const phoneErrors = [];
              if (errorData.error.famous_number) {
                phoneErrors.push(
                  `${t("famousArtist.fields.phone")}: ${
                    errorData.error.famous_number[0]
                  }`
                );
              }
              if (errorData.error.famous_whatsapp_number) {
                phoneErrors.push(
                  `${t("famousArtist.fields.whatsapp")}: ${
                    errorData.error.famous_whatsapp_number[0]
                  }`
                );
              }
              errorMessage = phoneErrors.join(", ");
            } else {
              errorMessage = JSON.stringify(errorData.error);
            }
          } else if (errorData.errors) {
            const firstError = Object.values(errorData.errors)[0];
            if (Array.isArray(firstError)) {
              errorMessage = firstError[0];
            } else {
              errorMessage = firstError as string;
            }
          } else if (errorData.data?.message) {
            errorMessage = errorData.data.message;
          }
        } catch (parseError) {
          console.log("Error parsing response:", parseError);
          console.log("Response status:", response.status);
          console.log("Response status text:", response.statusText);
          errorMessage = `${
            t("famousArtist.alerts.serverError") || "Server error"
          }: ${response.status} ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.log("Famous artist request error:", error);
      console.log("Error details:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });

      let errorMessage =
        error?.message ||
        t("common.somethingWentWrong") ||
        "Something went wrong. Please try again.";

      Toast.show({
        type: "error",
        text1: t("famousArtist.alerts.errorTitle") || "Request Failed",
        text2: errorMessage,
        visibilityTime: 3000,
        topOffset: 100,
        position: "top",
      });
    } finally {
      setIsLoading(false);
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
    setShowDivisionPicker(false);
    setPhoneCountry({
      cca2: "EG",
      callingCode: "20",
      name: "Egypt",
    });
    setWhatsappCountry({
      cca2: "EG",
      callingCode: "20",
      name: "Egypt",
    });
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
      <View
        className="flex-row items-center mb-2"
        style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
      >
        <Text
          className="text-gray-800 text-base"
          style={{
            fontFamily: AppFonts.medium,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {label}
        </Text>
        {options?.required && (
          <Text
            className={`text-red-500 ${isRTL ? "mr-1" : "ml-1"}`}
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            *
          </Text>
        )}
      </View>
      <TextInput
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        className={`border rounded-xl px-4 py-3 text-gray-800 bg-gray-50 ${
          errors[field] ? "border-red-300 bg-red-50" : "border-gray-200"
        } ${options?.multiline ? "h-24" : ""}`}
        textAlignVertical={options?.multiline ? "top" : "center"}
        style={{
          fontFamily: AppFonts.regular,
          textAlign: isRTL ? "right" : "left",
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
          style={{
            fontFamily: AppFonts.regular,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {errors[field]}
        </Text>
      )}
    </View>
  );

  const renderDivisionPicker = () => (
    <View className="mb-5">
      <View
        className="flex-row items-center mb-2"
        style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
      >
        <Text
          className="text-gray-800 text-base"
          style={{
            fontFamily: AppFonts.medium,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("famousArtist.fields.division")}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => setShowDivisionPicker(true)}
        className={`border rounded-xl px-4 py-4 text-gray-800 bg-gray-50 ${
          errors.famous_division ? "border-red-400" : "border-gray-200"
        }`}
      >
        <Text
          className={`${
            formData.famous_division ? "text-gray-800" : "text-gray-400"
          }`}
          style={{
            fontFamily: AppFonts.regular,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {formData.famous_division
            ? divisions.find((d) => d.key === formData.famous_division)
                ?.label || formData.famous_division
            : t("famousArtist.placeholders.division")}
        </Text>
      </TouchableOpacity>
      {errors.famous_division && (
        <Text
          className="text-red-500 text-sm mt-1"
          style={{
            fontFamily: AppFonts.regular,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {errors.famous_division}
        </Text>
      )}
    </View>
  );

  const renderImagePicker = (
    type: "id_card" | "profile",
    label: string,
    placeholder: string,
    image: any,
    iconName: string
  ) => (
    <View className="mb-5">
      <Text
        className="text-gray-800 mb-2"
        style={{
          fontFamily: AppFonts.medium,
          textAlign: isRTL ? "right" : "left",
        }}
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
              source={{ uri: image.uri }}
              className={`${
                type === "profile"
                  ? "w-24 h-24 rounded-full"
                  : "w-32 h-24 rounded-lg"
              } mb-2`}
            />
            <Text
              className="text-green-600 text-sm"
              style={{
                fontFamily: AppFonts.medium,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {image.name}
            </Text>
            <Text
              className="text-xs text-gray-500 mt-1"
              style={{
                fontFamily: AppFonts.regular,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("famousArtist.tapToChange") || "Tap to change"}
            </Text>
          </View>
        ) : (
          <View className="items-center">
            <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mb-3">
              <Ionicons name={iconName as any} size={24} color="#6B7280" />
            </View>
            <Text
              className="text-gray-600 text-center text-sm"
              style={{
                fontFamily: AppFonts.regular,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {placeholder}
            </Text>
            <Text
              className="text-xs text-gray-500 mt-1"
              style={{
                fontFamily: AppFonts.regular,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("famousArtist.tapToSelect") || "Tap to select"}
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
      transparent={true}
      style={{ zIndex: 1000 }}
    >
      <View className="flex-1 justify-end">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ 
            height: screenHeight * 0.8,
            zIndex: 1000 
          }}
        >
          <View 
            className="bg-white rounded-t-3xl"
            style={{ height: screenHeight * 0.8 }}
          >
          <View
            className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200"
            style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
          >
            <Text
              className="text-lg font-bold text-indigo-600"
              style={{
                fontFamily: AppFonts.bold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("famousArtist.modal.title")}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                className="text-xl text-gray-600"
                style={{
                  fontFamily: AppFonts.semibold,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
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
                style={{
                  fontFamily: AppFonts.semibold,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("famousArtist.sections.personalInfo")}
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
              <View className="mb-5">
                <View
                  className="flex-row items-center mb-2"
                  style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
                >
                  <Text
                    className="text-gray-800 text-base"
                    style={{
                      fontFamily: AppFonts.medium,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("famousArtist.fields.phone")}
                  </Text>
                  <Text
                    className={`text-red-500 ${isRTL ? "mr-1" : "ml-1"}`}
                    style={{ textAlign: isRTL ? "right" : "left" }}
                  >
                    *
                  </Text>
                </View>
                <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50">
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
                    }}
                    containerButtonStyle={{ paddingHorizontal: 10 }}
                  />
                  <Text
                    className="px-2"
                    style={{ textAlign: isRTL ? "right" : "left" }}
                  >
                    +{phoneCountry.callingCode}
                  </Text>
                  <TextInput
                    className="flex-1 p-3"
                    placeholder={
                      t("famousArtist.placeholders.phone") ||
                      "Enter phone number"
                    }
                    value={formData.famous_number}
                    onChangeText={(value) =>
                      handleInputChange("famous_number", value)
                    }
                    keyboardType="phone-pad"
                    textAlign={isRTL ? "right" : "left"}
                    style={{
                      textAlign: isRTL ? "right" : "left",
                      fontFamily: AppFonts.regular,
                    }}
                  />
                </View>
                {errors.famous_number && (
                  <Text
                    className="text-red-500 text-sm mt-1"
                    style={{
                      fontFamily: AppFonts.regular,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {errors.famous_number}
                  </Text>
                )}
              </View>

              {/* WhatsApp Number with Country Picker */}
              <View className="mb-5">
                <View
                  className="flex-row items-center mb-2"
                  style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
                >
                  <Text
                    className="text-gray-800 text-base"
                    style={{
                      fontFamily: AppFonts.medium,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("famousArtist.fields.whatsapp")}
                  </Text>
                </View>
                <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50">
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
                    }}
                    containerButtonStyle={{ paddingHorizontal: 10 }}
                  />
                  <Text
                    className="px-2"
                    style={{ textAlign: isRTL ? "right" : "left" }}
                  >
                    +{whatsappCountry.callingCode}
                  </Text>
                  <TextInput
                    className="flex-1 p-3"
                    placeholder={
                      t("famousArtist.placeholders.whatsapp") ||
                      "Enter WhatsApp number"
                    }
                    value={formData.famous_whatsapp_number}
                    onChangeText={(value) =>
                      handleInputChange("famous_whatsapp_number", value)
                    }
                    keyboardType="phone-pad"
                    textAlign={isRTL ? "right" : "left"}
                    style={{
                      textAlign: isRTL ? "right" : "left",
                      fontFamily: AppFonts.regular,
                    }}
                  />
                </View>
                {errors.famous_whatsapp_number && (
                  <Text
                    className="text-red-500 text-sm mt-1"
                    style={{
                      fontFamily: AppFonts.regular,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {errors.famous_whatsapp_number}
                  </Text>
                )}
              </View>
            </View>
            <View className="mb-6">
              <Text
                className="text-lg font-semibold text-gray-800 mb-4"
                style={{
                  fontFamily: AppFonts.semibold,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("famousArtist.sections.professionalInfo")}
              </Text>

              {renderDivisionPicker()}
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

            <View className="mb-8">
              <Text
                className="text-lg font-semibold text-gray-800 mb-4"
                style={{
                  fontFamily: AppFonts.semibold,
                  textAlign: isRTL ? "right" : "left",
                }}
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
              className="bg-blue-600 py-3 rounded-full mb-16"
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  className="text-white text-center font-semibold"
                  style={{
                    fontFamily: AppFonts.bold,
                    textAlign: "center",
                  }}
                >
                  {t("famousArtist.submit")}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>

      <Modal
        visible={showDivisionPicker}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-3xl p-6">
            <View
              className="flex-row justify-between items-center mb-4"
              style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
            >
              <Text
                className="text-lg font-semibold text-gray-800"
                style={{
                  fontFamily: AppFonts.semibold,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("famousArtist.fields.division")}
              </Text>
              <TouchableOpacity onPress={() => setShowDivisionPicker(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {divisions.map((division) => (
                <TouchableOpacity
                  key={division.key}
                  onPress={() => handleDivisionSelect(division.key)}
                  className={`py-4 px-4 rounded-lg mb-2 ${
                    formData.famous_division === division.key
                      ? "bg-red-100"
                      : "bg-gray-50"
                  }`}
                >
                  <Text
                    className={`${
                      formData.famous_division === division.key
                        ? "text-red-600 font-semibold"
                        : "text-gray-800"
                    }`}
                    style={{
                      fontFamily:
                        formData.famous_division === division.key
                          ? AppFonts.semibold
                          : AppFonts.regular,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {division.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
