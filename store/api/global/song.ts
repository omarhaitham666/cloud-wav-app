import { mainApi } from ".";

export interface Songs {
  id: number;
  title: string;
  artist: string;
  likes_count?: null;
  audio_url: string;
  cover_url: string;
  division?: string;
  isLiked?: boolean;
  plays?: number;
  debug_path?: string;
  cover_image?: string;
  artist_name?: string;
  song_url?: string;
}

const songApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrendSong: builder.query<Songs[], void>({
      query: () => ({
        url: `/trendingSongs`,
        method: "GET",
      }),
    }),
    getSongs: builder.query<Songs[], void>({
      query: () => ({
        url: `/Songs`,
        method: "GET",
      }),
    }),
    getSong: builder.query<Songs, string>({
      query: (id) => ({
        url: `/songs/${id}`,
        method: "GET",
      }),
    }),
    getSongStreem: builder.query<Songs, string>({
      query: (id) => ({
        url: `/songs/${id}/stream`,
        method: "GET",
        responseType: "blob",
      }),
    }),
    getSongByDivision: builder.query<Songs, string>({
      query: (name) => ({
        url: `/songs/division/${name}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetTrendSongQuery,
  useGetSongsQuery,
  useGetSongQuery,
  useGetSongByDivisionQuery,
  useGetSongStreemQuery,
} = songApi;
