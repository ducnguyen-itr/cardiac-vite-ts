import _, { find } from 'lodash';
import momentTz from 'moment-timezone';
import moment from 'moment';
import { length, mass } from 'units-converter';
import {
  mutateDate, mutateYesNo, parseImperialWeight, parseImperialHeight, parseMetriclHeightFt, parseMetriclHeightIn, parseMetriclWeight, converFtToIn,
} from '.';
import {
  AFIB_HISTORY_DATA, CountryData, COUNTRY_SHORT_DATA, GENERAL_INFOMATION_DATA, UNIT_OF_MEASUREMENT,
} from '../Constants/newPatientData';
import auth from '../Helpers/auth';
import { getFormatedPhone } from '../Helpers';
import {
  BIOTRES_STUDY_TYPES, BIOTRES_STUDY_TYPES_QUERY, DEVICE_TYPES, STUDY_TYPES, STUDY_TYPES_ENUMS,
} from '../Constants/carePlan';

import consoleLog from '../Helpers/consoleLog';
import { getCountryDivision } from './baselineInfo';
import { getCountryNameByCode } from './patientFormat';

const {
  MCT, CARDIAC_EVENT, HOLTER, EXTENDED_HOLTER, MCT_PEEK,
} = STUDY_TYPES_ENUMS;

const {
  OtherOptions, Myocardial, ChestPain, AFibStatusQuestion,
} = AFIB_HISTORY_DATA;

const { afibStatusdata } = AFibStatusQuestion;

export const getCountryString = (code) => {
  switch (code) {
    case 'AR':
      return 'Argentina';
    case 'CA':
      return 'Canada';
    case 'ES':
      return 'Spain';
    case 'TW':
      return 'Taiwan';
    case 'AE':
      return 'United Arab Emirates';
    case 'GB':
      return 'United Kingdom';
    case 'US':
      return 'United States';
    default:
      return null;
  }
};

const getSymptomHistory = (
  currentSymptoms = [], palpitationTriggers = [], palpitationOther = '',
  chestPainTimePerWeek = undefined, isFreChestPain = undefined,
) => {
  const symptomHistory = {};
  const palpitations = [];

  _.forEach(currentSymptoms, (x) => {
    switch (x.value) {
      case ChestPain:
        _.assign(symptomHistory, {
          increasingFrequencyOfChestPain: x.isCheck && isFreChestPain ? mutateYesNo(isFreChestPain) : undefined,
          chestPainTimePerWeek: chestPainTimePerWeek ? parseInt(chestPainTimePerWeek, 10) : undefined,
        });
        break;
      case 'Palpitations':
        if (x.isCheck) {
          _.forEach(palpitationTriggers, (x) => {
            if (x?.isCheck) {
              if (x?.value === OtherOptions) {
                palpitations.push(palpitationOther);
              } else {
                palpitations.push(x?.value);
              }
            }
          });
          _.assign(symptomHistory, { palpitations });
        }
        break;
      default:
        _.assign(symptomHistory, { [x.var]: x.isCheck });
        break;
    }
  });

  return symptomHistory;
};

const getMedicalHistory = (pastMedicalHistory = [], other = '', myocarDate = undefined) => {
  const medicalHistory = {};
  _.forEach(pastMedicalHistory, (x) => {
    switch (x.value) {
      case OtherOptions:
        _.assign(medicalHistory, { others: other });
        break;
      case Myocardial:
        _.assign(medicalHistory, { [x.var]: mutateDate(myocarDate) });
        break;
      default:
        _.assign(medicalHistory, { [x.var]: x.isCheck });
        break;
    }
  });

  return medicalHistory;
};

const formatMedications = (arr = []) => {
  if (arr.length === 0) {
    return [];
  }
  const tempArr = [];
  _.forEach(arr, (x) => {
    tempArr.push(x?.label || x?.value);
  });
  return tempArr;
};

