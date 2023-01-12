import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CheckBoxes, ProductCart } from '@/types/index';
import { concat, filter, first, multiply, subtract, sum } from 'lodash';

const initialState: ProductCart = {
  ProductID: 0,
  ProductName: ``,
  ProductDesc: ``,
  Quantity: 0,
  Price: 0,
  totalQty: 0,
  totalPrice: 0,
  subTotalPrice: 0,
  productId: 0,
  RadioBtnsAddons: [],
  CheckBoxes: [
    {
      addonID: 0,
      addons: [
        {
          attributeID: 0,
          name: ``,
        },
      ],
    },
  ],
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
      action: PayloadAction<
        Omit<ProductCart, 'QuantityMeters' | 'CheckBoxes' | 'RadioBtnsAddons'>
      >
    ) => {
      return {
        ...initialState,
        ...action.payload,
      };
    },
    addToCheckBox: (
      state: typeof initialState,
      action: PayloadAction<CheckBoxes>
    ) => {
      return {
        ...state,
        CheckBoxes: [...state.CheckBoxes, action.payload],
        totalPrice: sum([
          Number(state.totalPrice),
          Number(action.payload.addons[0].Value),
        ]),
        subTotalPrice: multiply(
          sum([
            Number(state.totalPrice),
            Number(action.payload.addons[0].Value),
          ]),
          state.Quantity
        ),
      };
    },
    removeFromCheckBox: (
      state: typeof initialState,
      action: PayloadAction<CheckBoxes>
    ) => {
      return {
        ...state,
        CheckBoxes: filter(
          state.CheckBoxes,
          (c) => c.addonID === action.payload.addonID
        ),
        totalPrice: subtract(
          Number(state.totalPrice),
          Number(action.payload.addons[0].Value)
        ),
        subTotalPrice: multiply(
          subtract(
            Number(state.totalPrice),
            Number(action.payload.addons[0].Value)
          ),
          state.Quantity
        ),
      };
    },
    setCartProductQty: (
      state: typeof initialState,
      action: PayloadAction<number>
    ) => {
      return {
        ...state,
        Quantity: action.payload,
        subTotalPrice: multiply(state.totalPrice, action.payload),
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

export const {
  resetProductCart,
  addToCheckBox,
  setInitialProductCart,
  removeFromCheckBox,
  setCartProductQty,
} = cartProductSlice.actions;
