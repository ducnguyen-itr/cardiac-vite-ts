import AppFlowActions from '../../Constants/appFlowActions';
import initialState from './initialState';

const isEndOfNotifications = (state = initialState.isEndOfNotifications, action) => {
  switch (action.type) {
    case AppFlowActions.UPDATE_IS_END_OF_NOTIFICATIONS_REQUEST: {
      return action.data;
    }
    default: {
      return state;
    }
  }
};

export default isEndOfNotifications;
