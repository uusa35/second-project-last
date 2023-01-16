import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Area } from '@/types/queries';
import { CustomerInfo } from '@/types/index';

const initialState: CustomerInfo = {
  id: 0,
  name: ``,
  email: ``,
  phone: ``,
};

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer: (
      state: typeof initialState,
      action: PayloadAction<CustomerInfo>
    ) => action.payload,
    removeCustomer: (state: typeof initialState, action: PayloadAction<void>) =>
      initialState,
  },
});

export const { setCustomer, removeCustomer } = customerSlice.actions;
