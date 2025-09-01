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
const songApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getalbums: builder.query<Albums[], void>({
      query: () => ({
        url: `/albums`,
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

export const { useGetalbumsQuery, useGetTrendalbumsQuery } = songApi;
