import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { loading: boolean } = {
  loading: false,
};

export const appLoadingSlice = createSlice({
  name: 'appLoading',
  initialState,
  reducers: {
    disableAppLoading: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => { loading: false },
    enableAppLoading: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => { loading: true },
  },
});

export const {
  enableAppLoading,
  disableAppLoading
} = appLoadingSlice.actions;
