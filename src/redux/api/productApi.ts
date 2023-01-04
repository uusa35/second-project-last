import { Product, Locale } from '../../types';
import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        category_id: string;
        page: string;
        limit: string;
        branchId: string | null;
        areaId: string;
      }
    >({
      query: ({
        category_id,
        page = '1',
        limit = '10',
        branchId = null,
        areaId = ``,
      }: any) => ({
        url: `items?page=${page}&limit=${limit}`,
        params: { category_id },
        headers: {
          'x-branch-id': branchId,
          'x-area-id': areaId,
        },
        validateStatus: (response, result) => response.status && result.Data,
      }),
    }),
    getSearchProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        key?: string;
        branchId?: string;
        areaId?: string;
      }
    >({
      query: ({ key = ``, branchId = null, areaId = `` }: any) => ({
        url: `search`,
        params: { key },
        headers: {
          'x-branch-id': branchId,
          'x-area-id': areaId,
        },
        validateStatus: (response, result) => response.status && result.Data,
      }),
    }),
    getProduct: builder.query<
      AppQueryResult<Product>,
      {
        id: string | unknown;
        lang: Locale['lang'] | string | undefined;
        branchId?: string | null;
        areaId?: string | null;
      }
    >({
      query: ({ id, lang, branchId = null, areaId = `` }: any) => ({
        url: `itemDetails`,
        params: { product_id: id },
        headers: {
          lang,
          'x-branch-id': branchId,
          'x-area-id': areaId,
        },
        validateStatus: (response, result) => response.status && result.Data,
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
        validateStatus: (response, result) => response.status && result.Data,
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery, useGetTopSearchQuery } =
  productApi;
