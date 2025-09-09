import CreatorCard from "@/components/cards/CreatorCard";
import CreatorRegister from "@/components/modals/CreatorRegisterModal";
import {
  useTopVideoCreatorsAllQuery,
  useTopVideoCreatorsQuery,
} from "@/store/api/global/videoCreator";
import { creatorCategories } from "@/utils/data";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
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

    const categoryMap: { [key: string]: string } = {
      Actors: "actor",
      Musicians: "musician",
      "Content Creators": "content",
      Youtubers: "youtuber",
      Athlete: "athlete",
      "Public Figure": "public",
      Tiktokers: "tiktoker",
    };

    const searchCategory = categoryMap[category.title] || "all";

    router.push({
      pathname: "/search",
      params: { category: searchCategory },
    });
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
        <View className="px-6 pb-8 py-16">
          <View
            className={`flex-row items-center justify-between mb-6 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Text
              className="text-2xl text-gray-900"
              style={{
                fontFamily: AppFonts.semibold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("creators.title")}
            </Text>
            <TouchableOpacity onPress={handleSearchPress}>
              <Ionicons name="search" size={28} color="#111" />
            </TouchableOpacity>
          </View>
          <Text
            className="text-lg text-gray-700 mb-4 text-center"
            style={{
              fontFamily: AppFonts.semibold,
              textAlign: "center",
            }}
          >
            {t("creators.subtitle")}
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
                <Text
                  className="text-sm text-gray-900 text-center"
                  style={{
                    fontFamily: AppFonts.semibold,
                    textAlign: "center",
                  }}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View className="items-center mt-10">
            <View className="flex-row gap-6 items-center">
              <View className="items-center">
                <TouchableOpacity
                  onPress={handleJoinPress}
                  className="w-20 h-20 rounded-full bg-gray-600 items-center justify-center mb-4 shadow-lg"
                >
                  <View className="w-8 h-0.5 bg-white" />
                  <View className="w-0.5 h-8 bg-white absolute" />
                </TouchableOpacity>
                <Text
                  className="text-lg text-gray-900"
                  style={{
                    fontFamily: AppFonts.semibold,
                    textAlign: "center",
                  }}
                >
                  {t("creators.joinUs")}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="my-8 px-6">
          <View className="my-5">
            <Text
              className="text-lg text-gray-900"
              style={{
                fontFamily: AppFonts.semibold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("creators.vipCreators")}
            </Text>
            {allCreatorsIsLoading ? (
              <View className="flex-1 justify-center items-center my-8">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text
                  className="text-gray-600 mt-2"
                  style={{
                    fontFamily: AppFonts.semibold,
                    textAlign: "center",
                  }}
                >
                  {t("creators.loading")}
                </Text>
              </View>
            ) : (
              <FlatList
                data={data}
                keyExtractor={(item) => item.id?.toString() ?? ""}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
                ItemSeparatorComponent={() => <View className="w-4" />}
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
            <Text
              className="text-lg text-gray-900"
              style={{
                fontFamily: AppFonts.semibold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("creators.topCreators")}
            </Text>
            {creatorsIsLoading ? (
              <View className="flex-1 justify-center items-center my-8">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text
                  className="text-gray-600 mt-2"
                  style={{
                    fontFamily: AppFonts.semibold,
                    textAlign: "center",
                  }}
                >
                  {t("creators.loading")}
                </Text>
              </View>
            ) : (
              <FlatList
                data={creatorsData}
                keyExtractor={(item) => item.id?.toString() ?? ""}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
                ItemSeparatorComponent={() => <View className="w-4" />}
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
