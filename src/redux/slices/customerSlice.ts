import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Area } from '@/types/queries';
import { CustomerInfo } from '@/types/index';

const initialState: CustomerInfo = {
  id: 0,
  name: ``,
  email: ``,
  phone: ``,
  address: {
    id:0,
    customer_id: 0,
    type: 0,
    address:{},
    longitude: ``,
    latitude: ``,
  },
};

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer: (
      state: typeof initialState,
      action: PayloadAction<CustomerInfo>
    ) => {
      console.log('customer state', {...state})
      return {
        ...state,
        ...action.payload,      
      };
    },
    removeCustomer: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...initialState,
        address: state.address,
      };
    },
    setCustomerAddress: (
      state: typeof initialState,
      action: PayloadAction<CustomerInfo['address']>
    ) => {
      return {
        ...state,
        address: action.payload,
      };
    },
    resetCustomerAddress: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        address: initialState.address,
      };
    },
  },
});

export const {
  setCustomer,
  removeCustomer,
  setCustomerAddress,
  resetCustomerAddress,
} = customerSlice.actions;
