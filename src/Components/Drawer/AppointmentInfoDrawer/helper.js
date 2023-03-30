import _ from 'lodash';
import moment from 'moment';
import { length, mass } from 'units-converter';
import fetchAppointments from '../../../Apollo/Functions/Fetch/fetchAppointments';
import fetchEvents from '../../../Apollo/Functions/Fetch/fetchEvents';
import fetchUpcommingEvent from '../../../Apollo/Functions/Fetch/fetchUpcommingEvent';
import fetchCarePlan from '../../../Apollo/Functions/Fetch/fetchCarePlan';
import {
  getAddressWithOutCountry, getCarePlanAvatars, getFormatedPhone, getFullName, getUserAvatars,
} from '../../../Helpers';
import auth from '../../../Helpers/auth';
import consoleLog from '../../../Helpers/consoleLog';
import { setPathRequest } from '../../../Redux/Actions/savePath';
import { imperialHeight, parseImperialWeight } from '../../../Utils';
import { formatPatientInfo } from '../../../Utils/table';
import fetchEvent from '../../../Apollo/Functions/Fetch/fetchEvent';
import { formatPhoneNumberWithCode, getCountryNameByCode } from '../../../Utils/patientFormat';
import { DEVICE_NAME_ENUM } from '../../../Constants/enum';

export const formatCareplanInfo = (data = {}) => {
  const carePlan = {};
  _.assign(carePlan, {
    ...data,
  });
  return carePlan;
};

export const handleFetchCareplan = async (_id = '') => {
  try {
    const carePlan = await fetchCarePlan({ _id });

    const patientInfo = formatPatientInfo(carePlan);
    // LOAD AVATAR WITHOUT AWAIT
    getCarePlanAvatars(carePlan);

    const { nurse, physician } = patientInfo || {};
    const tagArr = [];
    if (nurse && !_.isEmpty(nurse)) {
      tagArr.push({
        _id: nurse?._id,
        role: nurse?.title,
        firstName: nurse?.firstName,
        lastName: nurse?.lastName,
        photo: nurse?.photo,
      });
    }
    if (physician && !_.isEmpty(physician)) {
      tagArr.push({
        _id: physician?._id,
        role: physician?.title,
        firstName: physician?.firstName,
        lastName: physician?.lastName,
        photo: physician?.photo,
      });
    }
    return { patientInfo, tagArr };
  } catch (error) {
    consoleLog('Failed to fetch patient info', error);
    return {};
  }
};

export const formatPatientData = (event = {}) => {
  const {
    patient, _id, facility, invitedPatientInfo,
  } = event || {};

  const DOB = moment(patient?.dateOfBirth, 'YYYY-MM-DD');
  return {
    invitedPatientInfo,
    patient,
    _id,
    patientName: getFullName(patient),
    firstName: patient?.firstName || invitedPatientInfo?.firstName || '',
    lastName: patient?.lastName || invitedPatientInfo?.lastName || '',
    phoneNumber: patient?.contact?.phone || invitedPatientInfo?.phone || '',
    photo: patient?.photo,
    gender: patient?.gender,
    age: moment().diff(moment(DOB), 'y'),
    patientId: patient?._id || '',
    facilityName: facility?.name || '',
    facilityId: facility?._id || '',
    willDeletedAt: patient?.willDeletedAt,
    dateOfBirth: patient?.dateOfBirth,
  };
};

export const handleFetchPatientInfoByEvent = async (_id = '') => {
  try {
    const event = await fetchEvent({ _id }, 3);
    const patientInfo = formatPatientData(event);
    // LOAD AVATAR WITHOUT AWAIT
    // getUserAvatars(patientInfo);

    return { patientInfo };
  } catch (error) {
    consoleLog('Failed to fetch patient info', error);
    return {};
  }
};

const formaterDate = (fromTime) => {
  const date = new Date(fromTime);
  const day = moment(date).format('MMM DD, YYYY');
  const time = moment(date).format('hh:mm A');
  return `${day} at ${time}`;
};
const formaterAttendee = (attendees = []) => {
  const atds = [];

  _.forEach(attendees, (x) => {
    if (x.type !== 'Patient') {
      if (x.user?._id === auth.userId()) {
        atds.unshift('You');
      } else {
        atds.push(`${x.user?.firstName} ${x.user?.lastName}`);
      }
    }
  });
  return atds.join(' and ');
};

