
export const SavePathActions = {
  SET_PATH: 'SET_PATH',
  GET_PATH: 'GET_PATH',
  DELETE_PATH: 'DELETE_PATH',
  DELETE_DETAIL_PATH: 'DELETE_DETAIL_PATH',
  DELETE_REPORT_DETAIL_PATH: 'DELETE_REPORT_DETAIL_PATH',
  ACTIVE_NEW_TAB: 'activeNewTab',
  ACTIVE_REPORT_TAB: 'activeReportTab',
  TAB_NAME: 'tabName',
  DELETE_NAVIGATE_TO_HM_CURRENT: 'DELETE_NAVIGATE_TO_HM_CURRENT',
  DELETE_ALL_PATH: 'DELETE_ALL_PATH',
};

export const VERSION = {
  api: {
    appName: 'Biocare Cardiac',
    version: '0.32.6',
    platform: 'Web',
  },
  name: 'biocare-cardiac-web',
};

export const MEDICATION_POP_ACTIONS = {
  SET_MEDICATION_POP: 'SET_MEDICATION_POP',
  SET_MEDICATION_DATA: 'SET_MEDICATION_DATA',
};

export const CREATE_STUDY_POP_ACTIONS = {
  SET_CREATE_STUDY_POP: 'SET_CREATE_STUDY_POP',
  SET_CREATE_STUDY_DATA: 'SET_CREATE_STUDY_DATA',
};

export const LEAVE_POP_ACTIONS = {
  SET_LEAVE_POP: 'SET_LEAVE_POP',
  SET_LEAVE_DATA: 'SET_LEAVE_DATA',
};

export const MESSAGES_ACTIONS = {
  SET_MESSAGE_DATA: 'SET_MESSAGE_DATA',
  UPDATE_MESSAGE_DATA: 'UPDATE_MESSAGE_DATA',
  UPDATE_MESSAGE_SUBCRIPTION: 'UPDATE_MESSAGE_SUBCRIPTION',
};

export const FACILITY_ACTIONS = {
  SET_FACILITY: 'SET_FACILITY',
  INIT_FACILITY: 'INIT_FACILITY',
};

export const COUNTRY_ACTIONS = {
  SET_COUNTRY: 'SET_COUNTRY',
  DELETE_COUNTRY: 'DELETE_COUNTRY',
};

export const NOTIFICATION_CENTER_REQUEST = {
  LOAD_MORE: 'LOAD_MORE',
  LOAD_DEFAULT: 'LOAD_DEFAULT',
  LOAD_SOCKET: 'LOAD_SOCKET',
};

export const AFIB_HISTORY_TITLES = [
  'Period of Atrial Fibrillation diagnosis',
  'How was the patient diagnosed with Atrial Fibrillation?',
  'Bioflux report',
  'Cardioversion',
  'Patient has received electrical shock',
  'Current symptoms',
  'Past medical history',
  'Medication(s) previously used',
  'Medication(s) currently being used',
  'Hospitalization',
];

export const ECHOCARDIOGRAM = [
  'Date',
  'LVEF',
];
export const PAST_MEDICAL_CONDITIONS = [
  'Hypertension',
  'Diabetes mellitus',
  'Myocardial infarction',
];

export const MessageData = {
  ServerErr: 'A temporary server error has occurred. Please try again.',
  ExpiredText: 'Your login session has expired, please try again.',
  FailGenerate: 'Failed to generate serial numbers. Please try again.',
  SuccessGenerate: 'Generate serial number successfully.',
  InvalidCode: 'Invalid code provided, please request a code again.',
  InvalidCodeDisplay: 'Verification code is invalid. Please try again!',
  InvalidNewPassword: 'New password is invalid. Please try again!',
  PasswordNotMatch: 'The passwords do not match.\nPlease try again!',
  InvalidEx: 'The file could not be uploaded.\nOnly files with the following extensions are allowed: PNG, JPEG, JPG.',
  InvalidSize: 'Please enter a file with a valid file size no larger than 20MB.',
  IncorrectUsername: 'Incorrect username or password.',
  InvalidCurPas: 'Invalid current password. Please try again!',
  CodeMisMatch: 'CodeMismatchException',
  CreatedPartner: 'You have just created a new partner.',
  WrongEmailF: 'Email is wrong format!',
  WrongPhoneF: 'Phone is wrong format!',
  IncorrectEnterEmail: 'Incorrectly entered email!',
  InvalidEmail: 'Invalid email!',
  SendCodeToNewEmail: 'A verification code has been sent to your new email.',
  SuccessChangeEmail: 'Your email has been changed.',
  ErrSPAlready: 'Error: Service Partner already exist!',
  ErrSPAlreadyConverted: 'Service partner already exists!',
  Limit100: 'Please enter a value less than or equal to 100.',
  PassTooShort: 'That password is too short. Please make sure the password must be at least 8 characters.',
  PassUpperLower: 'The password includes the use of both upper-case and lower-case letters.',
  PassIncludesDigits: 'The password must include one or more numerical digits.',
  InvalidUserName: 'Invalid username!',
  TheSameEmail: 'New Email cannot be same as your old Email.',
  ExceededLimit: 'Attempt limit exceeded, please try after some time.',
  ExceededErr: 'InvalidParameterException',
  NoInternet: 'Could not connect to server. Please check your internet connection.',
  NoInternetErrCode: 'NetworkError',
  NotFoundUser: 'UserNotFoundException',
  NotVerifyEmailMes: 'Cannot reset password for the user as there is no registered/verified email or phone_number.',
  NotVeriNaviMes: 'is not verified. Do you want to verify this email?',
  NotFPMes: 'is not verified. Please go to your Account Settings and choose Change Email option for Email verification.',
  IsGoForVeri: 'Your email has been verified.',
  UpdateModelImgErr: 'Failed to update model image.',
  ChangeModelImgMsg: 'Model image has been changed successfully.',
  EmptyTableMes: 'There is no data to display',
  InvalidValue: 'Invalid value',
};


