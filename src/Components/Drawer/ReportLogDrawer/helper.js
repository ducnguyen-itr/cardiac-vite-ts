import _ from 'lodash';
import moment from 'moment';
import fetchEventLogs from '../../../Apollo/Functions/Fetch/fetchEventLogs';
import { USER_ROLE } from '../../../Constants/carePlanData';
import { getFullName } from '../../../Helpers';
import consoleLog from '../../../Helpers/consoleLog';

const getContentReportLog = (data, depend = {}) => {
  const {
    isReviwed, isPhysicianInterpretation, isNurseInterpretation, isSign,
  } = depend || {};
  const logerName = getFullName(data?.loggedBy);
  const { roles } = data?.loggedBy || {};

  const isNurse = roles?.includes(USER_ROLE.NURSE);
  const { oldProperties, newProperties } = data;

  if (isPhysicianInterpretation) {
    if ((newProperties?.isModifyCarePlan || oldProperties?.isModifyCarePlan)
      && oldProperties?.isModifyCarePlan !== newProperties?.isModifyCarePlan) {
      return `${logerName} added ${isNurse ? 'clinician comments.' : 'physician interpretation.'}`;
    }
    if ((newProperties?.physicianInterpretation || oldProperties?.physicianInterpretation)
      && oldProperties?.physicianInterpretation !== newProperties?.physicianInterpretation) {
      return `${logerName} added ${isNurse ? 'clinician comments.' : 'physician interpretation.'}`;
    }
  }
  if (isSign) {
    return `${logerName} added physician signature.`;
  }

  if (isNurseInterpretation) {
    if ((newProperties?.nurseInterpretation || oldProperties?.nurseInterpretation)
      && oldProperties?.nurseInterpretation !== newProperties?.nurseInterpretation) {
      return `${logerName} added ${isNurse ? 'clinician comments.' : 'physician interpretation.'}`;
    }
  }

  if (newProperties?.isReviewed && newProperties?.isReviewed !== oldProperties?.isReviewed) {
    return `${logerName} marked the report as reviewed.`;
  }
  if (!_.isNil(newProperties?.isReviewed) && !newProperties?.isReviewed && newProperties?.isReviewed !== oldProperties?.isReviewed) {
    return `${logerName} marked the report as unreviewed.`;
  }
  if (isReviwed) {
    if ((oldProperties?.nurseStatus === 'Reviewed' && newProperties?.nurseStatus === 'Read')
      || (oldProperties?.physicianStatus === 'Reviewed' && newProperties?.physicianStatus === 'Read')) {
      return `${logerName} marked the report as unreviewed.`;
    }
    if (newProperties?.nurseStatus === 'Reviewed' || newProperties?.physicianStatus === 'Reviewed') {
      return `${logerName} marked the report as reviewed.`;
    }
  }

  if ((oldProperties?.nurseStatus === 'Reviewed' && newProperties?.nurseStatus === 'Read')
    || (oldProperties?.physicianStatus === 'Reviewed' && newProperties?.physicianStatus === 'Read')) {
    return `${logerName} marked the report as unreviewed.`;
  }

  if ((newProperties?.nurseStatus === 'Reviewed')
    || (newProperties?.physicianStatus === 'Reviewed')) {
    return `${logerName} marked the report as reviewed.`;
  }

  if (newProperties?.nurseStatus === 'Sent' && oldProperties?.nurseStatus !== 'Sent') {
    return `${logerName} sent the report to the physician.`;
  }

  if ((oldProperties?.nurseStatus === 'New' && newProperties?.nurseStatus === 'Read')
    || (oldProperties?.physicianStatus === 'New' && newProperties?.physicianStatus === 'Read')) {
    return `${logerName} marked the report as read.`;
  }

  if ((newProperties?.nurseInterpretation || oldProperties?.nurseInterpretation)
    && oldProperties?.nurseInterpretation !== newProperties?.nurseInterpretation) {
    return `${logerName} added clinician comments.`;
  }

  if ((newProperties?.physicianInterpretation || oldProperties?.physicianInterpretation)
    && oldProperties?.physicianInterpretation !== newProperties?.physicianInterpretation) {
    return `${logerName} added physician interpretation.`;
  }

  if (newProperties?.isModifyCarePlan !== oldProperties?.isModifyCarePlan) {
    return `${logerName} added physician interpretation.`;
  }

  if ((newProperties?.reportStatus || oldProperties?.reportStatus)
    && (oldProperties?.reportStatus === 'Generated' || oldProperties?.reportStatus === 'None') && newProperties?.reportStatus === 'Generating') {
    return `${logerName} re-generated the report.`;
  }

  if (newProperties?.type === 'OnDemand' && !oldProperties) {
    return `${logerName} generated the report.`;
  }

  if (newProperties?.isSign) {
    return `${logerName} added physician signature.`;
  }

  return '';
};

