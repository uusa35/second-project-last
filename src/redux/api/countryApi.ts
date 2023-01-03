import { apiSlice } from './index';
import { AppQueryResult, Area, Country } from '@/types/queries';
import { Locale } from '@/types/index';

export const countryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCountries: builder.query<
      AppQueryResult<Country[]>,
      {
        lang: Locale['lang'] | undefined | string;
        country: string;
      }
    >({
      query: ({ lang, country }) => ({
        url: `countries`,
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    getAllAreas: builder.query<
      AppQueryResult<Area[]>,
      {
        locale: Locale['lang'] | undefined | string;
        country: string;
        params: {};
      }
    >({
      query: ({ locale, country, params }) => ({
        url: `areas`,
        params,
        headers: {
          'Accept-Language': locale,
          country,
        },
      }),
    }),
  }),
});

export const { useGetAllCountriesQuery, useGetAllAreasQuery } = countryApi;
