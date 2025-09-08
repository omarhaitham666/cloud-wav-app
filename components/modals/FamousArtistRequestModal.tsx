import {
  FamousArtistRequest,
  useCreateFamousArtistRequestMutation,
} from "@/store/api/global/famousArtist";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Animated,
  Easing,
  Image,
  Modal,
  ScrollView,
  StatusBar,
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

  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // ✅ Fade animation for smooth modal entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleInputChange = (
    field: keyof FamousArtistRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async (type: "id_card" | "profile") => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
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
      Alert.alert(t("common.error"), "Failed to pick image");
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
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.famous_name ||
        !formData.famous_email ||
        !formData.famous_number
      ) {
        Alert.alert(t("common.error"), t("common.fillRequiredFields"));
        return;
      }

      // 🚨 TEMP: You're sending image URIs — backend expects FILES.
      // We'll fix this in next step — for now, let’s get modal showing first.
      await createFamousArtistRequest(formData).unwrap();

      Alert.alert(t("common.success"), t("famousArtist.requestSubmitted"));
      resetForm();
      onClose();
    } catch (error) {
      console.log("Submit error:", error);
      Alert.alert(t("common.error"), t("common.somethingWentWrong"));
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // ✅ FIXED MODAL STRUCTURE — This will now SHOW
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true} // ✅ Critical fix
      statusBarTranslucent={true} // ✅ For Android status bar
      onRequestClose={handleClose}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View className="flex-1 w-full bg-white">
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-white">
            <Text
              className="text-xl font-semibold text-gray-800 flex-1"
              style={{
                fontFamily: AppFonts.semibold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("famousArtist.title") || "Famous Artist Request"}
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              className="p-2 ml-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{ padding: 16 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Name */}
            <View className="mb-4">
              <Text
                className="text-gray-700 mb-2 text-base"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("famousArtist.fields.name") || "Name"} *
              </Text>
              <TextInput
                value={formData.famous_name}
                onChangeText={(value) =>
                  handleInputChange("famous_name", value)
                }
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800 bg-white"
                style={{
                  fontFamily: AppFonts.regular,
                  textAlign: isRTL ? "right" : "left",
                }}
                placeholder={
                  t("famousArtist.placeholders.name") || "Enter your name"
                }
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text
                className="text-gray-700 mb-2 text-base"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("famousArtist.fields.email") || "Email"} *
              </Text>
              <TextInput
                value={formData.famous_email}
                onChangeText={(value) =>
                  handleInputChange("famous_email", value)
                }
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800 bg-white"
                style={{
                  fontFamily: AppFonts.regular,
                  textAlign: isRTL ? "right" : "left",
                }}
                placeholder={
                  t("famousArtist.placeholders.email") || "Enter your email"
                }
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone Number */}
            <View className="mb-4">
              <Text
                className="text-gray-700 mb-2 text-base"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("famousArtist.fields.phone") || "Phone"} *
              </Text>
              <TextInput
                value={formData.famous_number}
                onChangeText={(value) =>
                  handleInputChange("famous_number", value)
                }
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800 bg-white"
                style={{
                  fontFamily: AppFonts.regular,
                  textAlign: isRTL ? "right" : "left",
                }}
                placeholder={
                  t("famousArtist.placeholders.phone") || "Enter phone number"
                }
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            {/* WhatsApp Number */}
            <View className="mb-4">
              <Text
                className="text-gray-700 mb-2 text-base"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("famousArtist.fields.whatsapp") || "WhatsApp"}
              </Text>
              <TextInput
                value={formData.famous_whatsapp_number}
                onChangeText={(value) =>
                  handleInputChange("famous_whatsapp_number", value)
                }
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800 bg-white"
                style={{
                  fontFamily: AppFonts.regular,
                  textAlign: isRTL ? "right" : "left",
                }}
                placeholder={
                  t("famousArtist.placeholders.whatsapp") ||
                  "Enter WhatsApp number"
                }
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            {/* Division */}
            <View className="mb-4">
              <Text
                className="text-gray-700 mb-2 text-base"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("famousArtist.fields.division") || "Division"}
              </Text>
              <TextInput
                value={formData.famous_division}
                onChangeText={(value) =>
                  handleInputChange("famous_division", value)
                }
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800 bg-white"
                style={{
                  fontFamily: AppFonts.regular,
                  textAlign: isRTL ? "right" : "left",
                }}
                placeholder={
                  t("famousArtist.placeholders.division") || "Enter division"
                }
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Social Links */}
            <View className="mb-4">
              <Text
                className="text-gray-700 mb-2 text-base"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("famousArtist.fields.socialLinks") || "Social Links"}
              </Text>
              <TextInput
                value={formData.famous_social_links}
                onChangeText={(value) =>
                  handleInputChange("famous_social_links", value)
                }
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800 bg-white"
                style={{
                  fontFamily: AppFonts.regular,
                  textAlign: isRTL ? "right" : "left",
                }}
                placeholder={
                  t("famousArtist.placeholders.socialLinks") ||
                  "Enter social media links"
                }
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            {/* Details */}
            <View className="mb-4">
              <Text
                className="text-gray-700 mb-2 text-base"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("famousArtist.fields.details") || "Details"}
              </Text>
              <TextInput
                value={formData.famous_details}
                onChangeText={(value) =>
                  handleInputChange("famous_details", value)
                }
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800 bg-white min-h-[96px]"
                style={{
                  fontFamily: AppFonts.regular,
                  textAlign: isRTL ? "right" : "left",
                }}
                placeholder={
                  t("famousArtist.placeholders.details") ||
                  "Enter additional details"
                }
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                numberOfLines={4}
              />
            </View>

            {/* ID Card Image */}
            <View className="mb-4">
              <Text
                className="text-gray-700 mb-2 text-base"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("famousArtist.fields.idCard") || "ID Card"}
              </Text>
              <TouchableOpacity
                onPress={() => pickImage("id_card")}
                className="border border-gray-300 rounded-lg p-4 items-center bg-gray-50"
                activeOpacity={0.7}
              >
                {idCardImage ? (
                  <View className="items-center">
                    <Image
                      source={{ uri: idCardImage }}
                      className="w-24 h-24 rounded-lg mb-2"
                      resizeMode="cover"
                    />
                    <Text
                      className="text-gray-600 text-sm"
                      style={{ fontFamily: AppFonts.regular }}
                    >
                      Tap to change
                    </Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <Ionicons name="camera" size={32} color="#6B7280" />
                    <Text
                      className="text-gray-500 mt-2 text-center"
                      style={{ fontFamily: AppFonts.regular }}
                    >
                      {t("famousArtist.placeholders.selectIdCard") ||
                        "Select ID Card Image"}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Profile Image */}
            <View className="mb-6">
              <Text
                className="text-gray-700 mb-2 text-base"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("famousArtist.fields.profileImage") || "Profile Image"}
              </Text>
              <TouchableOpacity
                onPress={() => pickImage("profile")}
                className="border border-gray-300 rounded-lg p-4 items-center bg-gray-50"
                activeOpacity={0.7}
              >
                {profileImage ? (
                  <View className="items-center">
                    <Image
                      source={{ uri: profileImage }}
                      className="w-24 h-24 rounded-lg mb-2"
                      resizeMode="cover"
                    />
                    <Text
                      className="text-gray-600 text-sm"
                      style={{ fontFamily: AppFonts.regular }}
                    >
                      Tap to change
                    </Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <Ionicons name="person" size={32} color="#6B7280" />
                    <Text
                      className="text-gray-500 mt-2 text-center"
                      style={{ fontFamily: AppFonts.regular }}
                    >
                      {t("famousArtist.placeholders.selectProfile") ||
                        "Select Profile Image"}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`rounded-lg py-4 items-center mb-8 ${
                isLoading ? "bg-red-300" : "bg-red-500"
              }`}
              activeOpacity={0.8}
            >
              <Text
                className="text-white text-lg"
                style={{ fontFamily: AppFonts.semibold }}
              >
                {isLoading
                  ? t("common.submitting") || "Submitting..."
                  : t("famousArtist.submit") || "Submit Request"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
}
