// ALL VAR IS SAVE IN SERVER
//  WE HAVE TO MAP TO HAVE DISPLYED DATA

export const OVERVIEW_FIELDS = {
  equipmentProvided: 'Patient education',
  frequencyOfBloodTest: 'Bloodwork',
  nextBloodTest: 'Bloodwork',
  typesOfBloodTests: 'Bloodwork',
  timeUnitOfBloodTest: 'Bloodwork',

  frequencyOfStressTest: 'Stress test',
  nextStressTest: 'Stress test',
  timeUnitOfStressTest: 'Stress test',

  followSchedule: 'Follow up schedule',
  reportSetting: 'Report settings',

  notes: 'Notes',
  programType: 'Plan type',
};

export const CONDITION_INFO_FIELDS = {
  currentDiseases: 'Current conditions',
  monitoredDiseases: 'Conditions being monitored',
};

export const PRESCRIPTION_FIELDS = {
  medications: 'Prescription',
};

export const REPORT_SETTINGS_FIELDS = {
  isReportAccessNurse: 'Monthly report access for nurse',

  minHeartRate: 'Notification report triggers',
  maxHeartRate: 'Notification report triggers',
  minBloodPressureDenominator: 'Notification report triggers',
  minBloodPressureNumerator: 'Notification report triggers',
  maxBloodPressureNumerator: 'Notification report triggers',
  maxBloodPressureDenominator: 'Notification report triggers',
  minInr: 'Notification report triggers',
  maxInr: 'Notification report triggers',
  minEhraScore: 'Notification report triggers',
  maxEhraScore: 'Notification report triggers',
  medicationComplianceNurse: 'Notification report triggers',
  medicationCompliancePhysician: 'Notification report triggers',
  shortnessOfBreath: 'Notification report triggers',
  chestPain: 'Notification report triggers',
  abnormalBleed: 'Notification report triggers',
  lightHeadedness: 'Notification report triggers',
  sleepDisturbanceChange: 'Notification report triggers',
  palpitations: 'Notification report triggers',
  notes: 'Notification report triggers',

  consecutiveEhra: 'Notification report triggers',
  sleepLevel: 'Notification report triggers',
  consecutiveSleepDisturbance: 'Notification report triggers',
  isEnableAbnormalBleed: 'Notification report triggers',
  isEnableBloodPressure: 'Notification report triggers',
  isEnableBodyTemperature: 'Notification report triggers',
  isEnableChestPain: 'Notification report triggers',
  isEnableEhraScore: 'Notification report triggers',
  isEnableHeartRate: 'Notification report triggers',
  isEnableInr: 'Notification report triggers',
  isEnableLightHeadedness: 'Notification report triggers',
  isEnableMedicationCompliance: 'Notification report triggers',
  isEnableOxygenSaturation: 'Notification report triggers',
  isEnablePalpitations: 'Notification report triggers',
  isEnableShortnessOfBreath: 'Notification report triggers',
  isEnableSleepLevel: 'Notification report triggers',
  minOxygenSaturation: 'Notification report triggers',
  maxOxygenSaturation: 'Notification report triggers',
  maxBodyTemperature: 'Notification report triggers',
  minBodyTemperature: 'Notification report triggers',
};

export const BASELINE_INFO_FILEDS = {
  cardiacConditions: 'Cardiac conditions',
  Liver: 'Liver function test',
  LeadECG: '12 leads ECG',
  Echocardiogram: 'Echocardiogram',
  cha2ds2vasc: 'CHA2DS2-VASc score',
  hasBled: 'HAS-BLED score',
  ehra: 'EHRA score',
  frs: 'FRS score',
  Stress: 'Exercise stress testing',
  CBC: 'Complete blood count',
};


