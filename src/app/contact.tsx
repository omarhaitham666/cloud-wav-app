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
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.message
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
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
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
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
    <TouchableOpacity onPress={onPress} className="mb-3 rounded-2xl shadow-md">
      <LinearGradient
        colors={colors}
        className="flex-row items-center p-4 rounded-2xl"
      >
        <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
          <Ionicons name={icon as any} size={24} color="#fff" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-white font-bold text-base mb-1">{title}</Text>
          <Text className="text-white/80 text-xs mb-1">{subtitle}</Text>
          <Text className="text-white font-medium text-sm">{value}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );

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
      className={`mb-4 rounded-xl border ${
        focusedField === field
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-200 bg-gray-100"
      }`}
    >
      <TextInput
        className={`px-4 py-3 text-base text-gray-900 ${
          multiline ? "h-24 text-top" : ""
        }`}
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
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      {/* Header */}
      <LinearGradient
        colors={["#6366F1", "#8B5CF6", "#EC4899"]}
        className="pt-5 pb-8 px-5 relative"
      >
        <View className="items-center">
          <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-4">
            <Ionicons name="chatbubble-ellipses" size={32} color="#fff" />
          </View>
          <Text className="text-2xl font-bold text-white mb-2">
            Get in Touch
          </Text>
          <Text className="text-base text-white/90 text-center leading-5">
            We&apos;re here to help you bring your ideas to life
          </Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View className="flex-row justify-around bg-white -mt-4 mx-2 py-5 rounded-2xl shadow-md">
          <View className="items-center">
            <Ionicons name="time" size={20} color="#6366F1" />
            <Text className="text-xs text-gray-500 font-semibold mt-2">
              24/7 Support
            </Text>
          </View>
          <View className="items-center">
            <Ionicons name="star" size={20} color="#6366F1" />
            <Text className="text-xs text-gray-500 font-semibold mt-2">
              5★ Rating
            </Text>
          </View>
          <View className="items-center">
            <Ionicons name="flash" size={20} color="#6366F1" />
            <Text className="text-xs text-gray-500 font-semibold mt-2">
              Fast Response
            </Text>
          </View>
        </View>

        {/* Contact Methods */}
        <View className="mt-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Contact Methods
          </Text>

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

        {/* Contact Form */}
        <View className="mt-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Send us a Message
          </Text>

          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <InputField
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChangeText={(text) => handleInputChange("firstName", text)}
                  field="firstName"
                />
              </View>
              <View className="flex-1">
                <InputField
                  placeholder="Last Name *"
                  value={formData.lastName}
                  onChangeText={(text) => handleInputChange("lastName", text)}
                  field="lastName"
                />
              </View>
            </View>

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
              className="mt-2 rounded-xl overflow-hidden"
            >
              <LinearGradient
                colors={
                  isLoading ? ["#9CA3AF", "#6B7280"] : ["#6366F1", "#8B5CF6"]
                }
                className="py-4 items-center rounded-xl"
              >
                {isLoading ? (
                  <View className="flex-row items-center space-x-3">
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className="text-white font-bold">Sending...</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center space-x-2">
                    <Ionicons name="send" size={20} color="#fff" />
                    <Text className="text-white font-bold">Send Message</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-8 mb-8">
          <TouchableOpacity className="rounded-2xl shadow-md overflow-hidden">
            <LinearGradient
              colors={["#EC4899", "#EF4444"]}
              className="flex-row items-center p-5 rounded-2xl"
            >
              <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center">
                <Ionicons name="chatbubbles" size={28} color="#fff" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-lg font-bold text-white mb-1">
                  Start Live Chat
                </Text>
                <Text className="text-sm text-white/90">
                  Get instant answers to your questions
                </Text>
              </View>
              <View className="bg-white/20 px-4 py-2 rounded-lg">
                <Text className="text-white font-semibold text-sm">
                  Chat Now
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Contact;
