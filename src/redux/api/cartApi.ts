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
      }),
      invalidatesTags: ['Cart'],
    }),
    GetCartProducts: builder.query<
      AppQueryResult<ServerCart>,
      {
        UserAgent: string;
        url: string;
        area_branch: any;
      }
    >({
      query: ({ UserAgent, url, area_branch }) => ({
        url: `shoppingCart`,
        params: { UserAgent },
        headers: {
          url,
          ...area_branch,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
      providesTags: ['Cart'],
    }),
    checkPromoCode: builder.query<
      AppQueryResult<ServerCart>,
      {
        userAgent: string;
        PromoCode: string;
        url: string;
        area_branch: any;
      }
    >({
      query: ({ userAgent, PromoCode, url, area_branch }) => ({
        url: `checkPromoCode`,
        headers: { url, ...area_branch },
        params: { UserAgent: userAgent, PromoCode },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
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