export const EHRA_SCORE = [
  {
    title: 'Disabling - 1',
    content: 'Normal daily activity discontinued',
  },
  {
    title: 'Severe - 2',
    content: 'Normal daily activity affected',
  },
  {
    title: 'Moderate - 3',
    content: 'Normal daily activity not affected but patient troubled by symptoms',
  },
  {
    title: 'Mild - 4',
    content: 'Normal daily activity not affected; symptoms not troublesome to patient',
  },
  {
    title: 'None - 5',
    content: '',
  },
];

export const CHA2DS2VASCScoreData = [
  {
    value: 'Congestive heart failure',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Hypertension',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Age ≥ 75',
    isCheck: false,
    suffix: 2,
  },
  {
    value: 'Age 65-74',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Diabetes mellitus',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Stroke/TIA/thrombo-embolism',
    isCheck: false,
    suffix: 2,
  },
  {
    value: 'Vascular disease',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Sex Female',
    isCheck: false,
    suffix: 1,
  },
];
export const AdjustedStrokeRateData = ['0.0', 1.3, 2.2, 3.2, 4.0, 6.7, 9.8, 9.6, 6.7, 15.2];

export const HASBLEDClinicalCharacteristicData = [
  {
    value: 'Hypertension',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Abnormal liver function',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Abnormal renal function',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Stroke',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Bleeding',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Labile INRs',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Elderly (Age >65)',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Drugs',
    isCheck: false,
    suffix: 1,
  },
  {
    value: 'Alcohol',
    isCheck: false,
    suffix: 1,
  },
];

export const BleedsPer100PatientYears = [
  `Risk was 0.9% in one validation study (Lip 2011) and 1.13 bleeds per 100 patient-years in another validation study (Pisters 2010).\n
Anticoagulation should be considered: Patient has a relatively low risk for major bleeding (~1/100 patient-years).`,

  `Risk was 3.4% in one validation study (Lip 2011) and 1.02 bleeds per 100 patient-years in another validation study (Pisters 2010).\n
Anticoagulation should be considered: Patient has a relatively low risk for major bleeding (~1/100 patient-years).`,

  `Risk was 4.1% in one validation study (Lip 2011) and 1.88 bleeds per 100 patient-years in another validation study (Pisters 2010).\n
Anticoagulation should be considered: Patient has a relatively low risk for major bleeding (~2/100 patient-years).`,

  `Risk was 5.8% in one validation study (Lip 2011) and 3.74 bleeds per 100 patient-years in another validation study (Pisters 2010).\n
Anticoagulation should be considered: Patient is at high risk for major bleeding.`,

  `Risk was 8.9% in one validation study (Lip 2011) and 8.7 bleeds per 100 patient-years in another validation study (Pisters 2010).\n
Anticoagulation should be considered: Patient is at high risk for major bleeding.`,

  `Risk was 9.1% in one validation study (Lip 2011) and 12.5 bleeds per 100 patient-years in another validation study (Pisters 2010).\n
Anticoagulation should be considered: Patient is at high risk for major bleeding.`,

  `Scores greater than 5 were too rare to determine risk, but are likely over 10%.
Alternatives to anticoagulation should be considered: Patient is at extremely high risk for major bleeding.`,

  `Scores greater than 5 were too rare to determine risk, but are likely over 10%.
Alternatives to anticoagulation should be considered: Patient is at extremely high risk for major bleeding.`,

  `Scores greater than 5 were too rare to determine risk, but are likely over 10%.
Alternatives to anticoagulation should be considered: Patient is at extremely high risk for major bleeding.`,

  `Scores greater than 5 were too rare to determine risk, but are likely over 10%.
Alternatives to anticoagulation should be considered: Patient is at extremely high risk for major bleeding.`,
];

export const AfibConfirmData = ['ECG', 'Holter', 'Bioflux'];
export const HeartValveIssuseData = ['Valvular heart disease', 'Heart valve replacement'];

export const DEFAULT_HEART_VALVE_DATA = [
  {
    value: 'Left',
    isCheck: false,
  },
  {
    value: 'Right',
    isCheck: false,
  },
];

export const ValvularHeartDiseaseData = [
  'Valvular stenosis',
  'Valvular prolapse',
  'Regurgitation',
];
export const MitralValveStatusData = [
  'Normal', 'Progressive mitral stenosis', 'Severe mitral stenosis', 'Very severe mitral stenosis',
];

export const KEY_MEDICATION = 'f4b34cb4b9df55b5cde78387358edc32';
// export const URL_SEARCH_MEDICATION = 'https://api.drugbankplus.com/v1/us';
export const URL_SEARCH_MEDICATION = 'https://api-js.drugbank.com/v1/us';