const formatAppointment = (appointment) => {
  const apt = {};
  _.assign(apt, {
    ...appointment,
    dateFormatted: formaterDate(appointment.fromTime),
    attenddeeFormat: formaterAttendee(appointment.attendees),
    facilityName: appointment.facility?.name,
    facilityId: appointment.facility?._id,
    appointmentType: appointment.appointmentType === 'InPerson' ? 'In-person' : appointment.appointmentType,
  });
  return apt;
};

const formatAppointments = (appointments = []) => {
  const pastApt = [];
  _.forEach(appointments, (x) => {
    pastApt.push(formatAppointment(x));
  });
  const pastAppointment = _.sortBy(pastApt, [x => -x.fromTime]);
  return pastAppointment;
};

export const handleFetchAppointment = async (carePlanId = '', patientId = '', isLoadMore = false, lastAppointments = [], lastCursor = '') => {
  const epochEndTime = moment().add(20, 'm').valueOf();
  const sendingData = {
    filter: {
      attendees: patientId ? [patientId] : undefined,
      carePlans: carePlanId ? [carePlanId] : undefined,
      fromTime: 0,
      toTime: epochEndTime,
      status: ['Finished'],
    },
    limit: 10,
    cursor: undefined,
    orderType: 'desc',
  };
  if (isLoadMore) {
    _.assign(sendingData, { cursor: lastCursor });
  }
  try {
    const { events, cursor } = await fetchEvents(sendingData, 1);
    const pastAppointment = formatAppointments(events);

    let couldLoadMore = true;
    const loadMoreAppointmet = _.cloneDeep(lastAppointments);
    if (events?.length < 10) {
      couldLoadMore = false;
    }

    return { pastAppointment: isLoadMore ? [...loadMoreAppointmet, ...pastAppointment] : pastAppointment, cursor, couldLoadMore };
  } catch (error) {
    consoleLog(error);
    return {};
  }
};

export const handleFetchUpcommingEvent = async (carePlanId = '', patientId = '') => {
  try {
    const filter = {};
    if (carePlanId) {
      Object.assign(filter, { carePlan: carePlanId });
    } else {
      Object.assign(filter, { patient: patientId });
    }
    const upcoming = await fetchUpcommingEvent({ filter });
    const upComingAppointment = upcoming?._id ? formatAppointment(upcoming) : {};
    const upComingTime = upcoming?.fromTime ? moment(upcoming?.fromTime) : undefined;
    return { upComingAppointment, upComingTime };
  } catch (error) {
    consoleLog(error);
    return {};
  }
};

export const handleBottomClick = (
  propsName = '', _id = '', status = '', reportId = '', physicianId = '', nurseId = '',
) => {
  const tab = propsName.includes('new') ? 'patients/new' : 'patients';

  let pathName = `/${tab}/${status}/${_id}`;
  if ((propsName.includes('appointments') || propsName.includes('dashboard')) && status === 'new') {
    pathName = `/${tab}/new/new-${auth.isMD() && physicianId ? 'md' : nurseId ? 'assigned' : 'registered'}/${_id}`;
    return pathName;
  }

  if (propsName.includes('new-')) {
    pathName = `/${tab}/${propsName}/${_id}`;
    return pathName;
  }

  return pathName;
};

