import { PROGRAM_TYPE, PROGRAM_TYPE_LABEL } from './newPatientData';

export const STOP_BEFORE_END_TOOLTIP_TEXT = 'The care plan was stopped before the end of calendar month.';

export const BILL_STATUS_ENUM = {
  NOT_CREATED: 'NOT_CREATED',
  DRAFT: 'DRAFT',
  READY_FOR_BILLER: 'READY_FOR_BILLER',
  BILLED: 'BILLED',
  REIMBURSED: 'REIMBURSED',
  DENIED: 'DENIED',
};

export const BILL_STATUS_TEXT = {
  NOT_CREATED: 'Not created',
  DRAFT: 'Draft',
  READY_FOR_BILLER: 'Ready for biller',
  BILLED: 'Billed',
  REIMBURSED: 'Reimbused',
  DENIED: 'Denied',
};

export const BILL_STATUS_OPTIONS = [
  {
    value: BILL_STATUS_ENUM.NOT_CREATED,
    label: BILL_STATUS_TEXT.NOT_CREATED,
  },
  {
    value: BILL_STATUS_ENUM.DRAFT,
    label: BILL_STATUS_TEXT.DRAFT,
  },
  {
    value: BILL_STATUS_ENUM.READY_FOR_BILLER,
    label: BILL_STATUS_TEXT.READY_FOR_BILLER,
  },
  {
    value: BILL_STATUS_ENUM.BILLED,
    label: BILL_STATUS_TEXT.BILLED,
  },
  {
    value: BILL_STATUS_ENUM.REIMBURSED,
    label: BILL_STATUS_TEXT.REIMBURSED,
  },
  {
    value: BILL_STATUS_ENUM.DENIED,
    label: BILL_STATUS_TEXT.DENIED,
  },
];


export const BILL_STATUS_OPTIONS_CREATED = [

  {
    value: BILL_STATUS_ENUM.DRAFT,
    label: BILL_STATUS_TEXT.DRAFT,
  },
  {
    value: BILL_STATUS_ENUM.READY_FOR_BILLER,
    label: BILL_STATUS_TEXT.READY_FOR_BILLER,
  },
  {
    value: BILL_STATUS_ENUM.BILLED,
    label: BILL_STATUS_TEXT.BILLED,
  },
  {
    value: BILL_STATUS_ENUM.REIMBURSED,
    label: BILL_STATUS_TEXT.REIMBURSED,
  },
  {
    value: BILL_STATUS_ENUM.DENIED,
    label: BILL_STATUS_TEXT.DENIED,
  },
];


export const FILTER_PATIENTS = ['My patients', 'All patients'];

export const TIME_TRACKING_STATUS = ['All statuses', 'Draft', 'Ready for biller', 'Not created'];

export const TIME_TRACKING_DURATION_STATUS = ['Duration statuses', 'Billable', 'Unbillable'];

export const BILLING_TABS = ['In progress', 'Ready for Biller'];

export const IN_PROGRESS_FILTER = [{
  title: 'Status',
  name: 'status',
  options: [
    { value: 'Not created', label: 'Not created' },
    { value: 'Draft', label: 'Draft' },
  ],
},
{
  title: 'Duration',
  name: 'duration',
  options: [
    { value: 'Billable', label: 'Billable' },
    { value: 'Unbillable', label: 'Unbillable' },
  ],
},
{
  title: 'Plan type',
  name: 'programTypes',
  options: [
    {
      value: PROGRAM_TYPE.CCM_RPM,
      label: PROGRAM_TYPE_LABEL.CCM_RPM,
    },
    {
      value: PROGRAM_TYPE.CCM,
      label: PROGRAM_TYPE_LABEL.CCM,
    },
    {
      value: PROGRAM_TYPE.RPM,
      label: PROGRAM_TYPE_LABEL.RPM,
    }],
},
];

export const BILLER_FITER = [{
  title: 'Status',
  name: 'status',
  options: [
    { value: 'Ready for biller', label: 'Ready for biller' },
    { value: 'Billed', label: 'Billed' },
    { value: 'Reimbused', label: 'Reimbused' },
    { value: 'Denied', label: 'Denied' },
  ],
}, {
  title: 'Plan type',
  name: 'programTypes',
  options: [
    {
      value: PROGRAM_TYPE.CCM_RPM,
      label: PROGRAM_TYPE_LABEL.CCM_RPM,
    },
    {
      value: PROGRAM_TYPE.CCM,
      label: PROGRAM_TYPE_LABEL.CCM,
    },
    {
      value: PROGRAM_TYPE.RPM,
      label: PROGRAM_TYPE_LABEL.RPM,
    }],
}];

