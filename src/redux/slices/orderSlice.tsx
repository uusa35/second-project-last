import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types/index';

const initialState: Order = {
  payment_method: '',
  orderId: null,
  vendor_name: '',
  vendor_name_ar: '',
  vendor_name_en: '',
  vendor_logo: 'images/store/logos/logo.',
  vendor_description: [],
  branch_phone: '',
  branch_address: '',
  orderCode: '',
  order_id: '',
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state: typeof initialState, action: PayloadAction<Order>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetOrder: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...initialState,
      };
    },

    setPaymentMethod: (
      state: typeof initialState,
      action: PayloadAction<Order['payment_method']>
    ) => {
      return {
        ...state,
        payment_method: action.payload,
      };
    },
    resetPaymentMethod: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        payment_method: '',
      };
    },
  },
});

export const { setOrder, resetOrder, setPaymentMethod, resetPaymentMethod } =
  orderSlice.actions;