const checkIsMultiUpdate = (x) => {
  const { newProperties, oldProperties } = x || {};


  if (!_.isNil(newProperties?.isReviewed) && newProperties?.isReviewed !== oldProperties?.isReviewed && newProperties?.isSign
    && ((!_.isNil(newProperties?.physicianInterpretation) && newProperties?.physicianInterpretation !== oldProperties?.physicianInterpretation)
      || (!_.isNil(newProperties?.isModifyCarePlan) && newProperties?.isModifyCarePlan !== oldProperties?.isModifyCarePlan))) {
    return {
      isUpdateMultil: true, isReviwed: true, isPhysicianInterpretation: true, isSign: true,
    };
  }

  if (!_.isNil(newProperties?.isReviewed) && newProperties?.isReviewed !== oldProperties?.isReviewed
    && ((!_.isNil(newProperties?.physicianInterpretation) && newProperties?.physicianInterpretation !== oldProperties?.physicianInterpretation)
      || (!_.isNil(newProperties?.isModifyCarePlan) && newProperties?.isModifyCarePlan !== oldProperties?.isModifyCarePlan))) {
    return {
      isUpdateMultil: true, isReviwed: true, isPhysicianInterpretation: true,
    };
  }

  if (newProperties?.isReviewed !== oldProperties?.isReviewed && !_.isNil(newProperties?.isReviewed)
    && !_.isNil(newProperties?.nurseInterpretation) && newProperties?.nurseInterpretation !== oldProperties?.nurseInterpretation) {
    return { isUpdateMultil: true, isReviwed: true, isNurseInterpretation: true };
  }

  if (newProperties?.physicianStatus && newProperties?.physicianStatus !== oldProperties?.physicianStatus && newProperties?.isSign
    && ((newProperties?.physicianInterpretation !== oldProperties?.physicianInterpretation && !_.isNil(newProperties?.physicianInterpretation))
      || (!_.isNil(newProperties?.isModifyCarePlan) && newProperties?.isModifyCarePlan !== oldProperties?.isModifyCarePlan))) {
    return {
      isUpdateMultil: true, isReviwed: true, isPhysicianInterpretation: true, isSign: true,
    };
  }

  if (newProperties?.nurseStatus && oldProperties?.nurseStatus && newProperties?.nurseStatus !== oldProperties?.nurseStatus
    && !_.isNil(newProperties?.nurseInterpretation) && newProperties?.nurseInterpretation !== oldProperties?.nurseInterpretation) {
    return { isUpdateMultil: true, isReviwed: true, isNurseInterpretation: true };
  }

  if (newProperties?.physicianStatus && oldProperties?.physicianStatus && newProperties?.physicianStatus !== oldProperties?.physicianStatus
    && !_.isNil(newProperties?.physicianInterpretation) && newProperties?.physicianInterpretation !== oldProperties?.physicianInterpretation) {
    return { isUpdateMultil: true, isReviwed: true, isPhysicianInterpretation: true };
  }

  if (newProperties?.isSign && !_.isNil(newProperties?.physicianInterpretation)
    && newProperties?.physicianInterpretation !== oldProperties?.physicianInterpretation) {
    return { isUpdateMultil: true, isSign: true, isPhysicianInterpretation: true };
  }

  if (newProperties?.physicianStatus && oldProperties?.physicianStatus && newProperties?.physicianStatus !== oldProperties?.physicianStatus
    && _.isNil(newProperties?.isModifyCarePlan) && newProperties?.isModifyCarePlan !== oldProperties?.isModifyCarePlan) {
    return { isUpdateMultil: true, isReviwed: true, isPhysicianInterpretation: true };
  }

  if (newProperties?.nurseStatus && oldProperties?.nurseStatus && newProperties?.nurseStatus !== oldProperties?.nurseStatus
    && newProperties?.nurseInterpretation && newProperties?.nurseInterpretation !== oldProperties?.nurseInterpretation) {
    return { isUpdateMultil: true, isReviwed: true, isNurseInterpretation: true };
  }

  if (newProperties?.isSign && !_.isNil(newProperties?.isModifyCarePlan) && newProperties?.isModifyCarePlan !== oldProperties?.isModifyCarePlan) {
    return { isUpdateMultil: true, isSign: true, isPhysicianInterpretation: true };
  }

  return {
    isUpdateMultil: false, isReviwed: false, isPhysicianInterpretation: false, isNurseInterpretation: false, isSign: false,
  };
};