export const formatAfibHistory = (historyInfo = {}) => {
  if (_.isEmpty(historyInfo)) {
    consoleLog('Has no Atrial Fibrillation history info');
    return {};
  }

  const {
    diagnosedWithAfib,
    afibDuration, afibStatus, cardioversion, electricalShock,
    currentSymptoms, pastMedicalHistory, palpitationTriggers, palpitationOther, pastMedicalOther, myocardialInfarction,
    usedMedications, usingMedications,
    hospitalized, hospitalizedDate, ecgImages,
    chestPainTimePerWeek, increasingFrequencyOfChestPain,
    studyId,
  } = historyInfo;
  const symptomHistory = getSymptomHistory(currentSymptoms, palpitationTriggers, palpitationOther, chestPainTimePerWeek, increasingFrequencyOfChestPain);
  const medicalHistory = getMedicalHistory(pastMedicalHistory, pastMedicalOther, myocardialInfarction);
  return {
    diagnosedDuration: diagnosedWithAfib?.title === 'Yes' ? afibDuration?.title : undefined,
    diagnosedResult: diagnosedWithAfib?.title === 'Yes' ? afibStatus?.title : undefined,
    studyId: afibStatus?.title === afibStatusdata[2].title ? studyId : undefined,
    hadCardioversion: mutateYesNo(cardioversion),
    electricalShock: mutateYesNo(electricalShock),
    symptomHistory,
    usedMedications: formatMedications(usedMedications),
    usingMedications: formatMedications(usingMedications),
    isHospitalized: mutateYesNo(hospitalized),
    hospitalizedDate: mutateDate(hospitalizedDate),
    medicalHistory,
    ecgImages,
  };
};

export const formatSf36Result = (qualityInfo = {}) => {
  if (_.isEmpty(qualityInfo)) {
    return {};
  }
  const {
    physicalFunc, limitPhysical, limitEmotional, energyFatigue,
    emotional, socialFunc, pain, generalHealth,
  } = qualityInfo;

  return {
    physicalFunc: parseFloat(physicalFunc),
    limitPhysical: parseFloat(limitPhysical),
    limitEmotional: parseFloat(limitEmotional),
    energyFatigue: parseFloat(energyFatigue),
    emotionalWell: parseFloat(emotional),
    socialFunc: parseFloat(socialFunc),
    pain: parseFloat(pain),
    generalHealth: parseFloat(generalHealth),
  };
};

export const formatMutationCountry = (country = '') => {
  const index = _.findIndex(CountryData, x => x === country);
  if (index !== -1) {
    return COUNTRY_SHORT_DATA[index];
  }
  return country;
};

export const formatPatientBasicInfo = (basicInfo = {}) => {
  const {
    firstName, lastName, dob, gender, height, weight,
    insuranceName,
    ft, ins, currentUnit,

    email, phoneNumber, country, address, city, stateAddress, zip,
    stateCode, // facility,
  } = basicInfo || {};

  const facilityId = _.find(auth.getFacilities() || [], x => x.name === basicInfo?.facility)?._id;
  const isMetric = currentUnit === 'Metric';
  const countryCT = formatMutationCountry(country);

  let tempHeight = parseFloat(height);

  const tempFt = ft ? parseMetriclHeightFt(ft) : 0;
  const tempIns = ins ? parseMetriclHeightIn(ins) : 0;
  tempHeight = parseFloat(tempFt + tempIns);

  const generalInfo = {
    firstName,
    lastName,
    height: tempHeight,
    weight: parseFloat(parseMetriclWeight(weight)),
    gender: gender?.title,
    dateOfBirth: mutateDate(dob),
    email,
  };
  const settings = { isMetric };
  const patientInfo = { insuranceName: insuranceName?.title };
  const contact = {
    phone1: getFormatedPhone(phoneNumber),
    address,
    city,
    state: stateCode?.slice(-2) || stateAddress,
    zip,
    country: countryCT,
  };

  return {
    ...generalInfo, contact, settings, facilityId, patientInfo,
  };
};


const { GenderData, InsuranceData } = GENERAL_INFOMATION_DATA;

const formatStateOptions = (options) => {
  if (_.isEmpty(options) || !options) return [];
  return options.map(x => ({ label: x?.name, value: x.code }));
};

export const formatPatientInfoNewStudy = async (carePlan = {}) => {
  if (_.isEmpty(carePlan)) {
    return undefined;
  }
  const {
    _id, patient, facility, nurse, patientDemographic,
  } = carePlan;
  const {
    isMetric,
  } = patient?.settings || {};
  const {
    insuranceName,
  } = patient?.patientInfo || {};
  const technician = nurse._id || '';
  const {
    contact,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    height,
    weight,
    gender,
    email,
  } = patientDemographic || {};
  const {
    phone1,
    country,
    address,
    city,
    state,
    zip,
  } = contact || {};

  const states = await getCountryDivision(country);
  const stateOptions = formatStateOptions(states?.arr);
  const stateAddress = { value: state, label: find(stateOptions, x => x.value === state)?.label };
  const newWeight = parseImperialWeight(weight);

  const imperialHeight = parseImperialHeight(height);
  const newFt = parseInt(imperialHeight, 10);
  const newIns = converFtToIn(imperialHeight - newFt).toFixed(1);

  return {
    ...carePlan,
    carePlanId: _id,
    technician,
    firstName,
    middleName,
    lastName,
    gender: _.find(GenderData, x => x.title === gender),
    dob: dateOfBirth ? moment(dateOfBirth).format('MM/DD/YYYY') : '',
    height,
    weight: newWeight?.toFixed(0),
    insuranceName: _.find(InsuranceData, x => x.title === insuranceName),
    email,
    phone1: phone1?.replaceAll('-', ''),
    country,
    countryString: country ? getCountryNameByCode(country) : '',
    address,
    city,
    stateAddress,
    zip,
    currentUnit: UNIT_OF_MEASUREMENT[1],
    ft: newFt,
    ins: newIns ? Math.round(newIns) : 0,
    stateCode: state,
    facility: facility?._id || '',
    stateOptions,
  };
};