export const FullMessageData = {
  Authorization: {
    InputEmail: 'Please input your email',
    InputPassword: 'Please input your email',
    IncorrectEmail: 'Incorrect email',
    IncorrectPassword: 'Incorect password',
    Pass8Char: 'The password must be at least 8 characters',
    IncorrectDefault: 'Invalid username/password',
  },
  PatientDetails: {
    NoData: 'There is no data to display',
    NoDiseases: 'There is no conditions information yet',
    NoPrescription: 'There is no prescription yet',
    NoMedication: 'There is no medication yet',
    NoReportSettings: 'There is no report settings yet',
    NoStudy: 'There is no study yet',
    NoWorkingHour: 'Your working hours are not available!',
  },
  SENDING_TIME_SHEET_MASTER_DATA: {
    code: 'TIMESHEET',
  },
};

export const CARE_PLAN_TABS = {
  OVERVIEW: 'Overview',
  CONDITIONS: 'Conditions information',
  PRESCRIPTION: 'Prescription',
  REPORT_SETTINGS: 'Report settings',
  CHANGE_HISTORY: 'Change history',
  MEDICATION: 'Medication',
  HEART_MONITOR: 'Heart monitor',
  QUALITY_OF_LFIE: 'Quality of life​',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  CONSENT_FORMS: 'Consent forms',
  DEVICES: 'Devices',
};

export const HEART_MONITOR_DETAIL_TABS = {
  CURRENT_STUDY: 'Current study',
  PREVIOUS_STUDIES: 'Previous studies',
};

export const TableNames = {
  NewRegistered: 'new-registered',
  NewAssigned: 'new-assigned',
  NewMD: 'new-md',
  Active: 'active',
  Inactive: 'inactive',
  Notification: 'notification',
  Monthly: 'monthly',
  Bioheart: 'bioheart',
};

export const NEW_PATIENTS_TABS = ['Registered', 'Healthcare Team Assigned', 'Deleted'];
export const NEW_MD_PATIENTS_TABS = ['New', 'Deleted'];

export const CALENDAR_TABS = ['Follow-up', 'Scheduled appointments'];

export const HEART_MONITOR_TABS = ['Prescription', 'Active', 'Completed'];
export const BILLING_TABS = ['Time tracking', 'Superbills'];

export const CARE_PLAN_STATUS = {
  NEW: 'New',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DELETED: 'Deleted',
};

export const MEDICAL_TEST_RESULT_TYPE = {
  STRESS: 'Stress',
  CBC: 'CBC',
  LIVER: 'Liver',
  LEADECG: 'LeadECG',
  BASELINE: 'Baseline',
  BLOOD_SUGAR: 'BloodSugar',
  LIPID: 'Lipid',
  INR: 'INR',
  TSH: 'TSH',
  Creatinine: 'Creatinine',
  HgbA1C: 'HgbA1C',
  LVEF: 'LVEF',
  OTHER: 'Other',
};

export const HM_NOTIFICATION_REPORT_PRIORITY = {
  URGENT: 'Urgent',
  EMERGENT: 'Emergent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const TABLE_CELL_TYPE = {
  DATE: 'DATE',
  TIME: 'TIME',
  CHECKBOX: 'CHECKBOX',
  BUTTON: 'BUTTON',
  DATE_TIME: 'DATE_TIME',
  REASON: 'REASON',
  EMAIL: 'EMAIL',
  COPY: 'COPY',
  CREATE_APPOINTMENT: 'CREATE_APPOINTMENT',
  APPOINTMENT_TYPE: 'APPOINTMENT_TYPE',
  APPOINTMENT_STATUS: 'APPOINTMENT_STATUS',
  JOIN_APPOINTMENT: 'JOIN_APPOINTMENT',
  PRIORITY: 'PRIORITY',
  FILE: 'FILE',
  STUDY_TYPE: 'STUDY_TYPE',
  DETAIL_TYPE: 'DETAIL_TYPE',
  WITH_ARTIFACT_REPORT: 'WITH_ARTIFACT_REPORT',
  DATE_RANGE: 'DATE_RANGE',
  DATE_RANGE_TIME: 'DATE_RANGE_TIME',
  ON_DEMAND_REPORT_ID: 'ON_DEMAND_REPORT_ID',
  DELETE: 'DELETE',
  ADD_NEW_PATIENTS: 'ADD_NEW_PATIENTS',
  TEMPLATE: 'TEMPLATE',
  TOOLTIP_OVERFLOW_BUTTON: 'TOOLTIP_OVERFLOW_BUTTON',
  BIOHEART_STATUS: 'BIOHEART_STATUS',
  APPOINTMENT_REASON: 'APPOINTMENT_REASON',
  MEDICATION_FREQUENCY: 'MEDICATION_FREQUENCY',
  MEDICATION_NOTE: 'MEDICATION_NOTE',
  REMOVE_ROW: 'REMOVE_ROW',
  INPUT: 'INPUT',
  RESTORE_CARE_PLAN: 'RESTORE_CARE_PLAN',
};

const SYMPTOMS = {
  CHESTPAIN: 'ChestPain',
  PALPITATIONS: 'Palpitations',
  LIGHTHEAD: 'LightHead',
  SHORTOFBREATH: 'ShortOfBreath',
  ABNORMALBLEEDING: 'AbnormalBleeding',
  SLEEPDISTURBANCECHANGE: 'SleepDisturbance',
  MEDICATIONCOMPLIANCE: 'MedicationNonadherence',
  HEARTRATE: 'HeartRate',
  BLOODPRESSURE: 'BloodPressure',
  INR: 'INR',
  EHRA: 'EHRA',
  OXYGENSATURATION: 'OxygenSaturation',
  BODYTEMPERATURE: 'BodyTemperature',
};

