import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductCart, ClientCart } from '@/types/index';
import { filter, sum, sumBy } from 'lodash';

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
  },
});

export const { resetCart, setAddToCart, removeFromCart } = cartSlice.actions;
