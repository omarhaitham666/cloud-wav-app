import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CreatorOrderModal from "../modals/CreatorOrderModal";

const CreatorCard = ({
  image,
  name,
  id,
  price,
  bussiness_price,
}: {
  id: string;
  image: string;
  name: string;
  price: string;
  bussiness_price: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <View className="bg-white rounded-xl my-2 shadow-md p-3">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(drawer)/artist/orders/[id]",
              params: { id: id },
            })
          }
        >
          <Image
            source={{
              uri: image,
            }}
            className="w-full h-40 rounded-lg"
            resizeMode="cover"
          />
          <Text className="text-lg font-bold mt-3">{name}</Text>
          <Text className="text-purple-600 font-semibold mt-1">{price}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-green-500 rounded-full py-3 mt-3"
        >
          <Text className="text-white text-center font-semibold">
            Order Now →
          </Text>
        </TouchableOpacity>
      </View>
      <CreatorOrderModal
        visible={modalVisible}
        id={id}
        name={name}
        private_price={price}
        bussiness_price={bussiness_price}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default CreatorCard;
