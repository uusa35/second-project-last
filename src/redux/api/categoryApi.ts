import { apiSlice } from './index';
import { AppQueryResult, Category } from '@/types/queries';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<AppQueryResult<Category[]>, void>({
      query: () => ({
        url: `categories`,
        validateStatus: (response, result) => response.status && result.Data,
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
