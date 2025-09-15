import { mainApi } from "./index";

export interface FamousArtistRequest {
  famous_name: string;
  famous_email: string;
  famous_number: string;
  famous_whatsapp_number: string;
  famous_details: string;
  famous_id_card_image: string;
  famous_profile_image: string;
  famous_division: string;
  famous_social_links: string;
}

export interface FamousArtistRequestResponse {
  message: string;
  success: boolean;
  data?: FamousArtistRequest;
}

const famousArtistApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createFamousArtistRequest: builder.mutation<
      FamousArtistRequestResponse,
      FormData
    >({
      query: (formData) => ({
        url: "famous-artist-requests",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),
  }),
});

export const { useCreateFamousArtistRequestMutation } = famousArtistApi;
