import AlbumCard from "@/components/AlbumCard";
import ArtistCard from "@/components/ArtistCard";
import BannerMusic from "@/components/BannerMusic";
import SectionHeader from "@/components/SectionHeader";
import { SongCard } from "@/components/SongCard";
import {
  Albums,
  useGetalbumsQuery,
  useGetTrendalbumsQuery,
} from "@/store/api/global/albums";
import { Artists, useGetArtistsQuery } from "@/store/api/global/artists";
import {
  Songs,
  useGetSongByDivisionQuery,
  useGetSongsQuery,
  useGetTrendSongQuery,
} from "@/store/api/global/song";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FilterType = "home" | "tsongs" | "tAlbums" | "tAdded";

interface BrowseCategory {
  name: string;
  filter: FilterType;
  data: Songs[] | Albums[] | null | undefined;
}

const { width } = Dimensions.get("window");
const Music = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("home");
  const [activeGenre, setActiveGenre] = useState<string>("All Genres");

  const { data: songs, isLoading: isSongLoading } = useGetSongsQuery();
  const { data: artists, isLoading: isArtistLoading } = useGetArtistsQuery();
  const { data: albums, isLoading: isAlbumLoading } = useGetalbumsQuery();

  const { data: trendSongs, isLoading: isLoadingTrendSongs } =
    useGetTrendSongQuery();
  const { data: trendAlbums, isLoading: isLoadingTrendAlbums } =
    useGetTrendalbumsQuery();

  const { data: songsByDivision, isLoading: isLoadingSongsByDivision } =
    useGetSongByDivisionQuery(activeGenre === "All Genres" ? "" : activeGenre, {
      skip: activeGenre === "All Genres",
    });
  console.log(songsByDivision, "songsByDivision");

  const browseCategories: BrowseCategory[] = [
    { name: "Home", filter: "home", data: null },
    { name: "Trending songs", filter: "tsongs", data: trendSongs },
    { name: "Trending Albums", filter: "tAlbums", data: trendAlbums },
    { name: "Recently Added", filter: "tAdded", data: trendSongs },
  ];

  const genres = [
    "All Genres",
    "Shaapey",
    "Rap",
    "Hip-Hop",
    "Blues",
    "Rock",
    "Mahrgnat",
    "Jazz",
    "Sonata",
    "Symphony",
    "Orchestra",
    "Pop",
  ];

  const filteredSongs = useMemo(() => {
    if (activeGenre === "All Genres") {
      return songs;
    }
    return songsByDivision;
  }, [activeGenre, songs, songsByDivision]);

  const LoadingSpinner = ({ color = "#22c55e" }) => (
    <View className="flex-1 justify-center items-center py-12">
      <ActivityIndicator size="large" color={color} />
    </View>
  );

  const handleFilterPress = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const handleGenrePress = (genre: string) => {
    setActiveGenre(genre);
  };

  const renderSongList = (
    items: Songs | Songs[] | undefined,
    showGenreTitle = false
  ) => {
    const isLoading =
      activeGenre === "All Genres" ? isSongLoading : isLoadingSongsByDivision;

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!items) {
      return (
        <View className="flex items-center justify-center py-10 w-full">
          <Text className="text-gray-500 text-base">
            {activeGenre === "All Genres"
              ? "No songs found"
              : `No ${activeGenre} songs found`}
          </Text>
        </View>
      );
    }

    const songList = Array.isArray(items) ? items : [items];

    return (
      <View className="mb-8">
        {showGenreTitle && (
          <View className=" mb-4">
            <SectionHeader
              title={
                activeGenre === "All Genres"
                  ? "Popular Song"
                  : `${activeGenre} Songs`
              }
            />
          </View>
        )}
        <FlatList
          data={songList}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <SongCard
              id={item.id}
              title={item.title}
              artist={item.artist_name ?? "Unknown Artist"}
              audio_url={item.song_url ?? item.audio_url}
              cover_url={item.cover_url}
            />
          )}
        />
      </View>
    );
  };

  const renderAlbumList = (items: Albums[] | undefined) => {
    if (!items || items.length === 0)
      return (
        <View className="flex items-center justify-center py-10 w-full">
          <Text className="text-gray-500 text-base">No albums found</Text>
        </View>
      );

    return (
      <View className="flex-1">
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          renderItem={({ item }) => (
            <View className="bg-white rounded-xl shadow-sm overflow-hidden">
              <AlbumCard
                id={item.id}
                title={item.title}
                imageUrl={
                  "https://api.cloudwavproduction.com/storage/" +
                  item.album_cover
                }
                artistName={item.artist?.name}
              />
            </View>
          )}
        />
      </View>
    );
  };

  const getFilteredContent = () => {
    const activeCategory = browseCategories.find(
      (cat) => cat.filter === activeFilter
    );

    if (!activeCategory) return null;

    // === HOME ===
    if (activeFilter === "home") {
      return (
        <>
          <View className="mb-8">
            <SectionHeader title="Popular Artists" />
            {isArtistLoading ? (
              <LoadingSpinner />
            ) : artists && artists.length > 0 ? (
              <FlatList
                data={artists}
                keyExtractor={(item: Artists) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                renderItem={({ item }) => (
                  <View className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <ArtistCard
                      name={item.name}
                      imageUrl={item.profile_image}
                      id={item.id}
                    />
                  </View>
                )}
              />
            ) : (
              <View className="flex items-center mx-auto justify-center py-10 w-full">
                <Text className="text-gray-500 text-base">
                  No artists found
                </Text>
              </View>
            )}
          </View>

          <View className="mb-8">
            <SectionHeader title="Popular Albums" />
            {isAlbumLoading ? (
              <LoadingSpinner />
            ) : albums && albums.length > 0 ? (
              <FlatList
                data={(albums as Albums[]) || []}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingBottom: 10,
                }}
                renderItem={({ item }) => (
                  <AlbumCard
                    id={item.id}
                    title={item.title}
                    imageUrl={
                      "https://api.cloudwavproduction.com/storage/" +
                      item.album_cover
                    }
                    artistName={item.artist?.name}
                  />
                )}
              />
            ) : (
              <View className="flex items-center mx-auto justify-center py-10 w-full">
                <Text className="text-gray-500 text-base">No albums found</Text>
              </View>
            )}
          </View>

          {renderSongList(filteredSongs, true)}
        </>
      );
    }

    // === TRENDING SONGS ===
    if (activeFilter === "tsongs" || activeFilter === "tAdded") {
      return (
        <View className="mb-8">
          <SectionHeader title={activeCategory.name} />
          {isLoadingTrendSongs ? (
            <LoadingSpinner />
          ) : (
            renderSongList(trendSongs)
          )}
        </View>
      );
    }

    // === TRENDING ALBUMS ===
    if (activeFilter === "tAlbums") {
      return (
        <View className="mb-8">
          <SectionHeader title={activeCategory.name} />
          {isLoadingTrendAlbums ? (
            <LoadingSpinner />
          ) : (
            renderAlbumList(trendAlbums)
          )}
        </View>
      );
    }

    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">No content available</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View className="mb-2">
          <BannerMusic />
        </View>

        <View className="px-5 mb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-6">Browse</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {browseCategories.map((category, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleFilterPress(category.filter)}
                className={`${
                  activeFilter === category.filter
                    ? "bg-green-500"
                    : "bg-gray-50 border-gray-200"
                } border rounded-full px-5 py-2.5 mr-3 shadow-sm`}
                style={{
                  shadowColor:
                    activeFilter === category.filter ? "#22c55e" : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: activeFilter === category.filter ? 0.3 : 0.1,
                  shadowRadius: 4,
                  elevation: activeFilter === category.filter ? 6 : 2,
                }}
              >
                <Text
                  className={`text-sm font-medium ${
                    activeFilter === category.filter
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Genres - Always visible */}
        <View className="mb-8">
          <View className="px-5 mb-4">
            <Text className="text-2xl font-bold text-gray-900">Genres</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {genres.map((genre, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleGenrePress(genre)}
                className={`${
                  activeGenre === genre
                    ? "bg-green-500"
                    : "bg-gray-50 border-gray-200"
                } border rounded-full px-5 py-2.5 mr-3 shadow-sm`}
                style={{
                  shadowColor: activeGenre === genre ? "#22c55e" : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: activeGenre === genre ? 0.3 : 0.1,
                  shadowRadius: 4,
                  elevation: activeGenre === genre ? 6 : 2,
                }}
              >
                <Text
                  className={`text-sm font-medium ${
                    activeGenre === genre ? "text-white" : "text-gray-600"
                  }`}
                >
                  {genre}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="px-0">{getFilteredContent()}</View>
      </ScrollView>
    </View>
  );
};

export default Music;
