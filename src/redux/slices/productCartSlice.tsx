import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  CartAddons,
  CheckBoxes,
  ProductCart,
  QuantityMeters,
  RadioBtns,
} from '@/types/index';
import { concat, filter, map, multiply, subtract, sum, sumBy } from 'lodash';
import { searchParamsSlice } from '@/redux/slices/searchParamsSlice';
import { countrySlice } from '@/redux/slices/countrySlice';
import { act } from 'react-dom/test-utils';

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
  CheckBoxes: [],
  QuantityMeters: [],
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
      };
    },
    addMeter: (
      state: typeof initialState,
      action: PayloadAction<QuantityMeters>
    ) => {
      const exist = filter(
        state.QuantityMeters,
        (m) => m.addonID === action.payload.addonID
      );
      return {
        ...state,
        QuantityMeters: [
          action.payload,
          ...filter(
            state.QuantityMeters,
            (m) => m.addonID !== action.payload.addonID
          ),
        ],
      };
    },
    removeMeter: (
      state: typeof initialState,
      action: PayloadAction<number>
    ) => {
      return {
        ...state,
        QuantityMeters: filter(
          state.QuantityMeters,
          (c) => c.addonID !== action.payload
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
          ...filter(
            state.CheckBoxes,
            (c) => c.addonID !== action.payload.addonID
          ),
        ],
      };
    },
    removeFromCheckBox: (
      state: typeof initialState,
      action: PayloadAction<number>
    ) => {
      return {
        ...state,
        CheckBoxes: filter(
          state.CheckBoxes,
          (c) => c.addonID !== action.payload
        ),
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
        subTotalPrice: number;
        totalQty: number;
      }>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    // updatePrice: (
    //   state: typeof initialState,
    //   action: PayloadAction<number>
    // ) => {
    //   return {
    //     ...state,
    //     Quantity: action.payload,
    //     totalPrice: sum([
    //       Number(state.totalPrice),
    //       Number(
    //         sumBy(
    //           concat(
    //             map(state.RadioBtnsAddons, (r) => r.addons),
    //             map(state.CheckBoxes, (c) => c.addons),
    //             map(state.QuantityMeters, (m) => m.addons)
    //           ),
    //           (item) => item.price
    //         )
    //       ),
    //     ]),
    //     subTotalPrice: multiply(state.totalPrice, state.totalQty),
    //   };
    // },
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
} = productCartSlice.actions;
