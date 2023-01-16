import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductCart, ClientCart } from '@/types/index';
import { filter, sum, sumBy, multiply } from 'lodash';

const initialState: ClientCart = {
  grossTotal: 0,
  items: [],
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
        (item) => item.productId !== action.payload.productId
      );
      const grossTotal = sumBy(items, (item) => item.subTotalPrice);
      return {
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
        (item) => item.productId === action.payload
      );
      const grossTotal = sumBy(items, (item) => item.subTotalPrice);
      return {
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
        (item) => item.productId === action.payload.productId
      );
      state.items[itemIndex].totalQty += 1;
      state.items[itemIndex].subTotalPrice = multiply(
      state.items[itemIndex].totalPrice,
      state.items[itemIndex].totalQty
      )
      state.grossTotal = sum([state.items[itemIndex].subTotalPrice, state.grossTotal])
    },
    decreaseCartQty: (
      state: typeof initialState,
      action: PayloadAction<ProductCart>
    ) => {
      const itemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );
      if (state.items[itemIndex].totalQty > 1) {
        state.items[itemIndex].totalQty -= 1;
      } else if (state.items[itemIndex].totalQty === 1) {
        const nextCartItems = state.items.filter(
          (item) => item.productId !== action.payload.productId
        );
        state.items = nextCartItems;
      }
      state.items[itemIndex].subTotalPrice = multiply(
      state.items[itemIndex].totalPrice,
      state.items[itemIndex].totalQty
    )
    state.grossTotal = sum([state.items[itemIndex].subTotalPrice, state.grossTotal])
    },
  },
});

export const {
  resetCart,
  setAddToCart,
  removeFromCart,
  increaseCartQty,
  decreaseCartQty,
} = cartSlice.actions;
