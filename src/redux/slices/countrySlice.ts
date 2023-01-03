import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Country } from '@/types/queries';
import { isLocal } from '@/constants/*';
import { HYDRATE } from 'next-redux-wrapper';

export const defaultCountry = isLocal
  ? {
      id: 1,
      name: `egypt`,
      name_ar: `مصر`,
      name_en: `egypt`,
      code: `+20`,
      currency: `EGY`,
      image: ``,
    }
  : {
      id: 2,
      name: `kuwait`,
      name_ar: `الكويت`,
      name_en: `kuwait`,
      code: `+965`,
      currency: `KWD`,
      image: ``,
    };
const initialState: Country = defaultCountry;

export const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setCountry: (
      state: typeof initialState,
      action: PayloadAction<Country | any>
    ) => action.payload,
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
      };
    },
  },
});

export const { setCountry } = countrySlice.actions;