const getCountryString = (code) => {
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


export const getCCMPatientData = (patientInfo = {}) => {
  const {
    patient,
    invitedPatientInfo,
  } = patientInfo;

  const {
    firstName, lastName, photo, height, weight, dateOfBirth, contact, email, insuranceName,
    programType,
    equipmentProvided,
    bioheartMonitor,
    duration,
    transmission,
  } = patient || {};
  const DOB = dateOfBirth && moment(dateOfBirth, 'YYYY-MM-DD').isValid()
    ? moment(dateOfBirth, 'YYYY-MM-DD') : null;
  const bmi = (weight && height) ? weight / ((height / 100) ** 2) : null;

  const lbWeight = parseImperialWeight(weight);

  const handleDeviceName = (deviceName) => {
    switch (deviceName) {
      case DEVICE_NAME_ENUM.BLOOD_PRESSURE_CUFF:
        return 'BPM';
      case DEVICE_NAME_ENUM.PULSE_OXI_METER:
        return 'O2';
      case DEVICE_NAME_ENUM.THERMOMETER:
        return 'TP';
      default: return '';
    }
  };

  const formatDevice = () => {
    if ((!equipmentProvided || equipmentProvided.length === 0) && !bioheartMonitor?.isEnabled) {
      return '--';
    }
    const equipmentString = _.find(equipmentProvided, item => item.deviceName === DEVICE_NAME_ENUM.BIOKIT) ? DEVICE_NAME_ENUM.BIOKIT : _.join(_.map(equipmentProvided, item => handleDeviceName(item.deviceName)), ', ');
    return bioheartMonitor?.isEnabled ? ((!equipmentProvided || equipmentProvided.length === 0) ? 'Bioheart' : `${equipmentString}, Bioheart`) : equipmentString;
  };

  const info = [
    {
      title: 'Plan type',
      data: programType || '--',
    },
    {
      title: 'Devices',
      data: formatDevice(),
    },
    {
      title: 'Duration',
      data: duration ? `${duration} ${duration > 1 ? 'mins' : 'min'}` : '--',
    },
    {
      title: 'Transmission',
      data: transmission ? `${transmission} ${transmission > 1 ? 'days' : 'day'}` : '--',
    },
  ];

  const basicInfo = [
    {
      title: 'DOB',
      data: DOB ? moment(DOB).format('MM/DD/YYYY') : '--',
    },
    {
      title: 'Height',
      data: imperialHeight(height) || '--',
    },
    {
      title: 'Weight',
      data: lbWeight ? `${lbWeight.toFixed(1)} lb` : '--',
    },
    {
      title: 'BMI',
      data: !_.isNil(bmi) ? bmi?.toFixed(1) : '--',
    },
    {
      title: 'Insurance',
      data: insuranceName || '--',
    },
  ];
  const country = contact?.country ? contact?.country?.length === 2 ? getCountryNameByCode(contact?.country) : contact?.country : '--';

  const contactInfo = [
    {
      title: 'Email',
      data: email || invitedPatientInfo?.email || '--',
    },
    {
      title: 'Mobile',
      data: contact?.phone1 ? formatPhoneNumberWithCode(contact?.phone1, contact?.country)
        : formatPhoneNumberWithCode(invitedPatientInfo?.phone, invitedPatientInfo?.country) || '--',
    },
    {
      title: 'Emergency',
      data: contact?.emergencyPhone ? formatPhoneNumberWithCode(contact?.emergencyPhone, contact?.country)
        : formatPhoneNumberWithCode(invitedPatientInfo?.phone, invitedPatientInfo?.country) || '--',
    },
    {
      title: 'Home',
      data: contact?.homePhone ? formatPhoneNumberWithCode(contact?.homePhone, contact?.country)
        : formatPhoneNumberWithCode(invitedPatientInfo?.phone, invitedPatientInfo?.country) || '--',
    },
    {
      title: 'Address',
      data: getAddressWithOutCountry(contact) || '--',
    },
    {
      title: 'Country',
      data: country,
    },
  ];
  return { basicInfo, contactInfo, info };
};


export const generateCaregiverInfo = (patientData = {}) => {
  const { nurse, physician } = patientData;
  const arr = [];
  if (!_.isEmpty(nurse)) {
    arr.push({
      firstName: nurse?.firstName,
      lastName: nurse?.lastName,
      title: nurse?.title,
      roles: nurse?.roles,
      photo: nurse?.photo,
      _id: nurse?._id,
    });
  }
  if (!_.isEmpty(physician)) {
    arr.push({
      firstName: physician?.firstName,
      lastName: physician?.lastName,
      title: physician?.title,
      roles: physician?.roles,
      photo: physician?.photo,
      _id: physician?._id,
    });
  }
  return arr;
};