const SYMPTOMS_WORD = {
  CHESTPAIN_WORD: 'Chest pain',
  PALPITATIONS_WORD: 'Palpitations',
  LIGHTHEAD_WORD: 'Lightheadedness',
  SHORTOFBREATH_WORD: 'Increasing shortness of breath',
  ABNORMALBLEEDING_WORD: 'Abnormal bleeding',
  SLEEPDISTURBANCECHANGE_WORD: 'Sleep disturbance changes',
  MEDICATIONCOMPLIANCE_WORD: 'Medication nonadherence',
  HEARTRATE_WORD: 'Abnormal heart rate',
  BLOODPRESSURE_WORD: 'Abnormal blood pressure',
  INR_WORD: 'Abnormal INR',
  EHRA_WORD: 'Abnormal EHRA score',
  SPO2_WORD: 'Abnormal oxygen saturation',
  BODY_TEMPERATURE_WORD: 'Abnormal body temperature',
};

const {
  CHESTPAIN, PALPITATIONS, LIGHTHEAD,
  SHORTOFBREATH, ABNORMALBLEEDING, SLEEPDISTURBANCECHANGE, MEDICATIONCOMPLIANCE,
  HEARTRATE, BLOODPRESSURE, INR, EHRA, OXYGENSATURATION, BODYTEMPERATURE,
} = SYMPTOMS;

const {
  CHESTPAIN_WORD, PALPITATIONS_WORD, LIGHTHEAD_WORD,
  SHORTOFBREATH_WORD, ABNORMALBLEEDING_WORD, SLEEPDISTURBANCECHANGE_WORD, MEDICATIONCOMPLIANCE_WORD,
  HEARTRATE_WORD, BLOODPRESSURE_WORD, INR_WORD, EHRA_WORD, SPO2_WORD, BODY_TEMPERATURE_WORD,
} = SYMPTOMS_WORD;

export const SYM_ARR = [
  CHESTPAIN, PALPITATIONS, LIGHTHEAD,
  SHORTOFBREATH, ABNORMALBLEEDING, SLEEPDISTURBANCECHANGE, MEDICATIONCOMPLIANCE,
  HEARTRATE, BLOODPRESSURE, INR, EHRA, OXYGENSATURATION, BODYTEMPERATURE,
];
export const SYM_WORD_ARR = [
  CHESTPAIN_WORD, PALPITATIONS_WORD, LIGHTHEAD_WORD,
  SHORTOFBREATH_WORD, ABNORMALBLEEDING_WORD, SLEEPDISTURBANCECHANGE_WORD, MEDICATIONCOMPLIANCE_WORD,
  HEARTRATE_WORD, BLOODPRESSURE_WORD, INR_WORD, EHRA_WORD, SPO2_WORD, BODY_TEMPERATURE_WORD,
];
export const SEARCH_MEDICATION_URL = 'https://api-js.drugbank.com/v1/us';

export const MEDICAL_TEST_RESULT_VAR_ARR = [
  'stressTest', 'completeBloodCount', 'liverFunction', 'fastingBloodSugar', 'lipidProfile', 'inr',
  'tsh',
  'creatinine',
  'hgbA1C',
  'lvef',
  'otherTest',
];

export const STATUS = {
  REVIEWED: 'Reviewed',
  SENT: 'Sent',
  NEW: 'New',
  READ: 'Read',
};

export const REPORT_STATUS = {
  REVIEWED: 'REVIEWED',
  SENT: 'SENT',
  NEW: 'NEW',
  READ: 'READ',
};

export const NOTIFICATION_CENTER = {
  // MD
  SENT_REPORT: 'SentReport', // 356
  // NURSE
  APPOINTMENT: 'Appointment', // 87
  UPDATED_CAREPLAN: 'UpdatedCarePlan', // 62
  START_CAREPLAN: 'StartedCarePlan',

  PATIENT_COMPLETE_PROFILE: 'PatientCompleteProfile',
  REPORT_STUDY: 'ReportStudy',
  REQUEST_STUDY: 'RequestStudy',
  DAILY_ENTRY: 'DailyEntry',
  UPDATE_BIOHEART_AUTHORIZED: 'UpdateBioheartAuthorized',
  UPDATE_BIOHEART_REPORT_STATUS: 'UpdateBioheartReportStatus',
  CENCELED_APPOINTMENT: 'CanceledAppointment',
  REMOVE_ATTENDEE_APPOINTMENT: 'RemoveAttendeeAppointment',
  UPDATE_APPOINTMENT: 'UpdatedAppointment',
  NEW_APPOINTMENT: 'NewAppointment',

  NURSE_ASSIGNMENT: 'CarePlanNurseAssignment',
  NURSE_REASSIGNMENT: 'CarePlanNurseReassignment',
  PHYSICIAN_ASSIGNMENT: 'CarePlanPhysicianAssignment',
  PHYSICIAN_REASSIGNMENT: 'CarePlanPhysicianReassignment',
  NEW_APPOINTMENT_ASSIGNEE: 'NewAppointmentAssignee',
  NEW_MEDICATION_ADDED: 'OthersMedications',
  APPOINTMENT_FINISHED: 'AppointmentFinished',
  APPOINTMENT_OVERDUE: 'AppointmentOverdue',

  COMPLETED_CARE_PLAN: 'CompletedCarePlan',
  PATIENT_DELETED_ACCOUNT: 'PatientDeletedAccount',
  PATIENT_RECOVER_ACCOUNT: 'PatientRecoverAccount',
  RESTORE_CARE_PLAN: 'RestoreCarePlan',
  REACTIVE_CAREPLAN: 'ReactiveCarePlan',

  DELETED_CARE_PLAN: 'DeletedCarePlan',
};

