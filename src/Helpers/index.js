/* eslint-disable import/no-cycle */
import _ from 'lodash';
import moment from 'moment';
import { ALL_CLINIC, CountryData, COUNTRY_SHORT_DATA } from '../Constants/newPatientData';
import auth from './auth';
import { downloadImages } from './customAttachmentFile';
import { ARTIFACT_FINDINGS, HEALTHCARE_TEAM } from '../Constants';
import { FREQUENCY_UNIT_DATA, FREQUENCY_UNIT_DATA_SCHEDULE } from '../Constants/carePlanData';


export const getUserAvatars = async (users = {}) => {
  const pendingPromises = [];
  _.forEach(users, (img, index) => {
    pendingPromises.push(
      downloadImages(users[index].photo ? [users[index].photo] : [], true),
    );
  });

  const avatars = await Promise.all(pendingPromises);

  if (avatars) {
    _.forEach(users, (img, index) => {
      _.assign(img, { photo: avatars?.[index]?.[0]?.objectUrl || '' });
    });
  }
};

export const getCarePlanAvatars = async (carePlan = {}) => {
  const avatarArray = [
    carePlan?.patient?.photo || '',
    carePlan?.nurse?.photo || '',
    carePlan?.physician?.photo || '',
  ];

  const pendingPromises = [];
  _.forEach(avatarArray, (img) => {
    pendingPromises.push(
      downloadImages(img ? [img] : [], true),
    );
  });

  const avatars = await Promise.all(pendingPromises);
  const patientAvatar = avatars[0];
  const nurseAvatar = avatars[1];
  const mdAvatar = avatars[2];


  if (avatars) {
    _.assign(carePlan?.patient, { photo: patientAvatar?.[0]?.objectUrl || '' });
    _.assign(carePlan?.nurse, { photo: nurseAvatar?.[0]?.objectUrl || '' });
    _.assign(carePlan?.physician, { photo: mdAvatar?.[0]?.objectUrl || '' });
  }
};


export const getPatientAvatars = async (patient = {}) => {
  const avatarArray = [
    patient?.photo || '',
    patient?.currentCarePlan?.nurse?.photo || '',
    patient?.currentCarePlan?.physician?.photo || '',
  ];

  const pendingPromises = [];
  _.forEach(avatarArray, (img) => {
    pendingPromises.push(
      downloadImages(img ? [img] : [], true),
    );
  });

  const avatars = await Promise.all(pendingPromises);
  const patientAvatar = avatars[0];
  const nurseAvatar = avatars[1];
  const mdAvatar = avatars[2];


  if (avatars) {
    _.assign(patient, { photo: patientAvatar?.[0]?.objectUrl || '' });
    _.assign(patient?.currentCarePlan?.nurse, { photo: nurseAvatar?.[0]?.objectUrl || '' });
    _.assign(patient?.currentCarePlan?.physician, { photo: mdAvatar?.[0]?.objectUrl || '' });
  }
};


export const getCarePlanAvatarsAppointment = async (carePlan = {}) => {
  const avatarArray = [
    carePlan?.patient?.photo || '',
  ];

  const pendingPromises = [];
  _.forEach(avatarArray, (img) => {
    pendingPromises.push(
      downloadImages(img ? [img] : [], true),
    );
  });

  const avatars = await Promise.all(pendingPromises);
  const patientAvatar = avatars[0];

  if (avatars) {
    _.assign(carePlan, { photo: patientAvatar?.[0]?.objectUrl || '' });
  }
};
export const getFullName = x => `${x?.firstName || ''} ${x?.lastName || ''}`;
export const getFullNameAPT = (x) => {
  if (!x) return '';

  return `${x?.firstName || ''} ${x?.lastName || ''}`;
};

export const getFullFacilities = () => {
  const facilities = _.map(auth.getFacilities() || [], x => ({
    // _id: x._id,
    // name: x.name,
    value: x._id,
    label: x.name,
  }));
  if (facilities.length > 1) {
    facilities.unshift({
      label: ALL_CLINIC,
      value: ALL_CLINIC,
    });
  }
  return facilities;
};

export const getFormatedPhone = (phoneNumber = '') => {
  if (!phoneNumber) {
    return '';
  }
  const phone = `${phoneNumber}`;
  if (phone?.includes('-')) {
    if (phone?.[3] === '-' && phone?.[7] === '-') {
      return phone;
    }
    const newPhone = phone.replaceAll('-', '');
    return `${newPhone.slice(0, 3)}-${newPhone.slice(3, 6)}-${newPhone.slice(6)}`;
  }
  return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
};

