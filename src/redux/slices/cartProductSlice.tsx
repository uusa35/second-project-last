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
    setInitialProductCart: (
      state: typeof initialState,
      action: PayloadAction<Omit<ProductCart, 'Quantity' | 'QuantityMeters'>>
    ) => {
      return {
        ...initialState,
        ...action.payload,
      };
    },
    setQty: (state: typeof initialState, action: PayloadAction<number>) => {
      return {
        ...state,
        Quantity: action.payload,
      };
    },
    updatePrice: (
      state: typeof initialState,
      action: PayloadAction<number>
    ) => {
      return {
        ...state,
        Price: action.payload,
      };
    },
    resetProductCart: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { resetProductCart, setInitialProductCart } =
  cartProductSlice.actions;