export const NOTIFICATION_CENTER_SOCKET_TYPES = {
  ADD: 'Add',
  MASK_AS_READ: 'MarkAsRead',
  DELETE: 'Delete',
  DELETE_ALL: 'DeleteAll',
  // type, //Add, MaskAsRead, MaskAllAsRead, Delete, DeleteAll
};

export const ALL_TIME_TRACKING_ACTIVITIES = [
  'All activities',
  'Reviewing lab results',
  'Care plan review',
  'Care planning',
  'Discussion with other providers',
  'Scheduling appointments',
  'Refilling medication',
  'Making phone calls',
  'Appointment',
  'Monthly clinical review',
  'Following up with patients',
  'Coordinating referrals',
  'Answering questions',
  'Triaging symptoms',
  'Reviewing charts',
  'Arranging transportation',
  'Managing overall patient care',
];

export const DRAWER_TYPES = {
  ADD_NEW: 'ADD_NEW',
  DISPLAY: 'DISPLAY',
  EIDT: 'EIDT',
};

export const ASSIGN_SELECT_TYPES = {
  PATIENT_DETAILS: 'PATIENT_DETAILS',
  APPOINTMENT: 'APPOINTMENT',
};

export const RADIO_TYPES = {
  QUESTION: 'QUESTION',
  SCORE: 'SCORE',
  BIG: 'BIG',
  NONE: 'NONE',
  APPOINTMENT: 'APPOINTMENT',
};

export const APPOINTMENT_TYPES = [
  'Virtual', 'In-person',
];

export const SCHEDULE_TYPES = [
  'One-off', 'Follow-up',
];

export const APPOINTMENT_TYPES_BE = [
  'Virtual', 'InPerson',
];

export const SCHEDULE_TYPES_BE = [
  'OneOff', 'FollowUp',
];

export const DISPLAY_DATA_2 = {
  ATTACHMENT: 'ATTACHMENT',
  DATE: 'DATE',
  FREQUENCY: 'FREQUENCY',
  ARRAY: 'ARRAY',
  PERCENT: 'PERCENT',
  REPORT: 'REPORT',
  APT_STATUS: 'APT_STATUS',
  LINK: 'LINK',
};

