import { Product, Locale } from '../../types';
import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        category_id: string | number;
        branch_id?: string | null;
        page: string;
        limit: string;
        area_id?: string;
        lang: Locale['lang'] | string | undefined;
        url: string;
      }
    >({
      query: ({
        category_id,
        page,
        limit,
        branch_id,
        area_id,
        lang,
        url,
      }: any) => ({
        url: `items`,
        params: { category_id, page, limit },
        headers: {
          url,
          lang,
          ...(area_id ? { 'x-area-id': area_id } : {}),
          ...(branch_id ? { 'x-branch-id': branch_id } : {}),
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    getSearchProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        lang: Locale['lang'] | string | undefined;
        branch_id?: string;
        key?: string;
        areaId?: string;
        url: string;
      }
    >({
      query: ({ lang, key = ``, branch_id = '', areaId = ``, url }: any) => ({
        url: `search`,
        params: { key },
        headers: {
          url,
          ...(areaId ? { 'x-area-id': areaId } : {}),
          ...(branch_id ? { 'x-branch-id': branch_id } : {}),
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
        url: string;
      }
    >({
      query: ({ id, lang, branchId = null, areaId = ``, url }: any) => ({
        url: `itemDetails`,
        params: { product_id: id },
        headers: {
          url,
          lang,
          ...(areaId ? { 'x-area-id': areaId } : {}),
          ...(branchId ? { 'x-branch-id': branchId } : {}),
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
        url: string;
      }
    >({
      query: ({ lang, branchId = ``, areaId = ``, url }) => ({
        url: `topSearches`,
        headers: {
          url,
          ...(areaId ? { 'x-area-id': areaId } : {}),
          ...(branchId ? { 'x-branch-id': branchId } : {}),
          lang,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetTopSearchQuery,
  useLazyGetSearchProductsQuery,
} = productApi;
