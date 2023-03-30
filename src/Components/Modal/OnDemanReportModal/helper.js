import moment from 'moment';
import _ from 'lodash';
import handleAddOnDemandReport from '../../../Apollo/Functions/Handle/handleAddOnDemandReport';
import { showFailedMsg } from '../../../Utils/showNotification';
import consoleLog from '../../../Helpers/consoleLog';

export const isValidRangeTime = (startTime, endTime) => {
  if (_.isEmpty(startTime) || _.isEmpty(endTime)) {
    return false;
  }
  // start time < end time return false
  if (moment(startTime).endOf('day').isAfter(moment(endTime).endOf('day'))) {
    return false;
  }
  if (moment(endTime).diff(moment(startTime), 'days') < 6) {
    return false;
  }
  return true;
};

export const createNewOnDemandReport = async (sendingData) => {
  try {
    await handleAddOnDemandReport(sendingData);
  } catch (error) {
    showFailedMsg(error);
  }
};

export const disabledDate = (current, dates, startDate) => {
  // disabled future date
  if (moment().endOf('day').isBefore(moment(current).endOf('day'))) {
    return true;
  }
  // disabled before start date
  if (startDate && moment(current).endOf('day').isBefore(moment(startDate).endOf('day'))) {
    return true;
  }
  // disabled if careplan start less than 7 days
  // if (startDate && moment().endOf('day').diff(moment(startDate).endOf('day'), 'days') < 7) {
  //   return current && current > moment().endOf('day');
  // }

  // if (dates[0] && current.diff(dates[0], 'days') < 6 && !dates?.[1]) {
  //   return true;
  // }
  // const tooLate = dates[0] && current.diff(dates[0], 'days') > 29;
  // const tooEarly = dates[1] && dates[1].diff(current, 'days') > 29;
  return false;
};
