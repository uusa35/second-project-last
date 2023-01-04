import { combineReducers } from '@reduxjs/toolkit';
import { localeSlice } from './localeSlice';
import { productApi } from './../api/productApi';
import { appLoadingSlice } from './appLoadingSlice';
import { apiSlice } from '../api';
import { countrySlice } from '@/redux/slices/countrySlice';
import { appSettingSlice } from '@/redux/slices/appSettingSlice';
import { authSlice } from '@/redux/slices/authSlice';
import { storeApi } from '@/redux/api/storeApi';
import { categoryApi } from '@/redux/api/categoryApi';
import { cartSlice } from '@/redux/slices/cartSlice';
import { searchParamsSlice } from '@/redux/slices/searchParamsSlice';
import { vendorApi } from '@/redux/api/vendorApi';
import { currentElementSlice } from '@/redux/slices/currentElementSlice';
import { orderSlice } from '@/redux/slices/orderSlice';
import { addressSlice } from './addressSlice';
import { locationApi } from '@/redux/api/locationApi';
import { branchApi } from '@/redux/api/branchApi';
import { vendorSlice } from '@/redux/slices/vendorSlice';
import { branchSlice } from '@/redux/slices/branchSlice';

export const rootReducer = combineReducers({
  [appLoadingSlice.name]: appLoadingSlice.reducer,
  [localeSlice.name]: localeSlice.reducer,
  [countrySlice.name]: countrySlice.reducer,
  [vendorSlice.name]: vendorSlice.reducer,
  [branchSlice.name]: branchSlice.reducer,
  [appSettingSlice.name]: appSettingSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [appLoadingSlice.name]: appLoadingSlice.reducer,
  [cartSlice.name]: cartSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [searchParamsSlice.name]: searchParamsSlice.reducer,
  [addressSlice.name]: addressSlice.reducer,
  [currentElementSlice.name]: currentElementSlice.reducer,
  [apiSlice.reducerPath]: productApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [locationApi.reducerPath]: locationApi.reducer,
  [branchApi.reducerPath]: branchApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [storeApi.reducerPath]: storeApi.reducer,
  [vendorApi.reducerPath]: vendorApi.reducer,
});
