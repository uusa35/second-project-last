import { Product, Locale } from '../../types';
import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        category_id: string | number;
        branch_id: string | null;
        page: string;
        limit: string;
        area_id: string;
        lang: Locale['lang'] | string | undefined;
      }
    >({
      query: ({ category_id, page, limit, branch_id, area_id, lang }: any) => ({
        url: `items`,
        params: { category_id, page, limit, branch_id, area_id },
        headers: {
          lang,
          'x-area-id': area_id,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    getSearchProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        lang: Locale['lang'] | string | undefined;
        branch_id: string;
        key?: string;
        areaId?: string;
      }
    >({
      query: ({ lang, key = ``, branch_id, areaId = `` }: any) => ({
        url: `search`,
        params: { key },
        headers: {
          'x-branch-id': branch_id,
          'x-area-id': areaId,
          lang,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    getProduct: builder.query<
      AppQueryResult<Product>,
      {
        id: string | number;
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
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    getTopSearch: builder.query<
      AppQueryResult<{ topSearch: string[]; trendingItems: Product[] }>,
      {
        lang: Locale['lang'] | string | undefined;
        branchId?: string;
        areaId?: string;
      }
    >({
      query: ({ lang, branchId = ``, areaId = `` }) => ({
        url: `topSearches`,
        headers: {
          'x-branch-id': branchId,
          'x-area-id': areaId,
          lang,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery, useGetTopSearchQuery } =
  productApi;