export const CONFIRMATION_LAYOUT_TYPES = {
  SEND: 'SEND_REPORT',
  SAVE: 'SAVE_CHANGES',
  LEAVE: 'LEAVE_SITE',
  DELETE_ALL: 'DELETE_ALL',
  SWITCH_TO_CCM: 'SWITCH_TO_CCM',
  DELETE_TIME_SHEET: 'DELETE_TIME_SHEET',
  DELETE_MEDICATION: 'DELETE_MEDICATION',
  DELETE_ILR_REPORT: 'DELETE_ILR_REPORT',
  DELETE_EVENT_LOG_COMMENT: 'DELETE_EVENT_LOG_COMMENT',
  CANCEL_APPOINTMENT: 'CANCEL_APPOINTMENT',
  VIDEO_CALL_LINK_EXPIRED: 'VIDEO_CALL_LINK_EXPIRED',
  TROUBLE_CONNECTING: 'TROUBLE_CONNECTING',
  POOR_CONNECTION: 'POOR_CONNECTION',
  VIDEO_CRASH: 'VIDEO_CRASH',
  CHANGE_FOLLOW_UP_SCHEDULE: 'CHANGE_FOLLOW_UP_SCHEDULE',
  CHANGE_UNFOLLOW_UP_SCHEDULE: 'CHANGE_UNFOLLOW_UP_SCHEDULE',
  CANCEL_STUDY_PRESCRIPTION: 'CANCEL_STUDY_PRESCRIPTION',
  CANCEL_CREATE_STUDY: 'CANCEL_CREATE_STUDY',
  INCOMPLETE_INFO: 'INCOMPLETE_INFO',
  SWITCH_PROGRAM_TYPE: 'SWITCH_PROGRAM_TYPE',
  RESEND_LOGIN_INFO: 'RESEND_LOGIN_INFO',
  LEAVE_PRESCRIPTION: 'LEAVE_PRESCRIPTION',
  LEAVE_INTERPRETATION: 'LEAVE_INTERPRETATION',
  CHECKING_VERSION: 'CHECKING_VERSION',
  STOP_STUDY: 'STOP_STUDY',
  RELOAD: 'RELOAD',
  DELETE_INACTIVE_MEDICATION: 'DELETE_INACTIVE_MEDICATION',
  CANCEL_PROCESS: 'CANCEL_PROCESS',
  DELETE_ON_DEMAND_REPORT: 'DELETE_ON_DEMAND_REPORT',
  RE_GENERATE_ON_DEMAND_REPORT: 'RE_GENERATE_ON_DEMAND_REPORT',
  DELETE_TEMPLATES: 'DELETE_TEMPLATES',
  RESEND_REFERENCE_CODE: 'RESEND_REFERENCE_CODE',
  DISCARD_PATIENT_LIST: 'DISCARD_PATIENT_LIST',
  DISCARD_PATIENT_LIST_2: 'DISCARD_PATIENT_LIST_2',
  REMOVE_PATIENT: 'REMOVE_PATIENT',
  PATIENT_EXISTED: 'PATIENT_EXISTED',
  ADD_PATIENT_FAILED: 'ADD_PATIENT_FAILED',
  MISSING_HISTORY_INFO: 'MISSING_HISTORY_INFO',
  UNSAVE_CHANGE: 'UNSAVE_CHANGE',
  FAILED_TO_UPDATE_APM: 'FAILED_TO_UPDATE_APM',
  FAILED_TO_CANCEL_APM: 'FAILED_TO_CANCEL_APM',
  DISABLE_BIOHEART_MONITOR: 'DISABLE_BIOHEART_MONITOR',
  FINISH_APPOINTMENT: 'FINISH_APPOINTMENT',
  OVERDUE_APPOINTMENT: 'OVERDUE_APPOINTMENT',
  APPOINTMENT_FINISHED: 'APPOINTMENT_FINISHED',
  CANCELED_APPOINTMENT: 'CANCELED_APPOINTMENT',
  UNSAVED_VITALS: 'UNSAVED_VITALS',
  MANY_REQUESTS: 'MANY_REQUESTS',
  REND_REFRENCE_CODE: 'REND_REFRENCE_CODE',
  DISMISS_UPDATE: 'DISMISS_UPDATE',
  CONFIRM_SAVE_SEND_REPORT: 'CONFIRM_SAVE_SEND_REPORT',
  CANNOT_GENERATE_MASTER_BILL: 'CANNOT_GENERATE_MASTER_BILL',
  CANNOT_GENERATE_SUPER_BILL: 'CANNOT_GENERATE_SUPER_BILL',
  DELETE_CARE_PLAN: 'DELETE_CAREPLAN',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  PERMISSION_DENIED_CAM: 'PERMISSION_DENIED_CAM',
  PERMISSION_DENIED_MIC: 'PERMISSION_DENIED_MIC',
  RELOAD_REQUIRED: 'RELOAD_REQUIRED',
  BILLING_WARNING: 'BILLING_WARNING',
  BIOHEART_RESEND_CODE: 'BIOHEART_RESEND_CODE',
  REPLACE_CONSENT: 'REPLACE_CONSENT',
  FAILED_TO_UPLOAD_FILE: 'FAILED_TO_UPLOAD_FILE',
  DELETE_AUTO_MESSAGE: 'DELETE_AUTO_MESSAGE',
  OVER_SIZE: 'OVER_SIZE',
  DELETE_NEW_CARE_PLAN: 'DELETE_NEW_CARE_PLAN',
  RESTORE_CARE_PLAN: 'RESTORE_CARE_PLAN',
  REACTIVATE_CARE_PLAN: 'REACTIVATE_CARE_PLAN',
  REMOVE_CHAT_MEMBER: 'REMOVE_CHAT_MEMBER',
  IN_USE_COUNTRY: 'IN_USE_COUNTRY',
  LEAVE_CHAT_ROOM: 'LEAVE_CHAT_ROOM',
  CANCEL_THIS_APPOINTMENT: 'CANCEL_THIS_APPOINTMENT',
  CANCEL_FOLLOW_APPOINTMENT: 'CANCEL_FOLLOW_APPOINTMENT',
  CANCEL_ALL_APPOINTMENT: 'CANCEL_ALL_APPOINTMENT',
  DELETE_ALL_TIME_LOG: 'DELETE_ALL_TIME_LOG',
  DELETE_THIS_TIME_LOG: 'DELETE_THIS_TIME_LOG',
  LEAVE_SITE_TIME_LOG: 'LEAVE_SITE_TIME_LOG',
  RESEND_APPOINTMENT_CODE: 'RESEND_APPOINTMENT_CODE',
  DELETE_DIAGNOSIS: 'DELETE_DIAGNOSIS',
  DELETE_RISK_ASSESSMENT: 'DELETE_RISK_ASSESSMENT',
};

export const CALENDAR_MESSAGES = {
  CREATE_SUCCESS: 'The appointment is successfully created!',
  INVALID_DATE: 'Please select a future date/time!',
  UPDATE_SUCCESS: 'The appointment has been successfully updated!',
  CREATE_FAILED: 'Failed to create the appointment!',
  CREATE_FAILED_EXIST: 'Failed to create an appointment! Exist appointment on same time date and attendees.',
  UPDATE_FAILED: 'Failed to update the appointment!',
  CANCELED_SUCCESS: 'The appointment is successfully canceled!',
};

export const TOOLTIP_MESSAGES = {
  AUTO_APPOINTMENT: 'This is automatically logged by the system',
  CANCELED_APPOINTMENT: 'This appointment was canceled',
  END_OF_USE: 'End of use report',
  WITH_ARTIFACT_REPORT: 'This study has report marked as artifact',
  DELETED_ACCOUNT: 'Patient deleted their account',
};

export const NO_CURRENT_USER = 'No current user';

export const ROLES = {
  ADMIN: 'Admin',
  FACILITY_ADMIN: 'Facility Admin',
  CLINIC_PHYSICIAN: 'Clinic Physician',
  CLINIC_TECHNICIAN: 'Clinic Technician',
  PATIENT: 'Patient',
  REPORT_PRINTER: 'ReportPrinter',
  TECHNICIAN: 'Technician',
  PHYSICIAN: 'Physician',
};

