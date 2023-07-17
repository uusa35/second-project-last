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
          area_branch: any;
          url: string;
        }
      >({
        query: ({ params, area_branch, url }) => ({
          url: `create-order`,
          method: 'POST',
          params,
          headers: {
            ...area_branch,
            url,
            lang: 'en',
          },
          validateStatus: (response, result) =>
            response.status == 200 && result.status,
        }),
        transformErrorResponse(res) {
          if (res.data && !res.data?.status && res.data.msg) {
            if (res.data.msg.Date && res.data.msg.Date[0]) {
              return { ...res.data, msg: res.data.msg.Date[0] };
            } else if (res.data.msg.Time && res.data.msg.Time[0]) {
              return { ...res.data, msg: res.data.msg.Time[0] };
            } else {
              return { ...res.data, msg: res.data.msg };
            }
          }
        },
      }),
      addAddress: builder.query<
        AppQueryResult<OrderAddress>,
        {
          address_type: string;
          longitude: string;
          latitude: string;
          customer_id: number;
          address: string[];
          url: string;
        }
      >({
        query: (params) => ({
          url: `add-address`,
          params,
          headers: {
            url: params.url,
          },
          method: 'POST',
        }),
      }),
      trackOrder: builder.query<
        AppQueryResult<OrderTrack>,
        {
          order_code: string;
          url: string;
        }
      >({
        query: ({ order_code, url }) => ({
          url: `track-order`,
          headers: { url },
          params: { order_code },
        }),
      }),
      checkOrderStatus: builder.query<
        AppQueryResult<Order>,
        {
          status: string;
          order_id: string;
          url: string;
          userAgent: string;
        }
      >({
        query: ({ status, order_id, url, userAgent }) => ({
          url: `order/payment/status`,
          headers: { url },
          params: { status, order_id, userAgent },
        }),
      }),
      getInvoice: builder.query<
        AppQueryResult<OrderInvoice>,
        {
          order_id: string;
          url: string;
          area_branch: any;
          lang: string;
        }
      >({
        query: ({ order_id, url, area_branch, lang }) => ({
          url: `order/invoice`,
          headers: { url, ...area_branch, lang },
          params: { order_id },
        }),
      }),
      addFeedBack: builder.query<
        AppQueryResult<any>,
        {
          username: string;
          rate: number;
          note: string;
          phone: string | number;
          url: string;
        }
      >({
        query: ({ username, rate, note, phone, url }) => ({
          url: `feedbacks/create`,
          params: { username, rate, note, phone },
          method: 'POST',
          headers: {
            url,
          },
        }),
      }),
      getCustomerInfo: builder.query<
        AppQueryResult<any>,
        { name: string; email: string; phone: string | number; url: string }
      >({
        query: ({ name, email, phone, url }) => ({
          url: `customer-info`,
          params: { name, email, phone },
          headers: { url },
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
