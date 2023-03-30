import _ from 'lodash';
import { PROGRAM_TYPE_LABEL } from './newPatientData';

export const COMPONENT_STATUS = {
  DISPLAY: 'DISPLAY',
  EMPTY: 'EMPTY',
  INPUT: 'INPUT',
  EDIT: 'EDIT',
  ADD: 'ADD',
};
export const SERVICE_TYPES = {
  STANDARD: 'Standard study',
  BIODIRECT: 'Biodirect',

  STANDARD_VALUE: 'Bioflux',
  BIODIRECT_VALUE: 'BiofluxDirect',
};


export const DEVICE_TYPES = {
  BIOFLUX: 'Bioflux',
  BIOTRES: 'Biotres',
};
export const SERVICE_TYPE_DATA = [
  {
    label: SERVICE_TYPES.STANDARD,
    value: SERVICE_TYPES.STANDARD_VALUE,
  },
  {
    label: SERVICE_TYPES.BIODIRECT,
    value: SERVICE_TYPES.BIODIRECT_VALUE,
  },
];

export const DEVICE_TYPE_DATA = [
  {
    label: DEVICE_TYPES.BIOFLUX,
    value: DEVICE_TYPES.BIOFLUX,
  },
  {
    label: DEVICE_TYPES.BIOTRES,
    value: DEVICE_TYPES.BIOTRES,
  },
];

export const DEVICE_TYPE_TITLE_DATA = [
  {
    label: DEVICE_TYPES.BIOFLUX,
    title: DEVICE_TYPES.BIOFLUX,
    value: DEVICE_TYPES.BIOFLUX,
  },
  {
    label: DEVICE_TYPES.BIOTRES,
    title: DEVICE_TYPES.BIOTRES,
    value: DEVICE_TYPES.BIOTRES,
  },
];
export const DEVICE_TYPE_TITLE_DATA_DISABLE = [
  {
    label: DEVICE_TYPES.BIOFLUX,
    title: DEVICE_TYPES.BIOFLUX,
    value: DEVICE_TYPES.BIOFLUX,
  },
  {
    label: DEVICE_TYPES.BIOTRES,
    title: DEVICE_TYPES.BIOTRES,
    value: DEVICE_TYPES.BIOTRES,
    disabled: true,
  },
];

export const OTHER_OPTION = 'Other';

export const STUDY_TYPES_ENUMS_ARR = ['MCT', 'CARDIAC EVENT', 'HOLTER', 'EXTENDED HOLTER', 'MCT PEEK'];

export const STUDY_TYPES_ENUMS = {
  MCT: 'MCT',
  MCT_PEEK: 'MCT PEEK',
  CARDIAC_EVENT: 'CARDIAC EVENT',
  HOLTER: 'HOLTER',
  EXTENDED_HOLTER: 'EXTENDED HOLTER',
};

export const STUDY_TYPES_ENUMS_TYPE = {
  MCT: 'MCT - 93228-29',
  MCT_PEEK: 'MCT PEEK - 93228-29',
  CARDIAC_EVENT: 'CARDIAC EVENT - 93268-72',
  HOLTER: 'HOLTER - 93224-27',
  EXTENDED_HOLTER: 'EXTENDED HOLTER - 93241 - 93247',
};

export const HOLTER_AND_FOLLOW = 'HOLTER AND FOLLOW ON STUDY';

export const STUDY_TYPES = [
  'MCT - 93228-29',
  'MCT PEEK - 93228-29',
  'CARDIAC EVENT - 93268-72',
  'HOLTER - 93224-27',
  'EXTENDED HOLTER - 93241 - 93247',
  HOLTER_AND_FOLLOW,
];

export const BIOTRES_STUDY_TYPES = [
  'HOLTER - 93224-27',
  'EXTENDED HOLTER - 93241 - 93247',
];

export const BIOTRES_STUDY_TYPES_QUERY = [
  'HOLTER',
  'EXTENDED HOLTER',
];


export const STUDY_TYPES_QUERY = [
  'MCT',
  'MCT PEEK',
  'CARDIAC EVENT',
  'HOLTER',
  'EXTENDED HOLTER',
  HOLTER_AND_FOLLOW,
];

