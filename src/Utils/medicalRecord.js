import _, { has } from 'lodash';
import { CHA2DS2VASCScoreData } from '../Constants';
import {
  cha2ds2vascScoreToPercent, CHA2DS2VASC_SCORE_DATA, EHRA_SCORE_DATA, HASBLED_RISFACTOR,
} from '../Constants/medicalRecord';
import {
  getCVGRisk, getStep9HeartRate, getStep9Risk, getStep9TotalScore,
} from './baselineInfo';

export const customSymptomDisplay = (symptomHistory) => {
  const {
    lightHeadedness,
    fatigue,
    decreasingExerciseCapacity,
    dyspnea,
    syncope,
    palpitations,
    chestPainTimePerWeek,
    increasingFrequencyOfChestPain,
    numberInArmOrLeg,
    painfulUrination,
  } = _.clone(symptomHistory) || {};
  const res = [];
  if (!_.isNil(chestPainTimePerWeek) || !_.isNil(increasingFrequencyOfChestPain)) {
    res.push(`• Chest pain ${chestPainTimePerWeek
      ? `- ${chestPainTimePerWeek} time${chestPainTimePerWeek > 1 ? 's' : ''}/week` : ''}${increasingFrequencyOfChestPain ? `${chestPainTimePerWeek ? ', increasing over the past 4 weeks' : '- increasing over the past 4 weeks'}` : ''}`);
  }
  if (decreasingExerciseCapacity) {
    res.push('• Decreasing exercise capacity');
  }
  if (dyspnea) {
    res.push('• Dyspnea');
  }
  if (fatigue) {
    res.push('• Fatigue');
  }
  if (lightHeadedness) {
    res.push('• Lightheadedness');
  }
  if (numberInArmOrLeg) {
    res.push('• Numbness in arm(s) or leg(s)');
  }
  if (painfulUrination) {
    res.push('• Painful urination');
  }
  if (!_.isEmpty(palpitations)) {
    res.push(`• Palpitations - triggered by: ${palpitations?.join(', ')}`);
  } else if (palpitations?.length === 0 && !_.isNil(palpitations)) {
    res.push('• Palpitations');
  }
  if (syncope) {
    res.push('• Syncope');
  }
  return _.isEmpty(res) ? ['No'] : res;
};


export const getCha2ds2vascScore = (cha2ds2vasc = {}) => {
  if (_.isEmpty(cha2ds2vasc)) return { isEmptyDataCha2ds2vas: true };
  let isEmptyDataCha2ds2vas = true;
  let cha2ds2vascScore = 0;
  _.forEach(Object.keys(cha2ds2vasc), (x) => {
    if (cha2ds2vasc?.[x]) {
      const data = _.find(CHA2DS2VASC_SCORE_DATA, item => item.key === x);
      cha2ds2vascScore += (data?.suffix || 0);
    }
    if (!_.isNil(cha2ds2vasc?.[x])) {
      isEmptyDataCha2ds2vas = false;
    }
  });

  return { isEmptyDataCha2ds2vas, cha2ds2vascScore, cha2ds2vascDescription: cha2ds2vascScoreToPercent[cha2ds2vascScore] };
};

export const getHasBledScore = (hasBled = {}) => {
  if (_.isEmpty(hasBled)) return { isEmptyDataBled: true };
  let isEmptyDataBled = true;
  let hasBledScore = 0;
  _.forEach(Object.keys(hasBled), (x) => {
    if (hasBled?.[x]) {
      hasBledScore += 1;
    }
    if (!_.isNil(hasBled?.[x])) {
      isEmptyDataBled = false;
    }
  });

  return { isEmptyDataBled, hasBledScore, hasBledDescription: HASBLED_RISFACTOR[hasBledScore] };
};

export const getEhraScore = (ehra = '') => {
  if (!ehra) return { isEmptyDataEhra: true };
  const ehraData = _.find(EHRA_SCORE_DATA, x => x.key === ehra);
  return { isEmptyDataEhra: false, ehraScore: ehraData?.score || 0, ehraDescription: ehraData?.key || '' };
};

export const calcFrsScore = ({
  smoker, totalCholesterol, hdlCholesterol,
  systolicBP, bloodTreatedMedicines, age, gender,
}) => {
  const step9TotalScore = getStep9TotalScore(age, gender, smoker === 'Yes',
    totalCholesterol, hdlCholesterol,
    systolicBP, bloodTreatedMedicines, age, gender);
  const cvgRisk = getCVGRisk(step9TotalScore, gender);
  const heartAge = getStep9HeartRate(step9TotalScore, gender);
  const risk = getStep9Risk(cvgRisk);
  return {
    step9TotalScore, cvgRisk, heartAge, risk,
  };
};
// `10 years CVD risk: ${cvgRisk}%\nHeart age: ${heartRate} years\nRisk: ${risk}`;
export const getFrsScore = (frs = {}) => {
  if (_.isEmpty(frs)) return { isEmptyDataFrs: true };

  const {
    step9TotalScore, cvgRisk, heartAge, risk,
  } = calcFrsScore(frs);
  return {
    isEmptyDataFrs: false,
    frsScore: step9TotalScore,
    frsDescription: [
      `10 years CVD risk: ${cvgRisk}%`,
      `Heart age: ${heartAge} years`,
      `Risk: ${risk}`,
    ],
  };
};
