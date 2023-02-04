import { apiSlice } from './index';
import { AppQueryResult, Category } from '@/types/queries';
import { Locale } from '@/types/index';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      AppQueryResult<Category[]>,
      { lang: Locale['lang'] | string | undefined; xDomain?: string }
    >({
      query: ({ lang, xDomain }) => ({
        url: `categories`,
        headers: {
          lang,
          ...(xDomain ? { 'x-domain': xDomain } : {}),
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
