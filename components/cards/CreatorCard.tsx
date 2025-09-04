import { AppFonts } from "@/utils/fonts";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Image, Text, TouchableOpacity, View } from "react-native";
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
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View className="w-48">
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
          <Text 
            className="text-lg font-bold mt-3" 
            numberOfLines={1}
            style={{ 
              fontFamily: AppFonts.semibold,
              textAlign: isRTL ? 'right' : 'left'
            }}
          >
            {name}
          </Text>
          <View className={`flex-row items-center mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Text 
              className="text-purple-600 font-semibold text-sm"
              style={{ fontFamily: AppFonts.semibold }}
            >
              ${price}
            </Text>
            <Text 
              className="text-gray-400 text-xs mx-1"
              style={{ fontFamily: AppFonts.semibold }}
            >
              •
            </Text>
            <Text 
              className="text-gray-500 text-xs"
              style={{ fontFamily: AppFonts.semibold }}
            >
              {t('creators.private')}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-green-500 rounded-full py-3 mt-3"
        >
          <View className={`flex-row items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Text 
              className="text-white font-semibold"
              style={{ fontFamily: AppFonts.semibold }}
            >
              {t('creators.orderNow')}
            </Text>
            <ChevronRight 
              size={18} 
              color="#fff" 
              style={{ marginLeft: isRTL ? 0 : 4, marginRight: isRTL ? 4 : 0 }} 
            />
          </View>
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
