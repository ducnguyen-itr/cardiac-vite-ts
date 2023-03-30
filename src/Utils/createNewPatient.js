import _ from 'lodash';
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
import consoleLog from '../Helpers/consoleLog';
import { CURRENT_SYMPTOMS_NAME } from '../Constants/newTemplate';

const {
  OtherOptions, Myocardial, ChestPain, AFibStatusQuestion,
} = AFIB_HISTORY_DATA;

const { afibStatusdata } = AFibStatusQuestion;

// const getSymptomHistory = (
//   currentSymptoms = [], palpitationTriggers = [], palpitationOther = '',
//   chestPainTimePerWeek = undefined, isFreChestPain = undefined,
// ) => {
//   const symptomHistory = {};
//   const palpitations = [];

//   _.forEach(currentSymptoms, (x) => {
//     switch (x.value) {
//       case ChestPain:
//         _.assign(symptomHistory, {
//           increasingFrequencyOfChestPain: x.isCheck && isFreChestPain ? mutateYesNo(isFreChestPain) : undefined,
//           chestPainTimePerWeek: chestPainTimePerWeek ? parseInt(chestPainTimePerWeek, 10) : undefined,
//         });
//         break;
//       case 'Palpitations':
//         if (x.isCheck) {
//           _.forEach(palpitationTriggers, (x) => {
//             if (x?.isCheck) {
//               if (x?.value === OtherOptions) {
//                 palpitations.push(palpitationOther);
//               } else {
//                 palpitations.push(x?.value);
//               }
//             }
//           });
//           _.assign(symptomHistory, { palpitations });
//         }
//         break;
//       default:
//         _.assign(symptomHistory, { [x.var]: x.isCheck });
//         break;
//     }
//   });

//   return symptomHistory;
// };

const getSymptomHistory = (
  currentSymptoms = [], palpitationTriggers = [], palpitationOther = '',
  chestPainTimePerWeek = undefined, isFreChestPain = undefined,
) => {
  const symptomHistory = {};
  const palpitations = [];

  _.forEach(currentSymptoms, (x) => {
    switch (x) {
      case CURRENT_SYMPTOMS_NAME.lightHeadedness:
        _.assign(symptomHistory, {
          lightHeadedness: true,
        });
        break;
      case CURRENT_SYMPTOMS_NAME.fatigue:
        _.assign(symptomHistory, {
          fatigue: true,
        });
        break;
      case CURRENT_SYMPTOMS_NAME.decreasingExerciseCapacity:
        _.assign(symptomHistory, {
          decreasingExerciseCapacity: true,
        });
        break;
      case CURRENT_SYMPTOMS_NAME.dyspnea:
        _.assign(symptomHistory, {
          dyspnea: true,
        });
        break;
      case CURRENT_SYMPTOMS_NAME.syncope:
        _.assign(symptomHistory, {
          syncope: true,
        });
        break;
      case CURRENT_SYMPTOMS_NAME.chestPain:
        _.assign(symptomHistory, {
          increasingFrequencyOfChestPain: isFreChestPain ? mutateYesNo(isFreChestPain) : undefined,
          chestPainTimePerWeek: chestPainTimePerWeek ? parseInt(chestPainTimePerWeek, 10) : undefined,
        });
        break;
      case CURRENT_SYMPTOMS_NAME.numberInArmOrLeg:
        _.assign(symptomHistory, {
          numberInArmOrLeg: true,
        });
        break;
      case CURRENT_SYMPTOMS_NAME.painfulUrination:
        _.assign(symptomHistory, {
          painfulUrination: true,
        });
        break;
      // case CURRENT_SYMPTOMS_NAME.palpitations:
      //   if (palpitationTriggers?.length > 0) {
      //     _.forEach(palpitationTriggers, (pal) => {
      //       if (pal) {
      //         if (pal === OtherOptions) {
      //           palpitations.push(palpitationOther);
      //         } else {
      //           palpitations.push(pal);
      //         }
      //       }
      //     });
      //     _.assign(symptomHistory, { palpitations });
      //   } else {
      //     _.assign(symptomHistory, { palpitations: null });
      //   }
      //   break;
      default:
        break;
    }
  });
  if (currentSymptoms?.includes(CURRENT_SYMPTOMS_NAME.palpitations)) {
    if (palpitationTriggers?.length > 0) {
      _.forEach(palpitationTriggers, (pal) => {
        if (pal) {
          if (pal === OtherOptions) {
            palpitations.push(palpitationOther);
          } else {
            palpitations.push(pal);
          }
        }
      });
      _.assign(symptomHistory, { palpitations });
    } else {
      _.assign(symptomHistory, { palpitations: [] });
    }
  } else {
    _.assign(symptomHistory, { palpitations: null });
  }
  return symptomHistory;
};

