import _ from 'lodash';
import { AdjustedStrokeRateData, BleedsPer100PatientYears } from '../../../Constants';
import { getUpdatedKey } from '../../../Utils';
import {
  getCVGRisk, getFRSAgeSex, getHDLScore, getSmokerScore, getStep9HeartRate, getStep9Risk, getSystolicBP, getTotalCholesterol,
} from '../../../Utils/baselineInfo';

export const RISK_ASSESSMENT_OPTIONS = Object.freeze([
  {
    label: 'CHA2DS2-VASc score',
    value: 'cha2ds2vasc',
  },
  {
    label: 'EHRA score',
    value: 'ehra',
  },
  {
    label: 'Framingham risk score (FRS)',
    value: 'frs',
  },
  {
    label: 'HAS-BLED clinical characteristic',
    value: 'hadBled',
  },
]);

export const RISK_ASSESSMENT_FULLNAME_ENUM = Object.freeze({
  cha2ds2vasc: 'CHA2DS2-VACc score',
  frs: 'Framingham risk score (FRS)',
  hadBled: 'HAS-BLED clinical characteristic',
  ehra: 'EHRA score',
});

export const RISK_ASSESSMENT_ENUM = Object.freeze({
  CHA2DS2VASc: 'cha2ds2vasc',
  FRS: 'frs',
  HASBLED: 'hadBled',
  EHRA: 'ehra',
});

export const RISK_ASSESSMENT = {
  CHA2DS2VASc: 'cha2ds2vasc',
  FRS: 'frs',
  HASBLED: 'hasBled',
  EHRA: 'ehra',
};

export const CHA2DS2VASc = Object.freeze([
  {
    key: 'congestiveHeartFailure',
    value: 'Congestive heart failure',
    suffix: 1,
  },
  {
    key: 'hypertension',
    value: 'Hypertension',
    suffix: 1,
  },
  {
    key: 'age2',
    value: 'Age ≥ 75',
    suffix: 2,
  },
  {
    key: 'age1',
    value: 'Age 65-74',
    suffix: 1,
  },
  {
    key: 'diabetesMellitus',
    value: 'Diabetes mellitus',
    suffix: 1,
  },
  {
    key: 'stroke',
    value: 'Stroke/TIA/thrombo-embolism',
    suffix: 2,
  },
  {
    key: 'vascularDisease',
    value: 'Vascular disease',
    suffix: 1,
  },
  {
    key: 'sexFemale',
    value: 'Sex Female',
    suffix: 1,
  },
]);

export const formatCha2ds2vascValue = (key) => {
  switch (key) {
    case 'congestiveHeartFailure': return 'Congestive heart failure';
    case 'hypertension': return 'Hypertension';
    case 'age2': return 'Age ≥ 75';
    case 'age1': return 'Age 65-74';
    case 'diabetesMellitus': return 'Diabetes mellitus';
    case 'stroke': return 'Stroke/TIA/thrombo-embolism';
    case 'vascularDisease': return 'Vascular disease';
    case 'sexFemale': return 'Sex Female';
    default: return '';
  }
};

export const calculateCha2ds2vascScore = (data) => {
  let totalScore = 0;
  data.forEach((item) => {
    if (item.isChecked) {
      totalScore += item.suffix;
    }
  });
  return {
    totalScore,
    finalScore: AdjustedStrokeRateData[totalScore],
  };
};

export const calculateHasBLEDScore = (data) => {
  let totalScore = 0;
  data.forEach((item) => {
    if (item.isChecked) {
      totalScore += item.suffix;
    }
  });
  return {
    totalScore,
    finalScore: BleedsPer100PatientYears[totalScore],
  };
};

const getFRSTotalScore = ({
  age = 0, gender = 'Male', smoker = true, totalCholesterol = 0, HDLCholesterol = 0, systolicBP = 0, bloodTreatedMedicines = true,
}) => {
  const ageScore = getFRSAgeSex(age, gender);
  const totalChores = getTotalCholesterol(totalCholesterol, gender);
  const hdlScore = getHDLScore(HDLCholesterol);
  const sysScore = getSystolicBP(systolicBP, bloodTreatedMedicines, gender);
  const smokeSocre = getSmokerScore(smoker, gender);
  const score = ageScore + totalChores + hdlScore + sysScore + smokeSocre;
  return score;
};

export const calculateFRSScrore = ({
  age = 0, gender = 'Male', smoker = true, totalCholesterol = 0, HDLCholesterol = 0, systolicBP = 0, bloodTreatedMedicines = true,
}) => {
  const totalScore = getFRSTotalScore({
    age,
    gender,
    smoker,
    totalCholesterol,
    HDLCholesterol,
    systolicBP,
    bloodTreatedMedicines,
  });
  const cvgRisk = getCVGRisk(totalScore, gender);
  const heartRate = getStep9HeartRate(totalScore, gender);
  const risk = getStep9Risk(cvgRisk);
  return {
    totalScore, cvgRisk, heartRate, risk,
  };
};


