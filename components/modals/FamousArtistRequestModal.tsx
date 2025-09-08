import { FamousArtistRequest, useCreateFamousArtistRequestMutation } from "@/store/api/global/famousArtist";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Image,
    Modal,
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
  const [createFamousArtistRequest, { isLoading }] = useCreateFamousArtistRequestMutation();

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

  const handleInputChange = (field: keyof FamousArtistRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async (type: 'id_card' | 'profile') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      if (type === 'id_card') {
        setIdCardImage(imageUri);
        setFormData(prev => ({ ...prev, famous_id_card_image: imageUri }));
      } else {
        setProfileImage(imageUri);
        setFormData(prev => ({ ...prev, famous_profile_image: imageUri }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!formData.famous_name || !formData.famous_email || !formData.famous_number) {
        Alert.alert(t("common.error"), t("common.fillRequiredFields"));
        return;
      }

      await createFamousArtistRequest(formData).unwrap();
      Alert.alert(t("common.success"), t("famousArtist.requestSubmitted"));
      onClose();
      
      // Reset form
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
    } catch (error) {
      Alert.alert(t("common.error"), t("common.somethingWentWrong"));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text
            className="text-xl font-semibold text-gray-800"
            style={{ fontFamily: AppFonts.semibold }}
          >
            {t("famousArtist.title")}
          </Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Name */}
          <View className="mb-4">
            <Text
              className="text-gray-700 mb-2"
              style={{ fontFamily: AppFonts.medium }}
            >
              {t("famousArtist.fields.name")} *
            </Text>
            <TextInput
              value={formData.famous_name}
              onChangeText={(value) => handleInputChange("famous_name", value)}
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
              style={{ fontFamily: AppFonts.regular }}
              placeholder={t("famousArtist.placeholders.name")}
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text
              className="text-gray-700 mb-2"
              style={{ fontFamily: AppFonts.medium }}
            >
              {t("famousArtist.fields.email")} *
            </Text>
            <TextInput
              value={formData.famous_email}
              onChangeText={(value) => handleInputChange("famous_email", value)}
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
              style={{ fontFamily: AppFonts.regular }}
              placeholder={t("famousArtist.placeholders.email")}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone Number */}
          <View className="mb-4">
            <Text
              className="text-gray-700 mb-2"
              style={{ fontFamily: AppFonts.medium }}
            >
              {t("famousArtist.fields.phone")} *
            </Text>
            <TextInput
              value={formData.famous_number}
              onChangeText={(value) => handleInputChange("famous_number", value)}
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
              style={{ fontFamily: AppFonts.regular }}
              placeholder={t("famousArtist.placeholders.phone")}
              keyboardType="phone-pad"
            />
          </View>

          {/* WhatsApp Number */}
          <View className="mb-4">
            <Text
              className="text-gray-700 mb-2"
              style={{ fontFamily: AppFonts.medium }}
            >
              {t("famousArtist.fields.whatsapp")}
            </Text>
            <TextInput
              value={formData.famous_whatsapp_number}
              onChangeText={(value) => handleInputChange("famous_whatsapp_number", value)}
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
              style={{ fontFamily: AppFonts.regular }}
              placeholder={t("famousArtist.placeholders.whatsapp")}
              keyboardType="phone-pad"
            />
          </View>

          {/* Division */}
          <View className="mb-4">
            <Text
              className="text-gray-700 mb-2"
              style={{ fontFamily: AppFonts.medium }}
            >
              {t("famousArtist.fields.division")}
            </Text>
            <TextInput
              value={formData.famous_division}
              onChangeText={(value) => handleInputChange("famous_division", value)}
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
              style={{ fontFamily: AppFonts.regular }}
              placeholder={t("famousArtist.placeholders.division")}
            />
          </View>

          {/* Social Links */}
          <View className="mb-4">
            <Text
              className="text-gray-700 mb-2"
              style={{ fontFamily: AppFonts.medium }}
            >
              {t("famousArtist.fields.socialLinks")}
            </Text>
            <TextInput
              value={formData.famous_social_links}
              onChangeText={(value) => handleInputChange("famous_social_links", value)}
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
              style={{ fontFamily: AppFonts.regular }}
              placeholder={t("famousArtist.placeholders.socialLinks")}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          {/* Details */}
          <View className="mb-4">
            <Text
              className="text-gray-700 mb-2"
              style={{ fontFamily: AppFonts.medium }}
            >
              {t("famousArtist.fields.details")}
            </Text>
            <TextInput
              value={formData.famous_details}
              onChangeText={(value) => handleInputChange("famous_details", value)}
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800 h-24"
              style={{ fontFamily: AppFonts.regular }}
              placeholder={t("famousArtist.placeholders.details")}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* ID Card Image */}
          <View className="mb-4">
            <Text
              className="text-gray-700 mb-2"
              style={{ fontFamily: AppFonts.medium }}
            >
              {t("famousArtist.fields.idCard")}
            </Text>
            <TouchableOpacity
              onPress={() => pickImage('id_card')}
              className="border border-gray-300 rounded-lg p-4 items-center"
            >
              {idCardImage ? (
                <Image source={{ uri: idCardImage }} className="w-20 h-20 rounded-lg" />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera" size={32} color="#6B7280" />
                  <Text className="text-gray-500 mt-2" style={{ fontFamily: AppFonts.regular }}>
                    {t("famousArtist.placeholders.selectIdCard")}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Profile Image */}
          <View className="mb-6">
            <Text
              className="text-gray-700 mb-2"
              style={{ fontFamily: AppFonts.medium }}
            >
              {t("famousArtist.fields.profileImage")}
            </Text>
            <TouchableOpacity
              onPress={() => pickImage('profile')}
              className="border border-gray-300 rounded-lg p-4 items-center"
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} className="w-20 h-20 rounded-lg" />
              ) : (
                <View className="items-center">
                  <Ionicons name="person" size={32} color="#6B7280" />
                  <Text className="text-gray-500 mt-2" style={{ fontFamily: AppFonts.regular }}>
                    {t("famousArtist.placeholders.selectProfile")}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className="bg-red-500 rounded-lg py-4 items-center mb-10"
          >
            <Text
              className="text-white text-lg"
              style={{ fontFamily: AppFonts.semibold }}
            >
              {isLoading ? t("common.submitting") : t("famousArtist.submit")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
