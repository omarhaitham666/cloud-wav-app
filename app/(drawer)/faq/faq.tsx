import CustomHeader from "@/components/CustomHeader";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View className="bg-purple-800 rounded-lg mb-4 p-4">
      <TouchableOpacity
        onPress={toggleExpand}
        className="flex-row justify-between items-center"
      >
        <Text className="text-white text-base font-semibold flex-1">
          {question}
        </Text>
        <Ionicons
          name={expanded ? "remove-circle-outline" : "add-circle-outline"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
      {expanded && (
        <Text className="text-white mt-2 text-sm leading-relaxed">
          {answer}
        </Text>
      )}
    </View>
  );
};

const FAQPage = () => {
  return (
    <ScrollView className="flex-1  bg-white ">
      <View className=" mb-6 ">
        <CustomHeader showLanguageSwitcher />
      </View>
      <View className="px-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-center text-black">
            Frequently Asked Questions (FAQ)
          </Text>
          <Text className="text-center text-sm text-gray-600 mt-1">
            For advertising, music production, platform services, and more.
          </Text>
        </View>

        <FAQItem
          question="What is CloudWav Production?"
          answer="CloudWav Production is a digital platform offering professional services like advertising, music production, platform management, and video production."
        />
        <FAQItem
          question="How can I create an account on the website?"
          answer="Click 'Sign Up', enter details, choose account type, agree to terms, verify your email, then manage your profile."
        />
        <FAQItem
          question="How does the artist account work on the platform?"
          answer="Upload/manage your songs, access streaming, request production support, receive events/gig offers."
        />
        <FAQItem
          question="How can I request a dedication video or advertisement from an artist?"
          answer="Select artist, choose video type, fill details (name/message), make payment, and receive within specified time."
        />
        <FAQItem
          question="Can I book an artist for an event or occasion?"
          answer="Choose event type, submit request with date/location/details. You'll be contacted to finalize pricing."
        />
        <FAQItem
          question="How can I benefit from artistic and music production services?"
          answer="Choose service, submit project (style/budget), and connect with top professionals."
        />
        <FAQItem
          question="How do social media services and platform management work?"
          answer="Includes account management, paid ads, growth strategy, copyright protection, and digital rights."
        />
        <FAQItem
          question="How can I pay for services?"
          answer="Payments via Visa/Mastercard, Vodafone Cash (select countries), and bank transfer. Encrypted for security."
        />
        <FAQItem
          question="Can I get a refund after purchasing a service?"
          answer="Payments are non-refundable unless a technical issue prevents service delivery."
        />
        <FAQItem
          question="How can I sign a contract with CloudWav Production as an artist?"
          answer="Submit application and previous work. Upon approval, a contract will be signed with benefits and rules."
        />
        <FAQItem
          question="How can I contact customer support?"
          answer="Email: support@cloudwavproduction.com, contact form, or live chat (if available)."
        />
        <FAQItem
          question="What happens if my account gets suspended?"
          answer="Accounts may be suspended for ToS violations or suspicious activity. Appeals can be submitted via support."
        />

        <View className="bg-gray-100 p-5 mt-6 rounded-lg">
          <Text className="text-base font-semibold mb-2 text-black">
            * Tips for using CloudWav Production professionally:
          </Text>
          <Text className="text-sm text-gray-700 leading-relaxed">
            - Always check your email for updates.{"\n"}- Use production, paid
            video, and media services to boost projects.{"\n"}- Contact support
            for additional inquiries.
          </Text>
        </View>

        <View className="bg-red-100 p-4 mt-4 rounded-lg">
          <Text className="text-base font-bold mb-1 text-red-700">
            Legal warning:
          </Text>
          <Text className="text-sm text-gray-800">
            Violating platform rules may lead to suspension or closure. Payments
            are non-refundable except in stated cases. CloudWav may update terms
            without prior notice.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(drawer)/contact/contact")}
          className="mt-6 mb-16 bg-green-600 py-3 rounded-full"
        >
          <Text className="text-center text-white text-base font-bold">
            Contact Us
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FAQPage;
