import { mainApi } from "../global";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  profile_image?: string | null;
  role: string;
  request_status: string;
  video_creator_id: null;
  private_price: null;
  bussiness_price: null;
  artist_id: null;
}
export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyCodeRequest {
  email: string;
  password: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface LogoutRequest {
  name: string;
}
export interface ResetPasswordRequest {
  email: string;
  verification_code: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  expires_in: number;
  token_type: string;
}

/** ===== API ===== */
const authApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<{ message: string }, RegisterRequest>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        data: body,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        data: body,
      }),
    }),
    verifyCode: builder.mutation<{ message: string }, VerifyCodeRequest>({
      query: (body) => ({
        url: "/verify-code",
        method: "POST",
        data: body,
      }),
    }),
    forgotPassword: builder.mutation<
      { success: boolean },
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/forgot-password",
        method: "POST",
        data: body,
      }),
    }),
    resetPassword: builder.mutation<{ success: boolean }, ResetPasswordRequest>(
      {
        query: (body) => ({
          url: "/reset-password",
          method: "POST",
          data: body,
        }),
      }
    ),
    logout: builder.mutation<{ success: boolean }, void>({
      query: (body) => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    getUser: builder.query<User, void>({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
    }),
    UpdateUser: builder.mutation<
      User,
      {
        new_name: string;
        email: string;
        password: string;
        type: string;
      }
    >({
      query: (body) => ({
        url: "/update-name",
        method: "POST",
        data: body,
      }),
    }),
    UpdateProfileARTISTORCREATORUser: builder.mutation<
      User,
      | FormData
      | {
          name: string;
          profile_image: any;
          type: string;
        }
    >({
      query: (body) => {
        return {
          url: "/profile-update-request",
          method: "POST",
          data: body,
        };
      },
    }),
  }),

  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyCodeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useUpdateProfileARTISTORCREATORUserMutation,
} = authApi;

export default authApi;
