import _ from 'lodash';
import {
  take, all, call, put, fork,
} from 'redux-saga/effects';

import { NOTIFICATION_CENTER_SOCKET_TYPES } from '../../Constants';
import AppFlowActions from '../../Constants/appFlowActions';
import fetchNotifications from '../../Apollo/Functions/Fetch/fetchNotifications';
import fetchNotification from '../../Apollo/Functions/Fetch/fetchNotification';
import fetchCountNotificationUnRead from '../../Apollo/Functions/Fetch/fetchCountNotificationUnRead';
import consoleLog from '../../Helpers/consoleLog';

const fetchNotificationFunction = async (sendingData) => {
  try {
    const notificaiton = await fetchNotification(sendingData);
    if (_.isEmpty(notificaiton)) return [];
    return [notificaiton];
  } catch (error) {
    consoleLog('Failed to fetch notification', error);
    return [];
  }
};

const fetchNotificationsFunction = async (sendingData) => {
  try {
    return await fetchNotifications(sendingData);
  } catch (error) {
    consoleLog('Failed to fetch notifications', error);
    return [];
  }
};

const fetchUnreadNotificationsCountFunction = async () => {
  const sendingData = { filter: { source: 'CARDIAC' } };
  try {
    return await fetchCountNotificationUnRead(sendingData);
  } catch (error) {
    consoleLog('Failed to fetch unread notifications count', error);
    return 0;
  }
};

export function* fetchNotificationsRequest() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.FETCH_NOTIFICATIONS_REQUEST);
    const { data } = request;
    if (data.isLoadMore) {
      const notifications = yield call(fetchNotificationsFunction, data.sendingData);
      yield put({
        type: AppFlowActions.FETCH_NOTIFICATIONS_COMPLETE,
        data: {
          notifications,
          isLoadMore: true,
        },
      });
      if (notifications.length > 0) {
        yield put({ type: AppFlowActions.UPDATE_IS_END_OF_NOTIFICATIONS_REQUEST, data: false });
      } else {
        yield put({ type: AppFlowActions.UPDATE_IS_END_OF_NOTIFICATIONS_REQUEST, data: true });
      }
    } else {
      const [notifications, unreadNotificationsCount] = yield all([
        call(fetchNotificationsFunction, data.sendingData),
        call(fetchUnreadNotificationsCountFunction),
      ]);
      yield put({
        type: AppFlowActions.FETCH_NOTIFICATIONS_COMPLETE,
        data: {
          notifications,
          isLoadMore: false,
        },
      });
      yield put({
        type: AppFlowActions.UPDATE_UNREAD_NOTIFICATION_COUNT_REQUEST,
        data: unreadNotificationsCount,
      });
      if (notifications.length > 0) {
        yield put({ type: AppFlowActions.UPDATE_IS_END_OF_NOTIFICATIONS_REQUEST, data: false });
      } else {
        yield put({ type: AppFlowActions.UPDATE_IS_END_OF_NOTIFICATIONS_REQUEST, data: true });
      }
    }
  }
}

export function* fetchNotificationRequest() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.FETCH_NOTIFICATION_REQUEST);
    const { data } = request;
    // const [notification, unreadNotificationsCount] = yield all([
    //   call(fetchNotificationFunction, data.sendingData),
    //   call(fetchUnreadNotificationsCountFunction),
    // ]);

    const [notification, unreadNotificationsCount] = yield all([
      call(fetchNotificationFunction, data.sendingData),
      call(fetchUnreadNotificationsCountFunction),
    ]);

    yield put({
      type: AppFlowActions.FETCH_NOTIFICATION_COMPLETE,
      data: {
        notification,
        isLoadMore: false,
      },
    });
    yield put({
      type: AppFlowActions.UPDATE_UNREAD_NOTIFICATION_COUNT_REQUEST,
      data: unreadNotificationsCount,
    });
  }
}

export default function* notificationsFlow() {
  yield fork(fetchNotificationsRequest);
  yield fork(fetchNotificationRequest);
}
