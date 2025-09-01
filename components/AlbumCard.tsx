import { Image, Text, View } from "react-native";

const AlbumCard = ({
  title,
  imageUrl,
  id,
  artistName,
}: {
  title: string;
  imageUrl: string;
  id: string;
  artistName?: string;
}) => {
  return (
    <View className="mr-4 items-center">
      <Image source={{ uri: imageUrl }} className="w-32 h-32 rounded-lg" />
      <Text className="text-sm text-center mt-2">{title}</Text>
      <Text className="text-xs text-center mt-1">{artistName}</Text>
    </View>
  );
};

export default AlbumCard;
