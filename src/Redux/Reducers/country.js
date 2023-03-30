import _ from 'lodash';
import { COUNTRY_ACTIONS } from '../../Constants';
import initialState from './initialState';

const country = (state = initialState.country, action) => {
  switch (action.type) {
    case COUNTRY_ACTIONS.SET_COUNTRY: {
      if (_.isEmpty(action.data)) {
        return [];
      }
      return [...state, ...action.data];
    }
    default: {
      return [...state];
    }
  }
};

export default country;
