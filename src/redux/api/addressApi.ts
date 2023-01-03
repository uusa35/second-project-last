import { apiSlice } from './index';
import { AppQueryResult, Area, Country } from '@/types/queries';
import { Cart, Locale } from '@/types/index';

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddressFields: builder.query<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
      }
    >({
      query: ({ country, lang }) => ({
        url: `address-field`,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),

    getAllAddresses: builder.query<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
        token: string;
      }
    >({
      query: ({ country, token, lang }) => ({
        url: `address/index`,
        headers: {
          'Accept-Language': lang,
          country,
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),

    getAddress: builder.query<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
        token: string;
        params: any;
      }
    >({
      query: ({ country, token, lang, params }) => ({
        url: `address/index`,
        params: params,
        headers: {
          'Accept-Language': lang,
          country,
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),

    createAddress: builder.mutation<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
        token: string;
        body: any;
      }
    >({
      query: ({ country, token, lang, body }) => ({
        url: `address/store`,
        method: `POST`,
        body,
        headers: {
          'Accept-Language': lang,
          country,
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),

    updateAddress: builder.mutation<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
        token: string;
        id: number | string;
        body: any;
      }
    >({
      query: ({ country, token, lang, id, body }) => ({
        url: `address/update/${id}`,
        method: `POST`,
        body,
        headers: {
          'Accept-Language': lang,
          country,
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),

    deleteAddress: builder.mutation<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
        token: string;
        id: number | string;
      }
    >({
      query: ({ country, token, lang, id }) => ({
        url: `address/delete/${id}`,
        method: `POST`,
        headers: {
          'Accept-Language': lang,
          country,
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
  }),
});

export const {
    useGetAddressFieldsQuery,
    useGetAllAddressesQuery,
    useGetAddressQuery,
    useCreateAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation
} = addressApi;
