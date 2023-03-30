import _ from 'lodash';

export const ALL_CLINIC = 'All clinics';

export const UNIT_OF_MEASUREMENT = ['Metric', 'Imperial'];

export const STEP_DATA = [
  {
    title: 'General Information',
    description: '',
  },
  {
    title: 'General Cardiac History',
    description: '',
  },
];

export const YES_NO_RADIO = [
  {
    title: 'Yes',
    content: '',
  },
  {
    title: 'No',
    content: '',
  },
];

// CREATE NEW PATIENT
const GenderData = [
  {
    title: 'Male',
    content: '',
  },
  {
    title: 'Female',
    content: '',
  },
];
const GenderDataSelect = [
  'Male',
  'Female',
];

export const CountryData = [
  'Argentina',
  'Canada',
  'Spain',
  'Taiwan',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
];
export const COUNTRY_SHORT_DATA = [
  'AR',
  'CA',
  'ES',
  'TW',
  'AE',
  'GB',
  'US',
];

const HeightUnitData = ['cm', 'inch'];

const WeightUnitData = ['kg', 'lb'];

const AddressSigns = {
  CitySign1: 'locality',
  CitySign2: 'sublocality_level_1',
  StateSign: 'administrative_area_level_1',
  CountrySign: 'country',
  PostCodeSign: 'postal_code',
};

const InsuranceData = [
  {
    title: 'Private',
    content: '',
  },
  {
    title: 'Medicare',
    content: '',
  },
  {
    title: 'Medicaid',
    content: '',
  },
  {
    title: 'OHIP',
    content: '',
  },
  {
    title: 'Out of province',
    content: '',
  },
  {
    title: 'Other insurance',
    content: '',
  },
  {
    title: 'No medical insurance',
    content: '',
  },
];

const AFibDurationQuestion = {
  afibDurationTitle: 'How long has the patient been diagnosed with Atrial Fibrillation?',
  afibDurationdata: [
    {
      title: 'Less than 6 months',
      content: '',
    },
    {
      title: 'Between 6 to 12 months',
      content: '',
    },
    {
      title: 'Between 12 to 24 months',
      content: '',
    },
    {
      title: 'More than 24 months',
      content: '',
    },
  ],
};

export const AFibStatusQuestion = {
  afibStatusTitle: 'How was the patient diagnosed with Atrial Fibrillation?',
  afibStatusdata: [
    {
      title: 'Suspected',
      content: 'Atrial Fibrillation was suspected and investigated by a healthcare practitioner',
    },
    {
      title: 'Found on routine examination',
      content: 'The patient experienced Atrial Fibrillation while being examined by a healthcare practitioner',
    },
    {
      title: 'Bioflux',
      // content: 'The patient experienced Atrial Fibrillation while being examined at a Bioflux clinic',
      content: 'Atrial Fibrillation was confirmed after the patient ran a heart study using Bioflux device.',
    },
  ],
  BIOFLUX_SERVICE_DATA: {
    // title: 'Please search & choose the facility that provides Bioflux services for the patient',
    title: 'Search and select the facility that provided the heart study using Bioflux device.',
    placeholder: 'Search & choose the facility',
  },
  BIOFLUX_LOADING: 'BIOFLUX_LOADING',
  BIOFLUX_SUCCESS: 'BIOFLUX_SUCCESS',
  BIOFLUX_FAILED: 'BIOFLUX_FAILED',
  BIOFLUX_LOADING_MSG: 'Searching for Bioflux report',
  BIOFLUX_SUCCESS_MSG: 'Bioflux report found!',
  BIOFLUX_FAILED_MSG: 'Bioflux report not found! Please make sure you select the correct facility or input correct patient information.',
};

const CardioversionQuestion = {
  cardioversionTitle: 'Has the patient ever had cardioversion?',
  cardioversiondata: _.cloneDeep(YES_NO_RADIO),
};

const chestPainData = _.cloneDeep(YES_NO_RADIO);

const ElectricalShockQuestion = {
  electricalTitle: 'Has the patient ever received electrical shock treatments to return their heart rhythm back to normal? ',
  electricaldata: _.cloneDeep(YES_NO_RADIO),
};

const PalpitationsChildren = {
  title: 'What triggers the patient’s palpitations?',
  data: [
    {
      value: 'Alcohol',
      isCheck: false,
    },
    {
      value: 'Caffeine',
      isCheck: false,
    },
    {
      value: 'Decreased sleep',
      isCheck: false,
    },
    {
      value: 'Others',
      isCheck: false,
    },
  ],
};