const getContentBiofluxReport = (data) => {
  const { newProperties, oldProperties } = data || {};
  const logerName = getFullName(data?.loggedBy);
  if (newProperties?.status || newProperties?.isReviwed) {
    return `${logerName} marked the report as reviewed.`;
  }
  if (!newProperties?.status) {
    return `${logerName} marked the report as unreviewed.`;
  }
  return '';
};

const getContentBioheartReport = (data = {}) => {
  const { newProperties, oldProperties, loggedBy } = data || {};
  const logerName = getFullName(loggedBy);
  if (newProperties?.status === 'Reviewed') {
    return `${logerName} marked the report as reviewed.`;
  }
  if (oldProperties?.status === 'Reviewed' && newProperties?.status === 'Read') {
    return `${logerName} marked the report as unreviewed.`;
  }
  return '';
};

export const formatReportHistory = (data = []) => {
  const formatData = [];
  _.forEach(data, (x) => {
    if (x.type === 'Report') {
      const {
        isUpdateMultil, isReviwed, isPhysicianInterpretation, isNurseInterpretation, isSign,
      } = checkIsMultiUpdate(x);
      if (isUpdateMultil) {
        if (isReviwed) {
          formatData.push({
            data: getContentReportLog(x, { isReviwed }),
            title: moment(x?.createdAt).format('MM/DD/YYYY, hh:mm A'),
          });
        }
        if (isSign) {
          formatData.push({
            data: getContentReportLog(x, { isSign }),
            title: moment(x?.createdAt).format('MM/DD/YYYY, hh:mm A'),
          });
        }
        if (isPhysicianInterpretation) {
          formatData.push({
            data: getContentReportLog(x, { isPhysicianInterpretation }),
            title: moment(x?.createdAt).format('MM/DD/YYYY, hh:mm A'),
          });
        }
        if (isNurseInterpretation) {
          formatData.push({
            data: getContentReportLog(x, { isNurseInterpretation }),
            title: moment(x?.createdAt).format('MM/DD/YYYY, hh:mm A'),
          });
        }
        return;
      }
      formatData.push({
        data: getContentReportLog(x),
        title: moment(x?.createdAt).format('MM/DD/YYYY, hh:mm A'),
      });
    }

    if (x.type === 'BiofluxReport') {
      formatData.push({
        data: getContentBiofluxReport(x),
        title: moment(x?.createdAt).format('MM/DD/YYYY, hh:mm A'),
      });
    }
    if (x.type === 'BioheartReport') {
      formatData.push({
        data: getContentBioheartReport(x),
        title: moment(x?.createdAt).format('MM/DD/YYYY, hh:mm A'),
      });
    }
  });
  return formatData;
};

export const fetchReportHistory = async (sendingData = {}) => {
  try {
    const data = await fetchEventLogs(sendingData);
    const formatedData = formatReportHistory(data);
    return formatedData;
  } catch (error) {
    consoleLog(error);
    return [];
  }
};
