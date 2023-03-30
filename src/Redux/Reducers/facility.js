import _ from 'lodash';
import initialState from './initialState';
import { FACILITY_ACTIONS } from '../../Constants';

const {
  SET_FACILITY, INIT_FACILITY,
} = FACILITY_ACTIONS;

const facility = (state = initialState.facility, action) => {
  switch (action.type) {
    case SET_FACILITY: {
      if (_.isEmpty(action.data)) {
        return {};
      }
      return { ...state, ...action.data };
    }
    default: {
      return { ...state };
    }
  }
};

export default facility;
