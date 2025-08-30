import { PricingPlan } from "@/utils/data";
import { Check } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export const PricingCard = ({
  isYearly,
  plan,
}: {
  isYearly: boolean;
  plan: PricingPlan;
}) => {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const period = isYearly ? "/Year" : "/Mo";

  return (
    <View
      className={`bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden ${
        plan.isPopular
          ? "border-2 border-violet-500 scale-105"
          : "border border-gray-100"
      }`}
      style={{
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      }}
    >
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          {plan.name}
        </Text>

        <View className="flex-row items-baseline mb-4">
          <Text className="text-3xl font-semibold text-gray-800">$</Text>
          <Text className="text-5xl font-bold text-gray-800">{price}</Text>
          <Text className="text-lg text-gray-500 ml-2">{period}</Text>
        </View>

        {isYearly && (
          <View className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <Text className="text-green-700 text-sm font-medium text-center">
              💰 Save ${plan.monthlyPrice * 12 - plan.yearlyPrice} per year
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        className={`rounded-2xl py-4 mb-6 bg-gray-50 border border-gray-200  `}
        activeOpacity={0.7}
      >
        <Text className={`text-center text-base font-bold text-gray-700  `}>
          Get Started
        </Text>
      </TouchableOpacity>

      <View className="gap-4">
        {plan.features.map((feature, index) => (
          <View key={index} className="flex-row items-start gap-3">
            <View className="w-6 h-6 rounded-full bg-violet-100 items-center justify-center mt-0.5">
              <Check size={16} color="#8B5CF6" strokeWidth={2.5} />
            </View>
            <Text className="flex-1 text-sm text-gray-700 leading-6">
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
