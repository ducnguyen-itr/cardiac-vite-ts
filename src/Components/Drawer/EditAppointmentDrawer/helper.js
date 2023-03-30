import _ from 'lodash';
import moment from 'moment';
import momentTz from 'moment-timezone';
import fetchAppointment from '../../../Apollo/Functions/Fetch/fetchAppointment';
import fetchAttendeesAppointment from '../../../Apollo/Functions/Fetch/fetchAttendeesAppointment';
import fetchAvailableClinicUsers from '../../../Apollo/Functions/Fetch/fetchAvailableClinicUsers';
import fetchEvent from '../../../Apollo/Functions/Fetch/fetchEvent';
import fetchCarePlan from '../../../Apollo/Functions/Fetch/fetchCarePlan';
import fetchCarePlansOnGoing from '../../../Apollo/Functions/Fetch/fetchCarePlansOnGoing';
import fetchCheckExistenceAppointment from '../../../Apollo/Functions/Fetch/fetchCheckExistenceAppointment';
import fetchPatient from '../../../Apollo/Functions/Fetch/fetchPatient';
import fetchPatientInfoMissing from '../../../Apollo/Functions/Fetch/fetchPatientInfoMissing';
import handleAddAppointment from '../../../Apollo/Functions/Handle/handleAddAppointment';
import handleClinicUpdateAppointmentEvent from '../../../Apollo/Functions/Handle/handleClinicUpdateAppointmentEvent';
import handleUpdateAppointment from '../../../Apollo/Functions/Handle/handleUpdateAppointment';
import { APPOINTMENT_TYPES, CALENDAR_MESSAGES, ROLES } from '../../../Constants';
import {
  getCarePlanAvatars, getCarePlanAvatarsAppointment, getPatientAvatars, getUserAvatars,
} from '../../../Helpers';
import auth from '../../../Helpers/auth';
import consoleLog from '../../../Helpers/consoleLog';
import {
  formatAppointmentInfo, formatDateAndAttendees, formatPatientAppointmentInfo, getAttendeesIDForApt2,
} from '../../../Utils/calendar';
import {
  showFailedMsg, showSuccessMsg,
} from '../../../Utils/showNotification';
import { formatPatientData, formatUserData } from '../../../Utils/table';
import { CLINIC_UPDATE_EVENT_ENUM } from '../EventInfoDrawer/helper';
import { CARE_PLAN_PROGRAM_TYPE } from '../../../Constants/carePlanData';

const {
  CLINIC_PHYSICIAN, CLINIC_TECHNICIAN, TECHNICIAN,
  PHYSICIAN,
} = ROLES;

const {
  CANCELED_SUCCESS, UPDATE_SUCCESS, INVALID_DATE, CREATE_FAILED, CREATE_SUCCESS, UPDATE_FAILED, CREATE_FAILED_EXIST,
} = CALENDAR_MESSAGES;

export const handleFetchingPatientArray = async (search = undefined) => {
  try {
    const res = await fetchCarePlansOnGoing({
      filter: {
        search,
        cursor: undefined,
        sortOrder: 'desc',
        sortField: '_id',
      },
      limit: 20,
    });
    _.forEach(res || [], (x) => {
      getCarePlanAvatars(x);
    });
    const patientArray = formatPatientData(res);
    return patientArray;
  } catch (error) {
    consoleLog('Failed to fetch user data', error);
    return [];
  }
};

export const handleFetchingAppointmentInfo = async (_id = '') => {
  try {
    const appointment = await fetchEvent({
      _id,
    });
    getCarePlanAvatars(appointment?.carePlan);
    return formatAppointmentInfo(appointment);
  } catch (error) {
    consoleLog('Failed to fetch appointment info: ', error);
    return {};
  }
};

