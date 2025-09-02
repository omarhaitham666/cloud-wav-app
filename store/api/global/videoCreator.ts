import { mainApi } from ".";

export interface videoCreator {
  id?: number;
  user_id?: number;
  name: string;
  email: string;
  number: string;
  whatsapp_number: string;
  division: string;
  social_links: string;
  details: string;
  private_price: number;
  bussiness_price: number;
  profile_image: File | string;
  id_card: File;
  created_at?: string;
  updated_at?: string;
  user?: {
    id?: number;
    name?: string;
    email?: string;
    email_verified_at?: string;
    role?: string;
    two_factor_secret?: null;
    two_factor_recovery_codes?: null;
    two_factor_confirmed_at: null;
    refresh_token?: string;
    created_at?: string;
    updated_at?: string;
    refresh_token_expires_at?: string;
    verification_code: null;
    google_id?: string;
    verification_code_email: null;
    request_status?: string;
  };
}

interface Order {
  video_creator_id?: number;
  order_name?: string;
  order_email?: string;
  phone?: string;
  whatsapp?: string;
  order_details?: string;
  order_type?: "private" | "business";
  order_mas?: string;
  private_price?: number;
  bussiness_price?: number;
  order_artistName?: string;
}
const songApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    videoCreator: builder.mutation<videoCreator[], videoCreator>({
      query: (body) => ({
        url: `/video-creator-requests`,
        method: "POST",
        data: body,
      }),
    }),
    topVideoCreatorsAll: builder.query<videoCreator[], void>({
      query: () => ({
        url: `/top-video-creators-all`,
        method: "GET",
      }),
    }),
    topVideoCreators: builder.query<videoCreator[], void>({
      query: () => ({
        url: `/top-video-creators`,
        method: "GET",
      }),
    }),

    OrderVideoCreators: builder.mutation<videoCreator[], Order>({
      query: (body) => ({
        url: `/orders`,
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const {
  useVideoCreatorMutation,
  useTopVideoCreatorsQuery,
  useTopVideoCreatorsAllQuery,
  useOrderVideoCreatorsMutation,
} = songApi;
