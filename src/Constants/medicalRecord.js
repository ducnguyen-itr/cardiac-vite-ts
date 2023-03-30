export const DIAGNOSES_TAB = {
  MONITORED: 'Monitored',
  ACTIVE: 'Active',
  HISTORYCAL: 'Historical',
};

export const MEDICATION_TAB = {
  PRESCRIBED: 'Prescribed',
  PATIENT_ADDED: 'Patient-added',
};


export const MEDICATION_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

export const RISK_ASSESSMENT_TYPE = {
  CHA2DS2VASC: 'cha2ds2vasc',
  EHRA: 'ehra',
  FRS: 'frs',
  HAS_BLED: 'hasBled',
};

export const RISK_ASSESSMENT_TITLE = {
  CHA2DS2VASC: 'ChA2DS2-VASc',
  EHRA: 'EHRA',
  FRS: 'FRS',
  HAS_BLED: 'HAS-BLED',
};

export const DIAGNOSES_TYPE = {
  MONITORED: 'MONITORED',
  HISTORICAL: 'HISTORICAL',
  AT_RISK: 'AT_RISK',
};

export const ACUITY_TYPE = {
  CHRONIC: 'CHRONIC',
  ACUTE: 'ACUTE',
  UNKNOWN: 'UNKNOWN',
};

export const CORNFIRM_VIA_TYPE = {
  ECG: 'ECG',
  HOLTER: 'Holter',
  BIOFLUX: 'Bioflux',
  OTHER: 'Other',
};

export const CORNFIRM_VIA_TYPE_TEXT = {
  ECG: 'ECG',
  HOLTER: 'Holter',
  BIOFLUX: 'Bioflux',
  OTHER: 'Other',
};

export const MEDICATION_MISSING_TOOLTIP = 'Patient will not see this medication in the daily questionnaire.';

export const HASBLED_RISFACTOR = [
  ['Risk was 0.9% in one validation study (Lip 2011) and 1.13 bleeds per 100 patient-years in another validation study (Pisters 2010).',
    'Anticoagulation should be considered: Patient has a relatively low risk for major bleeding (~1/100 patient-years).'],

  ['Risk was 3.4% in one validation study (Lip 2011) and 1.02 bleeds per 100 patient-years in another validation study (Pisters 2010).',
    'Anticoagulation should be considered: Patient has a relatively low risk for major bleeding (~1/100 patient-years).'],

  ['Risk was 4.1% in one validation study (Lip 2011) and 1.88 bleeds per 100 patient-years in another validation study (Pisters 2010).',
    'Anticoagulation should be considered: Patient has a relatively low risk for major bleeding (~2/100 patient-years).'],

  ['Risk was 5.8% in one validation study (Lip 2011) and 3.74 bleeds per 100 patient-years in another validation study (Pisters 2010).',
    'Anticoagulation should be considered: Patient is at high risk for major bleeding.'],

  ['Risk was 8.9% in one validation study (Lip 2011) and 8.7 bleeds per 100 patient-years in another validation study (Pisters 2010).',
    'Anticoagulation should be considered: Patient is at high risk for major bleeding.'],

  ['Risk was 9.1% in one validation study (Lip 2011) and 12.5 bleeds per 100 patient-years in another validation study (Pisters 2010).',
    'Anticoagulation should be considered: Patient is at high risk for major bleeding.'],

  ['Scores greater than 5 were too rare to determine risk, but are likely over 10%. Alternatives to anticoagulation should be considered: Patient is at extremely high risk for major bleeding.'],

  ['Scores greater than 5 were too rare to determine risk, but are likely over 10%. Alternatives to anticoagulation should be considered: Patient is at extremely high risk for major bleeding.'],

  ['Scores greater than 5 were too rare to determine risk, but are likely over 10%. Alternatives to anticoagulation should be considered: Patient is at extremely high risk for major bleeding.'],

  ['Scores greater than 5 were too rare to determine risk, but are likely over 10%. Alternatives to anticoagulation should be considered: Patient is at extremely high risk for major bleeding.'],
];


export const CHA2DS2VASC_SCORE_DATA = [
  {
    key: 'congestiveHeartFailure',
    suffix: 1,
  },
  {
    key: 'hypertension',
    suffix: 1,
  },
  {
    key: 'age2',
    suffix: 2,
  },
  {
    key: 'age1',
    suffix: 1,
  },
  {
    key: 'diabetesMellitus',
    suffix: 1,
  },
  {
    key: 'stroke',
    suffix: 2,
  },
  {
    key: 'vascularDisease',
    suffix: 1,
  },
  {
    key: 'sexFemale',
    suffix: 1,
  },
];
export const cha2ds2vascScoreToPercent = ['0.0%', '1.3%', '2.2%', '3.2%', '4.0%', '6.7%', '9.8%', '9.6%', '6.7%', '15.2%'];

export const EHRA_SCORE_DATA = [
  {
    key: 'Disabling',
    score: 1,
    title: 'Disabling - 1',
    content: 'Normal daily activity discontinued',
  },
  {
    key: 'Severe',
    score: 2,
    title: 'Severe - 2',
    content: 'Normal daily activity affected',
  },
  {
    key: 'Moderate',
    score: 3,
    title: 'Moderate - 3',
    content: 'Normal daily activity not affected but patient troubled by symptoms',
  },
  {
    key: 'Mild',
    score: 4,
    title: 'Mild - 4',
    content: 'Normal daily activity not affected; symptoms not troublesome to patient',
  },
  {
    key: 'None',
    score: 5,
    title: 'None - 5',
    content: '',
  },
];

export const ADD_EDIT_MEDICATION_TYPE = {
  ADD_MEDICATION: 0,
  EDIT_MEDICATION: 1,
  PRESCRIBE_MEDICATION: 2,
};

export const MEDICAL_RECORD_TYPE = {
  RISK_ASSESSMENT: 'RISK_ASSESSMENT',
  DIAGNOSIS: 'DIAGNOSIS',
  MEDICATION: 'MEDICATION',
  ALLERGIES: 'ALLERGIES',
  PAST_HISTORY: 'PAST_HISTORY',
};