const CurrentSymptomsQuestion = {
  currentSymptomsTitle: 'Current symptoms',
  currentSymptomsData: [
    {
      value: 'Chest pain',
      isCheck: false,
      content: '',
      var: 'chestPainTimePerWeek',
    },
    {
      value: 'Decreasing exercise capacity',
      isCheck: false,
      content: '',
      var: 'decreasingExerciseCapacity',
    },
    {
      value: 'Dyspnea',
      isCheck: false,
      content: '',
      var: 'dyspnea',
    },
    {
      value: 'Fatigue',
      isCheck: false,
      content: '',
      var: 'fatigue',
    },
    {
      value: 'Lightheadedness',
      isCheck: false,
      content: '',
      var: 'lightHeadedness',
    },
    {
      value: 'Numbness in arm(s) or leg(s)',
      isCheck: false,
      content: '',
      var: 'numberInArmOrLeg',
    },
    {
      value: 'Painful urination',
      isCheck: false,
      content: '',
      var: 'painfulUrination',
    },
    {
      value: 'Palpitations',
      isCheck: false,
      // content: 'A funny or irregular heartbeat',
      content: '',
      var: 'palpitations',
    },
    {
      value: 'Syncope',
      isCheck: false,
      content: '',
      var: 'syncope',
    },
  ],
  CHEST_PAIN_TIMES: 'How many times per week does the patient get chest pain?',
  CHEST_PAIN_FREQUENCY: 'Has the frequency of chest pain been increasing over the past 4 weeks?',
};

const PastMedicalHistorQuestion = {
  pastMedicalHistoryTitle: 'Past medical history',
  pastMedicalHistoryData: [
    {
      value: 'Cardiothoracic surgery',
      isCheck: false,
      var: 'cardiothoracicSurgery',
    },
    {
      value: 'Congestive heart failure or LV dysfunction',
      isCheck: false,
      var: 'congestiveHeartOrLvDysfunction',
    },
    {
      value: 'Diabetes mellitus',
      isCheck: false,
      var: 'diabetesMellitus',
    },
    {
      value: 'Family history of Atrial Fibrillation',
      isCheck: false,
      var: 'familyHistoryOfAFib',
    },
    {
      value: 'High cholesterol',
      isCheck: false,
      var: 'highCholesterol',
    },
    {
      value: 'Hypertension',
      isCheck: false,
      var: 'hypertension',
    },
    {
      value: 'Hyperthyroidism or hypothyroidism',
      isCheck: false,
      var: 'hyperthyroidismOrHypothyroidism',
    },
    {
      value: 'Myocardial infarction',
      isCheck: false,
      var: 'myocardialInfarctionDate',
    },
    {
      value: 'Obesity',
      isCheck: false,
      var: 'obesity',
    },
    {
      value: 'Obstructive sleep apnea',
      isCheck: false,
      var: 'obstructiveSleepApnea',
    },
    {
      value: 'Poor circulation',
      isCheck: false,
      var: 'poorCirculation',
    },
    {
      value: 'Smoker',
      isCheck: false,
      var: 'smoker',
    },
    {
      value: 'Stroke transient ischemic attack (mini-stroke)',
      isCheck: false,
      var: 'strokeTransientIschemicAttack',
    },
    {
      value: 'Stroke',
      isCheck: false,
      var: 'stroke',
    },
    {
      value: 'Others',
      isCheck: false,
      var: 'others',
    },
  ],
};

const MedicationsQuestion = {
  usedTitle: 'Type(s) of medication previously used to manage cardiovascular diseases?',
  usedData: 'No medications',
  usedPlaceholder: 'Find and select a medication',

  usingTitle: 'Type(s) of medication currently being used to manage cardiovascular diseases?',
  usingData: 'No medications',
  usingPlaceholder: 'Find and select a medication',
};

const HospitalizedQuestion = {
  hospitalizedTitle: 'Has the patient ever been hospitalized?',
  hospitalizeddata: _.cloneDeep(YES_NO_RADIO),
};

const ImageOfECGQuestion = {
  imgOETitle: 'Image of ECG',
  imgOEPlaceholder: 'Click or drag files to this area to upload',
};

export const GENERAL_INFOMATION_DATA = {
  GenderData,
  CountryData,
  HeightUnitData,
  WeightUnitData,
  AddressSigns,
  InsuranceData,
  GenderDataSelect,
};

const GENDER = {
  MALE: 'Male',
  FEMALE: 'Female',
};

