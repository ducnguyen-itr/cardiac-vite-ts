import { CopyFilled } from '@ant-design/icons';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import {
  AdjustedStrokeRateData, BleedsPer100PatientYears, DISPLAY_DATA_2, HeartValveIssuseData,
} from '../Constants';
import {
  BASELINE_DIAGNOSED_CONDITIONS, BASELINE_DIAGNOSED_CONDITIONS_AFIB, BASELINE_DIAGNOSED_CONDITIONS_ENUM, BASELINE_DIAGNOSED_CONDITIONS_OTHER, BASELINE_DIAGNOSED_CONDITIONS_OTHERS, BASELINE_DIAGNOSED_CONDITIONS_TYPE, BASELINE_PATTERNS, BASELINE_PATTERNS_ENUM,
} from '../Constants/baseline';
import consoleLog from '../Helpers/consoleLog';
import { sortListCondition } from './initialIntakeInfo';

const {
  AtrialFibrillation,
  CongestiveHeartFailure,
  HypertensionAndHyperlipidemia,
  CoronaryArteryDisease,
  CardiovascularDisease,
  IschemicHeartDisease,
  Other,
} = BASELINE_DIAGNOSED_CONDITIONS_ENUM;

const {
  Paroxysmal, Persistent, LongStandingPersistent, Permanent, Valvular,
} = BASELINE_PATTERNS_ENUM;

export const calcStep7 = (hasbledClinical = {}) => {
  if (!hasbledClinical || _.isEmpty(hasbledClinical)) {
    return {};
  }
  let step7TotalScore = 0;
  _.forEach(hasbledClinical, (item) => {
    if (item.isCheck) {
      step7TotalScore += item.suffix;
    }
  });
  return { hasbledClinicalFinalScore: BleedsPer100PatientYears[step7TotalScore], step7TotalScore };
};

export const calcStep6 = (cha2ds2VascScore) => {
  if (!cha2ds2VascScore || _.isEmpty(cha2ds2VascScore)) {
    return {};
  }
  let step6TotalScore = 0;
  _.forEach(cha2ds2VascScore, (item) => {
    if (item.isCheck) {
      step6TotalScore += item.suffix;
    }
  });
  return { step6TotalScore, cha2ds2VascFinalScore: `${AdjustedStrokeRateData[step6TotalScore]}%` };
};

export const getHeartStatus = (
  heartValveIssue, valvularHeartDisease, heartValveReplacement, mitralValveStatus,
) => {
  switch (heartValveIssue) {
    case HeartValveIssuseData[0]:
      return `${HeartValveIssuseData[0]}: ${valvularHeartDisease}`;
    case HeartValveIssuseData[1]: {
      const tempArr = [];
      _.forEach(heartValveReplacement, (x) => {
        if (x.isCheck) {
          tempArr.push(x.value);
        }
      });
      const firstLine = `${HeartValveIssuseData[1]}: ${tempArr.join(', ')}`;
      const secondLine = `Mitral valve status: ${mitralValveStatus}`;
      return `${firstLine}\n${secondLine}`;
    }
    default:
      return heartValveIssue;
  }
};

export const formatDisplayDiagnosedConditionsPattern = (pattern = undefined) => {
  switch (pattern) {
    case Paroxysmal:
      return BASELINE_PATTERNS[0];
    case Persistent:
      return BASELINE_PATTERNS[1];
    case LongStandingPersistent:
      return BASELINE_PATTERNS[2];
    case Permanent:
      return BASELINE_PATTERNS[3];
    case Valvular:
      return BASELINE_PATTERNS[4];
    default:
      return pattern;
  }
};

export const formatDisplayDiagnosedConditionsType = (type = undefined) => {
  switch (type) {
    case AtrialFibrillation:
      return BASELINE_DIAGNOSED_CONDITIONS[0];
    case CongestiveHeartFailure:
      return BASELINE_DIAGNOSED_CONDITIONS[1];
    case HypertensionAndHyperlipidemia:
      return BASELINE_DIAGNOSED_CONDITIONS[2];
    case CoronaryArteryDisease:
      return BASELINE_DIAGNOSED_CONDITIONS[3];
    case CardiovascularDisease:
      return BASELINE_DIAGNOSED_CONDITIONS[4];
    case IschemicHeartDisease:
      return BASELINE_DIAGNOSED_CONDITIONS[5];
    case Other:
      return BASELINE_DIAGNOSED_CONDITIONS_OTHER;
    default:
      return type;
  }
};

