import { apiSlice } from './index';
import { AppQueryResult, Branch } from '@/types/queries';
import { Locale } from '@/types/index';

export const branchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query<
      AppQueryResult<Branch[]>,
      {
        lang: Locale['lang'] | string | undefined;
      }
    >({
      query: ({ lang }) => ({
        url: `branches`,
        headers: {
          lang,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    getBranch: builder.query<
      AppQueryResult<Branch>,
      {
        lang: Locale['lang'] | string | undefined;
        id: string;
      }
    >({
      query: ({ lang, id }) => ({
        url: `branches/${id}`,
        params: { branch_id: id },
        headers: {
          lang,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useGetBranchQuery,
  useLazyGetBranchesQuery,
} = branchApi;
