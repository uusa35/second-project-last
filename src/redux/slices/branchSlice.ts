import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Branch } from '@/types/queries';
import { appSettingSlice } from './appSettingSlice';

const initialState: Branch = {
  id: null,
  name: ``,
  name_ar: ``,
  name_en: ``,
  location: ``,
  mobile: ``,
  lang: ``,
  lat: ``,
  status: ``,
  delivery_type: ``,
};

export const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setBranch: (state: typeof initialState, action: PayloadAction<Branch>) =>
      action.payload,
    removeBranch: (state: typeof initialState, action: PayloadAction<void>) =>
      initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      appSettingSlice.actions.setCartMethod,
      (state, action) => {
        if(action.payload === 'delivery'){
          return initialState
        }
      }
    );
  },
});

export const { setBranch, removeBranch } = branchSlice.actions;
