
export const patientEducationData = [
  'Printed materials provided',
  'App access provided',
  'Online education booked',
];
export const patientEducationBoxData = [
  {
    value: 'Printed materials provided',
    isCheck: true,
  },
  {
    value: 'App access provided',
    isCheck: true,
  },
  {
    value: 'Online education booked',
    isCheck: true,
  },
];
export const FREQUENCY_UNIT_DATA = [
  'per week',
  'per 2 weeks',
  'per month',
  'per 2 months',
  'per 3 months',
  'per 6 months',
  'per year',
];
export const FREQUENCY_UNIT_DATA_SCHEDULE = [
  'No follow-up',
  'Weekly',
  'Bi-weekly',
  'Monthly',
  'Bi-monthly',
  'Every 3 months',
  'Every 6 months',
  'Yearly',
];
export const REQUIRED_EQUIPMENT_PROVIDED = [
  {
    value: 'Biokit',
    isCheck: false,
  },
  {
    value: 'Blood pressure cuff',
    isCheck: false,
    tooltip: 'Biokit includes this device.',
  },
  {
    value: 'Pulse oximeter',
    isCheck: false,
    tooltip: 'Biokit includes this device.',
  },
  {
    value: 'Weight scale',
    isCheck: false,
  },
];
export const TEST_TYPE_DATA = [
  'CBC',
  'INR',
  'TSH',
  'Creatinine',
  'Liver function test',
  'Blood glucose test',
  // 'HbA1c',
  'Lipid profile',
];
export const ScheduleData = [
  {
    title: 'Weekly',
    content: '',
  },
  {
    title: 'Bi-weekly',
    content: '',
  },
  {
    title: 'Monthly',
    content: '',
  },
];

export const StopHCData = [
  {
    title: 'Deceased',
    content: '',
  },
  {
    title: 'Changed physicians',
    content: '',
  },
  {
    title: 'Moved',
    content: '',
  },
  {
    title: 'Ad hoc patient',
    content: '',
  },
  {
    title: 'Left reporting',
    content: '',
  },
  {
    title: "Didn't like the solution",
    content: '',
  },
  {
    title: 'Lost to follow up',
    content: '',
  },
  {
    title: 'Other',
    content: '',
  },
];

export const CARE_PLAN_SOURCE = {
  ATHENA: 'Athena',
};

export const CARE_PLAN_PROGRAM_TYPE = {
  CCM: 'CCM',
  RPM: 'RPM',
  CCM_RPM: 'CCM_RPM',
};

export const USER_ROLE = {
  NURSE: 'Clinic Technician',
  PHYSICIAN: 'Clinic Physician',
};
