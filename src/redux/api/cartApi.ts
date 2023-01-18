import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { ServerCart, Locale, ProductCart } from '@/types/index';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTempId: builder.query<AppQueryResult<{ Id: string }>, void>({
      query: () => ({
        url: `tempId`,
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    addToCart: builder.mutation<
      AppQueryResult<ServerCart>,
      {
        branchId: any;
        body: { UserAgent: string; Cart: ProductCart[] };
      }
    >({
      query: ({ branchId, body }) => ({
        url: `addToCart`,
        method: `POST`,
        body,
        headers: {
          'x-branch-id': branchId,
        },
        validateStatus: (response, result) => result.status,
      }),
    }),
    GetCartProducts: builder.query<
      AppQueryResult<ServerCart>,
      {
        UserAgent: string;
      }
    >({
      query: ({ UserAgent }) => ({
        url: `shoppingCart`,
        params: { UserAgent },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    checkPromoCode: builder.query<
      AppQueryResult<any>,
      {
        userAgent: string;
        PromoCode: string;
      }
    >({
      query: ({ userAgent, PromoCode }) => ({
        url: `checkPromoCode`,
        params: { userAgent, PromoCode },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    RemoveFromCart: builder.mutation<
      AppQueryResult<any>,
      {
        body: any;
      }
    >({
      query: ({ body }) => ({
        url: `cart/clear/item`,
        method: `POST`,
        body,
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
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
          response.status == 200 && result.status,
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
  useAddToCartMutation,
  useLazyCheckPromoCodeQuery,
  useLazyGetCartProductsQuery,
} = cartApi;
