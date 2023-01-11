import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { Locale, Vendor } from '@/types/index';

export const vendorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendor: builder.query<
      AppQueryResult<Vendor>,
      { lang: Locale['lang'] | string | undefined }
    >({
      query: ({ lang }) => ({
        url: `vendorDetails`,
        headers: {
          lang,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const { useGetVendorQuery } = vendorApi;