export const HASBLEDClinicalCharacteristic = [
  {
    key: 'hypertension',
    value: 'Hypertension',
    suffix: 1,
  },
  {
    key: 'abnormalLiverFunction',
    value: 'Abnormal liver function',
    suffix: 1,
  },
  {
    key: 'abnormalRenalFunction',
    value: 'Abnormal renal function',
    suffix: 1,
  },
  {
    key: 'stroke',
    value: 'Stroke',
    suffix: 1,
  },
  {
    key: 'bleeding',
    value: 'Bleeding',
    suffix: 1,
  },
  {
    key: 'labileInrs',
    value: 'Labile INRs',
    suffix: 1,
  },
  {
    key: 'elderly65',
    value: 'Elderly (Age > 65)',
    suffix: 1,
  },
  {
    key: 'drugs',
    value: 'Drugs',
    suffix: 1,
  },
  {
    key: 'alcohol',
    value: 'Alcohol',
    suffix: 1,
  },
];


export const EHRA = [
  {
    value: 'Disabling',
    title: 'Disabling - 1',
    content: 'Normal daily activity discontinued',
  },
  {
    value: 'Severe',
    title: 'Severe - 2',
    content: 'Normal daily activity affected',
  },
  {
    value: 'Moderate',
    title: 'Moderate - 3',
    content: 'Normal daily activity not affected but patient troubled by symptoms',
  },
  {
    value: 'Mild',
    title: 'Mild - 4',
    content: 'Normal daily activity not affected; symptoms not troublesome to patient',
  },
  {
    value: 'None',
    title: 'None - 5',
    content: '',
  },
];

export const GENDER_OPTIONS = Object.freeze([
  {
    value: 'Male',
    label: 'Male',
  },
  {
    value: 'Female',
    label: 'Female',
  },
]);


export const handleDisabledSaveCha2ds2vasc = (oldData, newData) => {
  if (_.isEmpty(newData)) {
    return true;
  }
  const updateKeys = getUpdatedKey(CHA2DS2VASc.map(item => ({
    ...item,
    isChecked: oldData[item.key],
  })), newData);

  if (_.isEmpty(updateKeys)) {
    return true;
  }
  return false;
};

export const handleDisabledSaveHasBLED = (oldData, newData) => {
  if (_.isEmpty(newData)) {
    return true;
  }
  const updateKeys = getUpdatedKey(HASBLEDClinicalCharacteristic.map(item => ({
    ...item,
    isChecked: oldData[item.key],
  })), newData);

  if (_.isEmpty(updateKeys)) {
    return true;
  }
  return false;
};

export const handleDisabledSaveFRSForm = (oldData, newData, isEdit = false) => {
  // if (!newData?.age) {
  //   return true;
  // }
  const cloneOldData = _.cloneDeep(oldData);
  _.assign(cloneOldData, {
    age: +oldData?.age,
    hdlCholesterol: +oldData?.hdlCholesterol,
    systolicBP: +oldData?.systolicBP,
    totalCholesterol: +oldData?.totalCholesterol,
  });

  const cloneNewData = _.cloneDeep(newData);
  _.assign(cloneNewData, {
    age: +newData?.age,
    hdlCholesterol: +newData?.hdlCholesterol,
    systolicBP: +newData?.systolicBP,
    totalCholesterol: +newData?.totalCholesterol,
  });

  if (_.isEqual(cloneOldData, cloneNewData) && isEdit) {
    return true;
  }
  return false;
};

export const handleAddCha2ds2vascData = ({ cha2ds2vasc }) => {
  const newCha2ds2vasc = {};
  _.forEach(cha2ds2vasc, (item) => {
    _.assign(newCha2ds2vasc, { [item?.key]: item?.isChecked || false });
  });

  return newCha2ds2vasc;
};

export const handleAddHasBLEDData = ({ hasBLED }) => {
  const newHasBLED = {};
  _.forEach(hasBLED, (item) => {
    _.assign(newHasBLED, { [item?.key]: item?.isChecked || false });
  });

  return newHasBLED;
};

export const handleAddFRSFormData = ({ state }) => {
  const cloneState = _.cloneDeep(state);
  _.assign(cloneState, {
    age: +state?.age,
    hdlCholesterol: +state?.hdlCholesterol,
    systolicBP: +state?.systolicBP,
    totalCholesterol: +state?.totalCholesterol,
    ageError: undefined,
  });

  return cloneState;
};

export const handleAddData = ({ carePlanId, type, data }) => ({
  input: {
    carePlanId,
    [type]: data,
  },
});

export const handleUpdateData = ({ baselineId, type, data }) => ({
  _id: baselineId,
  input: {
    [type]: data,
  },
});

export const checkIsValidFrs = () => { };