export const TIME_TRACKING_STATUS_TEXT_ENUM = {
  ALL_STATUS: 'All statuses',
  DRAFT: 'Draft',
  READY_FOR_BILLER: 'Ready for biller',
  NOT_CREATED: 'Not created',
};
export const TIME_TRACKING_STATUS_ENUM = {

  DRAFT: 'Draft',
  READY_FOR_BILLER: 'ReadyForBiller',
  NOT_CREATED: 'NotCreated',
};

export const BILLING_STATUS_OPTIONS = [
  { value: BILL_STATUS_ENUM.READY_FOR_BILLER, label: 'Ready for biller' },
  { value: BILL_STATUS_ENUM.BILLED, label: 'Billed' },
  { value: BILL_STATUS_ENUM.REIMBURSED, label: 'Reimbursed' },
  { value: BILL_STATUS_ENUM.DENIED, label: 'Denied' },
];

export const BILL_STATUS_OPTIONS_DRAFT = [
  { value: BILL_STATUS_ENUM.DRAFT, label: 'Draft' },
  { value: BILL_STATUS_ENUM.READY_FOR_BILLER, label: 'Ready for biller' },
  { value: BILL_STATUS_ENUM.BILLED, label: 'Billed' },
  { value: BILL_STATUS_ENUM.REIMBURSED, label: 'Reimbursed' },
  { value: BILL_STATUS_ENUM.DENIED, label: 'Denied' },
];


export const SERVICE_CODE_OPTIONS = [
  {
    code: '99091',
    description: 'Collection and interpretation of physiologic data digitally stored and/or transmitted by the patient and/or caregiver to the physician or other QHCP.',
    label: '99091 Collection and interpretation of physiologic data digitally stored and/or transmitted by the patient and/or caregiver to the physician or other QHCP.',
  },
  {
    code: '99439',
    description: 'Each additional 20 minutes of clinical staff time spent providing non-complex CCM directed by a physician or other qualified health care professional.',
    label: '99439 Each additional 20 minutes of clinical staff time spent providing non-complex CCM directed by a physician or other qualified health care professional.',
  },
  {
    code: '99453',
    description: 'Patient initial set-up and education - Remote monitoring of physiologic parameter(s).',
    label: '99453 Patient initial set-up and education - Remote monitoring of physiologic parameter(s).',
  },
  {
    code: '99454',
    description: 'Remote monitoring of physiologic parameter(s), initial device(s) supply with daily recording(s) or programmed alert(s).',
    label: '99454 Remote monitoring of physiologic parameter(s), initial device(s) supply with daily recording(s) or programmed alert(s).',
  },
  {
    code: '99457',
    description: 'Review of patient-generated data up to to 20 minutes.',
    label: '99457 Review of patient-generated data up to to 20 minutes.',
  },
  {
    code: '99458',
    description: 'Remote physiologic monitoring treatment management services.',
    label: '99458 Remote physiologic monitoring treatment management services.',
  },
  {
    code: '99487',
    description: 'A 60-minute timed service provided by clinical staff to substantially revise or establish comprehensive care plan that involves moderate to high-complexity medical decision making.',
    label: '99487 A 60-minute timed service provided by clinical staff to substantially revise or establish comprehensive care plan that involves moderate to high-complexity medical decision making.',
  },
  {
    code: '99489',
    description: 'Each additional 30 minute increment after the initial 60 minutes of clinical staffing time spent providing complex CCM directed by a physican or qualified health care professional.',
    label: '99489 Each additional 30 minute increment after the initial 60 minutes of clinical staffing time spent providing complex CCM directed by a physican or qualified health care professional.',
  },
  {
    code: '99490',
    description: 'Chronic care management services, each additional 20 minutes of clinical staff time directed by a physician or other qualified health care professional.',
    label: '99490 Chronic care management services, each additional 20 minutes of clinical staff time directed by a physician or other qualified health care professional.',
  },
  {
    code: '99491',
    description: 'CCM services provided personally by a physician or other qualified health care professional for at least 30 minutes.',
    label: '99491 CCM services provided personally by a physician or other qualified health care professional for at least 30 minutes.',
  },
  {
    code: 'G0506',
    description: 'Comprehensive assessment of and care planning for patients requiring chronic care management services.',
    label: 'G0506 Comprehensive assessment of and care planning for patients requiring chronic care management services.',
  },
];

export const TOOLTIP_TEXT = 'This includes virtual appointments made prior to the care plan initiation.';

export const TIME_LOG_STATUS = {
  REVIEW: 'REVIEW',
  DONE: 'DONE',
};
