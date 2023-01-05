import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Branch } from '@/types/queries';

const initialState: Branch[] = [
  {
    id: null,
    name: ``,
    location: ``,
    mobile: ``,
    lang: ``,
    lat: ``,
    status: ``,
    delivery_type: ``,
  },
];

export const branchesSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    setBranches: (
      state: typeof initialState,
      action: PayloadAction<Branch[]>
    ) => action.payload,
  },
});

export const { setBranches } = branchesSlice.actions;
