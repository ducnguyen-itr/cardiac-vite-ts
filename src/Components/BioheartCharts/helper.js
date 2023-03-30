import _ from 'lodash';
import moment from 'moment';
import { REPORT_TIME_TYPE_ENUM, SPAN_DATA_INTERVAL_ENUM, TICK_INTERVAL_CHART_ENUM } from '../../Constants/chart';

export const findShortDashRange = (data, countNullStrategies = 3) => {
  if (!data || data.length === 0) {
    return {
      shortDashRanges: [],
    };
  }
  let countNull = 0;
  const shortDashRanges = [];
  for (let index = 0; index < data.length; index += 1) {
    if (!data[index].y) {
      countNull += 1;
    } else {
      if (countNull <= countNullStrategies && countNull > 0) {
        shortDashRanges.push({
          from: (index - countNull - 1) > 0 ? data[index - countNull - 1] : data[0],
          to: data[index],
        });
      }
      countNull = 0;
    }
  }
  return {
    shortDashRanges: _.filter(shortDashRanges, item => item.from.y && item.to.y),
  };
};

export const findPointsChart = (data) => {
  if (!data || data.length === 0) {
    return {
      points: [],
    };
  }
  const points = _.cloneDeep(data);
  for (let index = 0; index < data.length; index += 1) {
    if (index > 0 && index < data.length - 1 && (!data[index - 1].y && data[index].y && !data[index + 1].y)) {
      points[index] = data[index];
    } else if (index === 0 && data[index].y && !data[index + 1].y) {
      points[index] = data[index];
    } else if (index === data.length - 1 && data[index].y && !data[index - 1].y) {
      points[index] = data[index];
    } else {
      points[index].y = null;
    }
  }
  return {
    points,
  };
};


const getIntervalAndRangeData = ({ type = REPORT_TIME_TYPE_ENUM.DAY, currentDate = moment(), isRHRorHRV = false }) => {
  switch (type) {
    case REPORT_TIME_TYPE_ENUM.YEAR:
      return {
        interval: SPAN_DATA_INTERVAL_ENUM.ONE_MONTH,
        range: 12,
      };
    case REPORT_TIME_TYPE_ENUM.MONTH:
      return {
        interval: SPAN_DATA_INTERVAL_ENUM.ONE_DAY,
        range: moment(currentDate).daysInMonth(),
      };
    case REPORT_TIME_TYPE_ENUM.WEEK:
      return {
        interval: isRHRorHRV ? SPAN_DATA_INTERVAL_ENUM.ONE_DAY : SPAN_DATA_INTERVAL_ENUM.SIX_HOURS,
        range: isRHRorHRV ? 7 : 28,
      };
    case REPORT_TIME_TYPE_ENUM.DAY:
      return {
        interval: SPAN_DATA_INTERVAL_ENUM.THIRDTY_MINUTES,
        range: 48,
      };
    case REPORT_TIME_TYPE_ENUM.TEN_MINS:
      return {
        interval: SPAN_DATA_INTERVAL_ENUM.ONE_MINUTE,
        range: 10,
      };
    default:
      return {
        interval: SPAN_DATA_INTERVAL_ENUM.ONE_MINUTE,
        range: 60,
      };
  }
};


const getXAxisValue = ({
  type = REPORT_TIME_TYPE_ENUM.DAY,
  date = moment().valueOf(),
  interval = 1800000,
  isHeartRateChart = false,
}) => {
  if (type === REPORT_TIME_TYPE_ENUM.DAY && !isHeartRateChart) {
    return date;
  }
  if (type === REPORT_TIME_TYPE_ENUM.HOUR && isHeartRateChart) {
    return date;
  }
  if (type === REPORT_TIME_TYPE_ENUM.YEAR) {
    const daysInMonth = moment(date).daysInMonth();
    return moment(date).add(Number.parseInt(daysInMonth / 2, 10), 'd').valueOf();
  }
  return date + interval / 2;
};

