import moment from 'moment';

export const VIEW_MODE_VALUE = {
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  THREE_MONTH: 'THREE_MONTH',
  SIX_MONTH: 'SIX_MONTH',
  NINE_MONTH: 'NINE_MONTH',
  YEAR: 'YEAR',
  CUSTOM: 'CUSTOM',
};

export const MULTIPLE_RECORD_MODE = [
  VIEW_MODE_VALUE.DAY, VIEW_MODE_VALUE.WEEK, VIEW_MODE_VALUE.MONTH,
];

export const GET_MULTIPLE_RECORT_TYPE = [
  VIEW_MODE_VALUE.DAY, VIEW_MODE_VALUE.WEEK, VIEW_MODE_VALUE.MONTH, VIEW_MODE_VALUE.THREE_MONTH, VIEW_MODE_VALUE.SIX_MONTH,
];

export const WEEK_DATA_TYPE = [
  VIEW_MODE_VALUE.THREE_MONTH, VIEW_MODE_VALUE.SIX_MONTH,
];

export const VIEW_MODE_OPTIONS = [
  {
    label: 'Day',
    value: VIEW_MODE_VALUE.DAY,
    chartView: VIEW_MODE_VALUE.DAY,
    numberVal: 1,
  },
  {
    label: 'Week',
    value: VIEW_MODE_VALUE.WEEK,
    chartView: VIEW_MODE_VALUE.WEEK,
    numberVal: 7,
  },
  {
    label: 'Month',
    value: VIEW_MODE_VALUE.MONTH,
    chartView: VIEW_MODE_VALUE.MONTH,
    numberVal: 30,
  },
  {
    label: '3 months',
    value: VIEW_MODE_VALUE.THREE_MONTH,
    chartView: VIEW_MODE_VALUE.THREE_MONTH,
    numberVal: 90,
  },
  {
    label: '6 months',
    value: VIEW_MODE_VALUE.SIX_MONTH,
    chartView: VIEW_MODE_VALUE.SIX_MONTH,
    numberVal: 180,
  },
  {
    label: '9 months',
    value: VIEW_MODE_VALUE.NINE_MONTH,
    chartView: VIEW_MODE_VALUE.NINE_MONTH,
    numberVal: 270,
  },
  {
    label: 'Year',
    value: VIEW_MODE_VALUE.YEAR,
    chartView: VIEW_MODE_VALUE.YEAR,
    numberVal: 360,
  },
  {
    label: 'Custom',
    value: VIEW_MODE_VALUE.CUSTOM,
  },
];

export const CHART_INTERVAL = {
  WEEK: 'Week',
  MONTH: 'Month',
  DAY: 'Day',
};

export const CHART_LIMIT_NUMBER = {
  DAY: 1,
  WEEK: 7,
  MONTH: 31,
  THREE_MONTH: 100,
  SIX_MONTH: 200,
};


export const COMMON_XAXIS = {
  type: 'datetime',
  gridLineDashStyle: 'longdash',
  gridLineWidth: 1,
  crosshair: true,
  showLastLabel: true,
  showFirstLabel: true,
  gridLineColor: 'transparent',
  endOnTick: true,
  labels: {
    formatter(value) {
      return moment(value.value).format('M/D');
    },
    align: 'center',
  },
  tickWidth: 0,
};

export const COMMON_XAXIS_BY_HOUR = {
  type: 'datetime',
  gridLineDashStyle: 'longdash',
  gridLineWidth: 1,
  crosshair: true,
  showLastLabel: true,
  showFirstLabel: true,
  gridLineColor: 'transparent',
  endOnTick: true,
  labels: {
    formatter(value) {
      return moment(value.value).format('hh A');
    },
    align: 'center',
  },
  tickWidth: 0,
};


export const NORMAL_CHART_VALUE = {
  MIN_BMI: 18.5,
  MAX_BMI: 24.9,
  AVG_MEDI_ADHERENCE: 50,
};

export const COMMON_LINE_SERIES = {
  // connectNulls: true,
  lineWidth: 0.5,
  marker: {
    symbol: 'circle',
    radius: 2.5,
    enabled: true,
  },
  states: {
    hover: {
      radius: 3,
    },
  },
};


export const HEART_RATE_LEGEND = (config) => {
  const data = [];
  if (config?.isEnableHeartRate) {
    data.push(
      {
        type: 'square',
        color: 'rgba(24, 144, 255, 0.15)',
        title: `Normal range: ${config?.minHeartRate || '--'} - ${config?.maxHeartRate || '--'} bpm`,
      },
    );
  }
  return data;
};

export const BMI_LEGEND = [
  {
    type: 'circle',
    color: '#2F54EB',
    title: 'BMI',
  },
  {
    type: 'square',
    color: 'rgba(24, 144, 255, 0.15)',
    title: 'Normal range: 18.5 - 24.9',
  },
];

export const OXY_HEART_RATE_LEGEND = [
  {
    type: 'circle',
    color: '#FA8C16',
    title: 'Oxygen saturation',
  },
  {
    type: 'square',
    color: '#ADC6FF',
    title: 'Heart rate',
  },
];


export const PRES_MEDI_LEGEND = [
  {
    type: 'dash',
    color: '#69C0FF',
    title: 'Average level',
  },
];

