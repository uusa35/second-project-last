import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Branch } from '@/types/queries';

const initialState: Branch = {
  id: null,
  name: ``,
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
});

export const { setBranch, removeBranch } = branchSlice.actions;
