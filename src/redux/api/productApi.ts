import { Product, Locale } from '../../types';
import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        query?: string;
        branchId: string;
      }
    >({
      query: ({ query = `?page=1&limit=20`, branchId }) => ({
        url: `items${query}`,
        headers: {
          'x-branch-id': branchId,
        },
      }),
    }),
    getSearchProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        search?: string;
        branchId: string;
      }
    >({
      query: ({ search = ``, branchId }) => ({
        url: `search?key=${search}`,
        headers: {
          'x-branch-id': branchId,
        },
      }),
    }),
    getProduct: builder.query<
      AppQueryResult<Product>,
      {
        item_id: string | unknown;
        lang: Locale['lang'] | string;
        branchId: string;
      }
    >({
      query: ({ item_id, branchId, lang }) => ({
        url: `itemDetails`,
        params: { item_id },
        headers: {
          'Accept-Language': lang,
          'x-branch-id': branchId,
        },
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = productApi;
