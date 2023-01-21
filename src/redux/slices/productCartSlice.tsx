import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CheckBoxes,
  ProductCart,
  QuantityMeters,
  RadioBtns,
} from '@/types/index';
import { filter, multiply, random } from 'lodash';

const initialState: ProductCart = {
  ProductID: 0,
  ProductName: ``,
  name_ar: ``,
  name_en: ``,
  ProductDesc: ``,
  Quantity: 0,
  Price: 0,
  RadioBtnsAddons: [],
  CheckBoxes: [],
  QuantityMeters: [],
  totalQty: 0,
  totalPrice: 0,
  subTotalPrice: 0,
  enabled: false,
  image: ``,
  id: random(11111, 999999).toString(),
};

export const productCartSlice = createSlice({
  name: 'productCart',
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
        id: `${state.id}${action.payload.ProductID}`,
      };
    },
    addMeter: (
      state: typeof initialState,
      action: PayloadAction<QuantityMeters>
    ) => {
      return {
        ...state,
        QuantityMeters: [
          action.payload,
          ...filter(state.QuantityMeters, (m) => m.uId !== action.payload.uId),
        ],
      };
    },
    removeMeter: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        QuantityMeters: filter(
          state.QuantityMeters,
          (c) => c.uId !== action.payload
        ),
      };
    },
    addToCheckBox: (
      state: typeof initialState,
      action: PayloadAction<CheckBoxes>
    ) => {
      return {
        ...state,
        CheckBoxes: [
          action.payload,
          ...filter(state.CheckBoxes, (c) => c.uId !== action.payload.uId),
        ],
      };
    },
    removeFromCheckBox: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        CheckBoxes: filter(state.CheckBoxes, (c) => c.uId !== action.payload),
      };
    },
    addRadioBtn: (
      state: typeof initialState,
      action: PayloadAction<RadioBtns>
    ) => {
      return {
        ...state,
        RadioBtnsAddons: [action.payload],
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
    updatePrice: (
      state: typeof initialState,
      action: PayloadAction<{
        totalPrice: number;
        totalQty: number;
      }>
    ) => {
      return {
        ...state,
        ...action.payload,
        subTotalPrice: multiply(
          action.payload.totalPrice,
          action.payload.totalQty
        ),
      };
    },
    enableAddToCart: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        enabled: true,
      };
    },
    disableAddToCart: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        enabled: false,
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
  addRadioBtn,
  updatePrice,
  addMeter,
  removeMeter,
  enableAddToCart,
  disableAddToCart,
} = productCartSlice.actions;
