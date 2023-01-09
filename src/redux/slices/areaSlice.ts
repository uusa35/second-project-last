import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Area } from '@/types/queries';

const initialState: Area = {
  id: null,
  name: ``,
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
});

export const { setArea, removeArea } = areaSlice.actions;
