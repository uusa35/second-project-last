import { apiSlice } from './index';
import { Address, AppQueryResult } from '@/types/queries';
import { Prefrences } from '@/types/index';

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
        url: string;
      }
    >({
      query: ({ body, url }) => {
        console.log('body ===>', body)
        return {
          url: `add-address`,
          method: `POST`,
          headers: { url },
          body,
          // validateStatus: (response, result) =>
          //   response.status === 200 && result.status,
        }
      },
    }),

    checkTimeAvilability: builder.mutation<
      AppQueryResult<any>,
      {
        params: Prefrences;
        process_type: string;
        area_branch: string;
        url: string;
      }
    >({
      query: ({ params, process_type, area_branch, url }) => ({
        url: `checkAvailableTime`,
        params: { ...params },
        headers: {
          ...(process_type === 'delivery' && { 'x-area-id': area_branch }),
          ...(process_type === 'pickup' && { 'x-branch-id': area_branch }),
          url,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.status,
      }),
    }),
  }),
});

export const { useCreateAddressMutation, useCheckTimeAvilabilityMutation } =
  addressApi;