const formatHeartValveDisease = (type = '', heartValveReplacement = {}, valvularDisease) => {
  const data = [];
  if (type === 'Valvular heart disease') {
    data.push(`${type} ${valvularDisease ? `- ${valvularDisease}` : ''}`);
  }

  if (type === 'Heart valve replacement') {
    data.push(`${type}`);
    data.push(`${heartValveReplacement?.whichValve
      ? `• Replacement valve: ${heartValveReplacement?.whichValve}` : ''}`);
    data.push(`${heartValveReplacement?.mitralValveStatus
      ? `• Mitral valve status: ${heartValveReplacement?.mitralValveStatus}` : ''}`);
  }
  return data;
};

const formatDisplayData4DiagnosedConditionsItem = (item = {}, diagnosedConditionsBioflux = undefined, isUnLinked = false, bioflux = {}) => {
  const {
    type, pattern, onsetDate, confirmedVia,
    othersConditions, heartValve, heartValveReplacement, valvularDisease,
  } = item || {};
  const isMissingUnlinked = type === BASELINE_DIAGNOSED_CONDITIONS_AFIB && confirmedVia === 'Bioflux' && isUnLinked;
  const isMissingLinked = type === BASELINE_DIAGNOSED_CONDITIONS_AFIB && confirmedVia === 'Bioflux' && !isUnLinked && _.isEmpty(bioflux);

  const conditionItem = [
    {
      title: 'Diagnosed conditions',
      data: type === BASELINE_DIAGNOSED_CONDITIONS_TYPE.ValvularHeartDisease
        || type === BASELINE_DIAGNOSED_CONDITIONS_TYPE.HeartValveReplaceMent ? formatHeartValveDisease(type, heartValveReplacement, valvularDisease) : type,
      type: type === BASELINE_DIAGNOSED_CONDITIONS_TYPE.ValvularHeartDisease
        || type === BASELINE_DIAGNOSED_CONDITIONS_TYPE.HeartValveReplaceMent ? 'ARRAY' : '',
    },
  ];
  if (type === BASELINE_DIAGNOSED_CONDITIONS_AFIB) {
    conditionItem.push({
      title: 'Atrial Fibrillation pattern',
      data: pattern || 'N/A',
    });
  }
  if (type === BASELINE_DIAGNOSED_CONDITIONS_OTHER) {
    conditionItem.push({
      title: BASELINE_DIAGNOSED_CONDITIONS_OTHER,
      data: othersConditions || 'N/A',
    });
  }
  conditionItem.push(
    {
      title: 'Onset date',
      data: onsetDate ? moment(onsetDate).format('MM/DD/YYYY') : 'N/A',
    },
    {
      title: 'Confirmed via',
      data: confirmedVia || 'N/A',
      isMissingData: isMissingUnlinked || isMissingLinked,
      missingText: isMissingUnlinked ? 'Bioflux report is unavailable' : isMissingLinked ? 'Missing Bioflux report' : '',
    },
  );
  if (type === BASELINE_DIAGNOSED_CONDITIONS_AFIB && !isUnLinked && !_.isEmpty(bioflux)) {
    if (confirmedVia === 'Bioflux') {
      conditionItem.push({
        title: 'Bioflux report',
        data: !_.isEmpty(diagnosedConditionsBioflux) ? diagnosedConditionsBioflux : 'N/A',
        type: DISPLAY_DATA_2.REPORT,
      });
    }
  }
  return conditionItem;
};

const formatDisplayData4DiagnosedConditions = (diagnosedConditions = [], diagnosedConditionsBioflux = undefined, isUnLinked = false, bioflux = {}) => {
  const tempArr = [];
  if (!_.isEmpty(diagnosedConditions)) {
    _.forEach(diagnosedConditions, (x, index) => {
      tempArr.push({
        title: index === 0 ? 'Diagnosed conditions' : '',
        data: formatDisplayData4DiagnosedConditionsItem(x, diagnosedConditionsBioflux, isUnLinked, bioflux),
        index: index + 1,
      });
    });
  } else {
    tempArr.push({
      title: 'Diagnosed conditions',
      data: [{
        title: 'Diagnosed conditions',
        data: [],
        type: 'ARRAY',
      }],
    });
  }
  return tempArr;
};

