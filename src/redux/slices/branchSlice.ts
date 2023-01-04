import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Branch, Country } from '@/types/queries';
import { isLocal } from '@/constants/*';
import { HYDRATE } from 'next-redux-wrapper';
import { Vendor } from '@/types/index';

const initialState: Branch = {
  id: 0,
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
  },
});

export const { setBranch } = branchSlice.actions;
