import _ from 'lodash';
import moment from 'moment';
import momentBusiness from 'moment-business-days';
import { CAN_STOP_STATUSES, SUPPORT_STOP_PAUSE } from '../Constants';
import { SERVICE_TYPES, STUDY_STATUS, STUDY_TYPES_ENUMS } from '../Constants/carePlan';
import { getFullName } from '../Helpers';
import auth from '../Helpers/auth';
import { getFullNameId } from './patientsTable';


const {
  HOLTER,
} = STUDY_TYPES_ENUMS;


const {
  STANDARD_VALUE, STANDARD, BIODIRECT_VALUE, BIODIRECT,
} = SERVICE_TYPES;

export const formatStudyCategory = (serviceType = '') => {
  switch (serviceType) {
    case STANDARD_VALUE:
      return STANDARD;
    case BIODIRECT_VALUE:
      return BIODIRECT;
    default:
      return '';
  }
};
export const formatDuration = (x = 0) => parseInt(x / 24 / 60, 10);
const formatDurationString = (duration) => {
  const durationNum = formatDuration(duration);
  const durationString = `${durationNum} day${durationNum > 1 ? 's' : ''}`;
  return durationString;
};

const getStudyType = (prescribeStudies) => {
  const { studyType, followOnStudy } = prescribeStudies;
  if (followOnStudy?.studyType && studyType === 'HOLTER') {
    return 'HOLTER AND FOLLOW ON STUDY';
  }
  return studyType;
};

export const formatPrescribeStudies = (prescribeStudies = []) => {
  if (prescribeStudies.length === 0) {
    return [];
  }
  const userId = auth.userId();
  return _.map(prescribeStudies, prescribeStudy => ({
    carePlanId: prescribeStudy?.carePlan?._id,
    _id: prescribeStudy._id,
    patientName: getFullName(prescribeStudy?.carePlan?.patientDemographic),
    carePlanFid: prescribeStudy.carePlan?.friendlyId,
    studyType: getStudyType(prescribeStudy),
    nurseName: getFullNameId(prescribeStudy?.carePlan?.nurse, userId),
    medicalDoctorName: getFullNameId(prescribeStudy?.carePlan?.physician, userId),
    studyDuration: formatDurationString(prescribeStudy.initDuration),
    email: prescribeStudy?.carePlan?.patientDemographic?.email,
    patientId: prescribeStudy?.carePlan?.patient?._id,
    facilityName: prescribeStudy?.carePlan?.facility?.name || '',
    serviceType: formatStudyCategory(prescribeStudy.studyCategory),
    status: prescribeStudy?.carePlan?.status,
    // facilityNames: _.map(carePlan?.patient?.facilities || [], x => x.name),
    carePlanStatus: prescribeStudy.carePlan?.status,
    nameCreateBy: getFullNameId(prescribeStudy?.createdBy, userId),
    willDeletedAt: prescribeStudy?.carePlan?.patient?.willDeletedAt,
  }));
};

export const checkIsEOU = (study) => {
  if (_.isEmpty(study.reports)) return false;
  const { reports } = study;
  let flag = false;
  for (let i = 0; i < reports.length; i += 1) {
    const report = reports[i];
    if (report.type === 'Study' && report.status !== 'None' && !!report?.inbox?.date) {
      flag = true;
      break;
    }
  }
  return flag;
};

export const getStudyDuration = (start, stop) => {
  if (start && stop) {
    const duration = new Date(stop) - new Date(start);
    // const duration = moment(stop).valueOf() - moment(start).valueOf();
    // 86400000 ms per day
    const time = moment(stop).diff(start, 'seconds');
    const days = Math.floor(time / (60 * 60 * 24));
    const hours = Math.floor((time / (60 * 60)) % 24);
    const minutes = Math.floor((time / 60) % 60);

    const durationString = `${days}d ${`00${hours}h`.slice(-3)} ${`00${minutes}m`.slice(-3)}`;
    return durationString;
  }
  return 0;
};

export const getFullNameStudyId = (x, userID) => {
  if (x?.id === userID) {
    return `${x?.firstName || ''} ${x?.lastName || ''} (You)`;
  }
  return `${x?.firstName || ''} ${x?.lastName || ''}`;
};

