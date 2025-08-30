import { ImageBackground, Text, View } from "react-native";
import CustomHeader from "./CustomHeader";

const BannerMusic = () => {
  return (
    <View className="h-52 w-full mb-6">
      <ImageBackground
        source={require("../assets/images/bg-song-dateais.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
        imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="mt-1">
            <CustomHeader transparent showLanguageSwitcher colorIcon="#fff" />
          </View>
          <Text className="text-white text-3xl font-bold">Welcome Back</Text>
          <Text className="text-white text-lg mt-2">
            Discover music that fits your vibe 🎶
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default BannerMusic;
