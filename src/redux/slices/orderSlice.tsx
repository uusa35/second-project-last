import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, Order, Product, Vendor } from '@/types/index';
import { lowerCase } from 'lodash';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: Order = {
  isEmpty: true,
  orderMode: ``,
  order_id: ``,
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
