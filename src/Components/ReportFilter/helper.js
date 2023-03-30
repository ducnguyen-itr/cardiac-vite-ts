import { label } from 'aws-amplify';
import _ from 'lodash';
import moment from 'moment';
import { BILL_STATUS_OPTIONS } from '../../Constants/timeTracking';

export const isDisabledClear = (state) => {
  const {
    status, review,
  } = state || {};
  if (_.isEmpty(review) && _.isEmpty(status)) {
    return true;
  }
  return false;
};

export const isEmptyFilter = (state = {}) => {
  if (_.isEmpty(state)) return true;
  const { review, status } = state || {};
  if (!_.isEmpty(review) || !_.isEmpty(status)) {
    return false;
  }
  return true;
};
