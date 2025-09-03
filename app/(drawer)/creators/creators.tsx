import CreatorCard from "@/components/cards/CreatorCard";
import CreatorRegister from "@/components/modals/CreatorRegisterModal";
import {
  useTopVideoCreatorsAllQuery,
  useTopVideoCreatorsQuery,
} from "@/store/api/global/videoCreator";
import { creatorCategories } from "@/utils/data";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Creators = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { data, isLoading: allCreatorsIsLoading } =
    useTopVideoCreatorsAllQuery();
  const { data: creatorsData, isLoading: creatorsIsLoading } =
    useTopVideoCreatorsQuery();

  const handleCategoryPress = (category: {
    id: number;
    title: string;
    image: string;
  }) => {
    console.log("Selected category:", category.title);
  };

  const handleJoinPress = () => {
    setVisible(true);
  };

  const handleSearchPress = () => {
    router.push("/search");
  };

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 py-8">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-gray-900">
              Explore Creators
            </Text>
            <TouchableOpacity onPress={handleSearchPress}>
              <Ionicons name="search" size={28} color="#111" />
            </TouchableOpacity>
          </View>
          <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Personalized videos from your favorite stars
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          >
            {creatorCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category)}
                className="items-center mx-3"
              >
                <View className="w-20 h-20 rounded-full bg-gray-600 mb-2 overflow-hidden shadow-lg">
                  <Image
                    source={{ uri: category.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <Text className="text-sm font-semibold text-gray-900 text-center">
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View className="items-center mt-10">
            <TouchableOpacity
              onPress={handleJoinPress}
              className="w-20 h-20 rounded-full bg-gray-600 items-center justify-center mb-4 shadow-lg"
            >
              <View className="w-8 h-0.5 bg-white" />
              <View className="w-0.5 h-8 bg-white absolute" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">Join us</Text>
          </View>
        </View>
        <View className="my-8 px-6">
          <View className="my-5">
            <Text className="text-lg font-semibold text-gray-900">
              VIP Creators
            </Text>
            {allCreatorsIsLoading ? (
              <View className="flex-1 justify-center items-center my-8">
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <FlatList
                data={data}
                keyExtractor={(item) => item.id?.toString() ?? ""}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <CreatorCard
                    id={item.id?.toString() ?? ""}
                    image={
                      "https://api.cloudwavproduction.com/storage/" +
                      item.profile_image
                    }
                    name={item.name}
                    price={item.private_price.toString()}
                    bussiness_price={item.bussiness_price.toString()}
                  />
                )}
              />
            )}
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-900">
              Top Creators
            </Text>
            {creatorsIsLoading ? (
              <View className="flex-1 justify-center items-center my-8">
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <FlatList
                data={creatorsData}
                keyExtractor={(item) => item.id?.toString() ?? ""}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <CreatorCard
                    id={item.id?.toString() ?? ""}
                    image={
                      "https://api.cloudwavproduction.com/storage/" +
                      item.profile_image
                    }
                    name={item.name}
                    price={item.private_price.toString()}
                    bussiness_price={item.bussiness_price.toString()}
                  />
                )}
              />
            )}
          </View>
        </View>
        <CreatorRegister visible={visible} onClose={() => setVisible(false)} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Creators;
