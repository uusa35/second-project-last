import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Auth } from '@/types/queries';
import { RootState } from '@/redux/store';
import { searchParamsSlice } from '@/redux/slices/searchParamsSlice';
import { appSettingSlice } from '@/redux/slices/appSettingSlice';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: Auth = {
  access_token: null,
  user: {
    id: ``,
    name: ``,
    phone: ``,
    email: ``,
    date_of_birth: ``,
    gender: ``,
    status: false,
    phone_verified: 0,
    avatar: ``,
    country_code: ``,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state: typeof initialState, action: PayloadAction<Auth>) =>
      action.payload,
    logout: (state: typeof initialState, action: PayloadAction<void>) => {
      return initialState;
    },
    setAuthUserObject: (
      state: typeof initialState,
      action: PayloadAction<Auth['user']>
    ) => {
      return {
        ...state,
        user: action.payload,
      };
    },
  },
});
export const isAuthenticated = (state: RootState) =>
  state.auth.user.status === 1;
export const isVerified = (state: RootState) =>
  state.auth.user.phone_verified === 1;
export const { setLogin, logout, setAuthUserObject } = authSlice.actions;
