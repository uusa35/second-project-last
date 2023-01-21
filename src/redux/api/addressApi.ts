import { apiSlice } from './index';
import { Address, AppQueryResult } from '@/types/queries';

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAddress: builder.mutation<
      AppQueryResult<Address>,
      {
        body: {
          address_type: number | string;
          longitude: number | string;
          latitude: number | string;
          customer_id: number | string;
          address: { [key: string]: any };
        };
      }
    >({
      query: ({ body }) => ({
        url: `add-address`,
        method: `POST`,
        body,
        validateStatus: (response, result) =>
          response.status === 200 && result.status,
      }),
    }),
  }),
});

export const { useCreateAddressMutation } = addressApi;
