import { apiSlice } from './index';
import { AppQueryResult, Branch } from '@/types/queries';
import { CustomerInfo, Locale } from '@/types/index';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    SaveCustomerInfo: builder.mutation<
      AppQueryResult<any>,
      {
        body: CustomerInfo;
      }
    >({
      query: ({ body }) => ({
        url: `customer-info`,
        method: `POST`,
        body,
        validateStatus: (response, result) =>
          response.status === 200 && result.status,
      }),
    }),
  }),
});

export const { useSaveCustomerInfoMutation } = customerApi;
