import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const GENRES = [
  "Rap",
  "Pop",
  "Blues",
  "Rock",
  "Mahraganat",
  "Jazz",
  "Metal & Heavy Metal",
  "Sonata",
  "Symphony",
  "Orchestra",
  "Concerto",
];

interface Props {
  value?: string;
  onChange: (val: string) => void;
}

const GenreSelect: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="bg-white/10 px-4 py-3 rounded-xl flex-row justify-between items-center"
      >
        <Text className="text-white" style={{ fontFamily: AppFonts.medium }}>
          {value || "Select Genre"}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="white"
        />
      </TouchableOpacity>

      {open && (
        <View className="absolute top-14 left-0 right-0 bg-white rounded-xl shadow-xl max-h-60 z-10">
          <FlatList
            data={GENRES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onChange(item);
                  setOpen(false);
                }}
                className="px-5 py-3 border-b border-gray-200"
              >
                <Text className="text-black">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default GenreSelect;
