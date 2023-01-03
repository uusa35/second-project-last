import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Guest } from '@/types/queries';
import { RootState } from '@/redux/store';
import { HYDRATE } from 'next-redux-wrapper';
import { isEmpty } from 'lodash';

const initialState: Guest = {
  name: `guest`,
  gender: `male`,
  phone: 1,
  guestMode: false,
};

export const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    enableGuestMode: (
      state: typeof initialState,
      action: PayloadAction<Guest>
    ) => {
      return {
        ...action.payload,
        guestMode: true,
      };
    },
    disableGuestMode: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return initialState;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
      };
    },
  },
});
export const isGuestMode = (state: RootState) =>
  state.guest.guestMode && isEmpty(state.auth.access_token);
export const { enableGuestMode, disableGuestMode } = guestSlice.actions;
