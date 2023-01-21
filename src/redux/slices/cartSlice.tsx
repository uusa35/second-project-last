import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductCart, ClientCart } from '@/types/index';
import { filter, sum, sumBy, multiply } from 'lodash';

const initialState: ClientCart = {
  grossTotal: 0,
  subTotal: 0,
  total: 0,
  delivery_fees: `0`,
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
      const grossTotal = sumBy(items, (item) => item.grossTotalPrice);
      return {
        ...state,
        grossTotal: sum([action.payload.grossTotalPrice, grossTotal]),
        items: [...items, action.payload],
        promoEnabled: false,
        promoCode: { ...initialState.promoCode },
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
      const grossTotal = sumBy(items, (item) => item.grossTotalPrice);
      return {
        ...state,
        grossTotal,
        items,
        promoEnabled: false,
        promoCode: { ...initialState.promoCode },
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
      const filteredItems = filter(
        state.items,
        (item) => item.ProductID !== action.payload.ProductID
      );
      const currentItem = {
        ...action.payload,
        totalQty: action.payload.totalQty + 1,
        Quantity: action.payload.Quantity + 1,
        grossTotalPrice: multiply(
          action.payload.totalPrice,
          action.payload.totalQty + 1
        ),
      };
      const items = [...filteredItems, currentItem];
      return {
        ...state,
        items,
        grossTotal: sumBy(items, (item) => item.grossTotalPrice),
        promoEnabled: false,
      };
    },
    decreaseCartQty: (
      state: typeof initialState,
      action: PayloadAction<ProductCart>
    ) => {
      const filteredItems = filter(
        state.items,
        (item) => item.ProductID !== action.payload.ProductID
      );
      if (action.payload.totalQty > 1) {
        const currentItem = {
          ...action.payload,
          totalQty: action.payload.totalQty - 1,
          Quantity: action.payload.Quantity - 1,
          grossTotalPrice: multiply(
            action.payload.totalPrice,
            action.payload.totalQty - 1
          ),
        };
        const items = [...filteredItems, currentItem];
        return {
          ...state,
          items,
          grossTotal: sumBy(items, (item) => item.grossTotalPrice),
          promoEnabled: false,
        };
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
      action: PayloadAction<{
        total: number;
        subTotal: number;
        delivery_fees: string;
      }>
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