export const HEALTHCARE_TEAM = {
  NURSE: 'Nurse',
  PHYSICIAN: 'Physician',
};

export const CONTACT_METHOD = {
  BOTH: 'Both',
  EMAIL_AND_SMS: 'Email and SMS',
  EMAI: 'Email',
  SMS: 'SMS',
};

export const ARTIFACT_FINDINGS = [
  {
    text: 'Artifact',
    issue: 'Artifacts in all channels',
    description: 'All leads are disconnected from the electrodes, or the electrodes no longer stick firmly to the patient’s skin.',
    stepsToTry: [
      {
        order: 1,
        content: 'Verify the current signal by getting an evaluation strip.',
      },
      {
        order: 2,
        content: 'If the issue is confirmed, call the patient.',
        isPatientInfo: true,
      },
      {
        order: 3,
        content: 'Check all ECG leads with the patient and ensure all electrodes firmly stick to the patient’s skin.',
      },
      {
        order: 4,
        content: 'Verify the signal again by getting an evaluation strip.',
      },
    ],
  },
  {
    text: 'LeadOff',
    issue: 'Lead off on diagnosis channel',
    description: 'The diagnosis channel is off. This can be from the lead is disconnected from the electrode, or the electrode no longer sticks firmly to the patient’s skin.',
    stepsToTry: [
      {
        order: 1,
        content: 'Verify the current signal by getting an evaluation strip.',
      },
      {
        order: 2,
        content: 'If the issue is confirmed, call the patient.',
        isPatientInfo: true,
      },
      {
        order: 3,
        content: 'Check all ECG leads with the patient and ensure all electrodes firmly stick to the patient’s skin.',
      },
      {
        order: 4,
        content: 'Verify the signal again by getting an evaluation strip.',
      },
    ],
  },
  {
    text: 'LeadOff2',
    issue: 'More than one lead disconnected',
    description: 'One or more leads are disconnected from the electrodes, or the electrodes no longer stick firmly to the patient’s skin.',
    stepsToTry: [
      {
        order: 1,
        content: 'Verify the current signal by getting an evaluation strip.',
      },
      {
        order: 2,
        content: 'If the issue is confirmed, call the patient.',
        isPatientInfo: true,
      },
      {
        order: 3,
        content: 'Check all ECG leads with the patient and ensure all electrodes firmly stick to the patient’s skin.',
      },
      {
        order: 4,
        content: 'Verify the signal again by getting an evaluation strip.',
      },
    ],
  },
  {
    text: 'LeadOff3',
    issue: 'All leads or ECG cable disconnected',
    description: 'All leads are disconnected from the electrodes, or the electrodes no longer stick firmly to the patient’s skin.',
    stepsToTry: [
      {
        order: 1,
        content: 'Verify the current signal by getting an evaluation strip.',
      },
      {
        order: 2,
        content: 'If the issue is confirmed, call the patient.',
        isPatientInfo: true,
      },
      {
        order: 3,
        content: 'Check all ECG leads with the patient and ensure all electrodes firmly stick to the patient’s skin.',
      },
      {
        order: 4,
        content: 'Verify the signal again by getting an evaluation strip.',
      },
    ],
  },
  {
    text: 'LeadOffLL',
    issue: 'Lead LL disconnected',
    description: 'One of the 3 ECG leads – lead LL is disconnected from the electrode, or the electrode no longer sticks firmly to the patient’s skin.',
    stepsToTry: [
      {
        order: 1,
        content: 'Verify the current signal by getting an evaluation strip.',
      },
      {
        order: 2,
        content: 'If the issue is confirmed, call the patient.',
        isPatientInfo: true,
      },
      {
        order: 3,
        content: 'Check all ECG leads with the patient and ensure all electrodes firmly stick to the patient’s skin.',
      },
      {
        order: 4,
        content: 'Verify the signal again by getting an evaluation strip.',
      },
    ],
  },
  {
    text: 'LeadOffLA',
    issue: 'Lead LA disconnected',
    description: 'One of the 3 ECG leads – lead LA is disconnected from the electrode, or the electrode no longer sticks firmly to the patient’s skin.',
    stepsToTry: [
      {
        order: 1,
        content: 'Verify the current signal by getting an evaluation strip.',
      },
      {
        order: 2,
        content: 'If the issue is confirmed, call the patient.',
        isPatientInfo: true,
      },
      {
        order: 3,
        content: 'Check all ECG leads with the patient and ensure all electrodes firmly stick to the patient’s skin.',
      },
      {
        order: 4,
        content: 'Verify the signal again by getting an evaluation strip.',
      },
    ],
  },
  {
    text: 'LeadOffRA',
    issue: 'Lead RA disconnected',
    description: 'One of the 3 ECG leads – lead RA is disconnected from the electrode, or the electrode no longer sticks firmly to the patient’s skin.',
    stepsToTry: [
      {
        order: 1,
        content: 'Verify the current signal by getting an evaluation strip.',
      },
      {
        order: 2,
        content: 'If the issue is confirmed, call the patient.',
        isPatientInfo: true,
      },
      {
        order: 3,
        content: 'Check all ECG leads with the patient and ensure all electrodes firmly stick to the patient’s skin.',
      },
      {
        order: 4,
        content: 'Verify the signal again by getting an evaluation strip.',
      },
    ],
  },
  {
    text: 'MissingStrips',
    issue: '',
  },
  {
    text: 'Offline',
    issue: 'The device has been offline for more than 12 hours',
    description: 'The device has been offline for more than 12 hours. It may be powered off by the patient, or it was out of battery, or the issue was due to low cell coverage.',
    stepsToTry: [
      {
        order: 1,
        content: 'Call the patient.',
        isPatientInfo: true,
      },
      {
        order: 2,
        content: 'Ensure that the device is powered on and has sufficient charge.',
      },
      {
        order: 3,
        content: 'Check if the WIRELESS SIGNAL LEVEL indicator to see if there is a low cell coverage issue with the device.',
        subContent: [
          'If the cell signal level is low, bring the device near to window to see if the cell signal level is increased.',
          'If the cell signal level is good but the device is still offline, issue an RMA for this device.',
        ],
      },
    ],
  },
];

