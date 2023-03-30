import Auth from '@aws-amplify/auth';
import _ from 'lodash';
import { combineReducers } from 'redux';
import { NOTIFICATION_CENTER_SOCKET_TYPES } from '../../Constants';
import AppFlowActions from '../../Constants/appFlowActions';
import auth from '../../Helpers/auth';
import socketIO from '../../Utils/socketIO';
import facility from './facility';
import initialState from './initialState';
import isEndOfNotifications from './isEndOfNotifications';
import isLoading from './isLoading';
import login from './login';
import leavePopUp from './leavePopUp';
import notificationCounts from './notificationCounts';
import notifications from './notifications';
import savePath from './savePath';
import unreadNotificationCount from './unreadNotificationCount';
import histories from './histories';
import messages from './messages';
import country from './country';


const appReducer = combineReducers({
  isLoading,
  login,
  savePath,
  facility,
  notifications,
  unreadNotificationCount,
  isEndOfNotifications,
  leavePopUp,
  notificationCounts,
  histories,
  messages,
  country,
});

const rootReducer = (state, action) => {
  switch (action.type) {
    case AppFlowActions.UPDATE_NOTIFICATIONS_REQUEST: {
      const { type, _id } = action.data;
      const clonedNotifications = _.cloneDeep(state.notifications);
      let unreadNotificationCount = state.unreadNotificationCount || 0;

      if (type === NOTIFICATION_CENTER_SOCKET_TYPES.DELETE) { // delete 1
        const removedNotification = _.remove(clonedNotifications, x => x?._id === _id);

        if (removedNotification?.length !== 0 && !removedNotification[0].isRead) {
          unreadNotificationCount -= 1;
        }
      } else { // mark 1
        const item = _.find(clonedNotifications, x => x._id === _id);
        if (!_.isEmpty(item)) {
          _.assign(item, { status: 'Read' });
          unreadNotificationCount -= 1;
        }
      }
      return { ...state, notifications: clonedNotifications, unreadNotificationCount };
    }
    case AppFlowActions.LOGOUT_REQUEST: {
      // *: Leave room
      Auth.signOut(true);
      socketIO.leaveRoom(auth.userId());
      _.map(auth.getFacilities() || [], (x) => {
        socketIO.leaveRoom(x._id);
      });
      auth.logout();
      socketIO.disconnectSocket();
      console.clear();
      return initialState;
    }
    default: {
      return appReducer(state, action);
    }
  }
};

export default rootReducer;
