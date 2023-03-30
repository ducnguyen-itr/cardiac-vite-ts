

export const BASELINE_DIAGNOSED_CONDITIONS_ENUM = {
  AtrialFibrillation: 'AtrialFibrillation',
  CongestiveHeartFailure: 'CongestiveHeartFailure',
  HypertensionAndHyperlipidemia: 'HypertensionAndHyperlipidemia',
  CoronaryArteryDisease: 'CoronaryArteryDisease',
  CardiovascularDisease: 'CardiovascularDisease',
  IschemicHeartDisease: 'IschemicHeartDisease',
  Other: 'Other',
};

export const BASELINE_DIAGNOSED_CONDITIONS = [
  'Angina',
  'Aorta disease and Marfan syndrome',
  'Atrial arrhythmias',
  'Atrial Fibrillation',
  'Bradycardia',
  'Cardiomyopathy',
  'Cardiothoracic surgery',
  'Congenital heart disease',
  'Congestive heart failure or LV dysfunction',
  'Coronary artery disease',
  'Deep vein thrombosis and pulmonary embolism',
  'Diabetes mellitus',
  'Family history of AFib',
  'Heart attack',
  'Heart failure',
  'Heart valve disease',
  'High cholesterol',
  'Hypertension/High Blood Pressure',
  'Hyperthyroidism or hypothyroidism',
  'Kidney Disease',
  'Myocardial infarction',
  'Obesity',
  'Obstructive sleep apnea',
  'Pause',
  'Pericardial disease',
  'Peripheral vascular disease',
  'Poor circulation',
  'Rheumatic heart disease',
  'Sinus rhythm',
  'Smoker',
  'Stroke',
  'Stroke transient ischemic attack (mini-stroke)',
  'Tachycardia',
  'Unstable Angina',
  'Vascular disease',
  'Ventricular Arrhythmia',
  'Other',
];

export const BASELINE_DIAGNOSED_CONDITIONS_OTHER = 'Other';
export const BASELINE_DIAGNOSED_CONDITIONS_OTHERS = 'Others';
export const BASELINE_DIAGNOSED_CONDITIONS_AFIB = 'Atrial Fibrillation';

export const BASELINE_DIAGNOSED_CONDITIONS_TYPE = {
  Other: 'Other',
  AtrialFibrillation: 'Atrial Fibrillation',
  HeartValveDisease: 'Heart valve disease',
  ValvularHeartDisease: 'Valvular heart disease',
  HeartValveReplaceMent: 'Heart valve replacement',
};

// pattern: String @constraint(pattern: "^Paroxysmal$|^Persistent$|^LongStandingPersistent$|^Permanent$|^Valvular$")
export const BASELINE_PATTERNS_ENUM = {
  Paroxysmal: 'Paroxysmal',
  Persistent: 'Persistent',
  LongStandingPersistent: 'LongStandingPersistent',
  Permanent: 'Permanent',
  Valvular: 'Valvular',
};

export const BASELINE_PATTERNS = [
  'Paroxysmal', 'Persistent', 'Long-standing persistent', 'Permanent', 'Valvular',
];

export const MEDICAL_HISTORY_DEFAULT_OPTIONS = [
  {
    label: 'Common conditions',
    value: 'Common conditions',
    isCommon: true,
    isDisabled: true,
  },
  {
    value: 'Angina - unstable',
    label: 'Angina - unstable',
  },
  {
    value: 'Angina pectoris',
    label: 'Angina pectoris',
  },
  {
    value: 'Atrial Fibrillation',
    label: 'Atrial Fibrillation',
  },
  {
    value: 'Atrial arrhythmias',
    label: 'Atrial arrhythmias',
  },
  {
    value: 'Cardiomyopathy',
    label: 'Cardiomyopathy',
  },
  {
    value: 'Cardiothoracic surgery',
    label: 'Cardiothoracic surgery',
  },
  {
    value: 'Cholesterol - high',
    label: 'Cholesterol - high',
  },
  {
    value: 'Cigarette smoker',
    label: 'Cigarette smoker',
  },
  {
    value: 'Coronary artery disease (CAD)',
    label: 'Coronary artery disease (CAD)',
  },
  {
    value: 'Diabetes mellitus (DM)',
    label: 'Diabetes mellitus (DM)',
  },
  {
    value: 'Family history of AFib',
    label: 'Family history of AFib',
  },
  {
    value: 'Heart attack (myocardial infarction)',
    label: 'Heart attack (myocardial infarction)',
  },
  {
    value: 'Heart disease - rheumatic',
    label: 'Heart disease - rheumatic',
  },
  {
    value: 'Heart rate - rapid (tachycardia)',
    label: 'Heart rate - rapid (tachycardia)',
  },
  {
    value: 'Heart rate - slow (bradycardia)',
    label: 'Heart rate - slow (bradycardia)',
  },
  {
    value: 'Heart valve replacement',
    label: 'Heart valve replacement',
  },
  {
    value: 'Heat stroke',
    label: 'Heat stroke',
  },
  {
    value: 'High blood pressure (hypertension (HTN))',
    label: 'High blood pressure (hypertension (HTN))',
  },
  {
    value: 'Hyperthyroidism',
    label: 'Hyperthyroidism',
  },
  {
    value: 'Myocardial infarction',
    label: 'Myocardial infarction',
  },
  {
    value: 'Obesity',
    label: 'Obesity',
  },
  {
    value: 'Obstructive sleep apnea (OSA)',
    label: 'Obstructive sleep apnea (OSA)',
  },
  {
    value: 'Pause',
    label: 'Pause',
  },
  {
    value: 'Pericardial disease',
    label: 'Pericardial disease',
  },
  {
    value: 'Peripheral vascular disease',
    label: 'Peripheral vascular disease',
  },
  {
    value: 'Poor circulation',
    label: 'Poor circulation',
  },
  {
    value: 'Sinus rhythm',
    label: 'Sinus rhythm',
  },
  {
    value: 'Stroke transient ischemic attack',
    label: 'Stroke transient ischemic attack',
  },
  {
    value: 'Valvular heart disease',
    label: 'Valvular heart disease',
  },
  {
    value: 'Ventricular Arrhythmia',
    label: 'Ventricular Arrhythmia',
  },
];

export const AFIB_ICD_CODES = ['I48', 'I48.0', 'I48.1', 'I48.11', 'I48.19', 'I48.2', 'I48.20', 'I48.21', 'I48.9', 'I48.91'];