export const spanHeartRateDataByType = ({
  type = REPORT_TIME_TYPE_ENUM.HOUR,
  currentDate = moment(),
  data = { mins: [], maxs: [], avgs: [] },
}) => {
  // this function is use for start from 00 and end at 59 or 00
  const ranges = [];
  const averages = [];
  let curDate = moment(currentDate).startOf(type).valueOf();
  if (type !== REPORT_TIME_TYPE_ENUM.HOUR) {
    ranges.push({
      x: curDate, low: null, high: null,
    });
    averages.push({
      x: curDate, y: null,
    });
  }
  const { interval, range } = getIntervalAndRangeData({ type, currentDate });
  let dataIndex = 0;
  for (let i = 0; i < range; i += 1) {
    const x = getXAxisValue({
      type, interval, date: curDate, isHeartRateChart: true,
    });
    if (data.mins[dataIndex]?.time === curDate) {
      ranges.push({ x, low: data.mins[dataIndex].value, high: data.maxs[dataIndex].value });
      averages.push({ x, y: data.avgs[dataIndex].value });
      dataIndex += 1;
    } else {
      ranges.push({ x, low: null, high: null });
      averages.push({ x, y: null });
    }
    if (type === REPORT_TIME_TYPE_ENUM.YEAR) {
      curDate = moment(curDate).add(1, 'month').startOf('month').valueOf();
    } else {
      curDate += interval;
    }
  }
  return { ranges, averages };
};


export const getLabelFormatterAndTickInterval = (type) => {
  switch (type) {
    case REPORT_TIME_TYPE_ENUM.YEAR:
      return {
        labelFormatter: 'MMM',
        tickInterval: TICK_INTERVAL_CHART_ENUM.YEAR,
      };
    case REPORT_TIME_TYPE_ENUM.MONTH:
      return {
        labelFormatter: 'D',
        tickInterval: TICK_INTERVAL_CHART_ENUM.MONTH,
      };
    case REPORT_TIME_TYPE_ENUM.WEEK:
      return {
        labelFormatter: 'ddd',
        tickInterval: TICK_INTERVAL_CHART_ENUM.WEEK,
      };
    case REPORT_TIME_TYPE_ENUM.DAY:
      return {
        labelFormatter: 'h A',
        tickInterval: TICK_INTERVAL_CHART_ENUM.DAY,
      };
    default:
      return {
        labelFormatter: 'h:mm A',
        tickInterval: TICK_INTERVAL_CHART_ENUM.HOUR,
      };
  }
};

export const spanRestingHeartRateDataByType = ({
  type = REPORT_TIME_TYPE_ENUM.DAY,
  currentDate = moment(),
  data = { avgs: [] },
  isRHRorHRV = false,
}) => {
  const avgs = [];
  let curDate = moment(currentDate).startOf(type).valueOf();
  avgs.push({
    x: curDate, y: null,
  });
  const { interval, range } = getIntervalAndRangeData({ type, currentDate, isRHRorHRV });
  let dataIndex = 0;
  for (let i = 0; i < range; i += 1) {
    const x = getXAxisValue({
      type, interval, date: curDate, isHeartRateChart: true,
    });
    if (data.avgs[dataIndex]?.time === curDate) {
      avgs.push({ x, y: data.avgs[dataIndex].value });
      dataIndex += 1;
    } else {
      avgs.push({ x, y: null });
    }
    if (type === REPORT_TIME_TYPE_ENUM.YEAR) {
      curDate = moment(curDate).add(1, 'month').startOf('month').valueOf();
    } else {
      curDate += interval;
    }
  }
  return { avgs };
};

export const spanActivityDataByType = ({ type = REPORT_TIME_TYPE_ENUM.DAY, currentDate = moment(), data = [] }) => {
  const result = [{ x: currentDate, y: null }];
  let curDate = moment(currentDate).startOf(type).valueOf();
  const { interval, range } = getIntervalAndRangeData({ type, currentDate });
  let dataIndex = 0;
  for (let i = 0; i < range; i += 1) {
    const x = getXAxisValue({ type, interval, date: curDate });
    if (data[dataIndex]?.time === curDate) {
      result.push({ x, y: data[dataIndex].value / 60 });
      dataIndex += 1;
    } else {
      result.push({ x, y: null });
    }
    if (type === REPORT_TIME_TYPE_ENUM.YEAR) {
      curDate = moment(curDate).add(1, 'month').startOf('month').valueOf();
    } else {
      curDate += interval;
    }
  }
  return result;
};
