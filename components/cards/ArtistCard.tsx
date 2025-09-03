import { Link } from "expo-router";
import { Image, Text, View } from "react-native";

const ArtistCard = ({
  name,
  imageUrl,
  id,
}: {
  name: string;
  imageUrl: string;
  id: string;
}) => {
  return (
    <Link href={`/(drawer)/artist/${id}`}>
      <View className="mr-4 items-center">
        <Image
          source={{ uri: imageUrl }}
          className="w-24 h-24 rounded-full border-4 border-white"
        />
        <Text className="text-lg text-center mt-2">{name}</Text>
      </View>
    </Link>
  );
};

export default ArtistCard;
