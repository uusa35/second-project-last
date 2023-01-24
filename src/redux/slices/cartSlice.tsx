import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClientCart } from '@/types/index';

const initialState: ClientCart = {
  subTotal: 0,
  total: 0,
  delivery_fees: `0`,
  PromoCode: null,
  promoEnabled: false,
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
    resetCart: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...initialState,
      };
    },
    setCartTotalAndSubTotal: (
      state: typeof initialState,
      action: PayloadAction<
        Omit<ClientCart, 'notes' | 'promoEnabled' | 'PromoCode' | 'promoCode'>
      >
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
  setCartPromoCode,
  setCartTotalAndSubTotal,
  setCartPromoSuccess,
} = cartSlice.actions;
