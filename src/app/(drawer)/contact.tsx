import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
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
import CustomHeader from "../../components/CustomHeader";

const Contact = () => {
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
      return Alert.alert("Error", "Please fill in all required fields");
    }

    if (!validateEmail(formData.email)) {
      return Alert.alert("Error", "Please enter a valid email address");
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert("Success!", "Your message has been sent successfully.", [
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
      ]);
    } catch {
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = () => Linking.openURL("tel:+201055030045");
  const handleEmail = () =>
    Linking.openURL("mailto:support@cloudwavproduction.com");
  const handleLocation = () => {
    const address = "22 Al-Sawah Street, Zeitoun, Cairo, Egypt";
    Linking.openURL(
      `https://maps.google.com/?q=${encodeURIComponent(address)}`
    );
  };

  /** 🔹 Contact Card Component */
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
        className="flex-row items-center p-4 rounded-2xl"
      >
        <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
          <Ionicons name={icon as any} size={24} color="#fff" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-white font-bold text-base">{title}</Text>
          <Text className="text-white/80 text-xs">{subtitle}</Text>
          <Text className="text-white font-medium text-sm mt-1">{value}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );

  /** 🔹 Input Field Component */
  const InputField = ({
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
      className={`mb-4 rounded-xl border px-3 ${
        focusedField === field
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <TextInput
        className={`py-3 text-base text-gray-900 ${multiline ? "h-24" : ""}`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocusedField(field)}
        onBlur={() => setFocusedField("")}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="mt-6 px-5">
        <CustomHeader showLanguageSwitcher />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* 🔹 Contact Info Cards */}
        <View className="mt-8">
          <ContactCard
            icon="call"
            title="Phone Support"
            subtitle="Call us for immediate assistance"
            value="+201055030045"
            onPress={handleCall}
            colors={["#3B82F6", "#1D4ED8"]}
          />
          <ContactCard
            icon="mail"
            title="Email Support"
            subtitle="Send us your detailed queries"
            value="support@cloudwavproduction.com"
            onPress={handleEmail}
            colors={["#8B5CF6", "#7C3AED"]}
          />
          <ContactCard
            icon="location"
            title="Visit Our Office"
            subtitle="Meet us in person"
            value="22 Al-Sawah Street, Zeitoun, Cairo, Egypt"
            onPress={handleLocation}
            colors={["#10B981", "#059669"]}
          />
        </View>

        {/* 🔹 Contact Form */}
        <View className="mt-10 mb-10">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Send us a Message
          </Text>

          <View className="bg-white rounded-2xl p-5 shadow-md">
            <InputField
              placeholder="First Name *"
              value={formData.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
              field="firstName"
            />
            <InputField
              placeholder="Last Name *"
              value={formData.lastName}
              onChangeText={(text) => handleInputChange("lastName", text)}
              field="lastName"
            />
            <InputField
              placeholder="Email Address *"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              field="email"
            />
            <InputField
              placeholder="Phone Number"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              keyboardType="phone-pad"
              field="phone"
            />
            <InputField
              placeholder="Tell us about your project... *"
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
                colors={
                  isLoading ? ["#9CA3AF", "#6B7280"] : ["#6366F1", "#8B5CF6"]
                }
                className="py-4 items-center rounded-xl"
              >
                {isLoading ? (
                  <View className="flex-row items-center space-x-2">
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className="text-white font-bold">Sending...</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-2 space-x-2">
                    <Text className="text-white font-bold">Send Message</Text>
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