export const FOLLOW_STUDY_TYPES = [
  'MCT - 93228-29',
  'MCT PEEK - 93228-29',
  'CARDIAC EVENT - 93268-72',
  'HOLTER - 93224-27',
  'EXTENDED HOLTER - 93241 - 93247',
];

export const DIAGNOSIS_CODE_LABELS = [
  'Tachycardia, unspecified',
  'Bradycardia, unspecified',
  'Dyspnea, unspecified',
  'Orthopnea',
  'Palpitations',
  'Chest pain, unspecified',
  'Dizziness and giddiness',
  'Syncope and collapse',
  'Cardiac arrhythmia, unspecified',
  'Conduction disorder, unspecified',
  'Other specified conduction disorders',
  'Other specified cardiac arrhythmias',
  'Unspecified atrial fibrillation',
  'Unspecified atrial flutter',
  'Paroxysmal atrial fibrillation',
  'Persistent atrial fibrillation',
  'Other persistent atrial fibrillation',
  'Longstanding persistent atrial fibrillation',
  'Chronic atrial fibrillation, unspecified',
  'Permanent atrial fibrillation',
  'Typical atrial flutter',
  'Atypical atrial flutter',
  'Atrioventricular block, first degree',
  'Atrioventricular block, second degree',
  'Other atrioventricular block',
  'Supraventricular tachycardia',
  'Sick sinus syndrome',
  'Ventricular tachycardia',
  'Paroxysmal tachycardia, unspecified',
  'Unspecified atrioventricular block',
  'Left anterior fascicular block',
  'Left posterior fascicular block',
  'Unspecified fascicular block',
  'Other fascicular block',
  'Left bundle-branch block, unspecified',
  'Right fascicular block',
  'Other right bundle-branch block',
  'Bifascicular block',
  'Trifascicular block',
  'Nonspecifific intraventricular block',
  'Other specified heart block',
  'Pre-excitation syndrome',
  'Long QT syndrome',
  'Cardiac arrest due to underlying cardiac condition',
  'Cardiac arrest due to other underlying cardiac condition',
  'Cardiac arrest, cause unspecified',
  'Re-entry ventricular arrhythmia',
  'Longstanding persistent atrial fibrillation',
  'Other persistent atrial fibrillation',
  'Chronic atrial fibrillation, unspecified',
  'Permanent atrial fibrillation',
  'Chest pain, unspecified',
  'Atrioventricular block, complete',
  'Unspecified atrioventricular block',
  'Other atrioventricular block',
  'Left anterior fascicular block',
  'Left posterior fascicular block',
  'Unspecified fascicular block',
  'Other fascicular block',
  'Left bundle-branch block, unspecified',
  'Right fascicular block',
  'Other right bundle-branch block',
  'Bifascicular block',
  'Trifascicular block',
  'Nonspecifific intraventricular block',
  'Other specified heart block',
  'Pre-excitation syndrome',
  'Long QT syndrome',
  'Other specified conduction disorders',
  'Conduction disorder, unspecified',
  'Cardiac arrest due to underlying cardiac condition',
  'Cardiac arrest due to other underlying cardiac condition',
  'Cardiac arrest, cause unspecified',
  'Re-entry ventricular arrhythmia',
  'Supraventricular tachycardia',
  'Ventricular tachycardia',
  'Paroxysmal tachycardia, unspecified',
  'Paroxysmal atrial fibrillation',
  'Persistent atrial fibrillation',
  'Longstanding persistent atrial fibrillation',
  'Other persistent atrial fibrillation',
  'Chronic atrial fibrillation, unspecified',
  'Permanent atrial fibrillation',
  'Typical atrial flutter',
  'Atypical atrial flutter',
  'Unspecified atrial fibrillation',
  'Unspecified atrial flutter',
  'Ventricular fibrillation',
  'Ventricular flutter',
  'Atrial premature depolarization',
  'Junctional premature depolarization',
  'Ventricular premature depolarization',
  'Unspecified premature depolarization',
  'Other premature depolarization',
  'Other specified cardiac arrhythmias',
  'Transient cerebral ischemic attack, unspecified',
  'Reversible cerebrovascular vasoconstriction syndrome',
  'Other cerebrovascular vasospasm and vasoconstriction',
  'Cerebral autosomal dominant arteriopathy with subcortical infarcts and leukoencephalopathy',
  'Other hereditary cerebrovascular disease',
  'Adverse effect of cardiac-stimulant glycosides and drugs of similar action, initial encounter',
  'Adverse effect of cardiac-stimulant glycosides and drugs of similar action, subsequent encounter',
  'Adverse effect of cardiac-stimulant glycosides and drugs of similar action, sequela',
  'Adverse effect of calcium-channel blockers, initial encounter',
  'Adverse effect of calcium-channel blockers, subsequent encounter',
  'Adverse effect of calcium-channel blockers, sequela',
  'Adverse effect of other antidysrhythmic drugs, initial encounter',
  'Adverse effect of other antidysrhythmic drugs, sequela',
  'Adverse effect of unspecified agents primarily affecting the cardiovascular system, initial encounter',
  'Adverse effect of unspecified agents primarily affecting the cardiovascular system, sequela',
  'Adverse effect of other agents primarily affecting the cardiovascular system, initial encounter',
  'Adverse effect of other agents primarily affecting the cardiovascular system, sequela',
  '',
];

