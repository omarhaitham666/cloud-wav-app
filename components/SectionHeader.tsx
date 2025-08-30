import { Text, TouchableOpacity, View } from "react-native";

const SectionHeader = ({
  title,
  showViewAll = false,
}: {
  title: string;
  showViewAll: boolean;
}) => (
  <View className="flex-row justify-between items-center mb-4 px-5">
    <Text className="text-2xl font-bold text-gray-900">{title}</Text>
    {showViewAll && (
      <TouchableOpacity>
        <Text className="text-green-600 font-semibold text-sm">View All</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default SectionHeader;
