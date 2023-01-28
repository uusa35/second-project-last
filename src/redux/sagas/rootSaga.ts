import { fork, take, all, throttle } from 'redux-saga/effects';
import { REHYDRATE, PURGE } from 'redux-persist/lib/constants';
import {
  triggerChangeLang,
  triggerEnableLoading,
  triggerShowToastMessage,
  triggerSetLogin,
  triggerSetLogout,
  triggerResetApp,
  triggerResetEntireApp,
  triggerUpdateCartProductPrice,
} from './triggers';

export default function* rootSaga() {
  yield all([
    fork(triggerEnableLoading),
    fork(triggerChangeLang),
    fork(triggerSetLogin),
    fork(triggerSetLogout),
    fork(triggerShowToastMessage),
    fork(triggerResetApp),
    fork(triggerResetEntireApp),
    fork(triggerUpdateCartProductPrice),
  ]);
  yield take(REHYDRATE); // Wait for rehydrate to prevent sagas from running with empty store
  yield take(PURGE);
}
