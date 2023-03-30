import _ from 'lodash';
import moment from 'moment';
import {
  EHRA_SCORE, MEDICAL_TEST_RESULT_TYPE, MEDICAL_TEST_RESULT_VAR_ARR,
} from '../Constants';
import { CARE_PLAN_PROGRAM_TYPE, CARE_PLAN_SOURCE, TEST_TYPE_DATA } from '../Constants/carePlanData';
import { AFIB_HISTORY_DATA, UNIT_OF_MEASUREMENT } from '../Constants/newPatientData';
import {
  formatCountryDisplaying, formatDisplayPerTime, formatDisplayPerTimeSchedule,
  getAddressWithOutCountry,
} from '../Helpers';
import auth from '../Helpers/auth';
import consoleLog from '../Helpers/consoleLog';
import { formatCurrentSymptoms } from '../Pages/Patients/CreateNewTemplate/helper';
import { formatDisplayAtRiskConditions, formatDisplayDiagnosedConditions } from './baselineInfo';
import {
  formatMissingData, isEmptyObj, isNoAllData, mutateDate, parseImperialWeight, parseImperialHeight, converFtToIn, convertCelsiustoFahrenheit,
} from './index';
import { formartDisplayMedicalHistory } from './initialIntakeInfo';
import { formatPhoneNumberWithCode, getCountryNameByCode } from './patientFormat';
import { getFullNameId } from './patientsTable';
import { formatActivityHistory } from './timeTracking';

const { AFibDurationQuestion, AFibStatusQuestion } = AFIB_HISTORY_DATA;
const { afibDurationdata } = AFibDurationQuestion;
const { afibStatusdata } = AFibStatusQuestion;


export const isEmptyAfibHistoryObj = (obj = {}) => {
  const clonedObject = _.cloneDeep(obj);

  if (_.isEmpty(clonedObject)) {
    return true;
  }
  const { symptomHistory } = clonedObject;
  Object.keys(symptomHistory).forEach((key) => {
    if (!symptomHistory[key] || _.isEmpty(symptomHistory[key])) {
      delete symptomHistory[key];
    }
  });

  Object.keys(clonedObject).forEach((key) => {
    if (!clonedObject[key] || _.isEmpty(clonedObject[key])) {
      delete clonedObject[key];
    }
  });
  return _.isEmpty(clonedObject);
};

export const isEmptyConditionInfomation = (baselineInfo = {}) => {
  const { atRiskConditions, diagnosedConditions } = baselineInfo;
  if (_.isEmpty(atRiskConditions) || _.isEmpty(diagnosedConditions)) {
    return true;
  }
  for (let i = 0; i < atRiskConditions.length; i += 1) {
    const element = atRiskConditions[i];
    if (element.flag) {
      return false;
    }
  }

  for (let i = 0; i < diagnosedConditions.length; i += 1) {
    const element = diagnosedConditions[i];
    if (element.flag) {
      return false;
    }
  }
  return true;
};