export const getCareGiverTags = (caregiverInfo = {}) => {
  const mdTag = {};
  const nurseTag = {};
  if (_.isEmpty(caregiverInfo)) {
    return { mdTag, nurseTag };
  }

  const isMD = _.find(caregiverInfo, x => x?.roles.includes(HEALTHCARE_TEAM.PHYSICIAN));
  const isNurse = _.find(caregiverInfo, x => x?.roles.includes(HEALTHCARE_TEAM.NURSE));
  const userId = auth.userId();

  if (isMD && !_.isEmpty(isMD)) {
    const {
      firstName, lastName, roles, photo, _id,
    } = isMD;
    _.assign(mdTag, {
      title: `${firstName} ${lastName}${_id === userId ? ' (You)' : ''}`,
      firstName,
      lastName,
      roles,
      photo,
    });
  }
  if (isNurse && !_.isEmpty(isNurse)) {
    const {
      firstName, lastName, roles, photo, _id,
    } = isNurse;
    _.assign(nurseTag, {
      title: `${firstName} ${lastName}${_id === userId ? ' (You)' : ''}`,
      firstName,
      lastName,
      roles,
      photo,
    });
  }
  return { mdTag, nurseTag };
};

export const getHealthcareTags = (caregiverInfo = {}) => {
  const mdTag = {};
  const nurseTag = {};
  if (_.isEmpty(caregiverInfo)) {
    return { mdTag, nurseTag };
  }

  const isMD = _.find(caregiverInfo, x => x?.roles.includes('Physician'));
  const isNurse = _.find(caregiverInfo, x => x?.roles.includes('Nurse'));

  if (isMD && !_.isEmpty(isMD)) {
    const {
      firstName, lastName, roles, photo, _id,
    } = isMD;
    _.assign(mdTag, {
      title: `${firstName} ${lastName}`,
      firstName,
      lastName,
      roles,
      photo,
    });
  }
  if (isNurse && !_.isEmpty(isNurse)) {
    const {
      firstName, lastName, roles, photo, _id,
    } = isNurse;
    _.assign(nurseTag, {
      title: `${firstName} ${lastName}`,
      firstName,
      lastName,
      roles,
      photo,
    });
  }
  return { mdTag, nurseTag };
};

export const getAddressWithOutCountry = (contact = {}) => {
  const {
    address, city, state, zip, country,
  } = contact || {};
  const stateCT = ['CA', 'US']?.includes(country) ? state?.slice(-2) || state : state;

  const res = `${address ? `${address}, ` : ''}${city ? `${city}, ` : ''}${stateCT ? `${stateCT} ` : ''}${zip || ''}`;
  return res;
};

export const formatCountryDisplaying = (country = '') => {
  const index = _.findIndex(COUNTRY_SHORT_DATA, x => x === country);
  if (index !== -1) {
    return CountryData[index];
  }
  return country;
};

export const formatMutationPerTime = (perTime = FREQUENCY_UNIT_DATA[2]) => {
  switch (perTime) {
    case FREQUENCY_UNIT_DATA[0]:
      return 7;
    case FREQUENCY_UNIT_DATA[1]:
      return 14;
    case FREQUENCY_UNIT_DATA[2]:
      return 30;
    case FREQUENCY_UNIT_DATA[3]:
      return 60;
    case FREQUENCY_UNIT_DATA[4]:
      return 90;
    case FREQUENCY_UNIT_DATA[5]:
      return 180;
    case FREQUENCY_UNIT_DATA[6]:
      return 365;
    default:
      return 30;
  }
};

export const formatDisplayPerTime = (perTime = 30) => {
  switch (perTime) {
    case 7:
      return FREQUENCY_UNIT_DATA[0];
    case 14:
      return FREQUENCY_UNIT_DATA[1];
    case 30:
      return FREQUENCY_UNIT_DATA[2];
    case 60:
      return FREQUENCY_UNIT_DATA[3];
    case 90:
      return FREQUENCY_UNIT_DATA[4];
    case 180:
      return FREQUENCY_UNIT_DATA[5];
    case 365:
      return FREQUENCY_UNIT_DATA[6];
    default:
      return FREQUENCY_UNIT_DATA[2];
  }
};

