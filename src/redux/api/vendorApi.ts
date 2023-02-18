import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { Locale, Vendor } from '@/types/index';

export const vendorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendor: builder.query<
      AppQueryResult<Vendor>,
      {
        lang: Locale['lang'] | string | undefined;
        url: string | undefined;
        area_branch?: any;
      }
    >({
      query: ({ lang, url, area_branch }) => ({
        url: `vendorDetails`,
        headers: {
          lang,
          url,
          ...(area_branch ?? area_branch),
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const { useGetVendorQuery } = vendorApi;
