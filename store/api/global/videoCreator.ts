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

interface videos {
  id: number;
  title: string;
  url: string;
  created_at: string;
}
const songApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    videoCreator: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: `/video-creator-requests`,
        method: "POST",
        data: formData,
        // Don't set Content-Type manually for FormData - let axios handle it
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
    GetVedioCreaters: builder.query<videoCreator, string>({
      query: (id) => ({
        url: `/video-creators/${id}`,
        method: "GET",
      }),
    }),
    UpdatePriceVedioCreaters: builder.mutation<
      videoCreator,
      {
        id: string;
        body: { private_price: number; bussiness_price: number };
      }
    >({
      query: ({ id, body }) => ({
        url: `/videoCreator-update/${id}`,
        method: "PUT",
        data: body,
      }),
    }),
    GetVedios: builder.query<{ videos: videos[] }, string>({
      query: (id) => ({
        url: `/video-creators/${id}/videos`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useVideoCreatorMutation,
  useTopVideoCreatorsQuery,
  useTopVideoCreatorsAllQuery,
  useOrderVideoCreatorsMutation,
  useGetVedioCreatersQuery,
  useUpdatePriceVedioCreatersMutation,
  useGetVediosQuery,
} = songApi;
