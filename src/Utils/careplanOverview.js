import _ from 'lodash';
import moment from 'moment';
import { MEDICAL_TEST_RESULT_TYPE } from '../Constants';
import { TEST_TYPE_DATA } from '../Constants/carePlanData';
import { formatMutationPerTime, formatMutationPerTimeSchedule } from '../Helpers';

export const formatBloodTestType = (type = undefined) => {
  switch (type) {
    case TEST_TYPE_DATA[0]:
      return MEDICAL_TEST_RESULT_TYPE.CBC;
    case TEST_TYPE_DATA[1]:
      return MEDICAL_TEST_RESULT_TYPE.INR;
    case TEST_TYPE_DATA[2]:
      return MEDICAL_TEST_RESULT_TYPE.TSH;
    case TEST_TYPE_DATA[3]:
      return MEDICAL_TEST_RESULT_TYPE.Creatinine;
    case TEST_TYPE_DATA[4]:
      return MEDICAL_TEST_RESULT_TYPE.LIVER;
    case TEST_TYPE_DATA[5]:
      return MEDICAL_TEST_RESULT_TYPE.BLOOD_SUGAR;
    // case TEST_TYPE_DATA[6]:
    //   return MEDICAL_TEST_RESULT_TYPE.HgbA1C;
    case TEST_TYPE_DATA[6]:
      return MEDICAL_TEST_RESULT_TYPE.LIPID;
    default:
      return type;
  }
};

export const formatOverviewInfo = (info = {}, isCheckBloodwork = false, isCheckStressTest = false) => {
  if (_.isEmpty(info)) {
    return {};
  }
  const {
    bloodFrequency, bloodTheNextDate, testType, bloodFrequencyUnit,
    stressFrequency, stressTheNextDate, stressFrequencyUnit,
    schedule, nextDueOnFollowUp,
    notes,
  } = info;
  const frequencyOfFollowUp = formatMutationPerTimeSchedule(schedule);
  const objectInfo = {
    frequencyOfFollowUp,
    nextDueOnFollowUp: frequencyOfFollowUp > 0 && nextDueOnFollowUp ? moment(nextDueOnFollowUp).format('YYYY-MM-DD') : undefined,
    notes,
  };
  if (isCheckBloodwork) {
    _.assign(objectInfo, {
      frequencyOfBloodTest: parseInt(bloodFrequency, 10),
      timeUnitOfBloodTest: formatMutationPerTime(bloodFrequencyUnit),
      nextBloodTest: bloodTheNextDate ? moment(bloodTheNextDate).toISOString() : undefined,
      typesOfBloodTests: _.map(testType, x => formatBloodTestType(x)),
    });
  }
  if (isCheckStressTest) {
    _.assign(objectInfo, {
      frequencyOfStressTest: parseInt(stressFrequency, 10),
      nextStressTest: stressTheNextDate ? moment(stressTheNextDate).toISOString() : undefined,
      timeUnitOfStressTest: formatMutationPerTime(stressFrequencyUnit),
    });
  }
  return objectInfo;
};
