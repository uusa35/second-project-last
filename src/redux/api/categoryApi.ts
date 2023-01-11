import { apiSlice } from './index';
import { AppQueryResult, Category } from '@/types/queries';
import { Locale } from '@/types/index';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      AppQueryResult<Category[]>,
      { lang: Locale['lang'] | string | undefined }
    >({
      query: ({ lang }) => ({
        url: `categories`,
        headers: {
          lang,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