export const DIAGNOSIS_CODE_VALUES = [
  'R00.0',
  'R00.1',
  'R06.0',
  'R06.01',
  'R00.2',
  'R07.9',
  'R42',
  'R55',
  'I49.9',
  'I45.90',
  'I45.89',
  'I49.8',
  'I48.91',
  'I48.92',
  'I48.0',
  'I48.1',
  'I48.11',
  'I48.19',
  'I48.20',
  'I48.21',
  'I48.3',
  'I48.4',
  'I44.0',
  'I44.1',
  'I44.39',
  'I47.10',
  'I49.5',
  'I47.20',
  'I47.9',
  'I44.30',
  'I44.4',
  'I44.5',
  'I44.60',
  'I44.69',
  'I44.7',
  'I45.0',
  'I45.19',
  'I45.2',
  'I45.3',
  'I45.4',
  'I45.5',
  'I45.6',
  'I45.81',
  'I46.2',
  'I46.8',
  'I46.9',
  'I47.00',
  'I48.11',
  'I48.19',
  'I48.20',
  'I48.21',
  'R07.9',
  'I44.2',
  'I44.30',
  'I44.39',
  'I44.4',
  'I44.5',
  'I44.60',
  'I44.69',
  'I44.7',
  'I45.0',
  'I45.19',
  'I45.2',
  'I45.3',
  'I45.4',
  'I45.5',
  'I45.6',
  'I45.81',
  'I45.89',
  'I45.90',
  'I46.2',
  'I46.8',
  'I46.9',
  'I47.0',
  'I47.1',
  'I47.2',
  'I47.9',
  'I48.0',
  'I48.1',
  'I48.11',
  'I48.19',
  'I48.20',
  'I48.21',
  'I48.3',
  'I48.4',
  'I48.91',
  'I48.92',
  'I49.01',
  'I49.02',
  'I49.1',
  'I49.2',
  'I49.3',
  'I49.40',
  'I49.49',
  'I49.8',
  'G45.9',
  'I67.841',
  'I67.848',
  'I67.850',
  'I67.858',
  'T46.0X5A',
  'T46.0X5D',
  'T46.0X5S',
  'T46.1X5A',
  'T46.1X5D',
  'T46.1X5S',
  'T46.2X5A',
  'T46.2X5S',
  'T46.905A',
  'T46.905S',
  'T46.995A',
  'T46.995S',
  'Other',
];

// export const DIAGNOSIS_CODES = _.map(DIAGNOSIS_CODE_VALUES, (x, i) => `${x}${DIAGNOSIS_CODE_LABELS[i] ? ` - ${DIAGNOSIS_CODE_LABELS[i]}` : ''}`);

