import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Area } from '@/types/queries';
import { appSettingSlice } from './appSettingSlice';

const initialState: Area = {
  id: null,
  name: ``,
  name_ar: ``,
  name_en: ``,
};

export const areaSlice = createSlice({
  name: 'area',
  initialState,
  reducers: {
    setArea: (state: typeof initialState, action: PayloadAction<Area>) =>
      action.payload,
    removeArea: (state: typeof initialState, action: PayloadAction<void>) =>
      initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      appSettingSlice.actions.setCartMethod,
      (state, action) => {
        if(action.payload === 'pickup'){
          return initialState
        }
      }
    );
  },
});

export const { setArea, removeArea } = areaSlice.actions;
