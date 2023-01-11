import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { Cart, Locale } from '@/types/index';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTempId: builder.query<AppQueryResult<{ Id: string }>, void>({
      query: () => ({
        url: `tempId`,
        validateStatus: (response, result) =>
          response.status == 200 && result.Data.status,
      }),
    }),
    addToCart: builder.mutation<
      AppQueryResult<Cart>,
      {
        lang: Locale['lang'];
        country: string;
        body: any;
      }
    >({
      query: ({ country, body, lang }) => ({
        url: `cart/store`,
        method: `POST`,
        body,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),

    GetCartProducts: builder.query<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
        params: any;
      }
    >({
      query: ({ country, params, lang }) => ({
        url: `cart`,
        params: { ...params },
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),

    RemoveFromCart: builder.mutation<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
        body: any;
      }
    >({
      query: ({ country, body, lang }) => ({
        url: `cart/clear/item`,
        method: `POST`,
        body,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),

    UpdateItemInCart: builder.mutation<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
        body: any;
      }
    >({
      query: ({ country, body, lang }) => ({
        url: `cart/update`,
        method: `POST`,
        body,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
  }),
});

export const {
  useCreateTempIdQuery,
  useLazyCreateTempIdQuery,
  useGetCartProductsQuery,
  useRemoveFromCartMutation,
  useUpdateItemInCartMutation,
} = cartApi;
