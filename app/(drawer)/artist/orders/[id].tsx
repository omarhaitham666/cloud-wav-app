import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import CreatorOrderModal from "@/components/modals/CreatorOrderModal";
import {
    useGetVedioCreatersQuery,
    useGetVediosQuery,
} from "@/store/api/global/videoCreator";
import { useGetUserQuery } from "@/store/api/user/user";

const ArtistProfile = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [modalVisible, setModalVisible] = useState(false);

  const { data, isLoading: isFetching } = useGetVedioCreatersQuery(id);
  const { data: vedios, isLoading } = useGetVediosQuery(id);
  const { data: user } = useGetUserQuery();

  // Check if the current user is trying to order from themselves
  const isOwnProfile = user?.video_creator_id && user.video_creator_id === Number(id);

  if (isFetching) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#f9a826" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={["#4f46e5", "#6d28d9"]}
        className="pt-12 pb-10 px-5"
      >
        <StatusBar barStyle="light-content" />
        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 justify-center items-center"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 justify-center items-center">
            <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View className="items-center mb-6">
          <Image
            source={{
              uri:
                "https://api.cloudwavproduction.com/storage/" +
                data?.profile_image,
            }}
            className="w-36 h-36 rounded-full border-4 border-white"
          />
          <Text className="text-2xl font-bold text-white mt-2">
            {data?.name}
          </Text>
          <Text className="text-sm text-white/90">{data?.division}</Text>

          {!isOwnProfile && (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-green-500 rounded-full px-5 py-3 mt-3 shadow-md"
            >
              <Text className="text-white font-semibold">Order Now →</Text>
            </TouchableOpacity>
          )}

          {isOwnProfile && (
            <View className="bg-gray-500 rounded-full px-5 py-3 mt-3 shadow-md">
              <Text className="text-white font-semibold text-center">
                This is your own profile
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <FlatList
        data={vedios?.videos ?? []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={() => (
          <Text className="text-xl font-bold text-gray-800 mb-4">Videos</Text>
        )}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl shadow-md mb-5 overflow-hidden">
            <Video
              source={{ uri: item.url }}
              useNativeControls
              shouldPlay={false}
              resizeMode={ResizeMode.CONTAIN}
              style={{ width: "100%", height: 220, backgroundColor: "black" }}
            />
            <View className="p-4">
              <Text className="text-lg font-semibold text-gray-900">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {new Date(item.created_at).toDateString()}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() =>
          !isLoading && (
            <Text className="text-center text-gray-500">No videos found</Text>
          )
        }
      />

      {!isOwnProfile && (
        <CreatorOrderModal
          visible={modalVisible}
          id={id}
          name={data?.name ?? ""}
          private_price={String(data?.private_price) ?? "0"}
          bussiness_price={String(data?.bussiness_price) ?? "0"}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

export default ArtistProfile;
