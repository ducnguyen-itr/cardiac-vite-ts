import AppFlowActions from '../../Constants/appFlowActions';
import initialState from './initialState';

const messages = (state = initialState.messages, action) => {
  switch (action.type) {
    case AppFlowActions.SET_MESSAGE_DATA: {
      const { data } = action;
      if (data.isLoadMore) {
        return { ...state, ...data };
      }
      return { ...data };
    }
    case AppFlowActions.UPDATE_MESSAGE_DATA: {
      const { data } = action;
      return { ...data };
    }

    case AppFlowActions.UPDATE_CONVERSATION_COMPLETE: {
      const { data } = action;
      return { ...state, ...data };
    }
    default: {
      return state;
    }
  }
};

export default messages;
