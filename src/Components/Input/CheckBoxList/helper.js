import _ from 'lodash';
import { REPORTSETTING_OVERVIEW_TYPE } from '../../../Constants/reports';

export const checkDisabledReportSetting = (options, requiredEP) => {
  if (options.value === REPORTSETTING_OVERVIEW_TYPE.BLOOD_PRESSURE || options.value === REPORTSETTING_OVERVIEW_TYPE.OXYGEN) {
    let isBiokid = false;
    let isBloodPressure = false;
    let isOxygen = false;
    _.forEach(requiredEP, (x) => {
      if (x.value === REPORTSETTING_OVERVIEW_TYPE.BIOKIT && x.isCheck) {
        isBiokid = true;
      }
      if (x.value === REPORTSETTING_OVERVIEW_TYPE.BLOOD_PRESSURE_CUFF && x.isCheck) {
        isBloodPressure = true;
      }
      if (x.value === REPORTSETTING_OVERVIEW_TYPE.OXIMETER && x.isCheck) {
        isOxygen = true;
      }
    });
    if (options.value === REPORTSETTING_OVERVIEW_TYPE.BLOOD_PRESSURE && (isBiokid || isBloodPressure)) return true;
    if (options.value === REPORTSETTING_OVERVIEW_TYPE.OXYGEN && (isBiokid || isOxygen)) return true;
    return false;
  }
  return false;
};

export default checkDisabledReportSetting;
