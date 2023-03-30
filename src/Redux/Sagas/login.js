import { put, take, fork } from 'redux-saga/effects';

import AppFlowActions from '../../Constants/appFlowActions';

export function* loginRequest() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.LOGIN_REQUEST);
    const { data } = request;
    const result = {
      isSuccess: true, user: { ...data }, photo: data.photo || '',
    };
    yield put({
      type: AppFlowActions.FETCH_NOTIFICATIONS_REQUEST,
      data: {
        sendingData: {
          filter: {
            type: undefined,
            cursor: undefined,
            sortOrder: 'desc',
            sortField: '_id',
          },
          limit: parseInt(window.innerHeight / 120, 10) + 1,
        },
        isLoadMore: false,
      },
    });
    yield put({ type: AppFlowActions.LOGIN_COMPLETE, data: result });
  }
}

export default function* loginFlow() {
  yield fork(loginRequest);
}
