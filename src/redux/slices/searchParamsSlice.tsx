import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchParams } from '@/types/index';
import { Area, Category, Country } from '@/types/queries';
import { countrySlice } from '@/redux/slices/countrySlice';
import { filter, concat, indexOf } from 'lodash';
import { RootState } from '@/redux/store';
import moment from 'moment';

const initialState: SearchParams = {
  searchArea: {},
  searchCountry: {
    id: 2,
    name: `kuwait`,
    name_ar: `الكويت`,
    name_en: `kuwait`,
    code: `965`,
    currency: `kd`,
    image: ``,
  },
  searchMainCategory: null,
  searchSubCategory: null,
  // searchDateSelected: moment(new Date(), 'YYYY-MM-DD').toDate().toString(),
  searchDateSelected: moment().toISOString(),
  searchTimeSelected: ``,
  searchGendersSelected: ['male', 'female', 'kids'],
};

export const searchParamsSlice = createSlice({
  name: 'searchParams',
  initialState,
  reducers: {
    setSearchArea: (
      state: typeof initialState,
      action: PayloadAction<Area | object>
    ) => {
      return {
        ...state,
        searchArea: action.payload,
      };
    },
    removeSearchArea: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        searchArea: {},
      };
    },
    setSearchCountry: (
      state: typeof initialState,
      action: PayloadAction<Country>
    ) => {
      return {
        ...state,
        searchCountry: action.payload,
      };
    },
    setSearchDateSelected: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        searchDateSelected: action.payload,
      };
    },
    setSearchTimeSelected: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        searchTimeSelected: action.payload,
      };
    },
    toggleGendersSelected: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      const current = indexOf(state.searchGendersSelected, action.payload);
      if (current === -1) {
        return {
          ...state,
          searchGendersSelected: concat(
            state.searchGendersSelected,
            action.payload
          ),
        };
      } else if (current >= 0) {
        return {
          ...state,
          searchGendersSelected: filter(
            state.searchGendersSelected,
            (g) => g !== action.payload
          ),
        };
      }
    },
    setSearchMainCategory: (
      state: typeof initialState,
      action: PayloadAction<Category>
    ) => {
      return {
        ...state,
        searchMainCategory: action.payload,
        searchGendersSelected: [],
      };
    },
    setSearchSubCategoryCategory: (
      state: typeof initialState,
      action: PayloadAction<Category>
    ) => {
      return {
        ...state,
        searchSubCategory: action.payload,
      };
    },
    removeSearchSubCategoryCategory: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        searchSubCategory: null,
      };
    },
    resetSearchParams: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...initialState,
        searchDateSelected: new Date().toString(),
        country: state.searchCountry,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(countrySlice.actions.setCountry, (state, action) => {
      state.searchCountry = action.payload;
      state.searchArea = {};
    });
  },
});

export const dateSelected = (state: RootState) =>
  moment(state.searchParams.searchDateSelected).format('YYYY-MM-DD');
export const {
  setSearchCountry,
  setSearchArea,
  removeSearchArea,
  setSearchDateSelected,
  setSearchTimeSelected,
  toggleGendersSelected,
  setSearchMainCategory,
  setSearchSubCategoryCategory,
  removeSearchSubCategoryCategory,
  resetSearchParams,
} = searchParamsSlice.actions;
