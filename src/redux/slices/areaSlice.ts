import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Area } from '@/types/queries';
import { branchSlice } from './branchSlice';

const initialState: Area = {
  id: ``,
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
      branchSlice.actions.setBranch,
      (state, action) => initialState
    );
  },
});

export const { setArea, removeArea } = areaSlice.actions;
