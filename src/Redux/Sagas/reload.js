import { takeLatest, put, fork } from 'redux-saga/effects';

import AppFlowActions from '../../Constants/appFlowActions';

function* reloadPageFunction() {
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
}

function* reloadPageRequest() {
  yield takeLatest(AppFlowActions.RELOAD_PAGE_REQUEST, reloadPageFunction);
}

export default function* reloadFlow() {
  yield fork(reloadPageRequest);
}
