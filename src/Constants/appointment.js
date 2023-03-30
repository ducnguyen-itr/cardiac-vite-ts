
export const EVENT_STATUS = {
  DONE: 'Done',
  CANCELED: 'Canceled',
  OVERDUE: 'Overdue',
  ACTIVE: 'Active',
  FINISHED: 'Finished',
};

export const EVENT_TIME_STATUS = {
  BEFORE_BOOKING: 'before-booking',
  BEFORE_BOOKING_15: 'before-booking-15',
  IN_BOOKING: 'in-booking',
};

export const ClinicCancelEventEnum = {
  FOLLOWING_EVENTS: 'FOLLOWING_EVENTS',
  FUTURE_EVENTS: 'FUTURE_EVENTS',
};

export const EVENT_TYPE = {
  VIRTUAL: 'Virtual',
  INPERSON: 'InPerson',
  INPERSON_TEXT: 'In-person',
};

export const CANCEL_APPOINTMENT_TYPES = [
  'This appointment',
  'This and all following appointments',
  'All appointments in the series',
];


export const RECURRING_FREQUENCY_OPTIONS = [
  { value: 1, label: 'Daily' },
  { value: 7, label: 'Weekly' },
  { value: 14, label: 'Bi-weekly' },
  { value: 30, label: 'Monthly' },
  { value: 60, label: 'Bi-monthly' },
  { value: 90, label: 'Every 3 months' },
  { value: 180, label: 'Every 6 months' },
  { value: 365, label: 'Yearly' },
];

export const CREATE_APT_STEP_DATA = [
  {
    title: 'Patient Info',
    description: '',
  },
  {
    title: 'Appointment Info',
    description: '',
  },
  {
    title: 'Additional Info',
    description: '',
  },
  {
    title: 'Review Appointment',
    description: '',
  },
];
export const FILTER_APPOINTMENT_TYPES = {
  name: 'appointmentType',
  label: 'Type',
  options: [{
    value: EVENT_TYPE.VIRTUAL,
    label: EVENT_TYPE.VIRTUAL,
  }, {
    value: EVENT_TYPE.INPERSON,
    label: EVENT_TYPE.INPERSON_TEXT,
  },
  ],
};
