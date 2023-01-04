import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, Order, Product, Vendor } from '@/types/index';
import { lowerCase } from 'lodash';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: Order = {
  isEmpty: true,
  orderMode: ``,
  order_id: ``,
  class_id: ``,
  event_id: ``,
  recieptId: ``,
  transactionId: ``,
  class_name: ``,
  status: ``,
  event_name: ``,
  vendor_name: ``,
  venue_name: ``,
  vendor_logo: ``,
  date: ``,
  date_without_format: ``,
  time: ``,
  gender: ``,
  address: ``,
  area: ``,
  price: ``,
  currency: ``,
  payment_method: ``,
  payment_status: ``,
  customer_name: ``,
  customer_phone: ``,
  transaction_date: ``,
  longitude: ``,
  latitude: ``,
  category: ``,
  start_date: ``,
  subscription_name: ``,
  share_message: ``,
  invoice_id: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state: typeof initialState, action: PayloadAction<Order>) => {
      return {
        ...state,
        ...action.payload,
        isEmpty: false,
      };
    },
    resetOrder: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...initialState,
      };
    },
    toggleIsEmpty: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        isEmpty: !state.isEmpty,
        orderMode: !state.isEmpty ? `` : state.orderMode,
      };
    },
    orderMade: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...state,
      };
    },
    setInvoiceId: (
      state: typeof initialState,
      action: PayloadAction<number>
    ) => {
      return {
        ...state,
        invoice_id: action.payload,
      };
    },
  },
});

export const { setOrder, resetOrder, toggleIsEmpty, orderMade } =
  orderSlice.actions;