const formatAppointment = (appointment) => {
  if (_.isEmpty(appointment)) {
    return {};
  }
  const resultApt = {
    appointmentType: appointment.appointmentType,
    attendees: appointment.attendees,
    duration: moment(appointment.toTime).diff(moment(appointment.fromTime), 'm'),
    date: moment(appointment.fromTime).toISOString(),
    time: moment(appointment.fromTime).toISOString(),
    isRecurring: !!appointment?.recurringId,
    status: appointment.status,
  };
  let selectedMD = appointment.attendees?.find(attendee => attendee.type === 'Physician')?.user;
  if (selectedMD) {
    selectedMD = {
      ...selectedMD,
      userId: selectedMD._id,
      fullName: `${selectedMD.firstName} ${selectedMD.lastName} ${selectedMD._id === auth.getLoginData()?._id ? '(You)' : ''}`,
    };
  }
  let selectedNurse = appointment.attendees?.find(attendee => attendee.type === 'Technician')?.user;
  if (selectedNurse) {
    selectedNurse = {
      ...selectedNurse,
      userId: selectedNurse._id,
      fullName: `${selectedNurse.firstName} ${selectedNurse.lastName} ${selectedNurse._id === auth.getLoginData()?._id ? '(You)' : ''}`,
    };
  }
  resultApt.selectedMD = selectedMD;
  resultApt.selectedNurse = selectedNurse;
  if (appointment.carePlan) {
    // use care patient demographic
    Object.assign(resultApt, {
      selectedPatient: {
        carePlanId: appointment.carePlan?._id,
        carePlanFid: appointment.carePlan?.friendlyId,
        email: appointment.carePlan.patientDemographic?.email,
        firstName: appointment.carePlan.patientDemographic?.firstName,
        genderAge: appointment.carePlan.patientDemographic?.dateOfBirth ? `${appointment.carePlan.patientDemographic?.gender} - ${moment().diff(moment(appointment.carePlan.patientDemographic?.dateOfBirth), 'year')}` : appointment.carePlan.patientDemographic?.gender,
        lastName: appointment.carePlan.patientDemographic?.lastName,
        nurse: appointment.carePlan?.nurse,
        physician: appointment.carePlan?.physician,
        userId: appointment.patient?._id,
        facilityAddress: `${appointment.facility.contact?.address}, ${appointment.facility.contact?.city}, ${appointment.facility.contact?.state} ${appointment.facility.contact?.zip}`,
        facilityId: appointment.facility._id,
        facilityName: appointment.facility.name,
        isCCM: appointment?.carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM
          || appointment?.carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
        isRPM: appointment?.carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.RPM
          || appointment?.carePlan?.programType === CARE_PLAN_PROGRAM_TYPE.CCM_RPM,
      },
    });
    return resultApt;
  }
  Object.assign(resultApt, {
    selectedPatient: {
      carePlanId: '',
      email: appointment.patient?.email,
      firstName: appointment.patient?.firstName || appointment.invitedPatientInfo?.firstName,
      genderAge: appointment.patient?.dateOfBirth ? `${appointment.patient?.gender} - ${moment().diff(moment(appointment.patient?.dateOfBirth), 'year')}` : appointment.patient?.gender,
      lastName: appointment.patient?.lastName || appointment.invitedPatientInfo?.lastName,
      userId: appointment.patient?._id,
      facilityAddress: `${appointment.facility.contact?.address}, ${appointment.facility.contact?.city}, ${appointment.facility.contact?.state} ${appointment.facility.contact?.zip}`,
      facilityId: appointment.facility._id,
      facilityName: appointment.facility.name,
      isInvitedPatient: _.isEmpty(appointment?.patient) && !_.isEmpty(appointment.invitedPatientInfo),
    },
  });
  return resultApt;
};

export const fetchAppointmentV2 = async (_id = '') => {
  try {
    const appointment = await fetchEvent({ _id });
    getCarePlanAvatars(appointment?.carePlan);
    return {
      isSuccess: !!appointment,
      appointmentData: formatAppointment(appointment),
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
    };
  }
};

export const handleFetchingPatientInfo = async (_id = '') => {
  try {
    const carePlan = await fetchCarePlan({ _id }, 8);
    await getCarePlanAvatarsAppointment(carePlan);
    return formatPatientAppointmentInfo(carePlan);
  } catch (error) {
    consoleLog('Failed to fetch patient: ', error);
    return {};
  }
};