export const formatCompletedStudies = (studies = []) => {
  if (studies.length === 0) {
    return [];
  }
  const userId = auth.userId();

  return _.map(studies, (study) => {
    const EOUReport = [];
    const { reports } = study;
    _.forEach(reports, (report) => {
      if (report.type === 'Study') {
        EOUReport.push(report);
      }
    });

    const EOUReportId = EOUReport && EOUReport?.length > 0 ? EOUReport[0]?.id : '';
    const isEOUReport = checkIsEOU(study);
    return {
      ...study,
      _id: study.id,
      studyFid: study.friendlyId,
      carePlanFId: study.carePlan?.friendlyId,
      carePlanId: study.carePlan?._id,
      patientName: getFullName(study?.carePlan?.patientDemographic),
      patientId: study.carePlan?.patient?._id,
      facilityName: study?.facility?.name || '',
      linkedStudies: study.linkedStudies,
      studyType: study.studyType,
      carePlanStatus: study.carePlan?.status,
      isFollowOn: study.linkedStudies?.length > 0 || !_.isEmpty(study.info?.followOnStudy),
      studyDuration: formatDurationString(study.initDuration),
      serviceType: study.isBiofluxDirect ? BIODIRECT : STANDARD,
      isEOUReport,
      referringPhysician: study.info?.referringPhysician || {},
      interprettingPhysician: study.info?.interprettingPhysician || {},
      secondaryContact: study.info?.patient?.secondaryContact,
      stopTime: study.stop ? moment(study.stop).format('MM/DD/YYYY, hh:mm:ss A') : '--',
      actualStudyDuration: study?.start && study?.stop ? getStudyDuration(study.start, study.stop) : '--',
      reportDueDate: study.reportDueDate,
      EOUReportId: isEOUReport ? EOUReportId : '',
      nurseName: getFullNameStudyId(study?.info?.technician, userId),
      medicalDoctorName: getFullNameId(study?.info?.interprettingPhysician, userId),
      willDeletedAt: study?.carePlan?.patient?.willDeletedAt,
    };
  });
};


export const calculateStudyProgress = (study) => {
  const { start, lastStudyHistory } = study || {};
  if (!start) {
    return 0;
  }
  if (lastStudyHistory?.status === 'Starting') {
    return 0;
  }

  if (lastStudyHistory?.status === 'Draft') {
    return 0;
  }

  const progressStatues = ['Started', 'Paused', 'Resumed'];
  if (lastStudyHistory && _.includes(progressStatues, lastStudyHistory?.status)) {
    const { stop } = study;
    const duration = new Date(stop) - new Date(start);
    const startDate = new Date(start);
    let progress = Math.round(((new Date() - startDate) / duration) * 100);
    progress = progress > 100 ? 100 : progress < 0 ? 0 : progress;
    return progress;
  }
  return 100;
};


export const formatActiveStudies = (studies = []) => {
  if (studies.length === 0) {
    return [];
  }

  return _.map(studies, study => ({
    ...study,
    _id: study.id,
    studyId: study.friendlyId,
    carePlanFId: study.carePlan?.friendlyId,
    carePlanId: study.carePlan?._id,
    patientName: getFullName(study?.carePlan?.patientDemographic),
    patientId: study.carePlan?.patient?._id,
    facilityName: study?.facility?.name || '',
    linkedStudies: study.linkedStudies,
    studyType: study.studyType,
    isFollowOn: study.linkedStudies?.length > 0 || !_.isEmpty(study.info?.followOnStudy),
    studyDuration: formatDurationString(study.initDuration),
    studyDurationNum: formatDuration(study.initDuration),
    serviceType: study.isBiofluxDirect ? BIODIRECT : STANDARD,
    isBiofluxDirect: study.isBiofluxDirect,
    lastEvaluationEvent: study.lastEvaluationEvent,
    biofluxDirect: study.isBiofluxDirect,
    artifact: study.artifact,
    patient: study.info?.patient,
    start: study.start,
    stop: study.stop,
    timezone: study.timezone,
    ecgUploadProgress: study.ecgUploadProgress,
    // studyType,
    // linkedStudies,
    // followOnStudy,
    status: study?.status,
    carePlanStatus: study.carePlan?.status,
    lastStudyHistory: study.lastStudyHistory,
    progress: calculateStudyProgress(study),
    reportDueDate: study.reportDueDate,
    duration: study.initDuration,
    studyFid: study.friendlyId,
    device: study.device,
    facility: study.facility,
    referringPhysician: study.info?.referringPhysician || {},
    interprettingPhysician: study.info?.interprettingPhysician || {},
    secondaryContact: study.info?.patient?.secondaryContact,
    // facilityNames: _.map(carePlan?.patient?.facilities || [], x => x.name),
  }));
};

const checkStopStudy = (arraySupportStopPause, fwVersion) => {
  const element = _.find(arraySupportStopPause, x => fwVersion?.indexOf(x) >= 0);
  return !!element;
};

export const isCheckCanStopStudy = (study) => {
  const { device, lastStudyHistory, status } = study || {};
  if (status !== STUDY_STATUS.ONGOING) {
    return true;
  }
  // if (auth.isMD()) {
  //   return true;
  // }
  const canStop = device?.status !== 'Offline'
    && (CAN_STOP_STATUSES.includes(lastStudyHistory?.status)
      || (lastStudyHistory?.status === STUDY_STATUS.PAUSED
        && checkStopStudy(SUPPORT_STOP_PAUSE, device?.lastSync?.fwVersion?.trim()))
    );
  return !canStop;
};
