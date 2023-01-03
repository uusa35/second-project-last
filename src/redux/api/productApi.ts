import { Product, Locale } from '../../types';
import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        category_id: string;
        query?: string;
        branchId?: string;
      }
    >({
      query: ({ category_id, query = `?page=1&limit=20`, branchId }) => ({
        url: `items${query}`,
        params: { category_id },
        headers: {
          'x-branch-id': branchId,
        },
      }),
    }),
    getSearchProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        search?: string;
        branchId?: string;
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
        branchId?: string;
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
    getTopSearch: builder.query<
      AppQueryResult<{ topSearch: string[]; trendingItems: Product[] }>,
      {
        branchId?: string;
        areaId?: string;
      }
    >({
      query: ({ branchId = ``, areaId = `` }) => ({
        url: `topSearches`,
        headers: {
          'x-branch-id': branchId,
          'x-area-id': areaId,
        },
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery, useGetTopSearchQuery } =
  productApi;
