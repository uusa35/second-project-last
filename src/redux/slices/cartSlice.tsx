import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductCart, ClientCart } from '@/types/index';
import {
  filter,
  sum,
  sumBy,
  multiply,
  isEmpty,
  map,
  concat,
  flatten,
  join,
} from 'lodash';

const initialState: ClientCart = {
  grossTotal: 0,
  subTotal: 0,
  total: 0,
  delivery_fees: `0`,
  items: [
    {
      ProductID: 0,
      ProductName: ``,
      ProductDesc: ``,
      name_ar: ``,
      name_en: ``,
      totalQty: 0,
      totalPrice: 0,
      grossTotalPrice: 0,
      Quantity: 0,
      Price: 0,
      RadioBtnsAddons: [],
      CheckBoxes: [],
      QuantityMeters: [],
      enabled: false,
      image: ``,
    },
  ],
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
      const uIds = concat(
        action.payload.QuantityMeters &&
          map(action.payload.QuantityMeters, (q) => q.uId),
        action.payload.CheckBoxes &&
          map(action.payload.CheckBoxes, (c) => c.uId),
        action.payload.RadioBtnsAddons &&
          map(action.payload.RadioBtnsAddons, (r) => r.uId)
      );
      const newItem = {
        ...action.payload,
        id: `${action.payload.ProductID}${join(uIds, '')}`,
      };
      const items = filter(
        state.items,
        (item) => item.id !== newItem.id && item.ProductID !== 0
      );
      const grossTotal = sumBy(items, (item) => item.grossTotalPrice);
      return {
        ...state,
        grossTotal: sum([action.payload.grossTotalPrice, grossTotal]),
        items: [...items, newItem],
        promoEnabled: false,
        promoCode: { ...initialState.promoCode },
      };
    },
    removeFromCart: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      const items = filter(state.items, (item) => item.id !== action.payload);
      const grossTotal = sumBy(items, (item) => item.grossTotalPrice);
      return {
        ...state,
        grossTotal,
        total: !isEmpty(items) ? state.total : 0,
        subTotal: !isEmpty(items) ? state.subTotal : 0,
        items: !isEmpty(items) ? items : initialState.items,
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
        (item) => item.id !== action.payload.id
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
        (item) => item.id !== action.payload.id
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
  setCartPromoCode,
  setCartTotalAndSubTotal,
  setCartPromoSuccess,
} = cartSlice.actions;
