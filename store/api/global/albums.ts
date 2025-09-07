import { mainApi } from ".";
import { Songs } from "./song";

export interface Albums {
  title: string;
  artist: {
    id: number;
    name: string;
    profile_image: string;
    division: string;
  };
  id: string;
  album_cover: string;
  songs: Songs[];
}

export interface AlbumsResponse {
  album: {
    id: 34;
    title: string;
    artist: {
      id: 28;
      name: string;
    };
    album_cover: string;
  };
  songs: Songs[];
}
const songApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getalbums: builder.query<Albums[], void>({
      query: () => ({
        url: `/albums`,
        method: "GET",
      }),
    }),
    getalbum: builder.query<AlbumsResponse, string>({
      query: (id) => ({
        url: `/albums/${id}`,
        method: "GET",
      }),
    }),
    getTrendalbums: builder.query<Albums[], void>({
      query: () => ({
        url: `/trending-albums`,
        method: "GET",
      }),
    }),
    AddAlbum: builder.mutation<Albums, { title: string; album_cover: File }>({
      query: (formData) => ({
        url: `/albums`,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [{ type: "Albums", id: "LIST" }],
    }),
    UpdateAlbum: builder.mutation<Albums, string>({
      query: (id) => ({
        url: `/album-update/${id}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Albums", id: "LIST" }],
    }),
    AddSongToAlbum: builder.mutation<Albums, string>({
      query: (id) => ({
        url: `/albums/${id}/songs`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Albums", id: "LIST" }],
    }),
    delteAlbum: builder.mutation<Albums, string>({
      query: (id) => ({
        url: `/albums-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Albums", id: "LIST" }],
    }),
  }),
});

export const {
  useGetalbumsQuery,
  useGetalbumQuery,
  useGetTrendalbumsQuery,
  useAddAlbumMutation,
  useUpdateAlbumMutation,
  useAddSongToAlbumMutation,
  useDelteAlbumMutation,
} = songApi;
