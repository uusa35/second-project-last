import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductCart, ClientCart } from '@/types/index';
import { concat, filter, multiply, sum, sumBy } from 'lodash';

const initialState: ClientCart = {
  totalPrice: 0,
  totalQty: 0,
  items: [
    {
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
    },
  ],
};

export const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
    setProductCart: (
      state: typeof initialState,
      action: PayloadAction<ProductCart>
    ) => {
      return {
        totalPrice: sum([action.payload.totalPrice, state.totalPrice]),
        totalQty: sum([action.payload.totalQty, state.totalQty]),
        items: concat(
          filter(
            state.items,
            (item) => item.productId !== action.payload.productId
          ),
          action.payload
        ),
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
      const totalPrice = sumBy(items, (item) =>
        multiply(item.totalPrice, item.totalQty)
      );
      const totalQty = sumBy(items, (item) => item.totalQty);
      return {
        totalQty,
        totalPrice,
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

export const { resetCart } = cartSlice.actions;