export const formatPatientInfo = (carePlan = {}) => {
  if (_.isEmpty(carePlan)) {
    return {};
  }
  const {
    _id, friendlyId, patient, nurse, physician, reason, status,
    facility, signCMMConsent, source, createdAt, programType,
  } = carePlan || {};
  const {
    isMetric,
  } = patient?.settings || {};
  const {
    insuranceName, insuranceType, insuranceExpireDate, insuranceProvincialBilling,
  } = carePlan?.patientDemographic?.patientInfo || {};
  const {
    firstName, lastName, dateOfBirth, height, weight, gender, email, contactMethod,
    // isCognitoCompleted,
  } = carePlan?.patientDemographic || {};
  const {
    phone1, country, address, city, state, zip,
    // address, city, state, zip,
  } = carePlan?.patientDemographic?.contact || {};

  const newWeight = !_.isNil(weight) ? parseImperialWeight(weight) : undefined;
  const bmi = (weight && height) ? weight / ((height / 100) ** 2) : 0;
  const isUnLinked = _.isEmpty(carePlan?.patient);
  const { startDate, stopDate, inactiveTime } = formatActivityHistory(carePlan?.activityHistory);

  const patientData = {
    _id,
    patientId: patient?._id,
    firstName,
    lastName,
    carePlanId: friendlyId || '',
    gender,
    demoGender: gender,
    age: dateOfBirth ? moment().diff(dateOfBirth, 'years') : 0,
    patientAge: moment().diff(dateOfBirth, 'years'),
    dateOfBirth: dateOfBirth ? moment(dateOfBirth).format('MM/DD/YYYY') : undefined,
    height,
    contactMethod,
    weight: newWeight,
    isMetric,
    bmi: bmi ? bmi?.toFixed(1) : null,
    insuranceName,
    insuranceExpireDate,
    insuranceProvincialBilling,
    insuranceType,
    email: email || '--',
    phone: phone1,
    address: getAddressWithOutCountry(carePlan?.patientDemographic?.contact),
    country: formatCountryDisplaying(country),
    countryText: getCountryNameByCode(country),
    mobilePhone: formatPhoneNumberWithCode(carePlan?.patientDemographic?.contact?.phone1, country),
    homePhoneText: formatPhoneNumberWithCode(carePlan?.patientDemographic?.contact?.homePhone, country),
    emergencyPhoneText: formatPhoneNumberWithCode(carePlan?.patientDemographic?.contact?.emergencyPhone, country),
    reason,
    phoneNumber: phone1 || patient?.contact?.phone1,
    fullName: `${firstName} ${lastName}`,
    status: status?.toLowerCase() || '',
    photo: patient?.photo || '',
    facilityName: facility?.name || '',
    facilityId: facility?._id || '',
    facility,
    isUnLinked,
    isEmptyOverview: isEmptyObj(carePlan.info),
    isEmptyMedication: _.isEmpty(carePlan?.prescription?.medications),
    startDate: startDate || carePlan?.startDate,
    stopDate: stopDate || carePlan?.stopDate,
    inactiveTime: inactiveTime || '',
    willDeletedAt: carePlan?.patient?.willDeletedAt,
    activityHistory: carePlan?.activityHistory,
    deletedDate: carePlan?.deletedDate,
    createdAt,
    contact: carePlan?.patientDemographic?.contact || {},
    isAthena: source === CARE_PLAN_SOURCE.ATHENA,
    isCCM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
    isRPM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.RPM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
    programType: carePlan?.programType,
  };

  if (auth.isMD()) {
    _.assign(patientData, {
      isDisabledStartCarePlan: _.isEmpty(carePlan?.prescription?.medications) || isEmptyObj(carePlan.info),
    });
  } else {
    _.assign(patientData, {
      isDisabledAssignMD: isEmptyObj(carePlan.baselineInfo) || isEmptyObj(carePlan.info)
        || isEmptyAfibHistoryObj(carePlan.afibHistory),
      isEmptyBaseline: isEmptyObj(carePlan.baselineInfo),
      isEmptyOverview: isEmptyObj(carePlan.info),
    });
  }

  if (nurse && !_.isEmpty(nurse)) {
    _.assign(patientData, {
      nurse: {
        _id: nurse?._id,
        firstName: nurse?.firstName,
        lastName: nurse?.lastName,
        title: nurse?.title,
        roles: ['Nurse'], // nurse?.roles,
        photo: nurse?.photo || '',
      },
    });
  }

  if (physician && !_.isEmpty(physician)) {
    _.assign(patientData, {
      physician: {
        _id: physician?._id,
        title: physician?.title,
        firstName: physician?.firstName,
        lastName: physician?.lastName,
        roles: ['Physician'], // physician?.roles,
        photo: physician?.photo || '',
      },
    });
  }

  return patientData;
};
export const formatPatientBasicInfo = (carePlan = {}, key = 0) => {
  if (_.isEmpty(carePlan)) {
    return {};
  }

  const {
    _id, startDate, patient, facility, invitation,
  } = carePlan;
  const {
    isMetric,
  } = patient?.settings || {};
  const {
    insuranceName,
    insuranceType,
    insuranceExpireDate,
    insuranceProvincialBilling,
  } = carePlan?.patientDemographic?.patientInfo || {};
  const {
    firstName, lastName, dateOfBirth, height, weight, gender, email, contactMethod,
  } = carePlan.patientDemographic || {};

  const {
    phone1, country, address, city, state, zip, emergencyPhone,
    homePhone,
  } = carePlan?.patientDemographic?.contact || {};

  const newWeight = !_.isNil(weight) ? parseImperialWeight(weight) : weight;
  const imperialHeight = parseImperialHeight(height);
  const newFt = height ? parseInt(imperialHeight, 10).toString() : 0;
  const newIns = height ? converFtToIn(imperialHeight - newFt).toFixed(1) : 0;
  const isUnLinked = _.isEmpty(carePlan?.patient);

  const basicInfo = {
    _id,
    patientId: patient?._id,
    firstName,
    lastName,
    gender,
    dob: dateOfBirth ? moment(dateOfBirth).format('MM/DD/YYYY') : '',
    height: height || height?.toFixed(1),
    weight: newWeight,
    insuranceName,
    insuranceType,
    insuranceExpireDate,
    insuranceProvincialBilling,
    email,
    phoneNumber: phone1?.replaceAll('-', ''),
    country,
    address,
    city,
    stateAddress: ['US', 'CA'].includes(country) ? `${country}-${state}` : state,
    zip,
    currentUnit: UNIT_OF_MEASUREMENT[1],
    ft: newFt,
    ins: newIns,
    facility: facility?.name || '',
    isUnLinked,
    contactMethod,
    emergencyPhone,
    homePhone,
  };
  return basicInfo;
};