const formatDisplayData4AtRiskConditions = (atRiskConditions = [], notesAtRiskConditions = '', othersConditions = '') => {
  const data = [];
  const sortAtRiskConditions = sortListCondition(atRiskConditions);
  _.forEach(sortAtRiskConditions, (x) => {
    if (x === BASELINE_DIAGNOSED_CONDITIONS_OTHER) {
      data.push(`• Others: ${othersConditions}`);
    } else {
      data.push(`• ${x}`);
    }
  });

  const tempObj = {
    title: 'At-risk conditions',
    data: [
      {
        title: 'At-risk conditions',
        data,
        type: 'ARRAY',
      },
      {
        title: 'Notes',
        data: notesAtRiskConditions,
      },
    ],
  };
  return tempObj;
};

export const getCardiacConditions = ({
  heartValveIssue, valvularHeartDisease, heartValveReplacement, mitralValveStatus,
  diagnosedConditions, notesAtRiskConditions, atRiskConditions, othersConditions, diagnosedConditionsBioflux, isUnLinked, bioflux,
}) => {
  const AFibInfoData = [
    ...formatDisplayData4DiagnosedConditions(diagnosedConditions, diagnosedConditionsBioflux, isUnLinked, bioflux),
    formatDisplayData4AtRiskConditions(atRiskConditions, notesAtRiskConditions, othersConditions),
    // {
    //   title: 'Heart valve status',
    //   data: [
    //     {
    //       title: 'Issues',
    //       data: getHeartStatus(heartValveIssue, valvularHeartDisease, heartValveReplacement, mitralValveStatus) || '',
    //     },
    //   ],
    // },
  ];
  return AFibInfoData;
};


export const getFRSAgeSex = (age = 0, gender = 'Male') => {
  if (gender === 'Male') {
    if (age <= 34) return 0;
    if (age >= 35 && age <= 39) return 2;
    if (age >= 40 && age <= 44) return 5;
    if (age >= 45 && age <= 49) return 7;
    if (age >= 50 && age <= 54) return 8;
    if (age >= 55 && age <= 59) return 10;
    if (age >= 60 && age <= 64) return 11;
    if (age >= 65 && age <= 69) return 12;
    if (age >= 70 && age <= 74) return 14;
    // if (age >= 75) return 15;
    return 15;
  }
  if (age <= 34) return 0;
  if (age >= 35 && age <= 39) return 2;
  if (age >= 40 && age <= 44) return 4;
  if (age >= 45 && age <= 49) return 5;
  if (age >= 50 && age <= 54) return 7;
  if (age >= 55 && age <= 59) return 8;
  if (age >= 60 && age <= 64) return 9;
  if (age >= 65 && age <= 69) return 10;
  if (age >= 70 && age <= 74) return 11;
  // if (age >= 75) return 12;
  return 12;
};

export const getHDLScore = (HDLCholesterol = 0) => {
  if (HDLCholesterol > 1.6) return -2;
  if (HDLCholesterol >= 1.3 && HDLCholesterol <= 1.6) return -1;
  if (HDLCholesterol >= 1.2 && HDLCholesterol <= 1.29) return 0;
  if (HDLCholesterol >= 0.9 && HDLCholesterol <= 1.19) return 1;
  // if (HDLCholesterol < 0.9) return 2;
  return 2;
};

export const getTotalCholesterol = (totalCholesterol = 0, gender = 'Male') => {
  if (totalCholesterol < 4.1) return 0;
  if (totalCholesterol >= 4.1 && totalCholesterol <= 5.19) return 1;
  if (gender === 'Male') {
    if (totalCholesterol >= 5.2 && totalCholesterol <= 6.19) return 2;
    if (totalCholesterol >= 6.2 && totalCholesterol <= 7.2) return 3;
    // if (HDLCholesterol > 7.2) return 2;
    return 4;
  }
  if (totalCholesterol >= 5.2 && totalCholesterol <= 6.19) return 3;
  if (totalCholesterol >= 6.2 && totalCholesterol <= 7.2) return 4;
  // if (HDLCholesterol > 7.2) return 5;
  return 5;
};

