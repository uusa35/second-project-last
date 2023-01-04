import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

type Props = { element: object | any; type: string };

const initialState: Props = {
  element: {},
  type: ``,
};

export const currentElementSlice = createSlice({
  name: 'currentElement',
  initialState,
  reducers: {
    setCurrentElement: (state, action: PayloadAction<Props>) => {
      return {
        element: action.payload.element,
        type: action.payload.type,
      };
    },
    removeCurrentElement: (state, action: PayloadAction<void>) => initialState,
  },
});

export const { setCurrentElement, removeCurrentElement } =
  currentElementSlice.actions;
