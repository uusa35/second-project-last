import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart } from '@/types/index';

const initialState: Cart = {
  products: [],
  isEmpty: true,
  method: `delivery`,
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
    setTempId: (state: typeof initialState, action: PayloadAction<string>) => {
      return {
        ...initialState,
        tempId: action.payload,
        isEmpty: false,
      };
    },
    selectMethod: (
      state: typeof initialState,
      action: PayloadAction<Cart['method']>
    ) => {
      return {
        ...state,
        method: action.payload,
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
      };
    },
    resetCart: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...initialState,
        tempId: state.tempId,
      };
    },
  },
});

export const { setTempId, toggleIsEmpty, resetCart, selectMethod } =
  cartSlice.actions;