export const STUDY_STATUS = {
  DRAFT: 'Draft',
  STARTING: 'Starting',
  ABORTED: 'Aborted',
  STARTED: 'Started',
  PAUSED: 'Paused',
  RESUMED: 'Resumed',
  COMPLETED: 'Completed',
  UPLOADING: 'Uploading',
  UPLOADED: 'Uploaded',
  ERASING: 'Erasing',
  ERASED: 'Erased',
  STOPPING: 'Stopping',
  ONGOING: 'Ongoing',
  DONE: 'Done',
};

export const SUPPORT_STOP_PAUSE = ['4.0.010b', '4.0.010c', '4.0.010d', '4.0.010e', '4.0.011', '4.0.012', '1.0.'];

export const CAN_STOP_STATUSES = [STUDY_STATUS.STARTED, STUDY_STATUS.RESUMED];

export const BIODIRECT_STATUS = {
  NEW: 'New',
  DELIVERING: 'Delivering',
  DELIVERED: 'Delivered',
  RUNNING: 'Running',
  COMPLETED: 'Completed',
  RETURNING: 'Returning',
  RETURNED: 'Returned',
  DRAFT: 'Draft',
};
export const MEDICATION_UNIT_OPTIONS = [
  'spoon(s)',
  'cap(s)',
  'drop(s)',
  'application(s)',
  'patch(es)',
  'spray(s)',
  'puff(s)',
  'suppository(ies)',
  'pill(s)',
  'packet(s)',
  'injection(s)',
  'gram(s)',
  'miligram (s)',
  'mililiter (s)',
  'unit(s)',
  'piece(s)',
];

export const MEDICATION_UNIT_VALUE = [
  'spoon',
  'cap',
  'drop',
  'application',
  'patch',
  'spray',
  'puff',
  'suppository',
  'pill',
  'packet',
  'injection',
  'gram',
  'miligram',
  'mililiter',
  'unit',
  'piece',
];

export const FREQUENCY_DATA = [
  '1 time / day',
  '2 times / day',
  '3 times / day',
  '4 times / day',
  '5 times / day',
];

export const NOTIFICATION_COUNT_TYPE = {
  STATUS_CARE_PLAN: 'STATUS_CARE_PLAN',
  NOTIFICATION_REPORT: 'NOTIFICATION_REPORT',
  MONTHLY_REPORT: 'MONTHLY_REPORT',
  STUDY_REPORT: 'STUDY_REPORT',
  ALL: 'ALL',
};

export const UP_LOAD_FILE_DESCRIPTION = {
  UPLOAD_FILE_TITLE: 'Click or drag file to this area to upload',
  UPLOAD_FILE_DESC: 'You can use a .csv or .xlsx file with your patients\' first name, last name, phone number and email. The maximum number of patients per file is 100. ',
};


export const START_HCP_ERROR_MESSAGE = {
  MISSING_QOL: 'The patient has not completed the Quality of life test!',
  MISSING_OVERVIEW_MEDICATION: 'Care plan overview and Medications must be filled out to start the health care program!',
  MISSING_OVERVIEW: 'Care plan overview must be filled out to start the health care program!',
  MISSING_MEDICATION: 'Medications must be filled out to start the health care program!',
};

export const PATIENT_FILTER_ENUM = {
  MY_PATIENT: 'My patients',
  ALL_PATIENT: 'All patients',
};

export const PRESCRIPTIONS_FILTER_ENUM = {
  MY_PRESCRIPTIONS: 'My prescriptions',
  ALL_PRESCRIPTIONS: 'All prescriptions',
};

export const CALENDAR_FILTER_ENUM = {
  MY_CALENDAR: 'My calendar',
  CLINIC_CALENDAR: 'Clinic calendar',
};

export const ADDITIONAL_MEDICAL_HISTORY = [
  {
    label: 'Cardiothoracic surgery',
    value: 'Cardiothoracic surgery',
  },
  {
    label: 'Family history of AFib',
    value: 'Family history of AFib',
  },
  {
    label: 'Myocardial infarction',
    value: 'Myocardial infarction',
  },
  {
    label: 'Poor circulation',
    value: 'Poor circulation',
  },
  {
    label: 'Atrial arrhythmias',
    value: 'Atrial arrhythmias',
  },
  {
    label: 'Pause',
    value: 'Pause',
  },
  {
    label: 'Pericardial disease',
    value: 'Pericardial disease',
  },
  {
    label: 'Sinus rhythm',
    value: 'Sinus rhythm',
  },
  {
    label: 'Heart valve replacement',
    value: 'Heart valve replacement',
  },
];
