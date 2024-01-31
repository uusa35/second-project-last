import {
  takeLatest,
  call,
  put,
  all,
  throttle,
  takeEvery,
  debounce,
} from 'redux-saga/effects';
import {
  startChangeLangScenario,
  startEnableLoadingScenario,
  startShowToastMessageScenario,
  startResetEnireAppSceanrio,
  startUpdateCartProductScenario,
} from './appSaga';
import { appSettingSlice } from '@/redux/slices/appSettingSlice';
import { appLoadingSlice } from '@/redux/slices/appLoadingSlice';
import { localeSlice } from '@/redux/slices/localeSlice';
import { productCartSlice } from '@/redux/slices/productCartSlice';
import { REHYDRATE } from 'redux-persist';

export function* triggerResetEntireApp() {
  yield takeLatest(['REHYDRATE',
    '__NEXT_REDUX_WRAPPER_HYDRATE__'
  ], startResetEnireAppSceanrio);
}

export function* triggerUpdateCartProductPrice() {
  yield takeLatest(
    `${productCartSlice.actions.addToCheckBox}`,
    startUpdateCartProductScenario
  );
  yield takeLatest(
    `${productCartSlice.actions.removeFromCheckBox}`,
    startUpdateCartProductScenario
  );
  yield takeLatest(
    `${productCartSlice.actions.addRadioBtn}`,
    startUpdateCartProductScenario
  );
  yield takeLatest(
    `${productCartSlice.actions.setCartProductQty}`,
    startUpdateCartProductScenario
  );
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

export function* triggerShowToastMessage() {
  yield takeLatest(
    // yield debounce(
    // 1000,
    `${appSettingSlice.actions.showToastMessage}`,
    // `appSetting/showToastMessage`,
    startShowToastMessageScenario
  );
}
