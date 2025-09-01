import { mainApi } from ".";

export interface Services {
  id?: number;
  type: string;
  data: {
    name: string;
    email: string;
    phone: string;
    whatsapp_number: string;
    details: string;
    options?: string[] | undefined;
    platform?: string;
    social_media_account?: string;
  };
}

const songApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    Services: builder.mutation<Services[], Services>({
      query: (body) => ({
        url: `/services`,
        method: "GET",
        data: body,
      }),
    }),
  }),
});

export const { useServicesMutation } = songApi;
