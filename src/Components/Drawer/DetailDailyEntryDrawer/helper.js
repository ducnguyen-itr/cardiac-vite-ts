import { MEASUREMENT_ENUM } from '../../../Constants/dailyEntry';

export const getDrawerTitle = (type) => {
  switch (type) {
    case MEASUREMENT_ENUM.BLOOD_PRESSURE:
      return 'Blood pressure result details';
    case MEASUREMENT_ENUM.BODY_TEMPERATURE:
      return 'Body temperature result details';
    case MEASUREMENT_ENUM.HEART_RATE_AND_SPO2:
      return 'Heart rate & SpO2 result details';
    case MEASUREMENT_ENUM.WEIGHTS:
      return 'Weight result details';
    default:
      return '';
  }
};

export const getDataUnit = (type) => {
  switch (type) {
    case MEASUREMENT_ENUM.BLOOD_PRESSURE:
      return 'mmHg';
    case MEASUREMENT_ENUM.BODY_TEMPERATURE:
      return '°F';
    case MEASUREMENT_ENUM.HEART_RATE_AND_SPO2:
      return 'bpm';
    case MEASUREMENT_ENUM.WEIGHTS:
      return 'lb';
    default:
      return '';
  }
};
