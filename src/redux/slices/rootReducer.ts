import { combineReducers } from '@reduxjs/toolkit';
import { localeSlice } from './localeSlice';
import { appLoadingSlice } from './appLoadingSlice';
import { apiSlice } from '../api';
import { appSettingSlice } from '@/redux/slices/appSettingSlice';
import { cartSlice } from '@/redux/slices/cartSlice';
import { productCartSlice } from '@/redux/slices/productCartSlice';
import { orderSlice } from '@/redux/slices/orderSlice';
import { vendorSlice } from '@/redux/slices/vendorSlice';
import { branchSlice } from '@/redux/slices/branchSlice';
import { branchesSlice } from '@/redux/slices/branchesSlice';
import { areaSlice } from '@/redux/slices/areaSlice';
import { customerSlice } from '@/redux/slices/customerSlice';
// import { categoryApi } from '@/redux/api/categoryApi';
// import { vendorApi } from '@/redux/api/vendorApi';
// import { locationApi } from '@/redux/api/locationApi';
// import { branchApi } from '@/redux/api/branchApi';
// import { productApi } from './../api/productApi';

export const rootReducer = combineReducers({
  [appLoadingSlice.name]: appLoadingSlice.reducer,
  [localeSlice.name]: localeSlice.reducer,
  [vendorSlice.name]: vendorSlice.reducer,
  [branchSlice.name]: branchSlice.reducer,
  [areaSlice.name]: areaSlice.reducer,
  [branchesSlice.name]: branchesSlice.reducer,
  [appSettingSlice.name]: appSettingSlice.reducer,
  [cartSlice.name]: cartSlice.reducer,
  [customerSlice.name]: customerSlice.reducer,
  [productCartSlice.name]: productCartSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});
