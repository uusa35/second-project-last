import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerInfo } from '@/types/index';

const initialState: CustomerInfo = {
  id: null,
  userAgent: null, /// ==== tempId for the cart
  name: ``,
  email: ``,
  phone: ``,
  address: {
    // id: 0,
    // customer_id: 0,
    type: 0,
    address: {},
    longitude: ``,
    latitude: ``,
  },
  prefrences: {
    type: '',
    date: '',
    time: '',
  },
  notes: ``,
};

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer: (
      state: typeof initialState,
      action: PayloadAction<CustomerInfo>
    ) => {
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

    setUserAgent: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        userAgent: action.payload,
      };
    },
    setNotes: (state: typeof initialState, action: PayloadAction<string>) => {
      return {
        ...state,
        notes: action.payload,
      };
    },
    setCustomerAddress: (
      state: typeof initialState,
      action: PayloadAction<CustomerInfo['address']>
    ) => {
      return {
        ...state,
        address: {
          // id: action.payload?.id,
          type: action.payload?.type,
          latitude: action.payload?.latitude,
          longitude: action.payload?.longitude,
          ...action.payload?.address,
        },
        // customer_id: action.payload?.customer_id,
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

    setprefrences: (
      state: typeof initialState,
      action: PayloadAction<CustomerInfo['prefrences']>
    ) => {
      return {
        ...state,
        prefrences: action.payload,
      };
    },

    resetPrefrences: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        prefrences: initialState.prefrences,
      };
    },
  },
});

export const {
  setCustomer,
  removeCustomer,
  setCustomerAddress,
  resetCustomerAddress,
  setprefrences,
  resetPrefrences,
  setUserAgent,
  setNotes,
} = customerSlice.actions;