export const getSystolicBP = (systolicBP = 0, bloodPressure = false, gender = 'Male') => {
  if (gender === 'Male') {
    if (bloodPressure) {
      if (systolicBP < 120) return 0;
      if (systolicBP >= 120 && systolicBP <= 129) return 2;
      if (systolicBP >= 130 && systolicBP <= 139) return 3;
      if (systolicBP >= 140 && systolicBP <= 149) return 4;
      if (systolicBP >= 150 && systolicBP <= 159) return 4;
      // >= 160
      return 5;
    }
    if (systolicBP < 120) return -2;
    if (systolicBP >= 120 && systolicBP <= 129) return 0;
    if (systolicBP >= 130 && systolicBP <= 139) return 1;
    if (systolicBP >= 140 && systolicBP <= 149) return 2;
    if (systolicBP >= 150 && systolicBP <= 159) return -2;
    // >= 160
    return 3;
  }
  if (bloodPressure) {
    if (systolicBP < 120) return -1;
    if (systolicBP >= 120 && systolicBP <= 129) return 2;
    if (systolicBP >= 130 && systolicBP <= 139) return 3;
    if (systolicBP >= 140 && systolicBP <= 149) return 5;
    if (systolicBP >= 150 && systolicBP <= 159) return 6;
    // >= 160
    return 7;
  }
  if (systolicBP < 120) return -3;
  if (systolicBP >= 120 && systolicBP <= 129) return 0;
  if (systolicBP >= 130 && systolicBP <= 139) return 1;
  if (systolicBP >= 140 && systolicBP <= 149) return 2;
  if (systolicBP >= 150 && systolicBP <= 159) return 4;
  // >= 160
  return 5;
};

export const getSmokerScore = (smoker = false, gender = 'Male') => {
  if (gender === 'Male') {
    if (smoker) return 4;
    return 0;
  }
  if (smoker) return 3;
  return 0;
};

export const getStep9TotalScore = (age = 0, gender = 'Male', smoker = false,
  totalCholesterol = 0, HDLCholesterol = 0, systolicBP = 0, bloodPressure = false, frsAge,
  frsGender) => {
  const ageScore = getFRSAgeSex(frsAge || age, frsGender || gender);
  const totalChores = getTotalCholesterol(totalCholesterol, frsGender);
  const hdlScore = getHDLScore(HDLCholesterol);
  const sysScore = getSystolicBP(systolicBP, bloodPressure, frsGender);
  const smokeSocre = getSmokerScore(smoker, frsGender);
  const score = ageScore + totalChores + hdlScore + sysScore + smokeSocre;
  return score;
};

const CVGTotalPoints = _.range(-3, 22, 1);

const MaleCVDData = [
  '<1',
  1.1, 1.4, 1.6, 1.9, 2.3, 2.8, 3.3, 3.9, 4.7, 5.6, 6.7, 7.9, 9.4, 11.2, 13.3, 15.6, 18.4, 21.6, 25.3, 29.4,
  '>30', '>30', '>30', '>30'];

const FemaleCVDData = [
  '<1', '<1',
  1.0, 1.2, 1.5, 1.7, 2.0, 2.4, 2.8, 3.3, 3.9, 4.5, 5.3, 6.3, 7.3, 8.6, 10.0, 11.7, 13.7, 15.9, 18.51, 21.5, 24.8, 27.5,
  '>30'];

export const getCVGRisk = (totalScore = 0, gender = 'Male') => {
  let tempScore = totalScore;
  if (totalScore < -3) {
    tempScore = -3;
  }
  if (totalScore > 21) {
    tempScore = 21;
  }
  const item = _.findIndex(CVGTotalPoints, x => x === tempScore);
  if (item !== -1) {
    if (gender === 'Male') {
      return MaleCVDData[item];
    }
    return FemaleCVDData[item];
  }
  return '--';
};

export const getStep9HeartRate = (totalScore = 0, gender = 'Male') => {
  const x = totalScore;
  if (gender === 'Male') {
    if (x === 8) return 48;
    if (x < 8) {
      if (x < 0) return '<30';
      if (x === 0) return 30;
      if (x === 1) return 32;
      if (x === 2) return 34;
      if (x === 3) return 36;
      if (x === 4) return 38;
      if (x === 5) return 40;
      if (x === 6) return 42;
      if (x === 7) return 45;
    }
    if (x > 8) {
      if (x === 9) return 51;
      if (x === 10) return 54;
      if (x === 11) return 57;
      if (x === 12) return 60;
      if (x === 13) return 64;
      if (x === 14) return 68;
      if (x === 15) return 72;
      if (x === 16) return 76;
    }
    return '>80';
  }
  if (x === 8) return 51;
  if (x < 8) {
    if (x < 1) return '<30';
    if (x === 1) return 31;
    if (x === 2) return 34;
    if (x === 3) return 36;
    if (x === 4) return 39;
    if (x === 5) return 42;
    if (x === 6) return 45;
    if (x === 7) return 48;
  }
  if (x > 8) {
    if (x === 9) return 55;
    if (x === 10) return 59;
    if (x === 11) return 64;
    if (x === 12) return 68;
    if (x === 13) return 73;
    if (x === 14) return 79;
  }
  return '>80';
};

