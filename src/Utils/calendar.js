import _ from 'lodash';
import moment from 'moment';
import {
  APPOINTMENT_TYPES, SCHEDULE_TYPES, APPOINTMENT_TYPES_BE, SCHEDULE_TYPES_BE, ROLES,
} from '../Constants';
import { getAddressWithOutCountry, getFullName } from '../Helpers';
import auth from '../Helpers/auth';
import { getFullNameId } from './patientsTable';

export const VIDEO_CALL_STATUS = {
  START: 'START',
  END: 'END',
  NOTHING: 'NOTHING',
  CHANGE_UPDATER: 'CHANGE_UPDATER',
  UPDATE_PARTICIPANTS: 'UPDATE_PARTICIPANTS',
};

const {
  CLINIC_PHYSICIAN, CLINIC_TECHNICIAN, TECHNICIAN, PHYSICIAN,
} = ROLES;

export const MUTATION_APPOINTMENT_TYPES = [
  {
    label: APPOINTMENT_TYPES[0],
    value: APPOINTMENT_TYPES_BE[0],
  },
  {
    label: APPOINTMENT_TYPES[1],
    value: APPOINTMENT_TYPES_BE[1],
  },
];
export const SELECT_APPOINTMENT_TYPES = [
  {
    label: 'All type',
    value: undefined,
  },
  {
    label: SCHEDULE_TYPES[0],
    value: SCHEDULE_TYPES_BE[0],
  },
  {
    label: SCHEDULE_TYPES[1],
    value: SCHEDULE_TYPES_BE[1],
  },
];


export const APPOINTMENT_TYPES_FILTER = [
  {
    label: 'All types',
    value: undefined,
  },
  {
    label: APPOINTMENT_TYPES[0],
    value: APPOINTMENT_TYPES_BE[0],
  },
  {
    label: APPOINTMENT_TYPES[1],
    value: APPOINTMENT_TYPES_BE[1],
  },
];


export const SELECT_CALENDAR_FILTER = [
  {
    label: 'Clinic calendar',
    value: undefined,
  },
  {
    label: 'My calendar',
    value: 'My calendar',
  },
];


export const SELECT_PATIENT_FILTER = [
  {
    label: 'My patients',
    value: 'My patients',
  },
  {
    label: 'All patients',
    value: undefined,
  },
];

export const MUTATION_SCHEDULE_TYPES = [
  {
    label: SCHEDULE_TYPES[0],
    value: SCHEDULE_TYPES_BE[0],
  },
  {
    label: SCHEDULE_TYPES[1],
    value: SCHEDULE_TYPES_BE[1],
  },
];

export const formatFollowUps = (followUps = []) => {
  if (!followUps || followUps?.length === 0) {
    return [];
  }
  const userId = auth.userId();
  const tempData = [];
  _.forEach(followUps, (x) => {
    if (!_.isEmpty(x) && !_.isEmpty(x.carePlan)) {
      // const appointments = _.map(_.sortBy(x?.appointments, y => moment(y.date).valueOf()), y => ({
      //   _id: y?._id || '',
      //   date: y?.date ? moment(y.date).format('hh:mm A, MM/DD/YYYY') : '',
      // }));
      tempData.push({
        followUpId: x._id,
        carePlanId: x.carePlan?._id,
        patientName: getFullName(x.carePlan?.patientDemographic),
        phoneNumber: x.carePlan?.patientDemographic?.contact?.phone1 || '',
        email: x.carePlan?.patientDemographic?.email || '',
        medicalDoctorName: `${x.carePlan.physician?.firstName} ${x.carePlan.physician?.lastName}`,
        isDone: x.isDone,
        genderAge: `${x.carePlan?.patientDemographic?.gender || ''}${x.carePlan?.patientDemographic?.dateOfBirth
          ? ` - ${moment().diff(x.carePlan?.patientDemographic.dateOfBirth, 'years')}` : ''}`,
        patientId: x.carePlan?.patient?._id || '',
        appointments: x.appointments,
        facilityName: x?.carePlan?.facility?.name || '',
        nurseName: getFullNameId(x.carePlan?.nurse, userId),
        userId: auth.isMD() ? x.carePlan?.physician?._id : x.carePlan?.nurse?._id,
        willDeletedAt: x?.carePlan?.patient?.willDeletedAt,
        isInactive: x?.carePlan?.status === 'Inactive',
        // facilityNames: _.map(x?.carePlan?.patient?.facilities || [], x => x.name),
      });
    }
  });

  return _.sortBy(tempData, [x => x.patientName?.toLowerCase()]);
};

