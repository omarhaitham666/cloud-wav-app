import CreativeBanner from "@/components/CreativeBanner";
import { useSendMessageMutation } from "@/store/api/global/contact";
import {
  ANIMATION_DELAY,
  useCardHover,
  useFadeIn,
  usePageTransition,
  useSlideIn,
} from "@/utils/animations";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import Animated from "react-native-reanimated";
import Toast from "react-native-toast-message";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [focusedField, setFocusedField] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("EG");
  const [country, setCountry] = useState<Country>({
    callingCode: ["20"],
    cca2: "EG",
    currency: ["EGP"],
    flag: "🇪🇬",
    name: "Egypt",
    region: "Africa",
    subregion: "Northern Africa",
  });

  const { animatedStyle: pageAnimatedStyle, enterPage } = usePageTransition();
  const {
    animatedStyle: bannerAnimatedStyle,
    startAnimation: startBannerAnimation,
  } = useSlideIn("down", ANIMATION_DELAY.NONE);
  const {
    animatedStyle: contactCardsAnimatedStyle,
    startAnimation: startContactCardsAnimation,
  } = useSlideIn("up", ANIMATION_DELAY.SMALL);
  const {
    animatedStyle: formTitleAnimatedStyle,
    startAnimation: startFormTitleAnimation,
  } = useFadeIn(ANIMATION_DELAY.MEDIUM);
  const {
    animatedStyle: formAnimatedStyle,
    startAnimation: startFormAnimation,
  } = useSlideIn("up", ANIMATION_DELAY.LARGE);

  useEffect(() => {
    enterPage();
    startBannerAnimation();
    startContactCardsAnimation();
    startFormTitleAnimation();
    startFormAnimation();
  }, [
    enterPage,
    startBannerAnimation,
    startContactCardsAnimation,
    startFormTitleAnimation,
    startFormAnimation,
  ]);

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

    if (formData.message.length < 10) {
      return Alert.alert(
        t("contact.alerts.errorTitle"),
        t("contact.alerts.messageMinLength")
      );
    }

    try {
      // Print the send data
      const sendData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: `+${country.callingCode[0]}${formData.phone}`,
        message: formData.message,
      };
      console.log("Send data:", sendData);

      await sendMessage(sendData).unwrap();

      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });

      Toast.show({
        type: "success",
        text1: t("contact.alerts.successTitle"),
        text2: t("contact.alerts.successMessage"),
      });
    } catch (error: any) {
      console.error("Contact form submission error:", error);

      // Check if it's an authentication error
      if (
        error?.status === 401 ||
        error?.data?.message === "Unauthenticated."
      ) {
        Toast.show({
          type: "error",
          text1: t("contact.alerts.errorTitle"),
          text2: t("contact.alerts.loginRequired"),
        });
        // Redirect to login after a short delay
        setTimeout(() => {
          router.replace("/(drawer)/(auth)/login");
        }, 1500);
        return;
      }

      let errorMessage = t("contact.alerts.errorMessage");

      if (error?.data?.errors) {
        const errors = error.data.errors;
        const errorMessages = [];

        if (errors.first_name)
          errorMessages.push(`First Name: ${errors.first_name[0]}`);
        if (errors.last_name)
          errorMessages.push(`Last Name: ${errors.last_name[0]}`);
        if (errors.email) errorMessages.push(`Email: ${errors.email[0]}`);
        if (errors.phone) errorMessages.push(`Phone: ${errors.phone[0]}`);
        if (errors.message) errorMessages.push(`Message: ${errors.message[0]}`);

        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join("\n");
        }
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      Toast.show({
        type: "error",
        text1: t("contact.alerts.errorTitle"),
        text2: errorMessage,
      });
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
  }) => {
    const { animatedStyle, onPressIn, onPressOut } = useCardHover();

    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          className="mb-4 rounded-2xl shadow-md"
        >
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
      </Animated.View>
    );
  };

  const InputField = useCallback(
    ({
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
    ),
    [focusedField, isRTL]
  );

  return (
    <SafeAreaView className="flex-1 pt-12 bg-gray-50">
      <Animated.View style={[{ flex: 1 }, pageAnimatedStyle]}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Animated.View style={bannerAnimatedStyle} className="px-4">
            <CreativeBanner
              titleKey="title"
              subtitleKey="subtitle"
              iconKey="icon"
              colors={["#3B82F6", "#1D4ED8", "#1E40AF"]}
              namespace="contact"
            />
          </Animated.View>

          <Animated.View
            style={contactCardsAnimatedStyle}
            className="px-4 mt-8"
          >
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
          </Animated.View>

          <Animated.View
            style={formTitleAnimatedStyle}
            className="px-4 mt-10 mb-10"
          >
            <Text
              className="text-xl text-gray-800 mb-4 pe-4"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("contact.formTitle")}
            </Text>

            <Animated.View
              style={formAnimatedStyle}
              className="bg-white rounded-2xl p-5 shadow-md"
            >
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
              {/* Phone Number with Country Picker */}
              <View className="mb-4">
                <View className="flex-row items-center border border-gray-300 rounded-lg">
                  <CountryPicker
                    countryCode={countryCode}
                    withCallingCode
                    withFlag
                    withFilter
                    withAlphaFilter
                    onSelect={(selectedCountry) => {
                      setCountry(selectedCountry);
                      setCountryCode(selectedCountry.cca2);
                    }}
                    containerButtonStyle={{ paddingHorizontal: 10 }}
                  />
                  <Text
                    className="px-2 text-gray-800"
                    style={{ fontFamily: AppFonts.semibold }}
                  >
                    +{country.callingCode[0]}
                  </Text>
                  <TextInput
                    className="flex-1 px-4 py-3 text-gray-800"
                    placeholder={t("contact.phone")}
                    placeholderTextColor="#9CA3AF"
                    textAlignVertical="center"
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange("phone", text)}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField("")}
                    keyboardType="phone-pad"
                    style={{
                      textAlign: isRTL ? "right" : "left",
                      fontFamily: AppFonts.semibold,
                    }}
                  />
                </View>
              </View>
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
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Contact;
