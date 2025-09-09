import { mainApi } from ".";

// Service type enum values
export type ServiceType = 
  | "verify social media accounts"
  | "recover social media account"
  | "Sponsored ads"
  | "platform management"
  | "artist_service";

export interface Services {
  id?: number;
  type: ServiceType;
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
      query: (body) => {
        return {
          url: `/services`,
          method: "POST",
          data: body,
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useServicesMutation } = songApi;