export const formatUserData = (users = []) => {
  if (_.isEmpty(users)) {
    return [];
  }
  const userId = auth.userId();
  const userData = [];
  _.forEach(users, (x) => {
    userData.push({
      userId: x._id,
      roles: x?.roles?.[0],
      title: x?.title,
      firstName: x?.firstName,
      lastName: x?.lastName,
      email: x?.contact?.email,
      photo: x?.photo,
      facility: x?.currentFacility?._id || '',
      facilityName: x?.currentFacility?.name || '',
      fullName: getFullNameId(x, userId),
      available: x?.available,
      disabled: x?.availableAppointment,
    });
  });
  return _.orderBy(userData, x => x?.firstName?.toLocaleLowerCase());
};

export const formatPatientData = (carePlans = []) => {
  if (carePlans.length === 0) {
    return [];
  }
  const userData = [];
  _.forEach(carePlans, (x) => {
    if (!_.isEmpty(x.patient)) {
      const { patient, facility } = x || {};
      // const {
      //   address, city, state, zip,
      // } = facility?.contact || {};
      userData.push({
        userId: patient?._id,
        firstName: patient?.firstName,
        lastName: patient?.lastName,
        email: patient?.contact?.email,
        carePlanId: x?._id,
        photo: patient?.photo || '',
        physician: {
          _id: x?.physician?._id,
          firstName: x?.physician?.firstName,
          lastName: x?.physician?.lastName,
          photo: x?.physician?.photo || '',
        },
        nurse: {
          _id: x?.nurse?._id,
          firstName: x?.nurse?.firstName,
          lastName: x?.nurse?.lastName,
          photo: x?.nurse?.photo || '',
        },
        facilityName: x?.facility?.name || '',
        facilityAddress: getAddressWithOutCountry(facility?.contact),
        facilityId: facility?._id,
      });
    }
  });
  return _.orderBy(userData, x => x?.firstName?.toLocaleLowerCase());
};

export const formatParticipant = (users = []) => {
  if (users.length === 0) {
    return [];
  }
  const userData = [];
  _.forEach(users, (x) => {
    userData.push({
      value: x._id,
      label: `${x?.firstName} ${x?.lastName}`,
    });
  });
  return _.orderBy(userData, x => x?.firstName?.toLocaleLowerCase());
};

const formatDevices = (careplan) => {
  // will includes 3 section:
  // device
  // biohert device
  // report settings

};

const findObjInData = (title = '', data = [], key = '') => {
  const item = _.find(data, x => (key ? x[key] === title : x.title === title));
  if (item && !_.isEmpty(item)) {
    return item;
  }
  return undefined;
};

const formatPalpitationTriggers = (palpitations = []) => {
  const isHasOther = !!_.find(palpitations, x => !['Alcohol', 'Caffeine', 'Decreased sleep']?.includes(x));
  const palpitationArr = [];
  _.forEach(palpitations, (x) => {
    if (['Alcohol', 'Caffeine', 'Decreased sleep']?.includes(x)) {
      palpitationArr.push(x);
    }
  });
  if (isHasOther) {
    palpitationArr.push('Others');
  }
  return palpitationArr;
};

