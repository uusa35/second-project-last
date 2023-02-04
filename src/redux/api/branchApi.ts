import { apiSlice } from './index';
import { AppQueryResult, Branch } from '@/types/queries';
import { Locale } from '@/types/index';

export const branchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query<
      AppQueryResult<Branch[]>,
      {
        lang: Locale['lang'] | string | undefined;
        url: string;
      }
    >({
      query: ({ lang, url }) => ({
        url: `branches`,
        headers: {
          lang,
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const { useGetBranchesQuery } = branchApi;
