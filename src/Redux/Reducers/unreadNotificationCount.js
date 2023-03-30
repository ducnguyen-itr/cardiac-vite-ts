import AppFlowActions from '../../Constants/appFlowActions';
import initialState from './initialState';

const unreadNotificationCount = (state = initialState.unreadNotificationCount, action) => {
  switch (action.type) {
    case AppFlowActions.UPDATE_UNREAD_NOTIFICATION_COUNT_REQUEST: {
      return action.data;
    }
    case AppFlowActions.ADD_UNREAD_NOTIFICATION_COUNT_REQUEST: {
      return state + 1;
    }
    default: {
      return state;
    }
  }
};

export default unreadNotificationCount;
