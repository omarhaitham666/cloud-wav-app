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
  }),
});

export const { useGetalbumsQuery, useGetalbumQuery, useGetTrendalbumsQuery } =
  songApi;