export const handleCreateAppointment = async (
  data = {}, selectedPatient = {}, followUpId = '', onCloseDrawer = () => { },
) => {
  const {
    date, time, attendees, appointmentType, selectedNurse, selectedMD,
  } = data;

  const { dateCT, attendeesID, appointmentTypeCT } = formatDateAndAttendees({
    date, time, attendees, appointmentType, selectedNurse, selectedMD,
  });
  if (moment().valueOf() > moment(dateCT).valueOf()) {
    showFailedMsg(INVALID_DATE);
    return { loading: false };
  }
  try {
    await handleAddAppointment({
      input: {
        appointmentType: appointmentTypeCT,
        date: dateCT,
        attendees: attendeesID,
        carePlan: selectedPatient?.carePlanId,
        followUp: followUpId || undefined,
        timezone: momentTz.tz.guess(),
      },
    });
    showSuccessMsg(CREATE_SUCCESS);
    onCloseDrawer();
    return {
      loading: false, date: dateCT, time: dateCT, selectedNurse: {}, selectedMD: {},
    };
  } catch (error) {
    consoleLog('Failed to create appointment: ', error);
    if (error === CREATE_FAILED_EXIST) {
      showFailedMsg(CREATE_FAILED_EXIST);
    } else { showFailedMsg(CREATE_FAILED); }
    return { loading: false };
  }
};

export const hanleUpdateAppointment = async (
  isCancel = false, data = {}, _id = '', appointmentData = {}, key = '0',
) => {
  const {
    date, time, attendees, appointmentType, selectedNurse, selectedMD, duration, selectedPatient,
  } = data;
  const {
    dateCT, fromTime, toTime, attendeesID, appointmentTypeCT,
  } = formatDateAndAttendees({
    date, time, attendees, appointmentType, selectedNurse, selectedMD, duration, selectedPatient, appointmentData,
  });
  if (moment().valueOf() > moment(dateCT).valueOf()) {
    showFailedMsg(INVALID_DATE);
    return {};
  }
  try {
    const options = key === '1' ? CLINIC_UPDATE_EVENT_ENUM.FOLLOWING_EVENTS
      : key === '2' ? CLINIC_UPDATE_EVENT_ENUM.FUTURE_EVENTS : undefined;
    await handleClinicUpdateAppointmentEvent({
      _id,
      input: {
        appointmentType: data.appointmentType,
        fromTime,
        toTime,
        attendees: attendeesID,
      },
      options,
    });
    showSuccessMsg(isCancel ? CANCELED_SUCCESS : UPDATE_SUCCESS);
    return {
      current: 'DISPLAY', isCancel, date: dateCT, time: dateCT, selectedNurse: {}, selectedMD: {},
    };
  } catch (error) {
    consoleLog('Failed to handle update appointment: ', error);
    showFailedMsg(UPDATE_FAILED);
    return {};
  }
};

const customeNewAttendees = (attendees = [], newRawAttendees = []) => {
  const newAttedees = _.cloneDeep(attendees);
  _.forEach(newRawAttendees, (x) => {
    const item = _.find(newAttedees, y => y._id === x._id);
    if (_.isEmpty(item)) {
      _.assign(item, { disabled: false });
    } else {
      _.assign(item, { isCheck: false, disabled: true });
    }
  });
  return newAttedees;
};

const checkError = (user = {}, attendees = []) => {
  const { userId } = user || {};
  let error = '';
  _.forEach(attendees, (x) => {
    if (x?._id === userId) {
      error = 'Not available at the selected time';
    }
  });
  return error;
};

export const getDateCTForApt = (date = undefined, time = undefined) => {
  if (!date || !time) return '';
  const tempDate = moment(date).format('MM-DD-YY');
  const tempTime = moment(time).format('HH-mm');
  const dateCT = moment(`${tempDate} ${tempTime}`, 'MM-DD-YY HH-mm').format();
  return dateCT;
};

