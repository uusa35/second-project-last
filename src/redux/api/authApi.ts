import { apiSlice } from './index';
import {
  AppointmentHistory,
  AppQueryResult,
  Auth,
  PreviousOrder,
  StoreProps,
} from '@/types/queries';
import { Locale } from '@/types/index';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      AppQueryResult<Auth>,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: `login`,
        method: `POST`,
        body,
        validateStatus: (response, result) => response.status === 200,
      }),
    }),
    updateAvatar: builder.mutation<
      AppQueryResult<any>,
      {
        country: string;
        formdata: any;
        token: string;
      }
    >({
      query: ({ country, formdata, token }) => ({
        url: `update-avatar`,
        method: `POST`,
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    updateAccountSettings: builder.mutation<
      AppQueryResult<Auth>,
      {
        token: string;
        country: string;
        body: any;
      }
    >({
      query: ({ token, country, body }) => ({
        url: `account-setting`,
        method: `POST`,
        body,
        headers: {
          Authorization: `Bearer ${token}`,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    resetPassword: builder.mutation<
      AppQueryResult<Auth>,
      {
        country: string;
        token: string;
        body: any;
      }
    >({
      query: ({ country, token, body }) => ({
        url: `change-password`,
        method: `POST`,
        body,
        headers: {
          Authorization: `Bearer ${token}`,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    getOrderHistory: builder.query<
      AppQueryResult<PreviousOrder[]>,
      {
        country: string;
        token: string;
      }
    >({
      query: ({ country, token }) => ({
        url: `store/order-history`,
        headers: {
          Authorization: `Bearer ${token}`,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    getSportAppointmentHistory: builder.query<
      AppQueryResult<AppointmentHistory[]>,
      {
        country: string;
        token: string;
      }
    >({
      query: ({ country, token }) => ({
        url: `venue/appointment-history`,
        headers: {
          Authorization: `Bearer ${token}`,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    getSubscriptionAppointmentHistory: builder.query<
      AppQueryResult<AppointmentHistory[]>,
      {
        country: string;
        token: string;
      }
    >({
      query: ({ country, token }) => ({
        url: `subscription/booking-history`,
        headers: {
          Authorization: `Bearer ${token}`,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    getClassAppointmentHistory: builder.query<
      AppQueryResult<AppointmentHistory[]>,
      {
        country: string;
        token: string;
      }
    >({
      query: ({ country, token }) => ({
        url: `class/booking-history`,
        headers: {
          Authorization: `Bearer ${token}`,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),

    forgetPassword: builder.mutation<
      AppQueryResult<any>,
      {
        email: string;
      }
    >({
      query: ({ email }) => ({
        url: `forget-password`,
        method: `POST`,
        body: { email: email },
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
    }),

    register: builder.mutation<
      AppQueryResult<Auth>,
      {
        country: string;
        body: any;
      }
    >({
      query: ({ body, country }) => ({
        url: `register`,
        method: `POST`,
        body,
        headers: {
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
    }),
    MobileVerification: builder.mutation<
      AppQueryResult<Auth>,
      {
        country: string;
        body: any;
      }
    >({
      query: ({ body, country }) => ({
        url: `send-otp`,
        method: `POST`,
        body,
        headers: {
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
    }),

    OtpVerification: builder.mutation<
      AppQueryResult<Auth>,
      {
        body: any;
      }
    >({
      query: ({ body }) => ({
        url: `verify-code`,
        method: `POST`,
        body,
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
    }),
  }),
});

export const {
  useUpdateAvatarMutation,
  useUpdateAccountSettingsMutation,
  useLoginMutation,
  useGetOrderHistoryQuery,
  useForgetPasswordMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useGetClassAppointmentHistoryQuery,
  useGetSportAppointmentHistoryQuery,
  useGetSubscriptionAppointmentHistoryQuery,
  useMobileVerificationMutation,
  useOtpVerificationMutation,
} = authApi;
