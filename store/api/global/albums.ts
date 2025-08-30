import { mainApi } from ".";

export interface Albums {
  id: string;
  details: string;
  division: string;
  email: string;
  name: string;
  number: string;
  profile_image: string;
  social_links: string;
  songs: {
    id: 82;
    title: string;
    cover_path: string;
    song_path: string;
  }[];
  user_id: string;
  whatsapp_number: string;
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
