import { mainApi } from ".";

export interface ContactMessage {
  first_name: string;
  last_name: string;
  email: string;
  message: string;
  phone: string;
}

const contactApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<void, ContactMessage>({
      query: (body) => ({
        url: `/send-message`,
        method: "POST",
        data: body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useSendMessageMutation } = contactApi;