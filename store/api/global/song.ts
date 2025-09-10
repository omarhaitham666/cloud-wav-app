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
  isOwner?: boolean;
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
    LikeSong: builder.mutation<Songs, string>({
      query: (id) => ({
        url: `/songs/${id}/like`,
        method: "POST",
      }),
    }),
    getSongByDivision: builder.query<Songs, string>({
      query: (name) => ({
        url: `/songs/division/${name}`,
        method: "GET",
      }),
    }),
    UploadSong: builder.mutation<Songs, FormData>({
      query: (formData) => ({
        url: `/songs/upload`,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [{ type: "Songs", id: "LIST" }],
    }),
    deleteSong: builder.mutation<Songs, string>({
      query: (id) => ({
        url: `/songs-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Songs", id: "LIST" },
        { type: "Artists", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTrendSongQuery,
  useGetSongsQuery,
  useGetSongQuery,
  useGetSongByDivisionQuery,
  useLikeSongMutation,
  useGetSongStreemQuery,
  useUploadSongMutation,
  useDeleteSongMutation,
} = songApi;
