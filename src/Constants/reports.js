
export const REPORT_DETAIL_ENUM = {
  ON_DEMAND: 'on-demand',
  NOTIFICATION: 'notification',
  MONTHLY: 'monthly',
  HM_NOTIFICATION: 'hm-notification',
  HM_EOU: 'hm-end-of-use',
  BIOHEART: 'bioheart',
};
export const ON_DEMAND_REPORT_TYPE = {
  GENERATED: 'Generated',
  GENERATING: 'Generating',
  NONE: 'None',
};

export const BIOHHEART_REPORT_TYPE = {
  FAILED: 'Failed',
  INACTIVE: 'Inactive',
};

export const BIOHEART_PAGE_SIZE = 10;

export const BIOHEART_EXPLAIN = 'The patient must enable the Biocare cardiac intergration on the Bioheart mobile app to authorize permission.';


export const BIOHEART_FILTER = ['Failed', 'New', 'Read', 'Reviewed'];

export const STATUS_ENUM = {
  UNSENT: 'Unsent',
  SENT: 'Sent',
};

export const REVIEW_ENUM = {
  UNREVIEWED: 'Unreviewed',
  REVIEWED: 'Reviewed',
  FAILED: 'Failed',
};

export const REPORTSETTING_OVERVIEW_TYPE = {
  BLOOD_PRESSURE: 'bloodPressure',
  OXYGEN: 'oxygenSaturation',
  BIOKIT: 'Biokit',
  BLOOD_PRESSURE_CUFF: 'Blood pressure cuff',
  OXIMETER: 'Pulse oximeter',
};

export const REPORT_TABS_ENUM = {
  ON_DEMAND: 'on-demand',
  NOTIFICATION: 'notification',
  MONTHLY: 'monthly',
  BIOHEART: 'bioheart',
  ILR: 'ilr',
};

export const REPORT_FILTER = {
  name: 'review',
  label: 'review',
  options: [{
    value: REVIEW_ENUM.REVIEWED,
    label: REVIEW_ENUM.REVIEWED,
  }, {
    value: REVIEW_ENUM.UNREVIEWED,
    label: REVIEW_ENUM.UNREVIEWED,
  }],
};

export const REPORT_STATUS_FILTER = {
  name: 'status',
  label: 'status',
  options: [{
    value: STATUS_ENUM.SENT,
    label: STATUS_ENUM.SENT,
  }, {
    value: STATUS_ENUM.UNSENT,
    label: STATUS_ENUM.UNSENT,
  }],
};

export const BIOHEART_REPORT_STATUS_FILTER = {
  name: 'externalStatus',
  label: 'Status',
  options: [{
    value: REVIEW_ENUM.REVIEWED,
    label: REVIEW_ENUM.REVIEWED,
  }, {
    value: REVIEW_ENUM.UNREVIEWED,
    label: REVIEW_ENUM.UNREVIEWED,
  }, {
    value: REVIEW_ENUM.FAILED,
    label: 'Failed to generate',
  },
  ],
};

export const REPORT_TABS_LABEL = {
  ON_DEMAND: 'On-demand reports',
  NOTIFICATION: 'Notification reports',
  MONTHLY: 'Monthly reports',
  BIOHEART: 'Bioheart reports',
  ILR: 'ILR reports',
};


export const PATIENT_DETAIL_REPORT_TABS = [
  {
    label: 'On-demand reports',
    value: REPORT_TABS_ENUM.ON_DEMAND,
  },
  {
    label: 'Notification reports',
    value: REPORT_TABS_ENUM.NOTIFICATION,
  },
  {
    label: 'Monthly reports',
    value: REPORT_TABS_ENUM.MONTHLY,
  },
  {
    label: 'Bioheart reports',
    value: REPORT_TABS_ENUM.BIOHEART,
  },
];