export const GENDER_DATA = [
  {
    label: GENDER.MALE,
    value: GENDER.MALE,
  },
  {
    label: GENDER.FEMALE,
    value: GENDER.FEMALE,
  },
];

export const AFIB_HISTORY_DATA = {
  AFibDurationQuestion,
  AFibStatusQuestion,
  CardioversionQuestion,
  ElectricalShockQuestion,
  CurrentSymptomsQuestion,
  PastMedicalHistorQuestion,
  MedicationsQuestion,
  HospitalizedQuestion,
  ImageOfECGQuestion,
  PalpitationsChildren,
  OtherOptions: 'Others',
  Palpitations: 'Palpitations',
  Myocardial: 'Myocardial infarction',
  ChestPain: 'Chest pain',
  chestPainData,
  DIAGNOSED_WITH_AFIB_DATA: _.cloneDeep(YES_NO_RADIO),
};

export const QUALITY_OF_LIFE_TITLES = [
  'Physical functioning (%)',
  'Role limitations due to physical health (%)',
  'Role limitations due to emotional problems (%)',
  'Energy/fatigue (%)',
  'Emotional well-being (%)',
  'Social functioning (%)',
  'Pain (%)',
  'General health (%)',
];


export const NEW_PATIENT_MESSAGES = {
  INACTIVE_CAREPLAN: 'This email has been associated with an existing patient profile, are you trying to sign this patient up with a new healthcare program?',
  NEW_OR_ACTIVE_CAREPLAN: 'A healthcare program has already been developed with this email. In order to start a new healthcare program, the current one must be terminated.',
  NEW_OR_ACTIVE_CAREPLAN_COPY: 'This patient has already had another healthcare program developed',
};

export const NEW_TEMPLATE_QUESTION = {
  LAST_HOPITAL_VISIT_QUESTION: 'When was the last hospital visit?',
  LAST_HOPITAL_VISIT_ANSWER: 'The last hospital visit must be entered later.',
};

export const CONTACT_METHOD_OPTIONS = [
  'Email', 'SMS', 'Both',
];

export const CONTACT_METHOD_OBJ_OPTIONS = [
  { value: 'Email', title: 'Email' },
  { value: 'SMS', title: 'SMS' },
  { value: 'Both', title: 'Email and SMS' },
];

export const PROGRAM_TYPE = {
  CCM: 'CCM',
  RPM: 'RPM',
  CCM_RPM: 'CCM_RPM',
};

export const PROGRAM_TYPE_LABEL = {
  CCM: 'CCM',
  RPM: 'RPM',
  CCM_RPM: 'CCM & RPM',
  ALL: 'All plan types',
};

export const PROGRAM_TYPE_OPTIONS = [
  {
    title: PROGRAM_TYPE_LABEL.RPM,
    value: PROGRAM_TYPE.RPM,
  },
  {
    title: PROGRAM_TYPE_LABEL.CCM,
    value: PROGRAM_TYPE.CCM,
  },
  {
    title: PROGRAM_TYPE_LABEL.CCM_RPM,
    value: PROGRAM_TYPE.CCM_RPM,
  },
];

export const TEMPLATE_DEFAULT_DATA = { label: 'No template', value: '' };


export const NOTES_CONTENT = 'Used to indicate to the physician that these items are outstanding so that corrective action can be taken';
export const PLAN_TYPE_FILTER = {
  name: 'programTypes',
  label: 'Plan type',
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
};

export const FILTER_PLAN_TYPE = ['All plan types', PROGRAM_TYPE_LABEL.CCM_RPM, PROGRAM_TYPE_LABEL.CCM, PROGRAM_TYPE_LABEL.RPM];

export const PATIENT_STATUS = {
  READ: 'Read',
  UNREAD: 'Unread',
};

export const NEW_NURSE_PATIENT_STATUS = {
  name: 'nurseStatus',
  label: 'Status',
  options: [
    {
      value: PATIENT_STATUS.READ,
      label: PATIENT_STATUS.READ,
    },
    {
      value: PATIENT_STATUS.UNREAD,
      label: PATIENT_STATUS.UNREAD,
    },
  ],
};


export const NEW_MD_PATIENT_STATUS = {
  name: 'physicianStatus',
  label: 'Status',
  options: [
    {
      value: PATIENT_STATUS.READ,
      label: PATIENT_STATUS.READ,
    },
    {
      value: PATIENT_STATUS.UNREAD,
      label: PATIENT_STATUS.UNREAD,
    },
  ],
};
