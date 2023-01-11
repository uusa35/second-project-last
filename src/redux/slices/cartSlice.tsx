import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, ProductCart } from '@/types/index';

const initialState: ProductCart = {
  method: `delivery`,
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
    resetCart: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { setTempId, toggleIsEmpty, resetCart, selectMethod } =
  cartSlice.actions;