export const formatMutationPerTimeSchedule = (perTime = FREQUENCY_UNIT_DATA_SCHEDULE[2]) => {
  switch (perTime) {
    case FREQUENCY_UNIT_DATA_SCHEDULE[0]:
      return 0;
    case FREQUENCY_UNIT_DATA_SCHEDULE[1]:
      return 7;
    case FREQUENCY_UNIT_DATA_SCHEDULE[2]:
      return 14;
    case FREQUENCY_UNIT_DATA_SCHEDULE[3]:
      return 30;
    case FREQUENCY_UNIT_DATA_SCHEDULE[4]:
      return 60;
    case FREQUENCY_UNIT_DATA_SCHEDULE[5]:
      return 90;
    case FREQUENCY_UNIT_DATA_SCHEDULE[6]:
      return 180;
    case FREQUENCY_UNIT_DATA_SCHEDULE[7]:
      return 365;
    default:
      return 30;
  }
};

export const formatDisplayPerTimeSchedule = (perTime = 30) => {
  switch (perTime) {
    case 0:
      return FREQUENCY_UNIT_DATA_SCHEDULE[0];
    case 7:
      return FREQUENCY_UNIT_DATA_SCHEDULE[1];
    case 14:
      return FREQUENCY_UNIT_DATA_SCHEDULE[2];
    case 30:
      return FREQUENCY_UNIT_DATA_SCHEDULE[3];
    case 60:
      return FREQUENCY_UNIT_DATA_SCHEDULE[4];
    case 90:
      return FREQUENCY_UNIT_DATA_SCHEDULE[5];
    case 180:
      return FREQUENCY_UNIT_DATA_SCHEDULE[6];
    case 365:
      return FREQUENCY_UNIT_DATA_SCHEDULE[7];
    default:
      return FREQUENCY_UNIT_DATA_SCHEDULE[0];
  }
};

export const timezoneToOffset = (timezone) => {
  try {
    const timeString = timezone.substring(3);
    return parseInt(timeString, 10) * 60;
  } catch (exception) {
    return 0;
  }
};

export const dateToDuration = (time, measurements) => {
  if (time) {
    const dateMoment = moment(time);
    const now = moment();
    now.utcOffset(now.utcOffset(), false);
    // *: Get the difference between the moments
    const diff = measurements ? now.diff(dateMoment, measurements) : now.diff(dateMoment);
    return diff;
  }
  return null;
};

export const dateToString = (isoDate, timezone = 'UTC+0', format = ('MM/DD/YYYY, hh:mm A')) => {
  if (isoDate) {
    const utcOffset = timezoneToOffset(timezone);
    const dateMoment = moment(isoDate);
    dateMoment.utcOffset(utcOffset, false);
    return dateMoment.isValid() ? dateMoment.format(format) : '';
  }
  return '';
};

export const dateToTimeSince = (diff, timezone = 'UTC+0') => {
  // *: Express as a duration
  const diffDuration = moment.duration(diff);
  if (diff) {
    if (diffDuration.years() > 0) {
      return `${diffDuration.years()} ${diffDuration.years() === 1 ? 'year ago' : 'years ago'}`;
    }
    if (diffDuration.months() > 0) {
      return `${diffDuration.months()} ${diffDuration.months() === 1 ? 'month ago' : 'months ago'}`;
    }
    if (diffDuration.days() > 0) {
      return `${diffDuration.days()} ${diffDuration.days() === 1 ? 'day ago' : 'days ago'}`;
    }
    if (diffDuration.hours() > 0) {
      return `${diffDuration.hours()} ${diffDuration.hours() === 1 ? 'hour ago' : 'hours ago'}`;
    }
    if (diffDuration.minutes() > 0) {
      return `${diffDuration.minutes()} ${diffDuration.minutes() === 1 ? 'minute ago' : 'minutes ago'}`;
    }
    return 'Just now';
  }
  return '';
};

export const generateIssueFound = (text) => {
  const foundItem = _.find(ARTIFACT_FINDINGS, x => x.text === text);
  return {
    issueFound: foundItem?.issue || '',
    description: foundItem?.description || '',
    stepsToTry: foundItem?.stepsToTry || [],
  };
};

export const zeroPad = (num, places = 5) => {
  if (num || num === 0) {
    return num.toString().padStart(places, '0');
  }
  return '';
};
