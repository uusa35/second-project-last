import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types/index';

const initialState: Order = {
  orderId: null,
  vendor_name: '',
  vendor_logo: 'images/store/logos/logo.',
  vendor_description: [],
  branch_phone: '',
  branch_address: '',
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state: typeof initialState, action: PayloadAction<Order>) => {
      return {
        ...action.payload,
      };
    },
    resetOrder: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { setOrder, resetOrder } = orderSlice.actions;
