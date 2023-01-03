import { apiSlice } from './index';
import { AppQueryResult, Location } from '@/types/queries';

export const locationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<AppQueryResult<Location[]>, void>({
      query: () => ({
        url: `locations`,
      }),
    }),
  }),
});

export const { useGetLocationsQuery } = locationApi;
