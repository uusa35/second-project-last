import {
  takeLatest,
  call,
  put,
  all,
  throttle,
  takeEvery,
  debounce,
} from 'redux-saga/effects';
import { persistor } from './../store';
import {
  startChangeLangScenario,
  startEnableLoadingScenario,
  startShowToastMessageScenario,
  startSetLoginScenario,
  startSetLogOutScenario,
  startEnableGuestModeScenario,
  startOrderMadeScenario,
  startResetAppScenario,
} from './appSaga';
import { orderSlice } from '@/redux/slices/orderSlice';
import { appSettingSlice } from '@/redux/slices/appSettingSlice';
import { appLoadingSlice } from '@/redux/slices/appLoadingSlice';
import { localeSlice } from '@/redux/slices/localeSlice';
import { authSlice } from '@/redux/slices/authSlice';

export function* triggerResetApp() {
  yield takeLatest(`resetApp`, startResetAppScenario);
}

export function* triggerEnableLoading() {
  yield takeLatest(
    `${appLoadingSlice.actions.enableAppLoading}`,
    startEnableLoadingScenario
  );
}

export function* triggerChangeLang() {
  yield takeLatest(`${localeSlice.actions.setLocale}`, startChangeLangScenario);
}

export function* triggerSetLogin() {
  yield takeLatest(`${authSlice.actions.setLogin}`, startSetLoginScenario);
}

export function* triggerSetLogout() {
  yield takeLatest(`${authSlice.actions.logout}`, startSetLogOutScenario);
}


export function* triggerOrderMade() {
  yield takeLatest(`${orderSlice.actions.orderMade}`, startOrderMadeScenario);
}

export function* triggerShowToastMessage() {
  yield takeLatest(
    // yield debounce(
    // 1000,
    `${appSettingSlice.actions.showToastMessage}`,
    // `appSetting/showToastMessage`,
    startShowToastMessageScenario
  );
}
