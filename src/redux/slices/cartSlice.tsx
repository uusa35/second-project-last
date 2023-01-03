import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart } from '@/types/index';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: Cart = {
  tempId: '',
  products: [],
  isEmpty: true,
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

export const { setTempId, toggleIsEmpty, resetCart } = cartSlice.actions;
