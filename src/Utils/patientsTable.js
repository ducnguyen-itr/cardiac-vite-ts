import _ from 'lodash';
import moment from 'moment';
import { CARE_PLAN_PROGRAM_TYPE, CARE_PLAN_SOURCE } from '../Constants/carePlanData';
import { getFullName } from '../Helpers';
import auth from '../Helpers/auth';
import { formatPhoneNumberWithCode } from './patientFormat';

export const calcNextDueOnFollowUp = (frequency = 0, date = '', format = 'MMM DD, YYYY') => {
  if (frequency === 0) return '--';
  const dateMoment = moment(date, 'YYYY-MM-DD').startOf('day');
  const thisDate = moment().startOf('days');

  const diffDays = moment(thisDate).diff(dateMoment, 'day');
  if (moment(thisDate).isBefore(dateMoment) || diffDays === 0) {
    return moment(date, 'YYYY-MM-DD').format(format);
  }

  const newTotalDate = (Math.trunc(diffDays / frequency) + 1) * frequency;
  return moment(date, 'YYYY-MM-DD').add(newTotalDate, 'day').format(format);
};


export const getFullNameId = (x, userID) => {
  if (x?._id === userID || x?.id === userID) {
    return `${x?.firstName || ''} ${x?.lastName || ''} (You)`;
  }
  return `${x?.firstName || ''} ${x?.lastName || ''}`;
};
export const formatNewMDCarePlans = (carePlans = []) => {
  if (carePlans.length === 0) {
    return [];
  }
  const userID = auth.userId();

  return _.map(carePlans, (carePlan) => {
    const { patientDemographic } = carePlan;
    const phone = formatPhoneNumberWithCode(patientDemographic?.contact?.phone1, patientDemographic?.contact?.country);
    const email = patientDemographic?.email;
    const patientName = getFullName(carePlan.patientDemographic);
    return {
      _id: carePlan._id,
      carePlanId: carePlan.friendlyId,
      patientName,
      nurseName: getFullNameId(carePlan?.nurse),
      medicalDoctorName: getFullNameId(carePlan?.physician, userID),
      phone,
      email,
      patientId: carePlan.patient?._id,
      facilityName: carePlan?.facility?.name || '',
      status: carePlan?.physicianStatus || '',
      isLinked: !!carePlan.patient?._id,
      isMyPatient: carePlan?.physician?._id === userID,
      willDeletedAt: carePlan?.patient?.willDeletedAt,
      isImported: carePlan?.source === CARE_PLAN_SOURCE.ATHENA,
      isCCM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
      isRPM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.RPM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
      // facilityNames: _.map(carePlan?.patient?.facilities || [], x => x.name),
    };
  });
};

export const formatNewRegisteredCarePlans = (carePlans = []) => {
  if (carePlans.length === 0) {
    return [];
  }
  return _.map(carePlans, (carePlan) => {
    const { patientDemographic } = carePlan;
    const phone = formatPhoneNumberWithCode(patientDemographic?.contact?.phone1, patientDemographic?.contact?.country);
    const email = patientDemographic?.email;
    const patientName = getFullName(carePlan.patientDemographic);
    return {
      _id: carePlan._id,
      carePlanId: carePlan.friendlyId,
      patientName,
      phone,
      email,
      patientId: carePlan.patient?._id,
      facilityName: carePlan?.facility?.name || '',
      status: carePlan?.nurseStatus || '',
      isLinked: !!carePlan.patient?._id,
      willDeletedAt: carePlan?.patient?.willDeletedAt,
      isCCM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
      isRPM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.RPM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
    };
  });
};

