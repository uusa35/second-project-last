import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { Locale, Vendor } from '@/types/index';
import { xDomain } from '@/constants/*';

export const vendorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendor: builder.query<
      AppQueryResult<Vendor>,
      { lang: Locale['lang'] | string | undefined; url: string | undefined }
    >({
      query: ({ lang, url }) => ({
        url: `vendorDetails`,
        headers: {
          lang,
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
        keepUnusedDataFor: 0,
      }),
    }),
  }),
});

export const { useGetVendorQuery } = vendorApi;
