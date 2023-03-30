
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import fetchEvent from '../../../Apollo/Functions/Fetch/fetchEvent';
import { ROLES } from '../../../Constants';
import { EVENT_STATUS, EVENT_TYPE } from '../../../Constants/appointment';
import { CARE_PLAN_PROGRAM_TYPE } from '../../../Constants/carePlanData';
import { getFullName } from '../../../Helpers';
import auth from '../../../Helpers/auth';
import { zeroPad } from '../../../Utils';
import { MUTATION_APPOINTMENT_TYPES, MUTATION_SCHEDULE_TYPES } from '../../../Utils/calendar';
import { getFullNameId } from '../../../Utils/patientsTable';
import PatientTypeTag from '../../PatientTypeTag';

const {
  TECHNICIAN, PHYSICIAN,
} = ROLES;


export const EVENT_TIME_STATUS = {
  BEFORE_BOOKING: 'before-booking',
  BEFORE_BOOKING_15: 'before-booking-15',
  IN_BOOKING: 'in-booking',
};

export const CLINIC_UPDATE_EVENT_ENUM = {
  FOLLOWING_EVENTS: 'FOLLOWING_EVENTS',
  FUTURE_EVENTS: 'FUTURE_EVENTS',
};

export const CANCEL_APPOINTMENT_TYPES = [
  'This appointment',
  'This and all following appointments',
  'All appointments in the series',
];

export const EDIT_APPOINTMENT_TYPES = [
  'This appointment',
  'This and all following appointments',
  'All appointments in the series',
];

export const getAppointmentInfoData = (appointmentData = {}) => {
  const {
    appointmentType, facilityName, reasons = [],
  } = appointmentData || {};
  const data = [
    {
      title: 'Type',
      data: appointmentType || '--',
      type: 'APT_STATUS',
    },
    {
      title: 'Clinic ',
      data: facilityName || '--',
    },
    {
      title: 'Reason for visit',
      data: !_.isEmpty(reasons) ? reasons.join(',\n') : '--',
    },
  ];
  return data;
};

export const getPatientName = ({ isCCM, isRPM, patientName }) => (
  <div className="f-start-cen">
    {patientName || ''}
    {isCCM && <PatientTypeTag className="ml10" title="CCM" isShow isCCM />}
    {isRPM && <PatientTypeTag className="ml10" title="RPM" isShow />}
  </div>
);

export const getPatientInfoData = (appointmentData = {}) => {
  if (_.isEmpty(appointmentData)) return [];
  const {
    patientName, gender, dayOfBirth, age, carePlanFid, isCCM, isRPM,
  } = appointmentData || {};
  const data = [
    {
      title: 'Name',
      data: getPatientName({ isCCM, isRPM, patientName }) || '',
    },
    {
      title: 'Gender',
      data: gender || '--',
    },
    {
      title: 'Care plan ID',
      data: carePlanFid ? zeroPad(carePlanFid) : '--',
    },
    {
      title: 'DOB',
      data: dayOfBirth && !_.isNil(age) ? `${dayOfBirth} (${age})` : '--',
    },
  ];
  return data;
};


const getRecurringText = (recurringDay) => {
  switch (recurringDay) {
    case 1:
      return 'Repeat daily';
    case 7:
      return 'Repeat weekly';
    case 14:
      return 'Repeat bi-weekly';
    case 30:
      return 'Repeat monthly';
    case 60:
      return 'Repeat bi-monthly';
    case 90:
      return 'Repeat every 3 months';
    case 180:
      return 'Repeat every 6 months';
    case 365:
      return 'Repeat yearly';
    default:
      return '';
  }
};

