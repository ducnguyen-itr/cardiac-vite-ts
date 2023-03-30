import AppFlowActions from '../../Constants/appFlowActions';
import initialState from './initialState';

const isLoading = (state = initialState.isLoading, action) => {
  switch (action.type) {
    case AppFlowActions.DISPLAY_LOADING: {
      return action.data;
    }
    default: {
      return state;
    }
  }
};

export default isLoading;
