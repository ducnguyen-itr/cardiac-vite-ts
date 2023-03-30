const PacemakerData = [
  {
    title: 'Yes',
    content: '',
  },
  {
    title: 'No',
    content: '',
  },
];

const InsuranceData = [
  'Private',
  'Medicare',
  'Medicaid',
  'OHIP',
  'Out of province',
  'Other insurance',
  'No medical insurance',
];

export const INSURANCE_TYPE = {
  MEDICARE: 'Medicare',
  PRIVATE: 'Private',
  OTHER: 'Other',
};

export const SERVICE_TYPES = {
  STANDARD: 'Standard study',
  BIODIRECT: 'Biodirect',

  STANDARD_VALUE: 'Bioflux',
  BIODIRECT_VALUE: 'BiofluxDirect',
};

export const STUDY_CATEGORY = {
  BIOFLUX_DIRECT: 'BiofluxDirect',
  BIOFLUX: 'Bioflux',
};

export const NEW_STUDY_STEP_DATA = [
  {
    title: 'Patient Information​',
    description: '',
  },
  {
    title: 'Study Information​',
    description: '',
  },
  {
    title: 'Diagnosis​​',
    description: '',
  },
  {
    title: 'Verify ECG Signal​​',
    description: '',
  },
];

export const NEW_STUDY_STEP_DATA_BIODIRECT = [
  {
    title: 'Patient Information​',
    description: '',
  },
  {
    title: 'Study Information​',
    description: '',
  },
  {
    title: 'Diagnosis​​',
    description: '',
  },
];

export const GENERAL_INFOMATION_NEWSTUDY_DATA = {
  PacemakerData,
  InsuranceData,
};

export const STUDY_INFORMATION_REPORT = 'For more information, please visit the Bioflux portal. Changes to patient information here will not be reflected in the Bioflux portal.';
