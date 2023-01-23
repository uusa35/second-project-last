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
        body: { UserAgent: string; Cart: any };
        process_type: string;
        area_branch: string;
      }
    >({
      query: ({ body, process_type, area_branch }) => ({
        url: `addToCart`,
        method: `POST`,
        body,
        headers: {
          ...(process_type === 'delivery' && { 'x-area-id': area_branch }),
          ...(process_type === 'pickup' && { 'x-branch-id': area_branch }),
        },
        validateStatus: (response, result) => result.status,
      }),
      invalidatesTags: ['Cart'],
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
      providesTags: ['Cart'],
    }),
    checkPromoCode: builder.query<
      AppQueryResult<ServerCart>,
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

    changeLocation: builder.query<
      AppQueryResult<any>,
      {
        UserAgent: string;
        process_type: string;
        area_branch: string;
      }
    >({
      query: ({ UserAgent ,process_type, area_branch}) => ({
        url: `changeArea`,
        params: { UserAgent},
        headers:{
          ...(process_type === 'delivery' && { 'x-area-id': area_branch }),
          ...(process_type === 'pickup' && { 'x-branch-id': area_branch }),
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
  useLazyChangeLocationQuery
} = cartApi;
