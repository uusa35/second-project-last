import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductCart, ClientCart } from '@/types/index';
import { filter, sum, sumBy, multiply } from 'lodash';

const initialState: ClientCart = {
  grossTotal: 0,
  subTotal: 0,
  total: 0,
  items: [],
  PromoCode: null,
  promoEnabled: false,
  notes: ``,
  promoCode: {
    total_cart_before_tax: 0,
    total_cart_after_tax: 0,
    free_delivery: `false`,
  },
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setAddToCart: (
      state: typeof initialState,
      action: PayloadAction<ProductCart>
    ) => {
      const items = filter(
        state.items,
        (item) => item.ProductID !== action.payload.ProductID
      );
      const grossTotal = sumBy(items, (item) => item.subTotalPrice);
      return {
        ...state,
        grossTotal: sum([action.payload.subTotalPrice, grossTotal]),
        items: [...items, action.payload],
      };
    },
    removeFromCart: (
      state: typeof initialState,
      action: PayloadAction<number>
    ) => {
      const items = filter(
        state.items,
        (item) => item.ProductID !== action.payload
      );
      const grossTotal = sumBy(items, (item) => item.subTotalPrice);
      return {
        ...state,
        grossTotal,
        items,
      };
    },
    resetCart: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...initialState,
      };
    },
    increaseCartQty: (
      state: typeof initialState,
      action: PayloadAction<ProductCart>
    ) => {
      const itemIndex = state.items.findIndex(
        (item) => item.ProductID === action.payload.ProductID
      );
      state.items[itemIndex].totalQty += 1;
      state.items[itemIndex].Quantity += 1;
      state.items[itemIndex].subTotalPrice = multiply(
        state.items[itemIndex].totalPrice,
        state.items[itemIndex].totalQty
      );
      state.grossTotal = sumBy(state.items, (item) => item.subTotalPrice);
    },
    decreaseCartQty: (
      state: typeof initialState,
      action: PayloadAction<ProductCart>
    ) => {
      const itemIndex = state.items.findIndex(
        (item) => item.ProductID === action.payload.ProductID
      );
      if (state.items[itemIndex].totalQty > 1) {
        state.items[itemIndex].totalQty -= 1;
        state.items[itemIndex].Quantity -= 1;
        state.items[itemIndex].subTotalPrice = multiply(
          state.items[itemIndex].totalPrice,
          state.items[itemIndex].totalQty
        );
        state.grossTotal = sumBy(state.items, (item) => item.subTotalPrice);
      }
    },
    setCartNotes: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        notes: action.payload,
      };
    },
    setCartPromoCode: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        PromoCode: action.payload,
        promoEnabled: false,
      };
    },
    setCartPromoSuccess: (
      state: typeof initialState,
      action: PayloadAction<ClientCart['promoCode']>
    ) => {
      return {
        ...state,
        promoCode: action.payload,
        promoEnabled: true,
      };
    },
    setCartTotalAndSubTotal: (
      state: typeof initialState,
      action: PayloadAction<{ total: number; subTotal: number }>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {
  resetCart,
  setAddToCart,
  removeFromCart,
  increaseCartQty,
  decreaseCartQty,
  setCartNotes,
  setCartPromoCode,
  setCartTotalAndSubTotal,
  setCartPromoSuccess,
} = cartSlice.actions;