export const CHANGE_HISTORY_NAME = {
  Caregivers: 'Caregivers updated',

  InitialIntakeInfoAdded: 'Initial intake info added',
  InitialIntakeInfoUpdate: 'Initial intake info updated',

  BaselineInfoAdded: 'Baseline info added',
  BaselineInfoUpdate: 'Baseline info updated',

  CarePlanOverviewAdded: 'Care plan overview added',
  CarePlanOverviewUpdate: 'Care plan overview updated',

  ConditionsInformationAdd: 'Conditions information added',
  ConditionsInformation: 'Conditions information updated',

  PrescriptionAdded: 'Medications added',
  PrescriptionUpdated: 'Medications updated',
  MedicationsDeleted: 'Medications deleted',

  HeartStudyPrescribed: 'Heart study prescribed',
  HeartStudyCancel: 'Heart study canceled',
  HeartStudyStarted: 'Heart study started',
  HeartStudyStop: 'Heart study stopped',

  ReportSetting: 'Report settings updated',

  MedicalTestResult: 'Medical test result added',

  CareplanStarted: 'Health care program started',
  CareplanStop: 'Health care program stopped',

  MedicalTestResultAdded: 'Medical test result added',
  MedicalTestResultUpdate: 'Medical test result updated',
  PatientDemographicUpdated: 'Demographic information updated',
  InitialContactInfoUpdated: 'Initial contact info updated',
  Report: 'Report',
  SuperBillAdded: 'Superbill created',
  SuperBillUpdated: 'Superbill updated',
  SuperBillStatusUpdated: 'Superbill’s status updated',
  AddQoL: 'Quality of life added',
  UpdatedQoL: 'Quality of life updated',
  CarePlanRestore: 'Health care program restored',
  CarePlanDeleted: 'Health care program deleted',
  UploadConsent: 'CCM consent added',
  CCMConsentUpdated: 'CCM consent replaced',
  CCMConsentAdded: 'CCM consent added',
  RPMConsentUpdated: 'RPM consent replaced',
  RPMConsentAdded: 'RPM consent added',
  CarePlanReactive: 'Health care program reactivated',
  DiagnosisAdded: 'Diagnosis added',
  DiagnosisUpdated: 'Diagnosis updated',
  DiagnosisDeleted: 'Diagnosis deleted',
  CardiacRiskAssessmentAdded: 'Cardiac risk assessment added',
  CardiacRiskAssessmentUpdated: 'Cardiac risk assessment updated',
  CardiacRiskAssessmentDeleted: 'Cardiac risk assessment deleted',
  AllergiesAdded: 'Allergies added',
  AllergiesUpdated: 'Allergies updated',

  PastMedicalHistoryAdded: 'Past medical history added',
  PastMedicalHistoryUpdated: 'Past medical history updated',
  DeviceInfoUpdated: 'Device updated',
  DeviceInfoAdded: 'Device added',
};

export const MEDICAL_TEST_RESULT_TYPE_FIELDS = {
  Stress: 'Stress test',
  CBC: 'Complete blood count',
  Liver: 'Liver function testing',
  BloodSugar: 'Fasting blood sugar',
  Lipid: 'Lipid profile',
  INR: 'INR',
  TSH: 'TSH',
  Creatinine: 'Creatinine',
  HgbA1C: 'HbA1c',
  LVEF: 'Echocardiogram',
  Other: 'Other tests',
};


export const CHANGE_HISTORY_TYPE = {
  CarePlanOverviewUpdate: 'CarePlanOverviewUpdate',
  CarePlanOverviewAdded: 'CarePlanOverviewAdded',
  PrescriptionAdded: 'PrescriptionAdded',
  PrescriptionUpdated: 'PrescriptionUpdated',
  MedicationsDeleted: 'MedicationsDeleted',
  MedicalTestResultAdded: 'MedicalTestResultAdded',
  MedicalTestResultUpdate: 'MedicalTestResultUpdate',
  InitialIntakeInfoUpdate: 'InitialIntakeInfoUpdate',
  InitialIntakeInfoAdded: 'InitialIntakeInfoAdded',
  BaselineInfoUpdate: 'BaselineInfoUpdate',
  BaselineInfoAdded: 'BaselineInfoAdded',
  ConditionsInformation: 'ConditionsInformation',
  CareplanStop: 'CareplanStop',
  CareplanStarted: 'CareplanStarted',
  HeartStudyPrescribed: 'HeartStudyPrescribed',
  HeartStudyCancel: 'HeartStudyCancel',
  HeartStudyStarted: 'HeartStudyStarted',
  HeartStudyStop: 'HeartStudyStop',
  HeartStudyStopped: 'HeartStudyStopped',
  ReportSetting: 'ReportSetting',
  Caregivers: 'Caregivers',
  Report: 'Report',
  BioheartIntegration: 'BioheartIntegration',
  DeleteOnDemandReport: 'DeleteOnDemandReport',
  PatientDemographicUpdated: 'PatientDemographicUpdated',
  InitialContactInfoUpdated: 'InitialContactInfoUpdated',
  SuperBillAdded: 'SuperBillAdded',
  SuperBillUpdated: 'SuperBillUpdated',
  AddQoL: 'AddQoL',
  UpdatedQoL: 'UpdatedQoL',
  UploadConsent: 'UploadConsent',
  CCMConsentUpdated: 'CCMConsentUpdated',
  CCMConsentAdded: 'CCMConsentAdded',
  CarePlanRestore: 'CarePlanRestore',
  CarePlanDeleted: 'CarePlanDeleted',
  CarePlanReactive: 'CarePlanReactive',

  DiagnosisAdded: 'DiagnosisAdded',
  DiagnosisUpdated: 'DiagnosisUpdated',
  DiagnosisDeleted: 'DiagnosisDeleted',

  CardiacRiskAssessmentAdded: 'CardiacRiskAssessmentAdded',
  CardiacRiskAssessmentUpdated: 'CardiacRiskAssessmentUpdated',

  AllergiesAdded: 'AllergiesAdded',
  AllergiesUpdated: 'AllergiesUpdated',

  PastMedicalHistoryAdded: 'PastMedicalHistoryAdded',
  PastMedicalHistoryUpdated: 'PastMedicalHistoryUpdated',
  DeviceInfoUpdated: 'DeviceInfoUpdated',
  DeviceInfoAdded: 'DeviceInfoAdded',
};