export const DIAGNOSIS_CODES = [
  'R00.0 - Tachycardia, unspecified',
  'R00.1 - Bradycardia, unspecified',
  'R00.2 - Palpitations',
  'R42 - Dizziness and giddiness',
  'R55 - Syncope and collapse',
  'I49.5 - Sick sinus syndrome',
  'I49.8 - Other specified cardiac arrhythmias',
  'I49.9 - Cardiac arrhythmia, unspecified',
  'I47.1 - Supraventricular tachycardia',
  'I47.9 - Paroxysmal tachycardia, unspecified',
  'I48.0 - Paroxysmal atrial fibrillation',
  'I48.1 - Persistent atrial fibrillation',
  'I48.91 - Unspecified atrial fibrillation',
  'I48.92 - Unspecified atrial flutter',
  'I48.20 - Chronic atrial fibrillation, unspecified',
  'I45.9 - Conduction disorder, unspecified',
  'R07.9 - Chest pain, unspecified',
  'I44.30 - Unspecified atrioventricular block',
  'R06.00 - Dyspnea, unspecified',
  'R06.01 - Orthopnea',
  'R06.03 - Acute respiratory distress',
  'R06.09 - Other forms of dyspnea',
  'R06.1 - Stridor',
  'R06.2 - Wheezing',
  'R06.4 - Hyperventilation',
  'R06.83 - Snoring',
  'R06.89 - Other abnormalities of breathing',
  'R07.2 - Precordial pain',
  'R07.82 - Intercostal pain',
  'R07.89 - Other chest pain',
  'I44.0 - Atrioventricular block, first degree',
  'I44.1 - Atrioventricular block, second degree',
  'I44.2 - Atrioventricular block, complete',
  'I44.39 - Other atrioventricular block',
  'I44.4 - Left anterior fascicular block',
  'I44.5 - Left posterior fascicular block',
  'I44.60 - Unspecified fascicular block',
  'I44.69 - Other fascicular block',
  'I44.7 - Left bundle-branch block, unspecified',
  'I45.0 - Right fascicular block',
  'I45.19 - Other right bundle-branch block',
  'I45.2 - Bifascicular block',
  'I45.3 - Trifascicular block',
  'I45.4 - Nonspecifific intraventricular block',
  'I45.5 - Other specified heart block',
  'I45.6 - Pre-excitation syndrome',
  'I45.81 - Long QT syndrome',
  'I45.89 - Other specified conduction disorders',
  'I46.2 - Cardiac arrest due to underlying cardiac condition',
  'I46.8 - Cardiac arrest due to other underlying cardiac condition',
  'I46.9 - Cardiac arrest, cause unspecified',
  'I47.0 - Re-entry ventricular arrhythmia',
  'I47.2 - Ventricular tachycardia',
  'I48.11 - Longstanding persistent atrial fibrillation',
  'I48.19 - Other persistent atrial fibrillation',
  'I48.21 - Permanent atrial fibrillation',
  'I48.3 - Typical atrial flutter',
  'I48.4 - Atypical atrial flutter',
  'I49.01 - Ventricular fibrillation',
  'I49.02 - Ventricular flutter',
  'I49.1 - Atrial premature depolarization',
  'I49.2 - Junctional premature depolarization',
  'I49.3 - Ventricular premature depolarization',
  'I49.40 - Unspecified premature depolarization',
  'I49.49 - Other premature depolarization',
  'G45.9 - Transient cerebral ischemic attack, unspecified',
  'I67.841 - Reversible cerebrovascular vasoconstriction syndrome',
  'I67.848 - Other cerebrovascular vasospasm and vasoconstriction',
  'I67.850 - Cerebral autosomal dominant arteriopathy with subcortical infarcts and leukoencephalopathy',
  'I67.858 - Other hereditary cerebrovascular disease',
  'T46.0X5A - Adverse effect of cardiac-stimulant glycosides and drugs of similar action, initial encounter',
  'T46.0X5D - Adverse effect of cardiac-stimulant glycosides and drugs of similar action, subsequent encounter',
  'T46.0X5S - Adverse effect of cardiac-stimulant glycosides and drugs of similar action, sequela',
  'T46.1X5A - Adverse effect of calcium-channel blockers, initial encounter',
  'T46.1X5D - Adverse effect of calcium-channel blockers, subsequent encounter',
  'T46.1X5S - Adverse effect of calcium-channel blockers, sequela',
  'T46.2X5A - Adverse effect of other antidysrhythmic drugs, initial encounter',
  'T46.2X5S - Adverse effect of other antidysrhythmic drugs, sequela',
  'T46.905A - Adverse effect of unspecified agents primarily affecting the cardiovascular system, initial encounter',
  'T46.905S - Adverse effect of unspecified agents primarily affecting the cardiovascular system, sequela',
  'T46.995A - Adverse effect of other agents primarily affecting the cardiovascular system, initial encounter',
  'T46.995S - Adverse effect of other agents primarily affecting the cardiovascular system, sequela',
  'Other',
];

