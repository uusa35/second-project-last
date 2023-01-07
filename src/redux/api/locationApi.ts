import { apiSlice } from './index';
import { AppQueryResult, Location } from '@/types/queries';
import { Locale } from '@/types/index';

export const locationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<
      AppQueryResult<Location[]>,
      { lang: Locale['lang'] | string | undefined }
    >({
      query: ({ lang }) => ({
        url: `locations`,
        headers: {
          lang,
        },
      }),
    }),
  }),
});

export const { useGetLocationsQuery } = locationApi;
