import { useGetUserQuery } from "@/store/api/user/user";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FamousArtistRequestModal from "./modals/FamousArtistRequestModal";

const BannerMusic = () => {
  const { t } = useTranslation();
  const [famousArtistModalVisible, setFamousArtistModalVisible] =
    useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;
  const { data: userData } = useGetUserQuery();

  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    breathe.start();
    return () => breathe.stop();
  }, [opacityAnim, scaleAnim]);

  const handleFamousArtistPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    setFamousArtistModalVisible(true);
  };

  return (
    <View className="h-48 w-full mb-4">
      <ImageBackground
        source={require("../assets/images/bg-song-dateais.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
        imageStyle={{ borderRadius: 16 }}
      >
        <View className="flex-1 bg-black/40 justify-around px-4 py-3 rounded-2xl">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold mb-1">
                Welcome Back
              </Text>
              <Text className="text-white text-sm opacity-90">
                Discover music that fits your vibe.
              </Text>
            </View>

            {!userData?.artist_id && (
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                }}
              >
                <TouchableOpacity
                  onPress={handleFamousArtistPress}
                  className="ml-4"
                  activeOpacity={0.7}
                >
                  <View className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 border border-white/30">
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#FCD34D" />
                      <Text
                        className="text-white text-xs ml-1"
                        style={{
                          fontFamily: AppFonts.medium,
                        }}
                      >
                        Become A Artist
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
      </ImageBackground>

      <FamousArtistRequestModal
        visible={famousArtistModalVisible}
        onClose={() => setFamousArtistModalVisible(false)}
      />
    </View>
  );
};

export default BannerMusic;