export const getStep9Risk = (cvgRisk = 0) => {
  if (cvgRisk >= 20) {
    return 'High';
  }
  if (cvgRisk >= 10 && cvgRisk < 20) {
    return 'Intermediate';
  }
  return 'Low';
};

export const getCountryDivision = (country = '') => {
  // const url = `${URL_SEARCH_MEDICATION}/drug_names?q=${search}`;
  const url = `https://sm.alpha.bioflux.io/api/geocode/division?country=${country}`;
  return axios.get(url).then((result) => {
    const arr = result?.data?.divisions;
    if (arr && arr.length > 0) {
      const names = _.map(arr, x => x.name);
      const fullCodes = _.map(arr, x => x.fullCode);
      return { names, fullCodes, arr };
    }
    return { names: [], fullCodes: [], arr: [] };
  });
};

export const checkingDivisionZipCode = (division = '', postalCode = '') => {
  const url = `https://sm.alpha.bioflux.io/api/geocode/check-postal?division=${division}&postalCode=${postalCode}`;
  return axios.get(url).then(result => result?.data || {});
};


export const calcStep9 = ({
  age, gender, smoker, totalCholesterol, HDLCholesterol, systolicBP, bloodPressure, frsAge, frsGender,
}) => {
  const step9TotalScore = getStep9TotalScore(frsAge, frsGender, smoker === 'Yes',
    totalCholesterol, HDLCholesterol, systolicBP, bloodPressure === 'Yes', frsAge, frsGender);
  const cvgRisk = getCVGRisk(step9TotalScore, frsGender);
  const heartRate = getStep9HeartRate(step9TotalScore, frsGender);
  const risk = getStep9Risk(cvgRisk);
  return {
    step9TotalScore, cvgRisk, heartRate, risk,
  };
};

export const formatDisplayAtRiskConditions = (atRiskArray = []) => {
  const atRiskConditions = [];
  const flagArr = [];
  const flagCondition = [];
  let othersConditions = '';
  // let tempType = '';
  _.forEach(atRiskArray, (x) => {
    // tempType = formatDisplayDiagnosedConditionsType(x.type);
    if (x.type === BASELINE_DIAGNOSED_CONDITIONS_OTHER || x.type === BASELINE_DIAGNOSED_CONDITIONS_OTHERS) {
      othersConditions = x.othersConditions || '';
      atRiskConditions.push(`Other: ${x.othersConditions}`);
    } else {
      atRiskConditions.push(x.type);
    }
    flagCondition.push(x);
    flagArr.push(x.flag);
  });

  return {
    atRiskConditions, othersConditions, flagArr, flagCondition,
  };
};


const formatHeartVal = (heartValve = {}) => {
  if (_.isEmpty(heartValve)) {
    consoleLog('Has no heart valve data');
    return {};
  }

  const {
    status, valvularDisease, whichValve, mitralValveStatus,
  } = heartValve;
  return {
    heartValveIssue: status,
    valvularHeartDisease: valvularDisease,
    heartValveReplacement: [
      {
        value: 'Left',
        isCheck: whichValve?.includes('Left'),
      },
      {
        value: 'Right',
        isCheck: whichValve?.includes('Right'),
      },
    ],
    mitralValveStatus,
    whichValve,
  };
};

const formatHeartValveReplacement = (heartValveReplacement = {}) => {
  if (_.isEmpty(heartValveReplacement)) {
    consoleLog('Has no heart valve data');
    return {};
  }

  const {
    whichValve, mitralValveStatus,
  } = heartValveReplacement;
  return {
    heartValveReplacement: [
      {
        value: 'Left',
        isCheck: whichValve?.includes('Left'),
      },
      {
        value: 'Right',
        isCheck: whichValve?.includes('Right'),
      },
    ],
    mitralValveStatus,
    whichValve,
  };
};

