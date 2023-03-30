export const ActivityTypeEnum = {
  Walking: 'Walking',
  Lying: 'Lying',
  Standing: 'Standing',
  Resting: 'Resting',
  All: 'All',
  Unknown: 'Unknown',
};


export const HeartRateQueryEnum = {
  HR: 'HR',
  RESTING_HR: 'RESTING_HR',
  HRV: 'HRV',
  ACTIVE_MINUTES: 'ACTIVE_MINUTES',
  DAYS_HAVE_HR: 'DAY_HAVE_HR',
  ACTIVITY_HR: 'ACTIVITY_HR',
};

export const BIOHEART_REPORT_TIME_TYPE = {
  Hour: 'Hour',
  Day: 'Day',
  Week: 'Week',
  Month: 'Month',
  ThreeMonths: 'ThreeMonths',
  SixMonths: 'SixMonths',
  NineMonths: 'NineMonths',
  Year: 'Year',
};

export const BIOHEART_INTERVAL_INPUT = {
  HALF_HOUR: '30m',
  SIX_HOUR: '6h',
  DAY: '1d',
  WEEK: '7d',
  MONTH: '1month',
};

export const REPORT_TIME_TYPE_ENUM = {
  DAY: 'Day',
  HOUR: 'Hour',
  MONTH: 'Month',
  WEEK: 'Week',
  YEAR: 'Year',
  TEN_MINS: 'TenMins',
};

export const SPAN_DATA_INTERVAL_ENUM = {
  // 1000 * 3600 * 24 * 30
  ONE_MONTH: 2592000000,
  // 1000 * 3600 * 24
  ONE_DAY: 86400000,
  // 1000 * 3600 * 6
  SIX_HOURS: 21600000,
  // 1000 * 60 * 30
  THIRDTY_MINUTES: 1800000,
  // 1000 * 60 * 5
  FIVE_MINUTES: 300000,
  // 1000 * 60 * 1
  ONE_MINUTE: 60000,
  // 1000 * 3600 * 24 * 7
  WEEK: 604800000,
  TWO_WEEK: 604800000 * 2,
  TWO_DAY: 86400000 * 2,
  FOUR_HOURS: 3600000 * 4,
};

export const RANGE_OF_CHART = {
  DAY: 48, // 24 / 0.5
  WEEK: 28, // 4 * 7
  NINE_MONTH: 9,
  YEAR: 12,
};
