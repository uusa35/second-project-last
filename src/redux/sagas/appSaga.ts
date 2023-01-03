import { call, put, delay, select, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import i18n from 'i18next';
import route from 'next/router';
import { toast, TypeOptions } from 'react-toastify';
import { Auth, Guest } from '@/types/queries';
import { appSettingSlice } from '@/redux/slices/appSettingSlice';
import { lowerCase, snakeCase } from 'lodash';
import { orderSlice } from '@/redux/slices/orderSlice';
import { apiLogin, apiLogout, apiVerified, appLinks } from '@/constants/*';
import { searchParamsSlice } from '@/redux/slices/searchParamsSlice';

export function* startResetAppScenario() {
  yield all([put({ type: `${searchParamsSlice.actions.resetSearchParams}` })]);
  // persistor.purge();
}

export function* startEnableLoadingScenario(action: PayloadAction) {
  try {
  } catch (e) {
  } finally {
  }
}

export function* startChangeLangScenario(action: PayloadAction<string>) {
  try {
    yield put({ type: `${appSettingSlice.actions.hideSideMenu}` });
    yield delay(2000);
    i18n.changeLanguage(action.payload);
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  } finally {
  }
}

export function* startShowToastMessageScenario(
  action: PayloadAction<{
    content: string;
    type: TypeOptions | undefined;
    title?: string;
  }>
) {
  try {
    const content = i18n.t(snakeCase(lowerCase(action.payload.content)));
    toast(content, { type: action.payload.type });
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  }
}

export function* startSetLoginScenario(action: PayloadAction<Auth>) {
  try {
    const { access_token, user }: any = action.payload;
    yield all([
      call(apiLogin, { access_token }),
      call(apiVerified, { verified: user.phone_verified === 1 }),
      put({
        type: `${appSettingSlice.actions.showToastMessage}`,
        payload: {
          content: user.phone_verified ? 'login_success' : 'verify_email',
          type: user.phone_verified ? 'success' : 'info',
        },
      }),
      // put({ type: `${guestSlice.actions.disableGuestMode}` }),
    ]);
    if (user.phone_verified !== 1) {
      route.router?.push(appLinks.verificationOTP.path);
    }
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  }
}

export function* startEnableGuestModeScenario(action: PayloadAction<Guest>) {
  try {
    yield all([
      put({
        type: `${appSettingSlice.actions.showToastMessage}`,
        payload: {
          content: 'logged_in_as_guest',
          type: 'success',
        },
      }),
    ]);
    yield delay(1000);
    route.router?.back();
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  }
}

export function* startOrderMadeScenario(action: PayloadAction<any>) {
  const { data } = action.payload;
  const {
    cart: { currentMode },
  } = yield select();
  if (data.success) {
    yield all([
      put({
        type: `${appSettingSlice.actions.showToastMessage}`,
        payload: {
          content: `redirecting_ur_order_please_wait`,
          type: 'warning',
        },
      }),
      put({
        type: `${orderSlice.actions.setOrder}`,
        payload: { orderMode: currentMode },
      }),
    ]);
    // K-net / Visa Case
    if (data.data.url && data.data.invoice_id) {
      yield put({
        type: `${orderSlice.actions.setInvoiceId}`,
        payload: data.data.invoice_id,
      });
      route.router?.replace({
        pathname: `${appLinks.orderRedirect.path}`,
        query: { url: data.data.url },
      });
      // COD case
    } else if (data.success && data.data.order_id) {
      yield all([
        delay(2000),
        put({ type: `${appSettingSlice.actions.hideToastMessage}` }),
      ]);
      yield all([
        put({
          type: `${appSettingSlice.actions.showToastMessage}`,
          payload: {
            content: data.message,
            type: 'success',
          },
        }),
        put({
          type: `${orderSlice.actions.setOrder}`,
          payload: data.data,
        }),
      ]);
      route.router?.replace({
        pathname: appLinks.orderSuccess.path,
      });
    }
  } else {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: data.message,
        type: 'error',
      },
    });
  }
  try {
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  }
}

export function* startSetLogOutScenario(action: PayloadAction<void>) {
  try {
    const { guest } = yield select();
    yield call(apiLogout); // Api Next server
    yield put({ type: `${appSettingSlice.actions.hideSideMenu}` });
    if (!guest.guestMode) {
      yield put({
        type: `${appSettingSlice.actions.showToastMessage}`,
        payload: {
          content: 'logout_success',
          type: 'warning',
        },
      });
    }
    route.router?.push('/');
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  }
}