export const queryChecExistApt = async (date, time, attendees = [], selectedNurse = {}, selectedMD = {}, appointmentData = {}) => {
  const dateCT = getDateCTForApt(date, time);
  const attendeesMDId = getAttendeesIDForApt2(selectedMD);
  const attendeesNurseID = getAttendeesIDForApt2(selectedNurse);
  const lastSelectedNurse = appointmentData?.selectedNurse;
  const lastSelectedMD = appointmentData?.selectedMD;
  const isChangeDate = (appointmentData?.date !== moment(date).toISOString()) || (appointmentData?.time !== moment(time).toISOString());
  try {
    const data = { selectedMDError: '', selectedNurseError: '' };
    if (((lastSelectedMD?.userId !== selectedMD?.userId && !!selectedMD?.userId) || isChangeDate) && dateCT && !_.isEmpty(attendeesMDId)) {
      const resMd = await fetchCheckExistenceAppointment({
        date: dateCT,
        attendees: attendeesMDId || [],
      });

      if (_.isEmpty(resMd) || resMd?.isCancel) {
        _.assign(data, { selectedMDError: '' });
      } else {
        _.assign(data, { selectedMDError: checkError(selectedMD, resMd.attendees) || '' });
      }
    }

    if (((lastSelectedNurse?.userId !== selectedNurse?.userId && !!selectedNurse?.userId) || isChangeDate) && dateCT && !_.isEmpty(attendeesNurseID)) {
      const resNurse = await fetchCheckExistenceAppointment({
        date: dateCT,
        attendees: attendeesNurseID || [],
      });

      if (_.isEmpty(resNurse) || resNurse?.isCancel) {
        _.assign(data, { selectedNurseError: '' });
      } else {
        _.assign(data, { selectedNurseError: checkError(selectedNurse, resNurse.attendees) || '' });
      }
    }
    return data;
  } catch (error) {
    consoleLog('Failed to check exist appointment: ', error);
    return {};
  }
};

export const handleFetchingPatientInfoMissing = async (carePlanId) => {
  try {
    const res = await fetchPatientInfoMissing({
      carePlanId,
    });
    return res?.missing || [];
  } catch (error) {
    consoleLog('Failed to fetch user data', error);
    return [];
  }
};

export const fetchingUsersAppointmentData = async (facilityId = '', isNurse = true, date = '', time = '', duration = '') => {
  const tempDate = moment(date).format('MM-DD-YY');
  const tempTime = moment(time).format('HH-mm');
  const dateCT = date && time ? moment(`${tempDate} ${tempTime}`, 'MM-DD-YY HH-mm').valueOf() : undefined;
  const sendingData = {
    filter: {
      facility: facilityId || undefined,
      roles: isNurse ? [CLINIC_TECHNICIAN] : [CLINIC_PHYSICIAN],
      duration,
      datetime: dateCT,
    },
    limit: 999,
  };
  try {
    const data = await fetchAvailableClinicUsers(sendingData);
    getUserAvatars(data);
    const formatData = formatUserData(data);
    return formatData;
  } catch (error) {
    consoleLog('Failed to fetch user data', error);
    return [];
  }
};

export const checkIsBelongTo = (attendees = []) => {
  const userId = auth.userId();
  let isDisabled = true;
  _.forEach(attendees, (x) => {
    if (x.userId === userId) {
      isDisabled = false;
    }
  });
  return isDisabled;
};

const APPONTMENT_DRAWER_TYPES = ['CREATE', 'EDIT', 'DISPLAY'];

export const initState = {
  current: APPONTMENT_DRAWER_TYPES[0],
  patientArray: [],
  patientId: '',
  selectedPatient: {},
  missingInfo: [],
  appointmentType: APPOINTMENT_TYPES[0],
  time: undefined,
  attendees: [],
  loading: false,
  isCancel: false,
  patientsLoading: false,
  status: '',
  selectedMD: {},
  selectedNurse: {},
  selectedMDError: '',
  selectedNurseError: '',
  nurseData: [],
  nurseId: '',
  physicianData: [],
  physicianId: '',

};
