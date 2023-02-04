import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { ServerCart } from '@/types/index';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTempId: builder.query<
      AppQueryResult<{ Id: string }>,
      { url: string }
    >({
      query: ({ url }) => ({
        url: `tempId`,
        headers: {
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
      keepUnusedDataFor: 0,
    }),
    addToCart: builder.mutation<
      AppQueryResult<ServerCart>,
      {
        body: { UserAgent: string; Cart: any };
        process_type: string;
        area_branch: string;
        url: string;
      }
    >({
      query: ({ body, process_type, area_branch, url }) => ({
        url: `addToCart`,
        method: `POST`,
        body,
        headers: {
          ...(process_type === 'delivery' && { 'x-area-id': area_branch }),
          ...(process_type === 'pickup' && { 'x-branch-id': area_branch }),
          url,
        },
        validateStatus: (response, result) => result.status,
        keepUnusedDataFor: 0,
      }),
      invalidatesTags: ['Cart'],
    }),
    GetCartProducts: builder.query<
      AppQueryResult<ServerCart>,
      {
        UserAgent: string;
        url: string;
      }
    >({
      query: ({ UserAgent, url }) => ({
        url: `shoppingCart`,
        params: { UserAgent },
        headers: {
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
        keepUnusedDataFor: 0,
      }),
      providesTags: ['Cart'],
    }),
    checkPromoCode: builder.query<
      AppQueryResult<ServerCart>,
      {
        userAgent: string;
        PromoCode: string;
        url: string;
      }
    >({
      query: ({ userAgent, PromoCode, url }) => ({
        url: `checkPromoCode`,
        headers: { url },
        params: { userAgent, PromoCode },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
        keepUnusedDataFor: 0,
      }),
    }),
    changeLocation: builder.query<
      AppQueryResult<any>,
      {
        UserAgent: string;
        area_branch: any;
        url: string;
      }
    >({
      query: ({ UserAgent, area_branch, url }) => ({
        url: `changeArea`,
        params: { UserAgent },
        headers: {
          url,
          ...area_branch,
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
  useAddToCartMutation,
  useLazyCheckPromoCodeQuery,
  useLazyGetCartProductsQuery,
  useLazyChangeLocationQuery,
} = cartApi;
