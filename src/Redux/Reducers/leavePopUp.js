import { LEAVE_POP_ACTIONS } from '../../Constants';
import initialState from './initialState';

const leavePopUp = (state = initialState.leavePopUp, action) => {
  switch (action.type) {
    case LEAVE_POP_ACTIONS.SET_LEAVE_POP: {
      return { ...state, ...action.data };
    }
    default: {
      return state;
    }
  }
};

export default leavePopUp;
