import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import {
  OrderUser,
  Order,
  OrderAddress,
  OrderTrack,
  OrderInvoice,
} from '@/types/index';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      createOrder: builder.query<
        AppQueryResult<Order>,
        {
          params: OrderUser;
          process_type: string;
          area_branch: string;
        }
      >({
        query: ({ params, process_type, area_branch }) => ({
          url: `create-order`,
          method: 'POST',
          params,
          headers: {
            ...(process_type === 'delivery' && { 'x-area-id': area_branch }),
            ...(process_type === 'pickup' && { 'x-branch-id': area_branch }),
          },
          validateStatus: (response, result) =>
            response.status == 200 && result.status,
        }),
      }),
      addAddress: builder.query<
        AppQueryResult<OrderAddress>,
        {
          address_type: string;
          longitude: string;
          latitude: string;
          customer_id: number;
          address: string[];
        }
      >({
        query: (params) => ({
          url: `add-address`,
          params,
          method: 'POST',
        }),
      }),
      trackOrder: builder.query<
        AppQueryResult<OrderTrack>,
        {
          order_code: string;
        }
      >({
        query: ({ order_code }) => ({
          url: `track-order`,
          params: { order_code },
        }),
      }),
      checkOrderStatus: builder.query<
        AppQueryResult<Order>,
        {
          status: string;
          order_id: string;
        }
      >({
        query: ({ status, order_id }) => ({
          url: `order/payment/status`,
          params: { status, order_id },
        }),
      }),
      getInvoice: builder.query<
        AppQueryResult<OrderInvoice>,
        {
          order_id: string;
        }
      >({
        query: ({ order_id }) => ({
          url: `order/invoice`,
          params: { order_id },
        }),
      }),
      addFeedBack: builder.query<
        AppQueryResult<any>,
        { username: string; rate: number; note: string; phone: string | number }
      >({
        query: ({ username, rate, note, phone }) => ({
          url: `feedbacks/create`,
          params: { username, rate, note, phone },
          method: 'POST',
        }),
      }),
      getCustomerInfo: builder.query<
        AppQueryResult<any>,
        { name: string; email: string; phone: string | number }
      >({
        query: ({ name, email, phone }) => ({
          url: `customer-info`,
          params: { name, email, phone },
          method: 'POST',
        }),
      }),
    };
  },
});

export const {
  useLazyAddFeedBackQuery,
  useLazyAddAddressQuery,
  useLazyCheckOrderStatusQuery,
  useLazyCreateOrderQuery,
  useLazyTrackOrderQuery,
  useLazyGetCustomerInfoQuery,
  useLazyGetInvoiceQuery,
  useGetInvoiceQuery,
} = orderApi;
