import AppFlowActions from '../../Constants/appFlowActions';
import initialState from './initialState';

const notificationCounts = (state = initialState.notificationCounts, action) => {
  switch (action.type) {
    case AppFlowActions.FETCH_NOTIFICATION_COUNT_COMPLETE: {
      const { data } = action;
      return { ...state, ...data };
    }
    default: {
      return state;
    }
  }
};

export default notificationCounts;
