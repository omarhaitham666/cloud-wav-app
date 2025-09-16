import CreativeBanner from "@/components/CreativeBanner";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  ColorValue,
  KeyboardType,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.message
    ) {
      return Alert.alert(
        t("contact.alerts.errorTitle"),
        t("contact.alerts.errorFields")
      );
    }

    if (!validateEmail(formData.email)) {
      return Alert.alert(
        t("contact.alerts.errorTitle"),
        t("contact.alerts.invalidEmail")
      );
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert(
        t("contact.alerts.successTitle"),
        t("contact.alerts.successMessage"),
        [
          {
            text: "OK",
            onPress: () =>
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                message: "",
              }),
          },
        ]
      );
    } catch {
      Alert.alert(
        t("contact.alerts.errorTitle"),
        t("contact.alerts.errorMessage")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = () => Linking.openURL("tel:+201055030045");
  const handleEmail = () =>
    Linking.openURL("mailto:support@cloudwavproduction.com");
  const handleLocation = () => {
    const address = t("contact.locationSupportValue");
    Linking.openURL(
      `https://maps.google.com/?q=${encodeURIComponent(address)}`
    );
  };

  const ContactCard = ({
    icon,
    title,
    subtitle,
    value,
    onPress,
    colors,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    value: string;
    onPress: () => void;
    colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  }) => (
    <TouchableOpacity onPress={onPress} className="mb-4 rounded-2xl shadow-md">
      <LinearGradient
        colors={colors}
        style={{
          borderRadius: 18,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        }}
        className={`flex-row items-center p-4 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
          <Ionicons name={icon as any} size={24} color="#fff" />
        </View>
        <View className={`flex-1 ${isRTL ? "mr-4" : "ml-4"}`}>
          <Text
            className="text-white text-base"
            style={{
              textAlign: isRTL ? "right" : "left",
              fontFamily: AppFonts.semibold,
            }}
          >
            {title}
          </Text>
          <Text
            className="text-white/80 text-xs"
            style={{
              textAlign: isRTL ? "right" : "left",
              fontFamily: AppFonts.semibold,
            }}
          >
            {subtitle}
          </Text>
          <Text
            className="text-white font-medium text-sm mt-1"
            style={{
              textAlign: isRTL ? "right" : "left",
              fontFamily: AppFonts.semibold,
            }}
          >
            {value}
          </Text>
        </View>
        <Ionicons
          name={isRTL ? "chevron-back" : "chevron-forward"}
          size={20}
          color="#fff"
        />
      </LinearGradient>
    </TouchableOpacity>
  );

  const InputField = useCallback(({
    placeholder,
    value,
    onChangeText,
    multiline = false,
    keyboardType = "default",
    field,
  }: {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
    keyboardType?: KeyboardType;
    field: string;
  }) => (
    <View
      className={`mb-4 rounded-xl border px-4 ${
        focusedField === field
          ? "border-gray-300 bg-gray-100"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <TextInput
        className={`py-3 text-gray-800 ${multiline ? "h-24" : ""}`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        textAlignVertical={multiline ? "top" : "center"}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocusedField(field)}
        onBlur={() => setFocusedField("")}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
        style={{
          textAlign: isRTL ? "right" : "left",
          writingDirection: isRTL ? "rtl" : "ltr",
          fontFamily: AppFonts.semibold,
        }}
      />
    </View>
  ), [focusedField, isRTL]);

  return (
    <SafeAreaView className="flex-1 pt-12 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4">
          <CreativeBanner
            titleKey="title"
            subtitleKey="subtitle"
            iconKey="icon"
            colors={["#3B82F6", "#1D4ED8", "#1E40AF"]}
            namespace="contact"
          />
        </View>

        <View className="px-4 mt-8">
          <ContactCard
            icon="call"
            title={t("contact.phoneSupportTitle")}
            subtitle={t("contact.phoneSupportSubtitle")}
            value={t("contact.phoneSupportValue")}
            onPress={handleCall}
            colors={["#3B82F6", "#1D4ED8"]}
          />
          <ContactCard
            icon="mail"
            title={t("contact.emailSupportTitle")}
            subtitle={t("contact.emailSupportSubtitle")}
            value={t("contact.emailSupportValue")}
            onPress={handleEmail}
            colors={["#8B5CF6", "#7C3AED"]}
          />
          <ContactCard
            icon="location"
            title={t("contact.locationSupportTitle")}
            subtitle={t("contact.locationSupportSubtitle")}
            value={t("contact.locationSupportValue")}
            onPress={handleLocation}
            colors={["#10B981", "#059669"]}
          />
        </View>

        {/* 🔹 Contact Form */}
        <View className="px-4 mt-10 mb-10">
          <Text
            className="text-xl text-gray-800 mb-4 pe-4"
            style={{
              textAlign: isRTL ? "right" : "left",
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("contact.formTitle")}
          </Text>

          <View className="bg-white rounded-2xl p-5 shadow-md">
            <InputField
              placeholder={t("contact.firstName")}
              value={formData.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
              field="firstName"
            />
            <InputField
              placeholder={t("contact.lastName")}
              value={formData.lastName}
              onChangeText={(text) => handleInputChange("lastName", text)}
              field="lastName"
            />
            <InputField
              placeholder={t("contact.email")}
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              field="email"
            />
            <InputField
              placeholder={t("contact.phone")}
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              keyboardType="phone-pad"
              field="phone"
            />
            <InputField
              placeholder={t("contact.message")}
              value={formData.message}
              onChangeText={(text) => handleInputChange("message", text)}
              multiline
              field="message"
            />
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className="mt-3"
            >
              <LinearGradient
                style={{
                  borderRadius: 33,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                colors={
                  isLoading ? ["#9CA3AF", "#6B7280"] : ["#6366F1", "#8B5CF6"]
                }
                className="py-4 items-center rounded-xl"
              >
                {isLoading ? (
                  <View
                    className={`flex-row items-center space-x-2 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <ActivityIndicator size="small" color="#fff" />
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: AppFonts.semibold,
                      }}
                    >
                      {t("contact.sending")}
                    </Text>
                  </View>
                ) : (
                  <View
                    className={`flex-row items-center gap-2 space-x-2 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: AppFonts.semibold,
                      }}
                    >
                      {t("contact.sendButton")}
                    </Text>
                    <Ionicons name="send" size={20} color="#fff" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Contact;