const formatInitialIntakeInfo = (afibHistory = {}, sf36Result = {},
  invitation = {}, biofluxStatus = '', allergies = '') => {
  if (_.isEmpty(afibHistory) && _.isEmpty(sf36Result)) {
    return { allergies };
  }

  const {
    diagnosedDuration, diagnosedResult, hadCardioversion, electricalShock,
    symptomHistory, usedMedications, usingMedications,
    isHospitalized, hospitalizedDate, medicalHistory, ecgImages,
    bioflux,
  } = afibHistory || {};

  const {
    palpitations, chestPainTimePerWeek, increasingFrequencyOfChestPain,
  } = symptomHistory || {};
  const { isLinked } = invitation || {};
  const {
    pastMedicalHistory, pastMedicalOther, myocardialInfarction, isMyocardialInfarction,
  } = formartDisplayMedicalHistory(medicalHistory);
  const currentSymptoms = formatCurrentSymptoms(symptomHistory);
  const palpitationOther = _.find(palpitations, x => !['Alcohol', 'Caffeine', 'Decreased sleep']?.includes(x));
  const palpitationTriggers = formatPalpitationTriggers(palpitations);
  const isOtherText = palpitationOther || pastMedicalOther;
  const isOtherRadidoCheck = hadCardioversion !== null
    || electricalShock !== null || increasingFrequencyOfChestPain !== null || isHospitalized !== null || isOtherText;

  const isMissingBiofluxUnLinked = !isLinked && diagnosedResult === 'Bioflux';
  const couldNotFindBioflux = biofluxStatus === 'BIOFLUX_FAILED' && isLinked && diagnosedResult === 'Bioflux';

  const historyInfo = {
    diagnosedWithAfib: { title: diagnosedDuration && diagnosedResult ? 'Yes' : 'No' },
    afibDuration: findObjInData(diagnosedDuration, afibDurationdata),
    afibStatus: findObjInData(diagnosedResult, afibStatusdata),
    bioflux,
    isMyocardialInfarction,
    cardioversion: { title: hadCardioversion ? 'Yes' : 'No' },
    electricalShock: { title: electricalShock ? 'Yes' : 'No' },
    currentSymptoms,
    palpitationTriggers,
    palpitationOther,
    pastMedicalHistory,
    pastMedicalOther,
    myocardialInfarction,
    usedMedications,
    usingMedications,
    hospitalized: { title: isHospitalized ? 'Yes' : 'No' },
    hospitalizedDate,
    isMissingHospitalizedDate: isHospitalized && !hospitalizedDate,
    isMissingPastMedicalDate: isMyocardialInfarction && !myocardialInfarction,
    ecgImages,
    chestPainTimePerWeek,
    increasingFrequencyOfChestPain: { title: increasingFrequencyOfChestPain ? 'Yes' : 'No' },
    isOtherRadidoCheck,
    isMissingBiofluxUnLinked,
    couldNotFindBioflux,
    afibHistory,
  };

  if (_.isEmpty(sf36Result)) {
    return { historyInfo, qualityInfo: {}, allergies };
  }

  const {
    _id, physicalFunc, limitPhysical, limitEmotional, energyFatigue, socialFunc, generalHealth,
    sf36Questions,
  } = sf36Result;

  const qualityInfo = {
    _id,
    physicalFunc,
    limitPhysical,
    limitEmotional,
    energyFatigue,
    socialFunc,
    generalHealth,
    sf36Questions,
  };
  return { historyInfo, qualityInfo, allergies };
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
  };
};

const isDefaultCheck = (medicalHistory = [], key1, key2, key3) => {
  if (_.isEmpty(medicalHistory)) return false;
  let flag = false;
  _.forEach(medicalHistory, (x) => {
    if (x.type === key1 || x.type === key2 || x.type === key3) { flag = true; }
  });
  return flag;
};