const getMedicalHistory = (pastMedicalHistory = [], other = '', myocarDate = undefined) => {
  const medicalHistory = [];
  _.forEach(pastMedicalHistory, (x) => {
    if (x?.includes('Other: ')) {
      const otherStr = x.slice(7);
      medicalHistory.push({ type: 'Others', other: otherStr, date: undefined });
    } else if (x === Myocardial) {
      medicalHistory.push({ type: x, other: undefined, date: mutateDate(myocarDate) });
    } else {
      medicalHistory.push({ type: x, other: undefined, date: undefined });
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

const formatUsingMedication = (arr = []) => {
  if (_.isEmpty(arr)) return [];
  const tempArr = [];
  _.forEach(arr, (x) => {
    tempArr.push({
      name: x.name,
      quantity: x.quantity,
      frequency: x.frequency,
      time: x.time,
      unit: x.unit,
      notes: x.notes,
      prescribeAt: x.prescribeAt,
    });
  });
  return tempArr;
};


export const formatAfibHistory = (historyInfo = {}) => {
  if (_.isEmpty(historyInfo)) {
    consoleLog('Has no Atrial Fibrillation history info');
    return {};
  }

  const {
    cardioversion, electricalShock,
    currentSymptoms, pastMedicalHistory, palpitationTriggers, palpitationOther,
    pastMedicalOther, myocardialInfarction, usingMedications,
    hospitalized, hospitalizedDate,
    chestPainTimePerWeek, increasingFrequencyOfChestPain,

  } = historyInfo;

  const symptomHistory = getSymptomHistory(currentSymptoms, palpitationTriggers, palpitationOther, chestPainTimePerWeek, increasingFrequencyOfChestPain);
  const medicalHistory = getMedicalHistory(pastMedicalHistory, pastMedicalOther, myocardialInfarction);
  return {
    hadCardioversion: mutateYesNo(cardioversion),
    electricalShock: mutateYesNo(electricalShock),
    symptomHistory,
    usingMedications: formatUsingMedication(usingMedications),
    isHospitalized: mutateYesNo(hospitalized),
    hospitalizedDate: mutateDate(hospitalizedDate),
    medicalHistory,
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
  if (!isMetric) {
    const tempFt = ft ? parseMetriclHeightFt(ft) : 0;
    const tempIns = ins ? parseMetriclHeightIn(ins) : 0;
    tempHeight = parseFloat(tempFt + tempIns);
  }

  const generalInfo = {
    firstName,
    lastName,
    height: tempHeight,
    weight: isMetric ? parseFloat(weight) : parseFloat(parseMetriclWeight(weight)),
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


export const formatPatientMutation = (basicInfo = {}, historyInfo = {}) => {
  const formatedBasicInfo = formatPatientBasicInfo(basicInfo);

  const afibHistory = formatAfibHistory(historyInfo);

  return {
    ...formatedBasicInfo,
    afibHistory,
    utcOffset: moment().utcOffset(),
    timezone: momentTz.tz.guess(),
  };
};

export const formatBiofluxOptions = (facilities = []) => {
  if (facilities.length === 0) {
    return [];
  }
  const biofluxOptions = [];
  _.forEach(facilities, (x) => {
    biofluxOptions.push({
      _id: x._id,
      label: x.name,
      value: x.name,
      canUseBiofluxDirect: x.canUseBiofluxDirect,
    });
  });
  return biofluxOptions;
};


const { GenderData, InsuranceData } = GENERAL_INFOMATION_DATA;

export const formatCarePlanCopy = (carePlan = {}) => {
  if (_.isEmpty(carePlan)) {
    return undefined;
  }
  const { _id, patient, facility } = carePlan;
  const {
    isMetric,
  } = patient?.settings || {};
  const {
    insuranceName,
  } = patient?.patientInfo || {};
  const {
    contact,
    email,
    firstName,
    lastName,
    dateOfBirth,
    height,
    weight,
    gender,
  } = patient || {};
  const {
    phone1,
    country,
    address,
    city,
    state,
    zip,
    stateCode,
  } = contact || {};

  const newWeight = parseImperialWeight(weight);

  const imperialHeight = parseImperialHeight(height);
  const newFt = parseInt(imperialHeight, 10);
  const newIns = converFtToIn(imperialHeight - newFt).toFixed(1);

  return {
    _id,
    patientId: patient?._id,
    firstName,
    lastName,
    gender: _.find(GenderData, x => x.title === gender),
    dob: dateOfBirth ? moment(dateOfBirth).format('MM/DD/YYYY') : '',
    height,
    weight: newWeight?.toFixed(1),
    insuranceName: _.find(InsuranceData, x => x.title === insuranceName),
    email,
    phoneNumber: phone1?.replaceAll('-', ''),
    country,
    address,
    city,
    stateAddress: state,
    zip,
    currentUnit: UNIT_OF_MEASUREMENT[1],
    ft: newFt,
    ins: newIns,
    stateCode,
    facility: facility?.name || '',
    // facilityName: currentFacility?.name || '',
    // facilityId: currentFacility?._id || '',
  };
};


export const formatPatientMutationFake = (basicInfo = {}, historyInfo = {}, x) => {
  const { lastName, email } = basicInfo;
  _.assign(basicInfo, { lastName: `${lastName} ${x}` });
  const slptEm = email.split('@');

  _.assign(basicInfo, { email: `${slptEm[0] + x}@${slptEm[1]}` });
  const formatedBasicInfo = formatPatientBasicInfo(basicInfo);

  const afibHistory = formatAfibHistory(historyInfo);

  return {
    ...formatedBasicInfo,
    afibHistory,
    utcOffset: moment().utcOffset(),
    timezone: momentTz.tz.guess(),
  };
};
