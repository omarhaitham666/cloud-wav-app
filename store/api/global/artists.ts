import { mainApi } from ".";

export interface Artists {
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
  albums: [];
  user_id: string;
  whatsapp_number: string;
}

const songApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getArtists: builder.query<Artists[], void>({
      query: () => ({
        url: `/artists`,
        method: "GET",
      }),
    }),
    getArtist: builder.query<Artists, string>({
      query: (id) => ({
        url: `/Artists/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetArtistsQuery, useGetArtistQuery } = songApi;