const formatDefaultScored = (age = '', gender = '', medicalHistory = {}) => ({
  cha2ds2VascScore: [
    {
      value: 'Congestive heart failure',
      isCheck: isDefaultCheck(medicalHistory, 'Congestive heart failure or LV dysfunction'), // 'Congestive heart failure or LV dysfunction',
      suffix: 1,
    },
    {
      value: 'Hypertension',
      isCheck: isDefaultCheck(medicalHistory, 'Hypertension/High Blood Pressure'), // 'Hypertension / High Blood Pressure',
      suffix: 1,
    },
    {
      value: 'Age ≥ 75',
      isCheck: age ? age >= 75 : false,
      suffix: 2,
    },
    {
      value: 'Age 65-74',
      isCheck: age ? age >= 65 && age <= 74 : false,
      suffix: 1,
    },
    {
      value: 'Diabetes mellitus',
      isCheck: isDefaultCheck(medicalHistory, 'Diabetes mellitus'), // Diabetes mellitus
      suffix: 1,
    },
    {
      value: 'Stroke/TIA/thrombo-embolism',
      isCheck: isDefaultCheck(medicalHistory, 'Deep vein thrombosis and pulmonary embolism', 'Stroke transient ischemic attack (mini-stroke)', 'Stroke'),
      // 'Deep vein thrombosis and pulmonary embolism','Stroke transient ischemic attack (mini-stroke)', 'Stroke',
      suffix: 2,
    },
    {
      value: 'Vascular disease',
      isCheck: isDefaultCheck(medicalHistory, 'Vascular disease'), // 'Vascular disease'
      suffix: 1,
    },
    {
      value: 'Sex Female',
      isCheck: gender && gender === 'Female',
      suffix: 1,
    },
  ],
  hasbledClinical: [
    {
      value: 'Hypertension',
      isCheck: isDefaultCheck(medicalHistory, 'Hypertension/High Blood Pressure'),
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
      isCheck: isDefaultCheck(medicalHistory, 'Stroke'),
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
      isCheck: age ? age > 65 : false,
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
  ],
});
const formatCha2ds = (cha2ds2vasc = {}) => {
  if (_.isEmpty(cha2ds2vasc)) {
    consoleLog('Has no cha2ds2vasc data');
    return {};
  }

  const {
    congestiveHeartFailure, hypertension: hypertensionCHA, age2, age1,
    diabetesMellitus, stroke, vascularDisease, sexFemale,
  } = cha2ds2vasc;
  return {
    cha2ds2VascScore: [
      {
        value: 'Congestive heart failure',
        isCheck: congestiveHeartFailure,
        suffix: 1,
      },
      {
        value: 'Hypertension',
        isCheck: hypertensionCHA,
        suffix: 1,
      },
      {
        value: 'Age ≥ 75',
        isCheck: age2,
        suffix: 2,
      },
      {
        value: 'Age 65-74',
        isCheck: age1,
        suffix: 1,
      },
      {
        value: 'Diabetes mellitus',
        isCheck: diabetesMellitus,
        suffix: 1,
      },
      {
        value: 'Stroke/TIA/thrombo-embolism',
        isCheck: stroke,
        suffix: 2,
      },
      {
        value: 'Vascular disease',
        isCheck: vascularDisease,
        suffix: 1,
      },
      {
        value: 'Sex Female',
        isCheck: sexFemale,
        suffix: 1,
      },
    ],
  };
};

const formatHadBled = (hasBled = {}) => {
  if (_.isEmpty(hasBled)) {
    consoleLog('hasBled empty');
    return {};
  }

  const {
    hypertension: hypertensionHB, abnormalLiverFunction, abnormalRenalFunction, stroke: strokeHB, bleeding, labileInrs, elderly65, drugs, alcohol,
  } = hasBled;

  return {
    hasbledClinical: [
      {
        value: 'Hypertension',
        isCheck: hypertensionHB,
        suffix: 1,
      },
      {
        value: 'Abnormal liver function',
        isCheck: abnormalLiverFunction,
        suffix: 1,
      },
      {
        value: 'Abnormal renal function',
        isCheck: abnormalRenalFunction,
        suffix: 1,
      },
      {
        value: 'Stroke',
        isCheck: strokeHB,
        suffix: 1,
      },
      {
        value: 'Bleeding',
        isCheck: bleeding,
        suffix: 1,
      },
      {
        value: 'Labile INRs',
        isCheck: labileInrs,
        suffix: 1,
      },
      {
        value: 'Elderly (Age >65)',
        isCheck: elderly65,
        suffix: 1,
      },
      {
        value: 'Drugs',
        isCheck: drugs,
        suffix: 1,
      },
      {
        value: 'Alcohol',
        isCheck: alcohol,
        suffix: 1,
      },
    ],
  };
};

const formatFRS = (frs = {}, age = undefined, gender = undefined) => {
  if (_.isEmpty(frs)) {
    consoleLog('Has no FRS data');
    return {};
  }

  const {
    smoker, totalCholesterol, hdlCholesterol, systolicBP, bloodTreatedMedicines,
  } = frs;
  return {
    isEnsurePatientAge: !!smoker || !!totalCholesterol || !!hdlCholesterol || !!systolicBP || !!bloodTreatedMedicines,
    frsGender: frs?.gender || gender,
    frsAge: frs?.age || age,
    smoker: smoker ? 'Yes' : 'No',
    totalCholesterol,
    HDLCholesterol: hdlCholesterol,
    systolicBP,
    bloodPressure: bloodTreatedMedicines ? 'Yes' : 'No',
  };
};


const checkIsHasBioflux = (diagnosedConditions = []) => {
  if (_.isEmpty(diagnosedConditions)) return { isBioflux: false, reportPath: '', bioflux: {} };
  let reportPath = '';
  let isBioflux = false;
  let bioflux = {};
  _.forEach(diagnosedConditions, (x) => {
    if (x?.type === 'Atrial Fibrillation' && x?.confirmedVia === 'Bioflux') {
      bioflux = x?.bioflux;
      isBioflux = true;
      reportPath = x?.bioflux?.reportPath;
    }
  });
  return { isBioflux, reportPath, bioflux };
};


const formatBaselineInformation = (baselineInfo = {}, age = undefined, gender = undefined, afibHistory = {}) => {
  if (_.isEmpty(baselineInfo)) {
    consoleLog('Has no baseline info');
    return {};
  }

  const {
    afibConfirmed, afibPattern, heartValve, echocardiogramDate, echocardiogramLVEF, // bioflux,
    pastMedical, cha2ds2vasc, hasBled, ehra, frs,
    stressMedicalTest, bloodMedicalTest, liverMedicalTest, leadEcgMedicalTest,
    diagnosedConditions, atRiskConditions, notesAtRiskConditions,
  } = baselineInfo;
  const { medicalHistory } = afibHistory || {};
  const tempDiagnosedConditions = formatDisplayDiagnosedConditions(diagnosedConditions);
  const tempatRiskConditions = formatDisplayAtRiskConditions(atRiskConditions);
  const conditionsInformation = { diagnosedConditions, atRiskConditions };

  const { isBioflux, reportPath, bioflux } = checkIsHasBioflux(baselineInfo?.diagnosedConditions);

  const baselineInformation = {
    afibConfirm: afibConfirmed,
    afibPattern,
    ...formatHeartVal(heartValve),
    // diagnosedConditions,
    // atRiskConditions,
    notesAtRiskConditions,
    diagnosedConditions: tempDiagnosedConditions,
    ...tempatRiskConditions,
    conditionsInformation,
    // step2
    frs,
    bloodMedicalTest,
    liverMedicalTest,
    leadEcgMedicalTest,

    completeBloodCountDate: bloodMedicalTest?.date,
    liverFunctionTestDate: liverMedicalTest?.date,
    leadECGDate: leadEcgMedicalTest?.date,

    completeBloodCountSummary: bloodMedicalTest?.summary,
    liverFunctionTestSummary: liverMedicalTest?.summary,
    leadECGSummary: leadEcgMedicalTest?.summary,

    completeBloodCountAttachment: bloodMedicalTest?.attachments,
    liverFunctionTestAttachment: liverMedicalTest?.attachments,
    leadECGAttachment: leadEcgMedicalTest?.attachments,
    // step3
    stressMedicalTest,
    exerciseStressTestingDate: stressMedicalTest?.date,
    exerciseStressTestingSummary: stressMedicalTest?.summary,
    exerciseStressTestingAttachment: stressMedicalTest?.attachments,
    echocardiogramDate,
    echocardiogramLVEF,
    isBioflux,
    reportPath,
    bioflux,
    // step 5
    // ...formatPastHis(pastMedical),
    // step 6
    ...formatCha2ds(cha2ds2vasc),
    // step 7
    ...formatHadBled(hasBled),
    // step 8
    ehraScore: EHRA_SCORE[_.findKey(EHRA_SCORE, x => x?.title.toLocaleLowerCase()?.includes(ehra?.toLocaleLowerCase()))],
    // step 9
    ...formatFRS(frs, age, gender),
  };
  return baselineInformation;
};

const formatDisplayBloodTestType = (type = undefined) => {
  switch (type) {
    case MEDICAL_TEST_RESULT_TYPE.CBC:
      return TEST_TYPE_DATA[0];
    case MEDICAL_TEST_RESULT_TYPE.INR:
      return TEST_TYPE_DATA[1];
    case MEDICAL_TEST_RESULT_TYPE.TSH:
      return TEST_TYPE_DATA[2];
    case MEDICAL_TEST_RESULT_TYPE.Creatinine:
      return TEST_TYPE_DATA[3];
    case MEDICAL_TEST_RESULT_TYPE.LIVER:
      return TEST_TYPE_DATA[4];
    case MEDICAL_TEST_RESULT_TYPE.BLOOD_SUGAR:
      return TEST_TYPE_DATA[5];
    case MEDICAL_TEST_RESULT_TYPE.HgbA1C:
      return TEST_TYPE_DATA[0];
    case MEDICAL_TEST_RESULT_TYPE.LIPID:
      return TEST_TYPE_DATA[6];
    default:
      return type;
  }
};

const formatCarePlanOverview = (info = {}) => {
  if (!info || _.isEmpty(info)) {
    return {};
  }

  const {
    equipmentProvided, frequencyOfBloodTest, nextBloodTest, typesOfBloodTests, frequencyOfStressTest, nextStressTest,
    frequencyOfFollowUp, nextDueOnFollowUp, notes,
    timeUnitOfBloodTest, timeUnitOfStressTest,
  } = info;

  if (isNoAllData([
    equipmentProvided, frequencyOfBloodTest, nextBloodTest, typesOfBloodTests, frequencyOfStressTest, nextStressTest,
    timeUnitOfBloodTest, timeUnitOfStressTest,
  ]) && frequencyOfFollowUp === null && _.isNil(notes)) {
    consoleLog('Have no care plan overview data');
    return {};
  }

  const isBiokit = equipmentProvided?.includes('Biokit');
  const cpOverview = {
    requiredEP: [
      {
        value: 'Biokit',
        isCheck: isBiokit,
      },
      {
        value: 'Blood pressure cuff',
        isCheck: isBiokit ? false : equipmentProvided?.includes('Blood pressure cuff'),
        disabled: isBiokit,
        tooltip: 'Biokit includes this device.',
      },
      {
        value: 'Pulse oximeter',
        isCheck: isBiokit ? false : equipmentProvided?.includes('Pulse oximeter'),
        disabled: isBiokit,
        tooltip: 'Biokit includes this device.',
      },
      {
        value: 'Weight scale',
        isCheck: equipmentProvided?.includes('Weight scale'),
      },
    ],
    bloodFrequency: frequencyOfBloodTest,
    bloodTheNextDate: nextBloodTest,
    testType: _.uniq(_.map(typesOfBloodTests, x => formatDisplayBloodTestType(x))),
    bloodFrequencyUnit: formatDisplayPerTime(timeUnitOfBloodTest),
    stressFrequency: frequencyOfStressTest,
    stressTheNextDate: nextStressTest,
    stressFrequencyUnit: formatDisplayPerTime(timeUnitOfStressTest),
    schedule: formatDisplayPerTimeSchedule(frequencyOfFollowUp),
    frequencyOfFollowUp,
    nextDueOnFollowUp,
    notes,
  };

  return cpOverview;
};


const formatMTRToQuery = (obj = {}) => ({
  _id: obj?._id,
  date: obj?.date,
  summary: obj?.summary,
  attachments: obj?.attachments,
  testTitle: obj?.title,
  inrRes: obj?.result,
  lvef: obj?.result,
  hgbA1C: obj?.result,
});

export const formatMTRToAddOrEdit = (medicalObj = {}, type) => {
  if (!medicalObj || _.isEmpty(medicalObj)) {
    consoleLog('medicalObj empty');
    return [];
  }
  const {
    _id, date, summary, attachments, testTitle, inrRes, hgbA1C, lvef,
  } = medicalObj;
  const obj = {
    _id: _id || undefined,
    date: date ? mutateDate(date) : undefined,
    summary,
    title: testTitle,
    attachments,
  };
  switch (type) {
    case MEDICAL_TEST_RESULT_VAR_ARR[5]:
      // inr
      _.assign(obj, { result: inrRes });
      break;
    case MEDICAL_TEST_RESULT_VAR_ARR[8]:
      // HgbA1C
      _.assign(obj, { result: hgbA1C });
      break;
    case MEDICAL_TEST_RESULT_VAR_ARR[9]:
      // LVEF
      _.assign(obj, { result: lvef });
      break;
    default:
      _.assign(obj, { result: '' });
      break;
  }

  return obj;
};

export const formatMedicalTestResults = (medicalTestResults = []) => {
  if (!medicalTestResults || medicalTestResults.length === 0) {
    consoleLog('medicalTestResults empty');
    return {};
  }
  const stressTest = [];
  const completeBloodCount = [];
  const liverFunction = [];
  const fastingBloodSugar = [];
  const lipidProfile = [];
  const inr = [];
  const tsh = [];
  const creatinine = [];
  const hgbA1C = [];
  const lvef = [];
  const otherTest = [];

  _.forEach(_.orderBy(medicalTestResults, ['date'], ['desc']), (x) => {
    const res = formatMTRToQuery(x);
    switch (x?.type) {
      case MEDICAL_TEST_RESULT_TYPE.STRESS:
        stressTest.push(res);
        break;
      case MEDICAL_TEST_RESULT_TYPE.CBC:
        completeBloodCount.push(res);
        break;
      case MEDICAL_TEST_RESULT_TYPE.LIVER:
        liverFunction.push(res);
        break;
      case MEDICAL_TEST_RESULT_TYPE.BLOOD_SUGAR:
        fastingBloodSugar.push(res);
        break;
      case MEDICAL_TEST_RESULT_TYPE.LIPID:
        lipidProfile.push(res);
        break;
      case MEDICAL_TEST_RESULT_TYPE.INR:
        inr.push(res);
        break;
      case MEDICAL_TEST_RESULT_TYPE.TSH:
        tsh.push(res);
        break;
      case MEDICAL_TEST_RESULT_TYPE.Creatinine:
        creatinine.push(res);
        break;
      case MEDICAL_TEST_RESULT_TYPE.HgbA1C:
        hgbA1C.push(res);
        break;
      case MEDICAL_TEST_RESULT_TYPE.LVEF:
        lvef.push(res);
        break;
      case MEDICAL_TEST_RESULT_TYPE.OTHER:
        otherTest.push(res);
        break;
      default:
        break;
    }
  });

  return {
    stressTest,
    completeBloodCount,
    liverFunction,
    fastingBloodSugar,
    lipidProfile,
    inr,
    tsh,
    creatinine,
    hgbA1C,
    lvef,
    otherTest,
  };
};


export const formatCarePlan = (carePlan = {}, key = 0) => {
  const clonedCarePlan = _.cloneDeep(carePlan);

  if (_.isEmpty(clonedCarePlan)) {
    return {};
  }

  const { bioheartMonitor } = clonedCarePlan;
  _.assign(bioheartMonitor, { isAuthorized: clonedCarePlan?.patient?.bioheartMonitor?.isAuthorized || false });
  const missingData = formatMissingData(clonedCarePlan);
  const reportSettingInit = _.cloneDeep(clonedCarePlan?.reportSetting);

  const patientData = formatPatientInfo(clonedCarePlan);
  const basicInfo = formatPatientBasicInfo(clonedCarePlan, key);
  const searchBioFluxInfo = {
    firstName: carePlan?.patientDemographic?.firstName,
    lastName: carePlan?.patientDemographic?.lastName,
    dob: carePlan?.patientDemographic?.dateOfBirth,
    phoneNumber: carePlan?.patientDemographic?.contact?.phone1,
    facilityId: carePlan?.facility?._id || {},
    facility: carePlan?.facility?.name || '',
  };

  // _.clone(clonedCarePlan?.baselineInfo?.atRiskConditions)
  const initialIntakeInfo = formatInitialIntakeInfo(clonedCarePlan?.afibHistory, clonedCarePlan?.sf36Result, clonedCarePlan?.invitation, clonedCarePlan?.biofluxStatus, clonedCarePlan?.allergies);
  const {
    firstName, lastName, dob, phoneNumber,
  } = basicInfo || {};
  _.assign(initialIntakeInfo.historyInfo, {
    firstName, lastName, dob, phoneNumber,
  });
  const patientDetailsData = {
    basicInfo,
    patientData,
    initialIntakeInfo,
    searchBioFluxInfo,
    bioheartMonitor,
    missingData,
  };

  _.assign(patientDetailsData, {
    timeTrackingInfo: {
      _id: clonedCarePlan?._id,
      status: clonedCarePlan?.status,
    },
  });

  // const devices = formatDevices(clonedCarePlan);
  const devices = {
    equipmentProvided: clonedCarePlan?.info?.equipmentProvided || [],
    reportSetting: clonedCarePlan?.reportSetting || {},
    bioheartMonitor: clonedCarePlan?.bioheartMonitor || {},
  };

  _.assign(patientDetailsData, { devices });

  const cpOverview = formatCarePlanOverview({ ...clonedCarePlan?.info });
  const cpDiseasesInfo = {
    currentDiseases: clonedCarePlan?.info?.currentDiseases,
    monitoredDiseases: clonedCarePlan?.info?.monitoredDiseases,
  };
  _.assign(patientDetailsData, {
    reportSetting: {
      ...clonedCarePlan?.reportSetting,
      minBodyTemperature: !_.isNil(clonedCarePlan?.reportSetting?.minBodyTemperature)
        ? convertCelsiustoFahrenheit(clonedCarePlan?.reportSetting?.minBodyTemperature).toFixed(1) : null,
      maxBodyTemperature: !_.isNil(clonedCarePlan?.reportSetting?.maxBodyTemperature)
        ? convertCelsiustoFahrenheit(clonedCarePlan?.reportSetting?.maxBodyTemperature).toFixed(1) : null,

      weightGainDay: clonedCarePlan?.reportSetting?.weightGain?.dayThreshold,
      weightGainWeek: clonedCarePlan?.reportSetting?.weightGain?.weekThreshold,
      weightLossDay: clonedCarePlan?.reportSetting?.weightLoss?.dayThreshold,
      weightLossWeek: clonedCarePlan?.reportSetting?.weightLoss?.weekThreshold,
    },
    cpDiseasesInfo,
    cpOverview,
    startDate: clonedCarePlan.startDate,
    stopDate: clonedCarePlan.stopDate,
    reportSettingInit,
  });

  _.assign(patientDetailsData, { isDeleted: carePlan?.patient?.willDeletedAt });
  return _.cloneDeep(patientDetailsData);
};


export const defaultReportSetting = () => ({
  isReportAccessNurse: true,
  minHeartRate: 60,
  maxHeartRate: 120,
  minBloodPressureDenominator: 100,
  minBloodPressureNumerator: 60,
  maxBloodPressureNumerator: 120,
  maxBloodPressureDenominator: 80,
  minInr: 2,
  maxInr: 3,
  minEhraScore: 4,
  maxEhraScore: 5,
  medicationComplianceNurse: 2,
  medicationCompliancePhysician: 3,
  shortnessOfBreath: 2,
  chestPain: 1,
  abnormalBleed: 1,
  lightHeadedness: 2,
  palpitations: 2,
  notes: '',

  sleepLevel: 4,
  consecutiveSleepDisturbance: 5,
  consecutiveEhra: 2,
});
