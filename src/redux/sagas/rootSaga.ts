import { fork, take, all, throttle } from 'redux-saga/effects';
import { REHYDRATE, PURGE } from 'redux-persist/lib/constants';
import {
  triggerChangeLang,
  triggerEnableLoading,
  triggerShowToastMessage,
  triggerSetLogin,
  triggerSetLogout,
  triggerenableGuestMode,
  triggerOrderMade,
  triggerResetApp,
} from './triggers';

export default function* rootSaga() {
  yield all([
    fork(triggerEnableLoading),
    fork(triggerChangeLang),
    fork(triggerSetLogin),
    fork(triggerSetLogout),
    fork(triggerShowToastMessage),
    fork(triggerenableGuestMode),
    fork(triggerOrderMade),
    fork(triggerResetApp),
  ]);
  yield take(REHYDRATE); // Wait for rehydrate to prevent sagas from running with empty store
  yield take(PURGE);
}
