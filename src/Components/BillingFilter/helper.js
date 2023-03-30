import { label } from 'aws-amplify';
import _ from 'lodash';
import moment from 'moment';
import { BILL_STATUS_OPTIONS } from '../../Constants/timeTracking';


export const isDisabledClear = (state) => {
  const {
    status, duration, startDate, endDate, programTypes,
  } = state || {};
  if (_.isEmpty(duration) && _.isEmpty(status) && !startDate && !endDate && _.isEmpty(programTypes)) {
    return true;
  }
  return false;
};
export const disabledEndDate = (current, startDate) => {
  if (!startDate) return false;
  if (moment(startDate).add(1, 'days').endOf('day').isAfter(moment(current).endOf('day'))) {
    return true;
  }
  return false;
};

export const disabledStartDate = (current, endDate) => {
  if (!endDate) return false;
  if (moment(endDate).subtract(1, 'days').endOf('day').isBefore(moment(current).endOf('day'))) {
    return true;
  }
  return false;
};

export const getBillStatus = (status = []) => {
  if (_.isEmpty(status)) return [];
  return _.map(status, (x) => {
    const obj = _.find(BILL_STATUS_OPTIONS, option => option.label === x);
    return obj.value;
  });
};

export const getStatusBill = (status) => {
  if (_.isEmpty(status)) return [];
  return _.map(status, (x) => {
    const obj = _.find(BILL_STATUS_OPTIONS, option => option.value === x);
    return obj.label;
  });
};

export const getNewFilter = (state = {}) => {
  const {
    status, duration, startDate, endDate, programTypes,
  } = state || {};
  const billStatus = getBillStatus(status);
  return {
    startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : undefined,
    stopDate: endDate ? moment(endDate).format('YYYY-MM-DD') : undefined,
    status: duration,
    billStatus: _.isEmpty(billStatus) ? undefined : billStatus,
    programTypes: _.isEmpty(programTypes) ? undefined : programTypes,
  };
};

export const isEmptyFilter = (state = {}) => {
  if (_.isEmpty(state)) return true;
  let isEmpty = true;
  _.forEach(Object.keys(state), (key) => {
    if (!_.isEmpty(state?.[key])) {
      isEmpty = false;
    }
  });
  return isEmpty;
};

export const getInitState = (saveFilter = {}) => {
  if (_.isEmpty(saveFilter)) {
    return {
      duration: [],
      status: [],
      startDate: null,
      endDate: null,
      isFiltered: false,
      programTypes: [],
    };
  }
  const {
    billStatus, startDate, status, stopDate, programTypes,
  } = saveFilter || {};
  const state = {
    duration: status || [],
    status: getStatusBill(billStatus),
    startDate: startDate ? moment(startDate, 'YYYY-MM-DD') : null,
    endDate: stopDate ? moment(stopDate, 'YYYY-MM-DD') : null,
    programTypes,
  };
  return {
    ...state,
    isFiltered: !isEmptyFilter(state),
  };
};
