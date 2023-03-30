import _ from 'lodash';

export const QOL_COLORS_DATA = [
  '#ff85c0',
  '#ffc53d',
  '#95de64',
  '#9254de',
  '#FF4D4F',
  '#87E8DE',
];

export const QOL_LABELS_DATA = [
  'General health',
  'Limitations of activities',
  'Physical health problems',
  'Emotional health problems',
  'Social activities',
  'Energy and emotions',
];


export const BLOODWORK = 'Bloodwork';

export const MEDICAL_TEST_RESULT_TABS = [
  'Stress test', BLOODWORK, 'Echocardiogram', 'Heart studies', 'Other tests',
];

export const MEDICAL_TEST_RESULT_TYPES = [
  'stressTest',
  'completeBloodCount',
  'liverFunction',
  'fastingBloodSugar',
  'lipidProfile',
  'inr',
  'tsh',
  'creatinine',
  'hgbA1C',
  'lvef',
  'heartStudies',
  'otherTest',
];

export const BLOODWORK_ARRAY = [
  'Complete blood count',
  'Liver function testing',
  'Fasting blood sugar',
  'Lipid profile',
  'INR',
  'TSH',
  'Creatinine',
  'HbA1c',
];

export const MEDICAL_TEST_RESULT_TITLES = [
  // remove Heart studies
  'Stress test', ...BLOODWORK_ARRAY, 'Echocardiogram', 'Heart studies', 'Other tests',
];

export const MEDICAL_TEST_RESULT_MENU = [
  {
    name: MEDICAL_TEST_RESULT_TABS[0],
  },
  {
    name: MEDICAL_TEST_RESULT_TABS[1],
    sub: _.map(BLOODWORK_ARRAY, x => ({ name: x })),
  },
  {
    name: MEDICAL_TEST_RESULT_TABS[2],
  },
  // {
  //   name: MEDICAL_TEST_RESULT_TABS[3],
  // },
  {
    name: MEDICAL_TEST_RESULT_TABS[4],
  },
];

export const PATIENT_DETAIL_TAB = {
  OVERVIEW: 'OVERVIEW',
  CARE_PLAN: 'CARE_PLAN',
  MEDICAL_TEST_RESULTS: 'MEDICAL_TEST_RESULTS',
  REFACTORED_MEDICAL_TEST_RESULTS: 'REFACTORED_MEDICAL_TEST_RESULTS',
  HEART_MONITOR: 'HEART_MONITOR:',
  REPORTS: 'REPORTS',
  TIME_TRACKING: 'TIME_TRACKING',
  CHANGE_HISTORY: 'CHANGE_HISTORY',
  MEDICAL_RECORDS: 'MEDICAL_RECORDS',
  DAILY_ENTRY: 'DAILY_ENTRY',
  INITIAL_INTAKE_INFO: 'INITIAL_INTAKE_INFO',
  BASELINE_INFO: 'BASELINE_INFO',
  DEMOGRAPHICS: 'DEMOGRAPHICS',
};

export const DEFAULT_COUNTRY = {
  isInUse: true,
  name: 'United States',
  label: 'United States',
  alpha2: 'US',
  value: 'US',
  alpha3: 'USA',
  numeric: 840,
  dial: '1',
  flag: '🇺🇸',
};
