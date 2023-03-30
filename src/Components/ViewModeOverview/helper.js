import moment from 'moment';
import { VIEW_MODE_VALUE } from '../../Constants/overview';
import { formatActivityHistory } from '../../Utils/timeTracking';

export const disabledDate = (current, dates, activityHistory) => {
  const { startDate, stopDate } = formatActivityHistory(activityHistory, true);
  if ((stopDate && moment(stopDate).endOf('day').isBefore(moment(current).endOf('day')))
    || moment().endOf('day').isBefore(moment(current).endOf('day'))) {
    return true;
  }
  if (startDate && moment(current).endOf('day').isBefore(moment(startDate).endOf('day'))) {
    return true;
  }
  if (dates?.[0] && Math.abs(current.diff(dates?.[0], 'days')) > 360) {
    return true;
  }
  if (dates?.[1] && Math.abs(current.diff(dates?.[1], 'days')) > 360) {
    return true;
  }

  return false;
};

export const getDateString = (dayValues) => {
  const { value, endTime, startTime } = dayValues || {};
  if (value === VIEW_MODE_VALUE.DAY) {
    return `${moment(endTime).format('MM-DD-YYYY') === moment().format('MM-DD-YYYY') ? 'Today, ' : ''}${moment(endTime).format('MMM DD, YYYY')}`;
  }

  if (value === VIEW_MODE_VALUE.WEEK) {
    return `${moment(startTime).format('YYYY') === moment(endTime).format('YYYY')
      ? moment(startTime).format('MMM DD, YYYY') : moment(startTime).format('MMM DD')} - ${moment(endTime).format('MMM DD,YYYY')}`;
  }

  if (value === VIEW_MODE_VALUE.MONTH) {
    return `${moment(endTime).format('MMMM, YYYY')}`;
  }

  if (value === VIEW_MODE_VALUE.YEAR) {
    return `${moment(endTime).format('YYYY')}`;
  }
  if (value === VIEW_MODE_VALUE.CUSTOM) {
    const startDay = moment(startTime).format('MMM DD, YYYY');
    const endDay = moment(endTime).format('MMM DD, YYYY');
    if (startDay === endDay) {
      const toDay = moment().format('MMM DD, YYYY');
      return `${toDay === endDay ? 'Today, ' : ''}${endDay}`;
    }
    return `${moment(startTime).format('YYYY') === moment(endTime).format('YYYY') ? moment(startTime).format('MMM DD') : startDay} - ${endDay}`;
  }

  return `${moment(startTime).format('YYYY') === moment(endTime).format('YYYY')
    ? moment(startTime).format('MMMM') : moment(startTime).format('MMMM, YYYY')} - ${moment(endTime).format('MMMM, YYYY')}`;
};

export const getStartEndTime = (item) => {
  const endTime = moment().endOf('day');
  switch (item?.value) {
    case VIEW_MODE_VALUE.DAY:
      return { endTime, startTime: moment(endTime).startOf('day') };
    case VIEW_MODE_VALUE.WEEK:
      return { endTime, startTime: moment(endTime).subtract(6, 'day').startOf('day') };
    case VIEW_MODE_VALUE.MONTH:
      return { endTime: moment().endOf('month'), startTime: moment(endTime).startOf('month') };
    case VIEW_MODE_VALUE.THREE_MONTH:
      return { endTime: moment().endOf('month'), startTime: moment(endTime).subtract(2, 'month').startOf('month') };
    case VIEW_MODE_VALUE.SIX_MONTH:
      return { endTime: moment().endOf('month'), startTime: moment(endTime).subtract(5, 'month').startOf('month') };
    case VIEW_MODE_VALUE.NINE_MONTH:
      return { endTime: moment().endOf('month'), startTime: moment(endTime).subtract(8, 'month').startOf('month') };
    case VIEW_MODE_VALUE.YEAR:
      return { endTime: moment().endOf('year'), startTime: moment(endTime).startOf('year') };
    default:
      return {};
  }
};

const formatInputTime = ({ diff, format, config }) => {
  const { data, isPrev } = config || {};
  const { endTime } = data || {};
  const newEndTime = isPrev ? moment(endTime).subtract(diff, format).endOf(format) : moment(endTime).add(diff, format).endOf(format);
  return { ...data, endTime: newEndTime, startTime: moment(newEndTime).subtract(diff - 1, format).startOf(format) };
};

export const getNewDate = (config = {}) => {
  const { data } = config || {};
  switch (data?.value) {
    case VIEW_MODE_VALUE.DAY: {
      return formatInputTime({ diff: 1, format: 'day', config });
    }
    case VIEW_MODE_VALUE.WEEK: {
      return formatInputTime({ diff: 7, format: 'day', config });
    }
    case VIEW_MODE_VALUE.MONTH: {
      return formatInputTime({ diff: 1, format: 'month', config });
    }
    case VIEW_MODE_VALUE.THREE_MONTH: {
      return formatInputTime({ diff: 3, format: 'month', config });
    }
    case VIEW_MODE_VALUE.SIX_MONTH: {
      return formatInputTime({ diff: 6, format: 'month', config });
    }
    case VIEW_MODE_VALUE.NINE_MONTH: {
      return formatInputTime({ diff: 9, format: 'month', config });
    }
    case VIEW_MODE_VALUE.YEAR: {
      return formatInputTime({ diff: 1, format: 'year', config });
    }
    default:
      return {};
  }
};

export const checkDisabledChangeDate = (config = {}) => {
  const {
    dayValues, activityHistory,
  } = config || {};
  const { startDate, stopDate } = formatActivityHistory(activityHistory, true);
  const { endTime, startTime } = dayValues;
  const lastDay = stopDate ? moment(stopDate).endOf('day').valueOf() : moment().endOf('day').valueOf();
  const firstDay = moment(startDate).endOf('day').valueOf();
  const endTimeFormat = moment(endTime).endOf('day').valueOf();
  const startTimeFormat = moment(startTime).endOf('day').valueOf();

  switch (dayValues?.value) {
    case VIEW_MODE_VALUE.DAY: {
      return { isDisabledNext: lastDay === endTimeFormat, isDisabledPrev: startTimeFormat === firstDay };
    }
    case VIEW_MODE_VALUE.CUSTOM:
      return { isDisabledNext: true, isDisabledPrev: true };
    default:
      return {
        isDisabledNext: lastDay === endTimeFormat || endTimeFormat > lastDay,
        isDisabledPrev: startTimeFormat === firstDay || startTimeFormat < firstDay,
      };
  }
};
export const getChartView = (dayNumber) => {
  if (dayNumber === 1) return VIEW_MODE_VALUE.DAY;
  if (dayNumber > 1 && dayNumber <= 7) return VIEW_MODE_VALUE.WEEK;
  if (dayNumber > 7 && dayNumber <= 30) return VIEW_MODE_VALUE.MONTH;
  if (dayNumber > 30 && dayNumber <= 90) return VIEW_MODE_VALUE.THREE_MONTH;
  if (dayNumber > 90 && dayNumber <= 180) return VIEW_MODE_VALUE.SIX_MONTH;
  if (dayNumber > 180 && dayNumber < 270) return VIEW_MODE_VALUE.NINE_MONTH;
  return VIEW_MODE_VALUE.YEAR;
};

export const isDisabledApply = (dates = []) => dates?.length < 2;
