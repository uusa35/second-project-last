import { apiSlice } from './index';
import { AppQueryResult, Location } from '@/types/queries';
import { Locale } from '@/types/index';

export const locationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<
      AppQueryResult<Location[]>,
      { lang: Locale['lang'] | string | undefined; url: string, type: string }
    >({
      query: ({ lang, url, type }) => ({
        url: `locations`,
        headers: {
          lang,
          url,
        },
        params: { type }
      }),
    }),
  }),
});

export const { useGetLocationsQuery, useLazyGetLocationsQuery } = locationApi;
