export const AUTO_MESSAGE_STATUS_ENUM = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
};

export const AUTO_MESSAGE_TRIGGER_TYPE_ENUM = {
  TIME: 'TIME',
  CONDITION: 'CONDITION',
};

export const AUTO_MESSAGE_FREQUENCY_ENUM = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
};

export const CARE_PLAN_STATUS_ENUM = {
  NEW: 'NEW',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETED: 'DELETED',

};

export const SORT_BY_ENUM = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export const MEDICATION_TYPE_ENUM = {
  PRESCRIPTION: 'PRESCRIPTION',
  OTHER: 'OTHER',
};

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

export const SORT_FIELD_ENUM = {
  ID: 'ID',

  // Care plan
  START_DATE: 'START_DATE',
  STOP_DATE: 'STOP_DATE',
  NURSE_ASSIGNED_DATE: 'NURSE_ASSIGNED_DATE',
  PHYSICIAN_ASSIGNED_DATE: 'PHYSICIAN_ASSIGNED_DATE',

  // Report
  TIME: 'TIME',
  SEND_REPORT_TIME: 'SEND_REPORT_TIME',

  // Time tracking
  FROM_DATE: 'FROM_DATE',
  TO_DATE: 'TO_DATE',

  // Care plan delete
  DELETED_DATE: 'DELETED_DATE',

  // Template - Auto message
  CREATED_AT: 'CREATED_AT',

  // Time log
  DATE: 'DATE',
  DURATION: 'DURATION',

  // Medications
  PRESCRIBE_AT: 'PRESCRIBE_AT',
};

export const TIME_LOG_STATUS_ENUM = {
  REVIEW: 'REVIEW',
  DONE: 'DONE',
};


export const CAREPLAN_SOURCE = {
  ATHENA: 'Athena',
  CARDIAC: 'Cardiac',
};

export const REPORT_STATUS_ENUM = {};

// this enum is user for receiving data
export const DEVICE_NAME_LIST = ['Biokit', 'Blood pressure cuff', 'PULSE_OXI_METER', 'WEIGHT_SCALE'];


// this enum is used for send data
export const DEVICE_NAME_ENUM = {
  BIOKIT: 'Biokit',

  BLOOD_PRESSURE_CUFF: 'Blood pressure cuff',

  PULSE_OXI_METER: 'Pulse oximeter',

  THERMOMETER: 'Thermometer',

  BIOHEART: 'Bioheart',

  WEIGHT_SCALE: 'Weight scale',

};

export const DEVICES = [
  {
    serverEnum: 'BIOKIT',
    displayName: 'Biokit',
    deviceName: 'Biokit',
    order: 1,
  },
  {
    serverEnum: 'BLOOD_PRESSURE_CUFF',
    displayName: 'Blood pressure cuff',
    deviceName: 'Blood pressure cuff',
    order: 2,
    tooltip: 'Biokit includes this device.',
  },
  {
    serverEnum: 'PULSE_OXI_METER',
    displayName: 'Pulse oximeter',
    deviceName: 'Pulse oximeter',
    order: 4,
    tooltip: 'Biokit includes this device.',
  },
  {
    serverEnum: 'THERMOMETER',
    displayName: 'Thermometer',
    deviceName: 'Thermometer',
    order: 3,
    tooltip: 'Biokit includes this device.',
  },
  {
    serverEnum: 'BIOHEART',
    displayName: 'Bioheart',
    deviceName: 'Bioheart',
    order: 5,
  },
  {
    serverEnum: 'WEIGHT_SCALE',
    displayName: 'Weight scale',
    deviceName: 'Weight scale',
    tooltip: 'Not available',
    order: 6,
  },
];

export const DEVICE_ORDER_ENUM = {
  BIOKIT: 1,
  BLOOD_PRESSURE_CUFF: 2,
  PULSE_OXI_METER: 3,
  THERMOMETER: 4,
  BIOHEART: 5,
  WEIGHT_SCALE: 6,
};

export const DEVICE_DISPLAY_NAME_ENUM = {
  BIOKIT: 'Biokit',
  BLOOD_PRESSURE_CUFF: 'Blood pressure monitor',
  PULSE_OXI_METER: 'Pulse oximeter',
  THERMOMETER: 'Thermometer',
  BIOHEART: 'Bioheart',
  WEIGHT_SCALE: 'Weight scale',
};

export const ENOUGH_TRANMISTION_DAY = 16;

export const MASTER_DATA_CODES_ENUM = {
  EXTERNAL_REPORT: 'EXTERNAL_REPORT',
};