export const formatNewAssignedCarePlans = (carePlans = []) => {
  if (carePlans.length === 0) {
    return [];
  }
  const userID = auth.userId();
  return _.map(carePlans, (carePlan) => {
    const { patientDemographic } = carePlan;
    const phone = formatPhoneNumberWithCode(patientDemographic?.contact?.phone1, patientDemographic?.contact?.country);
    const email = patientDemographic?.email;
    const patientName = getFullName(carePlan.patientDemographic);
    return {
      _id: carePlan._id,
      carePlanId: carePlan.friendlyId,
      patientName,
      medicalDoctorName: getFullNameId(carePlan?.physician),
      nurseName: getFullNameId(carePlan?.nurse, userID),
      phone,
      email,
      patientId: carePlan.patient?._id,
      facilityName: carePlan?.facility?.name || '',
      isLinked: !!carePlan.patient?._id,
      willDeletedAt: carePlan?.patient?.willDeletedAt,
      isCCM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
      isRPM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.RPM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
    };
  });
};
export const formatDeletedCarePlans = (carePlans) => {
  if (carePlans.length === 0) {
    return [];
  }
  const userID = auth.userId();
  return _.map(carePlans, carePlan => ({
    _id: carePlan._id,
    carePlanId: carePlan.friendlyId,
    patientName: getFullName(carePlan.patientDemographic),
    phone: formatPhoneNumberWithCode(carePlan?.patientDemographic?.contact?.phone1, carePlan?.patientDemographic?.contact?.country),
    email: carePlan.patientDemographic?.email,
    nurseName: getFullNameId(carePlan?.nurse, userID),
    medicalDoctorName: getFullNameId(carePlan?.physician, userID),
    patientId: carePlan.patient?._id,
    facilityName: carePlan?.facility?.name || '',
    isCCM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
    isRPM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.RPM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
    deletedDate: carePlan?.deletedDate && moment(carePlan?.deletedDate).isValid()
      ? moment(carePlan?.deletedDate).format('MM/DD/YYY, hh:mm A') : '--',
    isAssigned: carePlan?.nurse?._id,
  }));
};

export const formatActiveCarePlans = (carePlans) => {
  if (carePlans.length === 0) {
    return [];
  }
  const userID = auth.userId();
  return _.map(carePlans, carePlan => ({
    _id: carePlan._id,
    carePlanId: carePlan.friendlyId,
    patientName: getFullName(carePlan.patientDemographic),
    phone: formatPhoneNumberWithCode(carePlan?.patientDemographic?.contact?.phone1, carePlan?.patientDemographic?.contact?.country),
    email: carePlan.patientDemographic?.email,
    nurseName: getFullNameId(carePlan?.nurse, userID),
    medicalDoctorName: getFullNameId(carePlan?.physician, userID),
    startDate: carePlan.startDate,
    nextFollowUp: calcNextDueOnFollowUp(carePlan?.info?.frequencyOfFollowUp, carePlan?.info?.nextDueOnFollowUp, 'MM/DD/YYYY'),
    patientId: carePlan.patient?._id,
    facilityName: carePlan?.facility?.name || '',
    willDeletedAt: carePlan?.patient?.willDeletedAt,
    isCCM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
    isRPM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.RPM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
  }));
};

export const formatInactiveCarePlans = (carePlans) => {
  if (carePlans.length === 0) {
    return [];
  }
  const userID = auth.userId();
  return _.map(carePlans, carePlan => ({
    _id: carePlan._id,
    carePlanId: carePlan.friendlyId,
    patientName: getFullName(carePlan?.patientDemographic),
    nurseName: getFullNameId(carePlan?.nurse, userID),
    medicalDoctorName: getFullNameId(carePlan?.physician, userID),
    stopDate: carePlan.stopDate,
    reason: carePlan.reason,
    email: carePlan.patient?.email,
    facilityName: carePlan?.facility?.name || '',
    patientId: carePlan.patient?._id,
    isShowTooltip: carePlan?.reason ? carePlan?.reason?.length > 45 : false,
    sortReason: carePlan?.reason ? `${carePlan?.reason?.slice(0, 42)}...` : '',
    willDeletedAt: carePlan?.patient?.willDeletedAt,
    isCCM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
    isRPM: carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.RPM || carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
  }));
};
