import AppFlowActions from '../../Constants/appFlowActions';
import initialState from './initialState';

const notifications = (state = initialState.notifications, action) => {
  switch (action.type) {
    case AppFlowActions.FETCH_NOTIFICATIONS_COMPLETE: {
      const { data } = action;
      if (data.isLoadMore) {
        return [...state, ...data.notifications];
      }
      return [...data.notifications];
    }
    case AppFlowActions.FETCH_NOTIFICATION_COMPLETE: {
      const { data } = action;
      return [...data.notification, ...state];
    }
    case AppFlowActions.DELETE_ALL_NOTIFICATIONS_REQUEST: {
      return [];
    }
    case AppFlowActions.UPDATE_NOTIFICATIONS_COMPLETE: {
      const { data } = action;
      return [...data.notifications];
    }
    default: {
      return state;
    }
  }
};

export default notifications;
