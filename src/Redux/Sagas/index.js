import { fork } from 'redux-saga/effects';

import loginFlow from './login';
import subcriptionMessageFlow from './messages';
import notificationsCountFlow from './notificationCounts';
import notificationsFlow from './notifications';
import reloadFlow from './reload';

export default function* root() {
  yield fork(loginFlow);
  yield fork(notificationsFlow);
  yield fork(reloadFlow);
  yield fork(notificationsCountFlow);
  yield fork(subcriptionMessageFlow);
}