const formatMutationStudyTypeReveser = (studyType = '') => {
  switch (studyType) {
    case MCT:
      return STUDY_TYPES[0];
    case MCT_PEEK:
      return STUDY_TYPES[1];
    case CARDIAC_EVENT:
      return STUDY_TYPES[2];
    case HOLTER:
      return STUDY_TYPES[3];
    case EXTENDED_HOLTER:
      return STUDY_TYPES[4];
    default:
      return '';
  }
};

export const formatStudyInfoNewStudy = (carePlan = {}, facilitySetting = {}, studyData = {}, physicians = []) => {
  if (_.isEmpty(carePlan)) {
    return undefined;
  }
  const {
    firstName, lastName, // dob, gender, email,
  } = auth.getLoginData() || {};
  const { studySetting } = facilitySetting || {};
  const clinicianInitials = `${firstName.slice(0, 1)}${lastName.slice(0, 1)}`;
  const {
    studyType, studyDuration, followType, followDuration, deviceType,
  } = studyData;
  let tempStudyType = studyType;
  if (studyType && deviceType === DEVICE_TYPES.BIOTRES && !BIOTRES_STUDY_TYPES_QUERY.includes(studyType)) {
    tempStudyType = null;
  }

  const isFollowOn = tempStudyType && studyData?.followType && studyData?.followDuration && studyType === STUDY_TYPES_ENUMS.HOLTER;
  const {
    physician, facility,
  } = carePlan || {};

  const interprettingPhysician = !_.isEmpty(physicians) ? auth.isMD() ? _.find(physicians, x => x._id === auth.userId())
    : _.find(physicians, x => x._id === physician?._id) : {};

  return {
    studyType: isFollowOn ? STUDY_TYPES[5] : tempStudyType ? formatMutationStudyTypeReveser(tempStudyType) : null,
    studyDuration: studyDuration || null,
    followType: !isFollowOn ? null : followType ? formatMutationStudyTypeReveser(followType) : null,
    followDuration: !isFollowOn ? null : followDuration || null,
    interprettingPhysician,
    clinicianInitials: clinicianInitials || '',
    canUseBiofluxDirect: facility.canUseBiofluxDirect,
    studySetting,
    deviceType,

  };
};
const getInsurance = (insuranceName) => {
  switch (insuranceName) {
    case 'Private':
      return 'Private';
    case 'Medicare':
      return 'Medicare';
    default:
      return 'Other';
  }
};

export const formatDiagnosisNewStudy = (carePlan = {}, studyData = {}) => {
  if (_.isEmpty(carePlan)) {
    return undefined;
  }
  const {
    patient, prescription, patientDemographic,
  } = carePlan || {};
  const {
    diagnosisCode, otherDiagnosisCode, secondDiagnosisCode, otherSecondDiagnosisCode, physiciansNote,
  } = studyData || {};

  const {
    insuranceName, insuranceType,
  } = patientDemographic?.patientInfo || {};
  const { medications } = prescription || {};
  const medicationNames = _.isEmpty(medications) ? [] : _.map(medications, x => x.name);

  const patientMedications = _.isEmpty(medicationNames) ? '' : medicationNames.join('\n');
  const insuranceNameFm = insuranceType === 'Cash/Credit card paying' ? 'Other' : insuranceName ? getInsurance(insuranceName) : 'Other';
  return {
    insuranceName: insuranceNameFm,
    diagnosisCode: diagnosisCode || null,
    otherDiagnosisCode: otherDiagnosisCode || '',
    secondDiagnosisCode: secondDiagnosisCode || null,
    secondOtherDiagnosisCode: otherSecondDiagnosisCode || '',
    patientMedications,
    physiciansNote: physiciansNote === '--' ? '' : physiciansNote || '',

  };
};
