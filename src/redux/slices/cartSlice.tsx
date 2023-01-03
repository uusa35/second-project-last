import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart } from '@/types/index';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: Cart = {
  tempId: '',
  products: [],
  isEmpty: true,
  currentMode: ``,
  classes: {
    id: ``,
    class_name: ``,
    vendor_name: ``,
    area: ``,
    date: ``,
    time: ``,
    date_without_format: ``,
    price: ``,
    currency: ``,
    subtotal: ``,
    tax: ``,
    total: ``,
  },
  subscription: {
    id: ``,
    subscription_name: ``,
    vendor_name: ``,
    address: ``,
    area: ``,
    start_date: ``,
    price: ``,
    currency: ``,
    subtotal: ``,
    tax: ``,
    total: ``,
  },
  event: {
    id: ``,
    event_name: ``,
    vendor_name: ``,
    area: ``,
    date: ``,
    time: ``,
    date_without_format: ``,
    price: ``,
    currency: ``,
    subtotal: ``,
    tax: ``,
    total: ``,
  },
  venue: {
    tax: ``,
    sub_total: ``,
    total: ``,
  },
  paymentMethods: [
    {
      id: ``,
      name: ``,
      image: ``,
    },
  ],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartVeneu: (
      state: typeof initialState,
      action: PayloadAction<{
        venue: Cart['venue'];
        paymentMethods: Cart['paymentMethods'];
      }>
    ) => {
      return {
        ...initialState,
        tempId: state.tempId,
        venue: action.payload.venue,
        paymentMethods: action.payload.paymentMethods,
        isEmpty: false,
        currentMode: `venue`,
      };
    },
    setCartClass: (
      state: typeof initialState,
      action: PayloadAction<{
        classes: Cart['classes'];
        paymentMethods: Cart['paymentMethods'];
      }>
    ) => {
      return {
        ...initialState,
        tempId: state.tempId,
        classes: action.payload.classes,
        paymentMethods: action.payload.paymentMethods,
        isEmpty: false,
        currentMode: 'classes',
      };
    },
    setCartEvent: (
      state: typeof initialState,
      action: PayloadAction<{
        event: Cart['event'];
        paymentMethods: Cart['paymentMethods'];
      }>
    ) => {
      return {
        ...initialState,
        tempId: state.tempId,
        event: action.payload.event,
        paymentMethods: action.payload.paymentMethods,
        isEmpty: false,
        currentMode: 'event',
      };
    },
    setCartSubscription: (
      state: typeof initialState,
      action: PayloadAction<{
        subscription: Cart['subscription'];
        paymentMethods: Cart['paymentMethods'];
      }>
    ) => {
      return {
        ...initialState,
        tempId: state.tempId,
        subscription: action.payload.subscription,
        paymentMethods: action.payload.paymentMethods,
        isEmpty: false,
        currentMode: 'subscription',
      };
    },
    setTempId: (state: typeof initialState, action: PayloadAction<string>) => {
      return {
        ...initialState,
        tempId: action.payload,
        isEmpty: false,
        currentMode: 'product',
      };
    },
    toggleIsEmpty: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        tempId: state.tempId,
        isEmpty: !state.isEmpty,
        currentMode: !state.isEmpty ? `` : state.currentMode,
      };
    },
    setCurrentMode: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        currentMode: action.payload,
      };
    },
    resetCart: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...initialState,
        tempId: state.tempId,
      };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
      };
    },
  },
});

export const {
  setCartVeneu,
  setCartClass,
  setCartEvent,
  setCartSubscription,
  setTempId,
  toggleIsEmpty,
  setCurrentMode,
  resetCart,
} = cartSlice.actions;