export const formatDisplayDiagnosedConditions = (data = []) => {
  if (data?.length === 0) {
    return [];
  }
  const diagnosedConditions = [];
  // let tempType = '';
  // type, pattern, onsetDate, confirmedVia, othersConditions,
  _.forEach(data, (x) => {
    // tempType = formatDisplayDiagnosedConditionsType(x.type);

    // if (x.type === 'Heart valve disease') {
    //   diagnosedConditions.push({
    //     type: x.type,
    //     onsetDate: x?.onsetDate,
    //     pattern: x.pattern, // formatDisplayDiagnosedConditionsPattern(x.pattern),
    //     othersConditions: x?.othersConditions || undefined,
    //     confirmedVia: x?.confirmedVia || undefined,
    //     flag: x?.flag,
    //     heartValve: formatHeartVal(x?.heartValve),
    //   });
    //   return;
    // }
    if (x.type === 'Valvular heart disease') {
      diagnosedConditions.push({
        type: x.type,
        onsetDate: x?.onsetDate,
        pattern: x.pattern, // formatDisplayDiagnosedConditionsPattern(x.pattern),
        othersConditions: x?.othersConditions || undefined,
        confirmedVia: x?.confirmedVia || undefined,
        flag: x?.flag,
        valvularDisease: x?.valvularDisease || undefined,
      });
      return;
    }
    if (x.type === 'Heart valve replacement') {
      diagnosedConditions.push({
        type: x.type,
        onsetDate: x?.onsetDate,
        pattern: x.pattern, // formatDisplayDiagnosedConditionsPattern(x.pattern),
        othersConditions: x?.othersConditions || undefined,
        confirmedVia: x?.confirmedVia || undefined,
        flag: x?.flag,
        heartValveReplacement: formatHeartValveReplacement(x?.heartValveReplacement),
      });
      return;
    }
    if (x.type === 'Atrial Fibrillation') {
      diagnosedConditions.push({
        type: x.type,
        onsetDate: x?.onsetDate,
        pattern: x.pattern, // formatDisplayDiagnosedConditionsPattern(x.pattern),
        othersConditions: x?.othersConditions || undefined,
        confirmedVia: x?.confirmedVia || undefined,
        flag: x?.flag,
        bioflux: x?.bioflux,
        studyId: x?.bioflux?.studyId,
      });
      return;
    }
    if (x.type === 'Others') {
      diagnosedConditions.push({
        type: 'Other',
        onsetDate: x?.onsetDate,
        pattern: x.pattern, // formatDisplayDiagnosedConditionsPattern(x.pattern),
        othersConditions: x?.othersConditions || undefined,
        confirmedVia: x?.confirmedVia || undefined,
        flag: x?.flag,
      });
      return;
    }
    diagnosedConditions.push({
      type: x.type,
      onsetDate: x?.onsetDate,
      pattern: x.pattern, // formatDisplayDiagnosedConditionsPattern(x.pattern),
      othersConditions: x?.othersConditions || undefined,
      confirmedVia: x?.confirmedVia || undefined,
      flag: x?.flag,
    });
  });

  return diagnosedConditions;
};


export const formatDisplayDiagnosedConditionsAdd = (afibHistory = {}, baselineInfo = {}) => {
  if (_.isEmpty(afibHistory) && _.isEmpty(baselineInfo?.diagnosedConditions)) {
    return [{
      type: null,
    }];
  }
  const {
    medicalHistory,
  } = afibHistory || {};
  const diagnosedConditions = !_.isEmpty(baselineInfo?.diagnosedConditions) ? _.map(baselineInfo?.diagnosedConditions, (x) => {
    if (x.type === 'Others') {
      return { ...x, type: 'Other' };
    }
    return { ...x };
  }) : [];
  if (_.isEmpty(medicalHistory)) {
    return _.isEmpty(diagnosedConditions) ? [{ type: null }] : diagnosedConditions;
  }

  // let tempType = '';
  // type, pattern, onsetDate, confirmedVia, othersConditions,
  _.forEach(medicalHistory, (x) => {
    // tempType = formatDisplayDiagnosedConditionsType(x.type);
    if (x.type?.includes('Other: ')) {
      const other = x?.type?.slice(7);
      diagnosedConditions.push({
        type: 'Other',
        othersConditions: other,
        onsetDate: x?.date || undefined,
      });
    } else if (x.type === 'Others') {
      diagnosedConditions.push({
        type: 'Other',
        othersConditions: x?.other,
        onsetDate: x?.date || undefined,
      });
    } else {
      const isHasArl = _.find(diagnosedConditions, item => item?.type === x?.type);
      if (isHasArl) {
        diagnosedConditions.push({
          type: 'Other',
          othersConditions: x?.type,
          onsetDate: x?.date || undefined,
        });
      } else {
        diagnosedConditions.push({
          type: x?.type,
          othersConditions: x?.other,
          onsetDate: x?.date || undefined,
        });
      }
    }
  });

  return diagnosedConditions;
};
