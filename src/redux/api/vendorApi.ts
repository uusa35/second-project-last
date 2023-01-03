import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { Locale, Vendor } from '@/types/index';

export const vendorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendor: builder.query<AppQueryResult<Vendor>, void>({
      query: () => ({
        url: `vendorDetails`,
        validateStatus: (response, result) => response.status && result.Data,
      }),
    }),
  }),
});

export const { useGetVendorQuery } = vendorApi;
