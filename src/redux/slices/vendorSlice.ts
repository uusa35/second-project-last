import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Country } from '@/types/queries';
import { isLocal } from '@/constants/*';
import { HYDRATE } from 'next-redux-wrapper';
import { Vendor } from '@/types/index';

const initialState: Vendor = {
  id: ``,
  name: ``,
  name_ar: ``,
  name_en: ``,
  status: ``,
  phone: ``,
  desc: ``,
  cover: ``,
  logo: ``,
  delivery: ``,
  location: ``,
  WorkHours: ``,
  DeliveryTime: ``,
  Preorder_availability: ``,
  Payment_Methods: {
    cash_on_delivery: `no`,
    knet: `no`,
    visa: `no`,
  },
};

export const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendor: (state: typeof initialState, action: PayloadAction<Vendor>) =>
      action.payload,
  },
});

export const { setVendor } = vendorSlice.actions;