export const OXYGEN_LEGEND = (config = {}) => {
  const data = [];
  if (config?.isEnableOxygenSaturation) {
    data.push({
      type: 'square',
      color: 'rgba(24, 144, 255, 0.15)',
      title: `Normal range: ${config?.minOxygenSaturation || '--'} - ${config?.maxOxygenSaturation || '--'} %`,
    });
  }
  return data;
};

export const ACTIVITY_LEGEND = [
  {
    type: 'square',
    background: 'linear-gradient(180deg, #F759AB 42.19%, #BD28AE 100%)',
    title: 'Activity duration',
  },
  {
    type: 'circle',
    color: '#7CB305',
    title: 'Activity level',
  },
];

export const SLEEP_CHART_LEGEND = [
  {
    type: 'circle',
    color: '#7CB305',
    title: 'Sleep',
  },
  {
    type: 'circle',
    color: '#1890FF',
    title: 'Wake',
  },
  {
    type: 'circle',
    color: '',
    title: 'Sleep goal: 8 hours',
  },
];
export const SLEEP_LINE_CHART_LEGEND = [
  {
    type: 'circle',
    color: '',
    title: 'Sleep goal: 8 hours',
  },
];

export const BLOOD_HEART_RATE_LEGEND = (config) => {
  const data = [
    {
      type: 'circle',
      color: '#FA8C16',
      title: 'Systolic',
    },
  ];
  if (config?.isEnableBloodPressure) {
    data.push({
      type: 'square',
      color: 'rgba(250, 140, 22, 0.15)',
      title: `Systolic normal range: ${config?.minSystolic || '--'}-${config?.maxSystolic || '--'} mmHg`,
    });
  }
  data.push({
    type: 'circle',
    color: '#389E0D',
    title: 'Diastolic',
  });
  if (config?.isEnableBloodPressure) {
    data.push({
      type: 'square',
      color: 'rgba(56, 158, 13, 0.15)',
      title: `Diastolic normal range: ${config?.minDiastolic || '--'}-${config?.maxDiastolic || '--'} mmHg`,
    });
  }
  return data;
};

export const BODY_TEAM_RATE_LEGEND = (config) => {
  const data = [];

  if (config?.isEnableBodyTemperature) {
    data.push(
      {
        type: 'square',
        color: 'rgba(24, 144, 255, 0.15)',
        title: `Normal range: ${config?.minBodyTemperature} - ${config?.maxBodyTemperature} °F`,
      },
    );
  }
  return data;
};

export const WEIGHT_BMI_LEGEND = [
  {
    type: 'square',
    color: 'rgba(24, 144, 255, 0.15)',
    title: `Normal range: ${NORMAL_CHART_VALUE.MIN_BMI} - ${NORMAL_CHART_VALUE.MAX_BMI}  `,
  },
];

export const TICK_INTERVAL_ENUM = {
  HOURS: 7200000,
  FOUR_HOURS: 14400000,
  DAY: 86400000,
  TWO_DAY: 86400000 * 2,
  FIVE_DAY: 432000000,
  WEEK: 604800000,
  MONTH: 2592000000,
};

export const CHART_UNIT_ENUM = {
  BPM: 'bpm',
  MMHG: 'mmHg',
  PERCENT: '%',
  FAHRENHEIT: '°F',
  MIN: 'min',
  LB: 'lb',
};

export const CHART_TYPE_ENUM = {
  LINE: 'LINE',
  BLOOD_PRESSURE: 'BLOOD_PRESSURE',
  WEIGHT_BMI: 'WEIGHT_BMI',
  SLEEP_HOUR: 'SLEEP_HOUR',
};


export const getInterval = (type) => {
  switch (type) {
    case VIEW_MODE_VALUE.DAY:
      return CHART_INTERVAL.DAY;
    case VIEW_MODE_VALUE.WEEK:
      return CHART_INTERVAL.DAY;
    case VIEW_MODE_VALUE.MONTH:
      return CHART_INTERVAL.DAY;

    case VIEW_MODE_VALUE.THREE_MONTH:
      return CHART_INTERVAL.WEEK;
    case VIEW_MODE_VALUE.SIX_MONTH:
      return CHART_INTERVAL.WEEK;

    case VIEW_MODE_VALUE.NINE_MONTH:
      return CHART_INTERVAL.MONTH;
    case VIEW_MODE_VALUE.YEAR:
      return CHART_INTERVAL.MONTH;
    default:
      return CHART_INTERVAL.DAY;
  }
};

export const getLimit = (type) => {
  switch (type) {
    case VIEW_MODE_VALUE.DAY:
      return CHART_LIMIT_NUMBER.DAY;
    case VIEW_MODE_VALUE.WEEK:
      return CHART_LIMIT_NUMBER.WEEK;
    case VIEW_MODE_VALUE.MONTH:
      return CHART_LIMIT_NUMBER.MONTH;
    case VIEW_MODE_VALUE.THREE_MONTH:
      return CHART_LIMIT_NUMBER.THREE_MONTH;
    case VIEW_MODE_VALUE.SIX_MONTH:
      return CHART_LIMIT_NUMBER.SIX_MONTH;
    default:
      return CHART_LIMIT_NUMBER.MONTH;
  }
};
