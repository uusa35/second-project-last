import { apiSlice } from './index';
import { AppQueryResult, Category, PaymentProcess } from '@/types/queries';
import { Locale, PaymentMethod } from '@/types/index';

export const storeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStoreIndex: builder.query<
      AppQueryResult<any>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
        params?: {};
      }
    >({
      query: ({ lang, country, params = {} }) => ({
        url: `store`,
        params,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
  }),
});

export const { useGetStoreIndexQuery } = storeApi;
