import { combineReducers } from '@reduxjs/toolkit';
import { localeSlice } from './localeSlice';
import { productApi } from './../api/productApi';
import { appLoadingSlice } from './appLoadingSlice';
import { apiSlice } from '../api';
import { countrySlice } from '@/redux/slices/countrySlice';
import { appSettingSlice } from '@/redux/slices/appSettingSlice';
import { authSlice } from '@/redux/slices/authSlice';
import { categoryApi } from '@/redux/api/categoryApi';
import { cartSlice } from '@/redux/slices/cartSlice';
import { productCartSlice } from '@/redux/slices/productCartSlice';
import { searchParamsSlice } from '@/redux/slices/searchParamsSlice';
import { vendorApi } from '@/redux/api/vendorApi';
import { currentElementSlice } from '@/redux/slices/currentElementSlice';
import { orderSlice } from '@/redux/slices/orderSlice';
import { locationApi } from '@/redux/api/locationApi';
import { branchApi } from '@/redux/api/branchApi';
import { vendorSlice } from '@/redux/slices/vendorSlice';
import { branchSlice } from '@/redux/slices/branchSlice';
import { branchesSlice } from '@/redux/slices/branchesSlice';
import { areaSlice } from '@/redux/slices/areaSlice';
import { customerSlice } from '@/redux/slices/customerSlice';

export const rootReducer = combineReducers({
  [appLoadingSlice.name]: appLoadingSlice.reducer,
  [localeSlice.name]: localeSlice.reducer,
  [countrySlice.name]: countrySlice.reducer,
  [vendorSlice.name]: vendorSlice.reducer,
  [branchSlice.name]: branchSlice.reducer,
  [areaSlice.name]: areaSlice.reducer,
  [branchesSlice.name]: branchesSlice.reducer,
  [appSettingSlice.name]: appSettingSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [appLoadingSlice.name]: appLoadingSlice.reducer,
  [cartSlice.name]: cartSlice.reducer,
  [customerSlice.name]: customerSlice.reducer,
  [productCartSlice.name]: productCartSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [searchParamsSlice.name]: searchParamsSlice.reducer,
  [currentElementSlice.name]: currentElementSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [locationApi.reducerPath]: locationApi.reducer,
  [branchApi.reducerPath]: branchApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [vendorApi.reducerPath]: vendorApi.reducer,
});
