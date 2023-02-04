import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { CustomerInfo } from '@/types/index';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    SaveCustomerInfo: builder.mutation<
      AppQueryResult<any>,
      {
        body: CustomerInfo;
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `customer-info`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) =>
          response.status === 200 && result.status,
      }),
    }),
  }),
});

export const { useSaveCustomerInfoMutation } = customerApi;
