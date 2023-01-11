import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductCart } from '@/types/index';

const initialState: ProductCart = {
  ProductID: 0,
  ProductName: ``,
  ProductDesc: ``,
  Quantity: 0,
  Price: 0,
  RadioBtnsAddons: [],
  CheckBoxes: [],
  QuantityMeters: [
    {
      addonID: 0,
      addons: [],
    },
  ],
};

export const cartProductSlice = createSlice({
  name: 'cartProduct',
  initialState,
  reducers: {
    resetCart: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { resetCart } = cartProductSlice.actions;