export const formatAppointmentDetail = (data = {}) => {
  const fromTime = !_.isNil(data.fromTime) ? new Date(data.fromTime) : null;
  const toTime = !_.isNil(data.toTime) ? new Date(data.toTime) : null;
  const userId = auth.userId();
  if (!_.isEmpty(data)) {
    const attendees = [];
    const notNullAttentdees = _.filter(data.attendees, attendee => attendee !== null);
    const nurseItem = _.find(notNullAttentdees, y => y.type?.includes(TECHNICIAN))?.user;
    const attendeesIds = [];
    _.forEach(notNullAttentdees, (x) => {
      if (data.type !== 'Patient') {
        attendeesIds.push(x.user?._id);
      }
    });

    const mdItem = _.find(notNullAttentdees, y => y.type?.includes(PHYSICIAN))?.user;
    let isShowVideoIcon = false;
    if (!_.isEmpty(nurseItem)) {
      attendees.push(`${nurseItem.firstName} ${nurseItem.lastName}${userId === nurseItem._id ? ' (You)' : ''}`);
      if (userId === nurseItem._id) {
        isShowVideoIcon = true;
      }
    }
    if (!_.isEmpty(mdItem)) {
      attendees.push(`${mdItem.firstName} ${mdItem.lastName}${userId === mdItem._id ? ' (You)' : ''}`);
      if (userId === mdItem._id) {
        isShowVideoIcon = true;
      }
    }
    if (data?.carePlan?.status === 'Inactive') {
      isShowVideoIcon = false;
    }
    if (['Canceled', 'Finished', 'Overdue', 'Deleted'].includes(data.status)) {
      isShowVideoIcon = false;
    }

    const appointmentType = data.appointmentType
      ? _.find(MUTATION_APPOINTMENT_TYPES, y => y.value === data.appointmentType)?.label : '';

    const DOB = data.carePlan?.patientDemographic?.dateOfBirth ? moment(data?.carePlan?.patientDemographic?.dateOfBirth, 'YYYY-MM-DD')
      : data.patient?.dateOfBirth && moment(data.patient?.dateOfBirth, 'YYYY-MM-DD').isValid()
        ? moment(data.patient?.dateOfBirth, 'YYYY-MM-DD') : null;
    const age = DOB ? moment().diff(moment(DOB), 'y') : null;


    const firstName = data.carePlan?.patientDemographic?.firstName || data.patient?.firstName || data.invitedPatientInfo?.firstName || '';
    const lastName = data.carePlan?.patientDemographic?.lastName || data.patient?.lastName || data.invitedPatientInfo?.lastName || '';
    const isInvitedPatient = !_.isEmpty(data?.invitedPatientInfo) && !(!_.isEmpty(data?.patient) || !_.isEmpty(data?.carePlan));
    return {
      ...data,
      // id of that appointment
      _id: data._id,
      // id of the careplan belong to this appointment (if any)
      carePlanId: data.carePlan?._id,
      // status of the careplan belong to this appointment (if any)
      carePlanStatus: data.carePlan?.status,
      // friendly id of the careplan belong to this appointment (if any)
      carePlanFid: data.carePlan?.friendlyId || null,
      // type of this appointment: Virtual or inPerson
      appointmentType,
      // Patient information
      isInvitedPatient,
      firstName: data.carePlan?.patientDemographic?.firstName ? data.carePlan?.patientDemographic?.firstName : data.patient?.firstName,
      lastName: data.carePlan?.patientDemographic?.lastName ? data.carePlan?.patientDemographic?.lastName : data.patient?.lastName,
      patientName: `${firstName} ${lastName}`,
      gender: data.carePlan?.patientDemographic?.gender ? data?.carePlan?.patientDemographic?.gender : data.patient?.gender,
      phoneNumber: data.patient?.contact?.phone,
      dayOfBirth: DOB ? moment(DOB).format('MM/DD/YYYY') : '--',
      dateOfBirth: data.carePlan?.patientDemographic?.dateOfBirth || data.patient?.dateOfBirth,
      age,
      // patient ID
      patientId: data.patient?._id || '',
      // call id of this appointment (if any)
      callId: data?.call?._id,
      // call status of this appointment (if any)
      callStatus: data?.call?.callStatus,
      // Patient data information
      allergies: data.info?.allergies || '',
      medicalHistory: data?.info?.medicalConditions || [],
      // attendees of appoitnemnt (patient, nurse, physician)
      attendees,
      // condition to show join appointment button
      isShowVideoIcon,
      // appointment status
      status: data.status || '',
      // facility name
      facilityName: data?.facility?.name || '',
      // facility id
      facilityId: data?.facility?._id || '',
      // id of attendees that could join appoitnemnt (patient, nurse, physician)
      attendeesIds,
      // start time of this appointment
      fromTime,
      fromTimeMoment: fromTime,
      // end time of this appointment
      toTime,
      toTimeMoment: toTime,
      // reasons of this appointment
      reasons: data.info?.reasons,
      // infor of the physician that is member of this appointment
      mdItem,
      // infor of the nurse that is member of this appointment
      nurseItem,
      // booking time of this appoitnemnt (from time - to time)
      bookingTime: fromTime && toTime ? `${moment(fromTime).format('MM/DD/YYYY')} - ${moment(toTime).format('hh:mm A')}` : '',
      // day time of this appoitnemnt
      dayTime: fromTime && toTime ? `${moment(fromTime).format('MM/DD/YYYY')}` : '',
      // duration time of this appoitnemnt
      durationTime: fromTime && toTime ? `${moment(fromTime).format('hh:mm A')} - ${moment(toTime).format('hh:mm A')}` : '',
      // the day that patient will delete this app forever (if any)
      willDeletedAt: data?.patient?.willDeletedAt,
      // its show this appointment is belong to a recurring appointment
      isRecurring: !!data?.recurringId,
      // time of this event
      eventTime: `${moment(fromTime).format('hh:mm A')} - ${moment(toTime).format('hh:mm A')} (${moment(toTime).diff(moment(fromTime), 'minutes')} mins)`,
      // day time of this event
      eventDay: moment(fromTime).format('ddd MM/DD/YYYY'),
      // recurring description
      recurringText: getRecurringText(data?.recurringDay),
      isCCM: data.carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM || data.carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
      isRPM: data.carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.RPM || data.carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
    };
  }
  return {};
};

export const fetchAppointmentDetail = async (_id) => {
  try {
    const res = await fetchEvent({ _id }, 2);
    if (_.isNil(res)) {
      return null;
    }
    return formatAppointmentDetail(res);
  } catch (error) {
    throw error;
  }
};

export const handleGetStatus = (status, fromTime) => {
  switch (status) {
    case 'Active': {
      const is15Upcoming = moment(fromTime).diff(moment(), 'm') <= 15
        && moment(fromTime).diff(moment(), 'm') > 0;
      const isUpcoming = moment(fromTime).diff(moment(), 'm') > 15;
      const status = isUpcoming ? 'before-booking' : is15Upcoming ? 'before-booking-15' : 'in-booking';
      return { status };
    }
    case 'Overdue':
    case 'Finished':
    case 'Canceled':
      return { status: 'done' };
    default:
      return {};
  }
};


export const getShowBtn = (appointmentType, status, eventStatus, isMyPatient) => {
  const isActive = status === EVENT_STATUS.ACTIVE;
  const isDuring = isMyPatient && (eventStatus === 'before-booking-15' || eventStatus === 'in-booking');

  const isShowMarkBtn = isActive && appointmentType === EVENT_TYPE.INPERSON_TEXT && isDuring;
  const isFinishAPM = isActive && appointmentType === EVENT_TYPE.VIRTUAL && isDuring;
  const showCancelAPM = isActive && (eventStatus === 'before-booking-15' || eventStatus === 'before-booking');
  return { isShowMarkBtn, isFinishAPM, showCancelAPM };
};