export const COPY_RESPONSE_MSG = {
  REFERENCE_CODE: 'Referenced code copied to clipboard',
  REFERENCE_CODE_FAILED: 'Failed to copy the reference code!',
};

export const STUDY_MSG = {
  ADD_FAILED: 'Failed to prescribe the study!',

  EXPIRED_TITLE: 'New study prescription expired!',
  NEW_STUDY_PRESCRIBED: 'New study prescribed!',
  NEW_STUDY_SUB: 'Open Bioflux clinic portal',
  STUDY_VIEW_ALL_NOTI: 'View all study notification reports',
};

export const STUDY_STATUS_ENUM = ['Starting', 'Ongoing', 'Completed', 'Done', 'Draft', 'Aborted'];

export const STUDY_STATUS = {
  EXPIRED: 'Aborted',
  ONGOING: 'Ongoing',
  NOT_STARTED: 'Draft',
  STARTING: 'Starting',
  COMPLETED: 'Completed',
  DONE: 'Done',
  FOLLOW_ON: 'FOLLOW_ON',
  FO_TAG: 'FO',
  DRAFT: 'Draft',
  ABORTED: 'Aborted',
};

export const HM_REPORT_TYPES_ENUM = ['Notification', 'Study'];

export const PRIORITY_ENUM = ['Urgent', 'Emergent', 'High', 'Medium', 'Low'];

export const PRIORITY_ALL_DATA = ['All priorities', 'Urgent', 'Emergent', 'High', 'Medium', 'Low'];
export const FILTER_BIOFLUX_REPORT_STATUS = ['All statuses', 'Unreviewed', 'Reviewed'];
export const FILTER_BIOHEART_STATUS = ['All statuses', 'Unreviewed', 'Reviewed', 'Failed to generate'];
export const FILTER_STATUS = ['All statuses', 'Unreviewed', 'Reviewed'];
export const FILTER_PATIENTS = ['All patients', 'My patients'];
export const FILTER_CARE_PLAN_STATUS = ['All statuses', 'Read', 'Unread'];
export const FILTER_PRESCRIPTIONS = ['All prescriptions', 'My prescriptions'];
export const FILTER_MESSAGE_STATUS = ['All status', 'Done', 'Undone'];

export const FILTER_HM_PLAN_TYPE = [PROGRAM_TYPE_LABEL.ALL, PROGRAM_TYPE_LABEL.CCM, PROGRAM_TYPE_LABEL.CCM_RPM];

export const HEART_MORNITOR_TABS = {
  CURRENT_STUDY: 'Current study',
  PREVIOUS_STUDIES: 'Previous studies',
  BIOHEART_MONITOR: 'Bioheart',
};

export const TIME_TRACKING_TABS = {
  TIME_TRACKING: 'Time tracking',
  SUPERBILLS: 'Superbills',
};

export const REPORT_SETTINGS_2_TO_5 = [
  '< 2',
  '< 3',
  '< 4',
  '< 5',
];

export const REPORT_SETTINGS_1_TO_4 = [
  'None',
  '≥ 1',
  '≥ 2',
  '≥ 3',
  '≥ 4',
];

export const REPORT_SETTINGS_5_TO_10 = [
  'None',
  '≥ 5',
  '≥ 6',
  '≥ 7',
  '≥ 8',
  '≥ 9',
  '≥ 10',
];
export const SF_46_ANSWER_23 = [
  '• Food',
  '• Housing',
  '• Transportation',
  '• Utilities',
  '• Medical care, medicine, medical supplies',
  '• Childcare',
  '• Help with activities of daily living (bathing, dressing, cooking, etc.)',
  '• None',
];
export const SF_46_ANSWER_24_25 = [
  'Yes',
  'No',
];
export const ON_DEMAND_REPORT = {
  instruction: 'The timeframe is required to be at least 7 days and less than 31 days',
};