export const formatSchedules = (appointments = []) => {
  if (!appointments || appointments?.length === 0) {
    return [];
  }
  const userId = auth.userId();
  const tempData = [];
  _.forEach(appointments, (x) => {
    if (!_.isEmpty(x)) {
      const fromTime = !_.isNil(x.fromTime) ? new Date(x.fromTime) : null;
      const toTime = !_.isNil(x.toTime) ? new Date(x.toTime) : null;
      const DOB = x.carePlan?.patientDemographic?.dateOfBirth
        ? moment(x.carePlan?.patientDemographic?.dateOfBirth) : moment(x.patient?.dateOfBirth, 'YYYY-MM-DD');

      const attendees = [];
      const notNullAttentdees = x.attendees.filter(attendee => attendee !== null);
      const nurseItem = _.find(notNullAttentdees, y => y?.type?.includes(TECHNICIAN))?.user;
      const attendeesIds = [];
      _.forEach(notNullAttentdees, (x) => {
        if (x.type !== 'Patient') {
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
      if (x.carePlan?.status === 'Inactive') {
        isShowVideoIcon = false;
      }
      if (['Canceled', 'Finished', 'Overdue', 'Deleted'].includes(x.status)) {
        isShowVideoIcon = false;
      }
      const reason = x.info?.reasons ? x.info?.reasons?.join(', ') : '';
      const isShowToolTipReason = reason.length > 40;
      const shortReason = `${reason.slice(0, 37)}...`;
      const appointmentType = x.appointmentType
        ? _.find(MUTATION_APPOINTMENT_TYPES, y => y.value === x.appointmentType)?.label : '';

      const scheduleType = x.scheduleType
        ? _.find(SELECT_APPOINTMENT_TYPES, y => y.value === x.scheduleType)?.label : '';

      tempData.push({
        ...x,
        _id: x._id,
        carePlanId: x.carePlan?._id,
        carePlanFid: x.carePlan?.friendlyId || null,
        patientName: x.carePlan ? getFullName(x.carePlan?.patientDemographic) : getFullName(x.patient),
        firstName: x.carePlan ? x.carePlan?.patientDemographic?.firstName : x.patient?.firstName,
        lastName: x.carePlan ? x.carePlan?.patientDemographic?.lastName : x.patient?.lastName,
        phoneNumber: x?.carePlan ? x.carePlan?.patientDemographic?.phone1 : x.patient?.contact?.phone,
        nurseName: getFullNameId(x.carePlan?.nurse, userId) || '',
        medicalDoctorName: getFullNameId(x?.carePlan?.physician, userId) || '',
        scheduleType,
        appointmentType,
        date: x.date,
        photo: x.patient?.photo,
        gender: x.patient?.gender,
        age: moment().diff(moment(DOB), 'y'),
        time: x.date ? moment(x.date).format('hh:mm A') : '',
        patientId: x.patient?._id || '',
        attendees,
        isCancel: x?.isCancel,
        isShowVideoIcon,
        status: x.status || '',
        facilityName: x?.facility?.name || '',
        facilityId: x?.facility?._id || '',
        attendeesIds,
        fromTime: moment(fromTime).format('hh:mm A'),
        toTime: moment(toTime).format('hh:mm A'),
        reasons: reason,
        shortReason,
        isShowToolTipReason,
        durationTime: fromTime && toTime ? `${moment(fromTime).format('hh:mm A')} - ${moment(toTime).format('hh:mm A')}` : '',
        fromTimeMoment: fromTime,
        toTimeMoment: toTime,
        willDeletedAt: x?.carePlan ? x.carePlan?.patient?.willDeletedAt : x?.patient?.willDeletedAt,
        dateOfBirth: x.carePlan?.patientDemographic?.dateOfBirth || x.patient?.dateOfBirth,
        callStatus: x?.call?.callStatus,
      });
    }
  });

  return _.sortBy(tempData, [x => moment(x.fromTime, 'hh:mm A').valueOf(), x => x.patientName?.toLowerCase()]);
};

export const formatFollowUpAppointment = (followUpAppointment = {}) => {
  if (!followUpAppointment || _.isEmpty(followUpAppointment)) {
    return {};
  }
  return {
    date: followUpAppointment?.date ? moment(followUpAppointment.date).format('HH:mm, MM/DD/YYYY') : '',
    _id: followUpAppointment?._id || '',
  };
};

export const getAttendees = (selectedPatient = {}) => {
  if (_.isEmpty(selectedPatient)) {
    return [];
  }
  const attendees = [];
  if (selectedPatient?.nurse?._id) {
    attendees.push(
      {
        role: ROLES.CLINIC_TECHNICIAN,
        // role: 'Nurse',
        _id: selectedPatient?.nurse?._id,
        firstName: selectedPatient?.nurse?.firstName,
        lastName: selectedPatient?.nurse?.lastName,
        photo: selectedPatient?.nurse?.photo,
        fullName: getFullName(selectedPatient?.nurse),
        isCheck: true,
      },
    );
  }
  if (selectedPatient?.physician?._id) {
    attendees.push(
      {
        role: ROLES.CLINIC_PHYSICIAN,
        // role: 'MD',
        _id: selectedPatient?.physician?._id,
        firstName: selectedPatient?.physician?.firstName,
        lastName: selectedPatient?.physician?.lastName,
        photo: selectedPatient?.physician?.photo,
        fullName: getFullName(selectedPatient?.physician),
        isCheck: false,
      },
    );
  }
  return attendees;
};

const formatAttendees = (attendees = []) => {
  const userId = auth.userId();
  const attendeeList = [];
  _.forEach(attendees, (x) => {
    attendeeList.push({
      ...x,
      fullName: getFullNameId(x, userId),
      role: x?.roles?.[0],
      userId: x?._id,
    });
  });
  return attendeeList;
};

const formatSelectedNurse = (attendees = []) => {
  const selectedNurse = {};
  const userId = auth.userId();
  _.forEach(attendees, (x) => {
    if (x?.type === ROLES.TECHNICIAN) {
      _.assign(selectedNurse, {
        ...x.user,
        fullName: getFullNameId(x.user, userId),
        role: x.user?.roles?.[0],
        userId: x.user?._id,
      });
    }
  });
  return selectedNurse;
};

const formatSelectedMD = (attendees = []) => {
  const selectedMD = {};
  const userId = auth.userId();
  _.forEach(attendees, (x) => {
    if (x?.type === ROLES.PHYSICIAN) {
      _.assign(selectedMD, {
        ...x.user,
        fullName: x.user ? getFullNameId(x.user, userId) : '',
        role: x.user?.roles?.[0],
        userId: x.user?._id,
      });
    }
  });
  return selectedMD;
};

export const formatAppointmentInfo = (appointment = {}) => {
  if (_.isEmpty(appointment)) {
    return {};
  }
  const {
    appointmentType, isCancel, fromTime, toTime,
  } = appointment;
  const fromDateMoment = new Date(parseFloat(fromTime));
  const toDateMoment = new Date(parseFloat(toTime));
  const duration = moment(toDateMoment).diff(moment(fromDateMoment), 'm');
  const date = moment(fromDateMoment).toISOString();

  const isCCMPatient = !appointment?.carePlan;
  const notNullAttentdees = appointment?.attendees.filter(attentdee => attentdee !== null);

  const selectedPatient = {
    userId: appointment.patient?._id || '',
    firstName: appointment.carePlan?.patientDemographic?.firstName,
    lastName: appointment.carePlan?.patientDemographic?.lastName,
    email: appointment.patient?.contact?.email,
    carePlanId: appointment.carePlan?._id,
    photo: appointment.patient?.photo,
    physician: {
      _id: appointment.carePlan?.physician?._id,
      firstName: appointment.carePlan?.physician?.firstName,
      lastName: appointment.carePlan?.physician?.lastName,
      photo: appointment.carePlan?.physician?.photo,
    },
    nurse: {
      _id: appointment.carePlan?.nurse?._id,
      firstName: appointment.carePlan?.nurse?.firstName,
      lastName: appointment.carePlan?.nurse?.lastName,
      photo: appointment.carePlan?.nurse?.photo,
    },
    genderAge: `${appointment.carePlan?.patientDemographic?.gender || ''}${appointment.carePlan?.patientDemographic?.dateOfBirth ? ` - ${moment().diff(appointment.carePlan?.patientDemographic.dateOfBirth, 'years')}` : ''}`,
    facilityName: appointment?.facility?.name || '',
    // facilityNames: _.map(appointment?.carePlan?.patient?.facilities || [], x => x.name),
    facilityId: appointment?.facility?._id || '',
    attendees: notNullAttentdees,
    facilityAddress: getAddressWithOutCountry(appointment?.facility?.contact),
  };
  // const attendees = getAttendees(selectedPatient);

  const attendees = formatAttendees(notNullAttentdees);

  const selectedNurse = formatSelectedNurse(notNullAttentdees);
  const selectedMD = formatSelectedMD(notNullAttentdees);
  _.forEach(attendees, (x) => {
    _.assign(x, { isCheck: !!_.find(notNullAttentdees, y => y._id === x._id) });
  });

  return {
    selectedPatient,
    attendees,
    date,
    duration,
    time: date,
    appointmentType,
    isCancel,
    status: appointment.carePlan?.status || '',
    selectedNurse,
    selectedMD,
  };
};

export const getDateCTForApt = (date = undefined, time = undefined) => {
  const tempDate = moment(date).format('MM-DD-YY');
  const tempTime = moment(time).format('HH-mm');
  const dateCT = moment(`${tempDate} ${tempTime}`, 'MM-DD-YY HH-mm').format();
  return dateCT;
};

export const getFromToDate = (date = undefined, time = undefined, duration = '', appointmentData = {}) => {
  const lastTime = moment(appointmentData?.time).format('HH-mm');
  const lastDate = moment(appointmentData?.date).format('MM-DD-YY');
  const lastDuration = appointmentData?.duration;
  const tempDate = moment(date).format('MM-DD-YY');
  const tempTime = moment(time).format('HH-mm');
  const dateCT = moment(`${tempDate} ${tempTime}`, 'MM-DD-YY HH-mm').format();

  const fromTime = (lastTime !== tempTime || lastDate !== tempDate || lastDuration !== duration)
    ? moment(`${tempDate} ${tempTime}`, 'MM-DD-YY HH-mm').valueOf() : undefined;
  const toTime = (lastTime !== tempTime || lastDate !== tempDate || lastDuration !== duration)
    ? moment(`${tempDate} ${tempTime}`, 'MM-DD-YY HH-mm').add(duration, 'm').valueOf() : undefined;

  return { dateCT, fromTime, toTime };
};

export const getAttendeesIDForApt = (attendees = []) => {
  const attendeesID = [];
  _.forEach(attendees, (x) => {
    if (x.isCheck) {
      attendeesID.push(x._id);
    }
  });
  return attendeesID;
};

export const getAttendeesIDForApt2 = (selectedNurse = {}, selectedMD = {}, selectedPatient = {}, appointmentData) => {
  const attendeesID = [];
  const attendees = {};
  if (selectedNurse?.userId) {
    attendeesID.push({ user: selectedNurse?.userId, type: 'Technician' });
    _.assign(attendees, { selectedNurse: selectedNurse?.userId });
  }
  if (selectedMD?.userId) {
    attendeesID.push({ user: selectedMD?.userId, type: 'Physician' });
    _.assign(attendees, { selectedMD: selectedMD?.userId });
  }
  if (selectedPatient?.userId) {
    attendeesID.push({ user: selectedPatient?.userId, type: 'Patient' });
  }
  return !_.isEqual({
    selectedMD: appointmentData?.selectedMD,
    selectedNurse: appointmentData?.selectedNurse,
  }, attendees) ? attendeesID : undefined;
};
export const formatDateAndAttendees = (obj = {}) => {
  if (_.isEmpty(obj)) {
    return { date: undefined, attendees: [] };
  }

  const {
    date, time, attendees, appointmentType, selectedNurse, selectedMD, duration, selectedPatient, appointmentData,
  } = obj;

  const { dateCT, fromTime, toTime } = getFromToDate(date, time, duration, appointmentData);

  const attendeesID = getAttendeesIDForApt2(selectedNurse, selectedMD, selectedPatient, appointmentData);

  const appointmentTypeCT = appointmentType !== appointmentData?.appointmentType
    ? _.find(MUTATION_APPOINTMENT_TYPES, x => x.label === appointmentType)?.value : undefined;
  return {
    dateCT, fromTime, toTime, attendeesID, appointmentTypeCT,
  };
};

export const formatPatientAppointmentInfo = (carePlan = {}) => {
  if (_.isEmpty(carePlan)) {
    return {};
  }
  // const {
  //   address, city, state, zip,
  // } = carePlan.currentCarePlan?.facility?.contact || {};
  const selectedPatient = {
    userId: carePlan._id,
    firstName: carePlan?.patient.firstName,
    lastName: carePlan?.patient.lastName,
    email: carePlan.contact?.email,
    carePlanId: carePlan?._id,
    photo: carePlan?.photo,
    physician: {
      _id: carePlan?.physician?._id,
      firstName: carePlan?.physician?.firstName,
      lastName: carePlan?.physician?.lastName,
      photo: carePlan?.physician?.photo,
    },
    nurse: {
      _id: carePlan?.nurse?._id,
      firstName: carePlan?.nurse?.firstName,
      lastName: carePlan?.nurse?.lastName,
      photo: carePlan?.nurse?.photo,
    },
    genderAge: `${carePlan?.gender || ''}${carePlan?.dateOfBirth ? ` - ${moment().diff(carePlan.dateOfBirth, 'years')}` : ''}`,
    facilityName: carePlan?.facility?.name || '',
    facilityId: carePlan?.facility?._id || '',
    facilityAddress: getAddressWithOutCountry(carePlan?.facility?.contact),
  };
  const attendees = getAttendees(selectedPatient);
  return { selectedPatient, attendees };
};

export const formatAppointmentVideoInfo = (appointment = {}) => {
  const { attendees, patient, carePlan } = appointment;
  const nurseId = _.find(attendees, y => y.roles?.includes(CLINIC_TECHNICIAN))?._id;
  const physicianId = _.find(attendees, y => y.roles?.includes(CLINIC_PHYSICIAN))?._id;
  const appointmentInfo = {
    carePlanId: carePlan?._id,
    patientId: patient?._id,
  };
  if (nurseId) {
    _.assign(appointmentInfo, { nurseId });
  }
  if (physicianId) {
    _.assign(appointmentInfo, { physicianId });
  }
  return appointmentInfo;
};

const getAttendeesId = (attendees = []) => {
  let nurseId;
  let physicianId;
  let patientId;
  _.forEach(attendees, (x) => {
    if (x?.type === 'Patient') {
      patientId = x?.user?._id;
    }
    if (x?.type === 'Technician') {
      nurseId = x?.user?._id;
    }
    if (x?.type === 'Physician') {
      physicianId = x?.user?._id;
    }
  });
  return { nurseId, physicianId, patientId };
};

export const checkVideoCallStatus = (
  appointmentInfo = {}, newAttendeeIds = [], preAttendeesList = [], isStarting = false, saveParticipants = [],
) => {
  const isGetOut = newAttendeeIds.length < preAttendeesList.length; // Someone comes
  const isNurseComes = preAttendeesList.length === 0 && auth.isNurse();
  const isPhysicianComes = preAttendeesList.length === 0 && auth.isMD();
  const { nurseId, physicianId, patientId } = getAttendeesId(appointmentInfo?.attendees);
  // const { nurseId, physicianId, patientId } = appointmentInfo;
  const isPatient = !!_.find(newAttendeeIds, x => x === patientId);
  const isNurse = !!_.find(newAttendeeIds, x => x === nurseId);
  const isPhysician = !!_.find(newAttendeeIds, x => x === physicianId);

  if (isNurseComes) {
    if (isPatient && !isPhysician && !isStarting) {
      return VIDEO_CALL_STATUS.START;
    }
    return VIDEO_CALL_STATUS.NOTHING;
  }

  if (isPhysicianComes) {
    if (isPatient && !isNurse && !isStarting) {
      return VIDEO_CALL_STATUS.START;
    }
    return VIDEO_CALL_STATUS.NOTHING;
  }

  if (isGetOut) {
    const isPatientOuts = !!_.find(preAttendeesList, x => x === patientId) && !isPatient;
    if (isPatientOuts && isStarting) { // !(isNurse || isPhysician) = No Nurse and No Physician
      return VIDEO_CALL_STATUS.END;
    }
    const isNurseOuts = !!_.find(preAttendeesList, x => x === nurseId) && !isNurse;
    const isPhysicianOuts = !!_.find(preAttendeesList, x => x === physicianId) && !isPhysician;
    if (isPatient && !isStarting) {
      if ((isNurseOuts && isPhysician) || isPhysicianOuts && isNurse) {
        return VIDEO_CALL_STATUS.CHANGE_UPDATER;
      }
    }
  }

  if (isPatient && (isNurse || isPhysician) && !isStarting) { // Patient comes (maybe)
    return VIDEO_CALL_STATUS.START;
  }

  if (newAttendeeIds.length > preAttendeesList.length && isStarting && saveParticipants.length !== 2) {
    return VIDEO_CALL_STATUS.UPDATE_PARTICIPANTS;
  }

  return VIDEO_CALL_STATUS.NOTHING;
};
