import moment from 'moment';

export const disabledDate = (current, dates, startDate) => {
  // disabled future date
  if (moment().endOf('day').isBefore(moment(current).endOf('day'))) {
    return true;
  }
  // disabled before start date
  if (startDate && moment(current).endOf('day').isBefore(moment(startDate).endOf('day'))) {
    return true;
  }

  return false;
};

export default disabledDate;
