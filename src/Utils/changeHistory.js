import _ from 'lodash';
import moment from 'moment';
import { zeroPad } from '.';
import fetchUser from '../Apollo/Functions/Fetch/fetchUser';
import {
  BASELINE_INFO_FILEDS, CHANGE_HISTORY_NAME, CHANGE_HISTORY_TYPE, OVERVIEW_FIELDS, REPORT_SETTINGS_FIELDS,
} from '../Constants/changeHistory';
import { RISK_ASSESSMENT_TITLE, RISK_ASSESSMENT_TYPE } from '../Constants/medicalRecord';
import consoleLog from '../Helpers/consoleLog';
import { getBillStatusEnum } from '../Pages/Billing/helper';

const newMapTitleContent = (valueData = {}, valueData2 = {}, mapData = []) => {
  const content = [];
  if (!_.isEmpty(valueData)) {
    _.forEach(Object.keys(valueData), (x) => {
      const item = mapData[x];
      if (item) {
        content.push(item);
      }
    });
  }
  if (!_.isEmpty(valueData2)) {
    _.forEach(Object.keys(valueData2), (x) => {
      const item = mapData[x];
      if (item) {
        content.push(item);
      }
    });
  }
  return _.uniq(content);
};

const checkReportSettingChange = (oldData, newData) => {
  const {
    maxBloodPressureDenominator,
    maxBloodPressureNumerator,
    maxOxygenSaturation,
    minBloodPressureDenominator,
    minBloodPressureNumerator,
    minOxygenSaturation,
  } = oldData || {};

  if (!_.isEqual(maxBloodPressureDenominator, newData?.maxBloodPressureDenominator)) {
    return true;
  }
  if (!_.isEqual(maxBloodPressureNumerator, newData?.maxBloodPressureNumerator)) {
    return true;
  }
  if (!_.isEqual(maxOxygenSaturation, newData?.maxOxygenSaturation)) {
    return true;
  }
  if (!_.isEqual(minBloodPressureDenominator, newData?.minBloodPressureDenominator)) {
    return true;
  }
  if (!_.isEqual(minBloodPressureNumerator, newData?.minBloodPressureNumerator)) {
    return true;
  }
  if (!_.isEqual(minOxygenSaturation, newData?.minOxygenSaturation)) {
    return true;
  }
  return false;
};

const mapOverviewContent = (oldProperties = {}, newProperties = {}) => {
  const content = [];

  if (newProperties?.programType && !_.isEqual(oldProperties?.programType, newProperties?.programType)) {
    content.push(OVERVIEW_FIELDS.programType);
  }

  if (checkReportSettingChange(oldProperties, newProperties)) {
    content.push(OVERVIEW_FIELDS.reportSetting);
  }
  if (!_.isEqual(oldProperties?.frequencyOfBloodTest, newProperties?.frequencyOfBloodTest)) {
    content.push(OVERVIEW_FIELDS.frequencyOfBloodTest);
  }
  if (!_.isEqual(oldProperties?.nextBloodTest, newProperties?.nextBloodTest)) {
    content.push(OVERVIEW_FIELDS.nextBloodTest);
  }
  if (!_.isEmpty(newProperties?.typesOfBloodTests)) {
    if (!_.isEqual(oldProperties?.typesOfBloodTests, newProperties?.typesOfBloodTests)) {
      content.push(OVERVIEW_FIELDS.typesOfBloodTests);
    }
  }
  if (!_.isEqual(oldProperties?.timeUnitOfBloodTest, newProperties?.timeUnitOfBloodTest)) {
    content.push(OVERVIEW_FIELDS.timeUnitOfBloodTest);
  }
  if (!_.isEqual(oldProperties?.frequencyOfStressTest, newProperties?.frequencyOfStressTest)) {
    content.push(OVERVIEW_FIELDS.frequencyOfStressTest);
  }
  if (!_.isEqual(oldProperties?.nextStressTest, newProperties?.nextStressTest)) {
    content.push(OVERVIEW_FIELDS.nextStressTest);
  }
  if (!_.isEqual(oldProperties?.timeUnitOfStressTest, newProperties?.timeUnitOfStressTest)) {
    content.push(OVERVIEW_FIELDS.timeUnitOfStressTest);
  }
  if (!_.isEqual(oldProperties?.followSchedule, newProperties?.followSchedule)) {
    content.push(OVERVIEW_FIELDS.followSchedule);
  }
  if (!_.isEqual(oldProperties?.frequencyOfFollowUp, newProperties?.frequencyOfFollowUp)
    || !_.isEqual(oldProperties?.nextDueOnFollowUp, newProperties?.nextDueOnFollowUp)) {
    content.push(OVERVIEW_FIELDS.followSchedule);
  }
  if (!_.isEqual(oldProperties?.notes, newProperties?.notes) && !_.isNil(oldProperties)) {
    content.push(OVERVIEW_FIELDS.notes);
  }
  if (!_.isNil(newProperties?.isReportAccessNurse) && !_.isEqual(oldProperties?.isReportAccessNurse, newProperties?.isReportAccessNurse)) {
    content.push(REPORT_SETTINGS_FIELDS.isReportAccessNurse);
  }
  return _.uniq(content);
};

const getUserName = async (userId = '') => {
  if (!userId) return '';
  try {
    const user = await fetchUser({ _id: userId }, 2);
    if (_.isEmpty(user)) return '';
    return `${user?.firstName} ${user?.lastName}`;
  } catch (error) {
    consoleLog(error);
    return '';
  }
};

const getContentDiagnosis = data => [`${data?.code ? `${data?.code} ` : ''}${data?.description || ''}`];
const getContentPastMedicalHis = data => [`${data?.code ? `${data?.code} ` : ''}${data?.description || ''}`];

const getContentRiskAssessment = (data) => {
  const content = [];
  let title = '';
  _.forEach(Object.keys(data), (key) => {
    switch (key) {
      case RISK_ASSESSMENT_TYPE.CHA2DS2VASC:
        content.push(RISK_ASSESSMENT_TITLE.CHA2DS2VASC);
        break;
      case RISK_ASSESSMENT_TYPE.HAS_BLED:
        content.push(RISK_ASSESSMENT_TITLE.HAS_BLED);
        break;
      case RISK_ASSESSMENT_TYPE.FRS:
        content.push(RISK_ASSESSMENT_TITLE.FRS);
        break;
      case RISK_ASSESSMENT_TYPE.EHRA:
        content.push(RISK_ASSESSMENT_TITLE.EHRA);
        break;
      default:
        break;
    }
    if (_.isNil(data[key])) {
      title = 'Cardiac risk assessment deleted';
    } else {
      title = 'Cardiac risk assessment updated ';
    }
  });
  return { riskContent: content, riskTitle: title };
};

const getContentMedicalTestResult = (data = {}) => {
  const { date, title } = data || {};
  return [`${title}, ${moment(date).format('MM/DD/YYYY')}`];
};

const getContentBaselineInfo = (oldProperties = {}, newProperties = {}) => {
  const content = [];

  if (!_.isEqual(oldProperties?.baselineInfo?.atRiskConditions, newProperties?.baselineInfo?.atRiskConditions)
    || !_.isEqual(oldProperties?.baselineInfo?.notesAtRiskConditions, newProperties?.baselineInfo?.notesAtRiskConditions)
    || !_.isEqual(oldProperties?.baselineInfo?.diagnosedConditions, newProperties?.baselineInfo?.diagnosedConditions)
  ) {
    content.push(BASELINE_INFO_FILEDS.cardiacConditions);
  }
  if (!_.isEqual(oldProperties?.baselineInfo?.cha2ds2vasc, newProperties?.baselineInfo?.cha2ds2vasc)) {
    content.push(BASELINE_INFO_FILEDS.cha2ds2vasc);
  }
  if (oldProperties?.baselineInfo?.echocardiogramDate !== newProperties?.baselineInfo?.echocardiogramDate
    || oldProperties?.baselineInfo?.echocardiogramLVEF !== newProperties?.baselineInfo?.echocardiogramLVEF) {
    content.push(BASELINE_INFO_FILEDS.Echocardiogram);
  }
  if (!_.isEqual(oldProperties?.baselineInfo?.hasBled, newProperties?.baselineInfo?.hasBled)) {
    content.push(BASELINE_INFO_FILEDS.hasBled);
  }
  if (!_.isEqual(oldProperties?.baselineInfo?.frs, newProperties?.baselineInfo?.frs)) {
    content.push(BASELINE_INFO_FILEDS.frs);
  }
  if (!_.isEqual(oldProperties?.baselineInfo?.ehra, newProperties?.baselineInfo?.ehra)) {
    content.push(BASELINE_INFO_FILEDS.ehra);
  }

  if (!_.isEqual(oldProperties?.CBC, newProperties?.CBC)) {
    content.push(BASELINE_INFO_FILEDS.CBC);
  }
  if (!_.isEqual(oldProperties?.Liver, newProperties?.Liver)) {
    content.push(BASELINE_INFO_FILEDS.Liver);
  }
  if (!_.isEqual(oldProperties?.LeadECG, newProperties?.LeadECG)) {
    content.push(BASELINE_INFO_FILEDS.LeadECG);
  }
  if (!_.isEqual(oldProperties?.Stress, newProperties?.Stress)) {
    content.push(BASELINE_INFO_FILEDS.Stress);
  }
  return _.uniq(content);
};

const getMedicationName = (medicaions) => {
  const names = [];
  _.forEach(medicaions, (x) => {
    names.push(`• ${x.name}`);
  });
  return names;
};

const getPatientDemographicContent = (newProperties = {}, oldProperties = {}) => {
  const content = [];
  if (!_.isEqual(newProperties?.email, oldProperties?.email)) {
    content.push('Email');
  }
  if (!_.isEqual(newProperties?.firstName, oldProperties?.firstName)) {
    content.push('First name');
  }
  if (!_.isEqual(newProperties?.lastName, oldProperties?.lastName)) {
    content.push('Last name');
  }
  if (!_.isEqual(newProperties?.gender, oldProperties?.gender)) {
    content.push('Gender');
  }
  if (!_.isEqual(newProperties?.dateOfBirth, oldProperties?.dateOfBirth)) {
    content.push('Date of birth');
  }
  if (!_.isEqual(newProperties?.height, oldProperties?.height)) {
    content.push('Height');
  }
  if (!_.isEqual(newProperties?.weight, oldProperties?.weight)) {
    content.push('Weight');
  }
  if (!_.isEqual(newProperties?.contact?.phone1, oldProperties?.contact?.phone1)) {
    content.push('Mobile phone number');
  }
  if (!_.isEqual(newProperties?.contact?.emergencyPhone, oldProperties?.contact?.emergencyPhone)) {
    content.push('Emergency phone number');
  }
  if (!_.isEqual(newProperties?.contact?.homePhone, oldProperties?.contact?.homePhone)) {
    content.push('Home phone number');
  }
  if (!_.isEqual(newProperties?.contactMethod, oldProperties?.contactMethod)) {
    content.push('Preferred contact method');
  }
  if (!_.isEqual(newProperties?.contact?.country, oldProperties?.contact?.country)) {
    content.push('Country');
    content.push('Address');
  }
  if (!_.isEqual(newProperties?.contact?.address, oldProperties?.contact?.address)
    || !_.isEqual(newProperties?.contact?.city, oldProperties?.contact?.city)
    || !_.isEqual(newProperties?.contact?.stateCode, oldProperties?.contact?.stateCode)
    || !_.isEqual(newProperties?.contact?.zip, oldProperties?.contact?.zip)) {
    content.push('Address');
  }
  if (!_.isEqual(newProperties?.patientInfo, oldProperties?.patientInfo)) {
    content.push('Insurance');
  }
  return _.uniq(content);
};

const getInitialIntakeConten = (newProperties = {}, oldProperties = {}) => {
  const content = [];
  if (!_.isEqual(newProperties?.afibHistory, oldProperties?.afibHistory)) {
    content.push('General cardiac history');
  }
  if (!_.isEqual(newProperties?.allergies, oldProperties?.allergies)) {
    content.push('Allergies');
  }
  return _.uniq(content);
};

const getSuperBillContent = (newProperties = {}, oldProperties = {}) => {
  if (!newProperties || _.isEmpty(newProperties)) return '';
  const isChangeStatus = oldProperties?.foundBill?.status && newProperties?.status && oldProperties?.foundBill?.status !== newProperties?.status;
  const { friendlyId, billFid, status } = newProperties || {};
  const billStatus = getBillStatusEnum(status);
  const content = billFid ? `Bill ${zeroPad(billFid, 5)}${isChangeStatus ? `: ${billStatus?.label || ''}` : ''}` : `Bill ${zeroPad(friendlyId, 5)}${isChangeStatus ? `: ${billStatus?.label || ''}` : ''}`;
  return [content];
};

const a = {
  Biokit: {
    status: 'Enable',
  },
  'Blood pressure cuff': {
    status: 'Enable',
    deviceId: '3',
  },
  Thermometer: {
    status: 'Enable',
    deviceId: '3',
    setUpDate: '2023-03-01T00:00:00.000Z',
  },
  'Pulse oximeter': {
    status: 'Enable',
    deviceId: '1521120083',
    setUpDate: '2023-03-01T00:00:00.000Z',
  },
};

const getFirstText = (config) => {
  const { newData, oldData } = config || {};
  if (newData === true && newData !== oldData) {
    return 'Add ';
  }
  if (newData === false && newData !== oldData) {
    return 'Remove ';
  }
  if (newData === oldData) {
    return 'Update ';
  }
  return '';
};
const getFirstTextStatus = (config) => {
  const { newData, oldData } = config || {};
  if (newData === 'Enable' && newData !== oldData) {
    return 'Add ';
  }
  if (newData === 'Disable' && newData !== oldData) {
    return 'Remove ';
  }
  if (newData === oldData) {
    return 'Update ';
  }
  return '';
};

const getDeviceInfoUpdate = ({ newData, oldData, isAdd }) => {
  // const isAdd = _.isNil(oldData); // BE said if dont have oldData is Add
  const content = [];
  _.forEach(Object.keys(newData), (key) => {
    const item = newData[key];
    const oldItem = oldData?.[key];
    if (key === 'reportSetting') {
      content.push('Report settings');
      return;
    }
    if (!_.isEqual(item, oldItem)) {
      const firstText = key === 'bioheartMonitor'
        ? getFirstText({ newData: item?.isEnabled, oldData: oldItem?.isEnabled })
        : getFirstTextStatus({ newData: item?.status, oldData: oldItem?.status });
      content.push(`${isAdd ? '' : firstText}${key === 'bioheartMonitor' ? 'Bioheart' : key}${item.deviceId ? ` (${item.deviceId})` : ''}${item.setUpDate
        ? `, ${moment(item.setUpDate).format('MM/DD/YYYY')}` : ''}`);
    }
  });
  return { content, title: isAdd ? 'Devices added' : 'Devices updated' };
};
// Report settings
const newFormatTitleContent = async ({
  oldProperties = {}, newProperties = {}, comment, createdAt, loggedBy, _id, type,
}) => {
  if (!type) return {};
  let title = '';
  let content = [];
  switch (type) {
    case CHANGE_HISTORY_TYPE.CarePlanOverviewUpdate:
      title = CHANGE_HISTORY_NAME.CarePlanOverviewUpdate;
      content = mapOverviewContent(oldProperties, newProperties);
      break;
    case CHANGE_HISTORY_TYPE.CarePlanOverviewAdded:
      title = CHANGE_HISTORY_NAME.CarePlanOverviewAdded;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.InitialContactInfoUpdated:
      title = CHANGE_HISTORY_NAME.InitialContactInfoUpdated;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.PrescriptionAdded: {
      content = { isArray: true, contentData: [] };

      title = CHANGE_HISTORY_NAME.PrescriptionAdded;
      const addMedicaionName = getMedicationName(newProperties?.medications);
      if (!_.isEmpty(addMedicaionName)) {
        content.contentData.push({
          data: addMedicaionName,
          name: 'Add',
        });
      }
    }
      break;
    case CHANGE_HISTORY_TYPE.PrescriptionUpdated:
      title = CHANGE_HISTORY_NAME.PrescriptionUpdated;
      content = { isArray: true, contentData: [] };
      if (!_.isEmpty(newProperties?.medications)) {
        const addMedication = _.filter(newProperties?.medications, x => x.action === 'Add');
        const prscribeMedication = _.filter(newProperties?.medications, x => x.action === 'Prescribe');
        const updateMedication = _.filter(newProperties?.medications, x => x.action === 'Update');
        const archiveMedication = _.filter(newProperties?.medications, x => x.action === 'Archive');
        const addMedicaionName = getMedicationName(addMedication);
        const prscribeMedicaionName = getMedicationName(prscribeMedication);
        const updateMedicaionName = getMedicationName(updateMedication);
        const archiveMedicaionName = getMedicationName(archiveMedication);
        if (!_.isEmpty(addMedicaionName)) {
          content.contentData.push({
            data: addMedicaionName,
            name: 'Add',
          });
        }
        if (!_.isEmpty(prscribeMedicaionName)) {
          content.contentData.push({
            data: prscribeMedicaionName,
            name: 'Prescribe',
          });
        }
        if (!_.isEmpty(updateMedicaionName)) {
          content.contentData.push({
            data: updateMedicaionName,
            name: 'Update',
          });
        }
        if (!_.isEmpty(archiveMedicaionName)) {
          content.contentData.push({
            data: archiveMedicaionName,
            name: 'Archive',
          });
        }
      }
      break;
    case CHANGE_HISTORY_TYPE.MedicationsDeleted:
      title = CHANGE_HISTORY_NAME.MedicationsDeleted;
      content = [`${oldProperties?.name}`];
      break;

    case CHANGE_HISTORY_TYPE.PatientDemographicUpdated:
      title = CHANGE_HISTORY_NAME.PatientDemographicUpdated;
      content = getPatientDemographicContent(newProperties, oldProperties);
      break;

    case CHANGE_HISTORY_TYPE.MedicalTestResultAdded:
      title = CHANGE_HISTORY_NAME.MedicalTestResultAdded;
      content = getContentMedicalTestResult(newProperties);
      break;
    case CHANGE_HISTORY_TYPE.MedicalTestResultUpdate:
      title = CHANGE_HISTORY_NAME.MedicalTestResultUpdate;
      content = getContentMedicalTestResult(newProperties);
      break;
    case CHANGE_HISTORY_TYPE.InitialIntakeInfoUpdate:
      title = CHANGE_HISTORY_NAME.InitialIntakeInfoUpdate;
      content = getInitialIntakeConten(newProperties, oldProperties);
      break;
    case CHANGE_HISTORY_TYPE.InitialIntakeInfoAdded:
      title = CHANGE_HISTORY_NAME.InitialIntakeInfoAdded;
      content = getInitialIntakeConten(newProperties, oldProperties);
      break;
    case CHANGE_HISTORY_TYPE.BaselineInfoUpdate:
      title = CHANGE_HISTORY_NAME.BaselineInfoUpdate;
      content = getContentBaselineInfo(oldProperties, newProperties);
      break;
    case CHANGE_HISTORY_TYPE.BaselineInfoAdded:
      title = CHANGE_HISTORY_NAME.BaselineInfoAdded;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.DiagnosisAdded:
      title = CHANGE_HISTORY_NAME.DiagnosisAdded;
      content = getContentDiagnosis(newProperties);
      break;
    case CHANGE_HISTORY_TYPE.DiagnosisUpdated:
      title = CHANGE_HISTORY_NAME.DiagnosisUpdated;
      content = getContentDiagnosis(newProperties);
      break;
    case CHANGE_HISTORY_TYPE.DiagnosisDeleted:
      title = CHANGE_HISTORY_NAME.DiagnosisDeleted;
      content = getContentDiagnosis(oldProperties);
      break;
    case CHANGE_HISTORY_TYPE.PastMedicalHistoryAdded:
      title = CHANGE_HISTORY_NAME.PastMedicalHistoryAdded;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.PastMedicalHistoryUpdated:
      title = CHANGE_HISTORY_NAME.PastMedicalHistoryUpdated;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.CardiacRiskAssessmentAdded: {
      const { riskContent } = getContentRiskAssessment(newProperties);
      title = CHANGE_HISTORY_NAME.CardiacRiskAssessmentAdded;
      content = riskContent;
      break;
    }
    case CHANGE_HISTORY_TYPE.CardiacRiskAssessmentUpdated: {
      const { riskContent, riskTitle } = getContentRiskAssessment(newProperties);
      title = riskTitle;
      content = riskContent;
      break;
    }
    case CHANGE_HISTORY_TYPE.AllergiesUpdated:
      title = CHANGE_HISTORY_NAME.AllergiesUpdated;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.AllergiesAdded:
      title = CHANGE_HISTORY_NAME.AllergiesAdded;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.CarePlanDeleted:
      title = CHANGE_HISTORY_NAME.CarePlanDeleted;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.CarePlanRestore:
      title = CHANGE_HISTORY_NAME.CarePlanRestore;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.AddQoL:
      title = CHANGE_HISTORY_NAME.AddQoL;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.CarePlanReactive:
      title = CHANGE_HISTORY_NAME.CarePlanReactive;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.UpdatedQoL:
      title = CHANGE_HISTORY_NAME.UpdatedQoL;
      content = [];
      break;

    case CHANGE_HISTORY_TYPE.UploadConsent:
      title = CHANGE_HISTORY_NAME.UploadConsent;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.CCMConsentUpdated: {
      const isAdded = newProperties?.attachments?.[0]?.action === 'Added';
      const isRPM = isAdded ? newProperties?.attachments?.[0]?.type === 'RPM' : newProperties?.attachments?.[0]?.consentType === 'RPM';
      title = isRPM ? (isAdded ? CHANGE_HISTORY_NAME.RPMConsentAdded : CHANGE_HISTORY_NAME.RPMConsentUpdated)
        : isAdded ? CHANGE_HISTORY_NAME.CCMConsentAdded : CHANGE_HISTORY_NAME.CCMConsentUpdated;
      content = [];
      break;
    }

    case CHANGE_HISTORY_TYPE.CCMConsentAdded: {
      const isRPM = newProperties?.attachments?.[0]?.type === 'RPM';
      title = isRPM ? CHANGE_HISTORY_NAME.RPMConsentAdded : CHANGE_HISTORY_NAME.CCMConsentAdded;
      content = [];
      break;
    }

    case CHANGE_HISTORY_TYPE.ConditionsInformation:
      title = CHANGE_HISTORY_NAME.ConditionsInformation;
      content = ['Conditions are being monitored'];
      break;
    case CHANGE_HISTORY_TYPE.CareplanStop:
      title = CHANGE_HISTORY_NAME.CareplanStop;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.CareplanStarted:
      title = CHANGE_HISTORY_NAME.CareplanStarted;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.DeviceInfoUpdated: {
      const data = getDeviceInfoUpdate({ newData: newProperties, oldData: oldProperties, isAdd: false });
      title = CHANGE_HISTORY_NAME.DeviceInfoUpdated;
      content = data?.content || [];
      break;
    }
    case CHANGE_HISTORY_TYPE.DeviceInfoAdded: {
      const data = getDeviceInfoUpdate({ newData: newProperties, oldData: oldProperties, isAdd: true });
      title = CHANGE_HISTORY_NAME.DeviceInfoAdded;
      content = data?.content || [];
      break;
    }
    case CHANGE_HISTORY_TYPE.HeartStudyPrescribed:
      title = CHANGE_HISTORY_NAME.HeartStudyPrescribed;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.HeartStudyCancel:
      title = CHANGE_HISTORY_NAME.HeartStudyCancel;
      content = [];
      break;
    case CHANGE_HISTORY_TYPE.SuperBillAdded:
      title = CHANGE_HISTORY_NAME.SuperBillAdded;
      content = getSuperBillContent(newProperties);
      break;
    case CHANGE_HISTORY_TYPE.SuperBillUpdated: {
      title = (oldProperties?.foundBill?.status && newProperties?.status && oldProperties?.foundBill?.status !== newProperties?.status)
        ? CHANGE_HISTORY_NAME.SuperBillStatusUpdated : CHANGE_HISTORY_NAME.SuperBillUpdated;
      content = getSuperBillContent(newProperties, oldProperties);
      break;
    }
    case CHANGE_HISTORY_TYPE.HeartStudyStarted:
      title = CHANGE_HISTORY_NAME.HeartStudyStarted;
      content = newProperties?.studyFid ? [`Study ${zeroPad(newProperties?.studyFid)}`] : [];
      break;
    case CHANGE_HISTORY_TYPE.HeartStudyStop:
      title = CHANGE_HISTORY_NAME.HeartStudyStop;
      content = newProperties?.studyFid ? [`Study ${zeroPad(newProperties?.studyFid)}`] : [];
      break;
    case CHANGE_HISTORY_TYPE.HeartStudyStopped:
      title = CHANGE_HISTORY_NAME.HeartStudyStop;
      content = newProperties?.studyFid ? [`Study ${zeroPad(newProperties?.studyFid)}`] : [];
      break;
    case CHANGE_HISTORY_TYPE.ReportSetting:
      title = CHANGE_HISTORY_NAME.ReportSetting;
      content = newMapTitleContent(oldProperties, newProperties, REPORT_SETTINGS_FIELDS);
      break;
    case CHANGE_HISTORY_TYPE.Report:
      title = CHANGE_HISTORY_NAME.Report;
      content = [];
      if (newProperties?.nurseStatus === 'Reviewed' || newProperties?.physicianStatus === 'Reviewed') {
        content = ['Reviewed'];
      }
      if (newProperties?.nurseStatus === 'Read' || newProperties?.physicianStatus === 'Read') {
        content = ['Unreview'];
      }
      if (newProperties?.nurseStatus === 'Sent') {
        content = ['Send noti report'];
      }
      break;
    case CHANGE_HISTORY_TYPE.Caregivers: {
      const contentData = [];
      if (!!newProperties?.nurse && oldProperties?.nurse !== newProperties?.nurse) {
        title = oldProperties?.nurse === 'undefined' ? 'Caregiver added' : 'Caregiver updated';
        const nurseName = await getUserName(newProperties?.nurse);
        contentData.push(`${nurseName} is assigned as a nurse.`);
      }
      if (!!newProperties?.physician && oldProperties?.physician !== newProperties?.physician) {
        title = oldProperties?.physician === 'undefined' ? 'Caregiver added' : 'Caregiver updated';
        const physicianName = await getUserName(newProperties?.physician);
        contentData.push(`${physicianName} is assigned as a physician.`);
      }
      content = contentData;
    }
      break;
    case CHANGE_HISTORY_TYPE.DeleteOnDemandReport:
      title = 'On-demand report';
      content = [`Deleted report  ${newProperties?.reportId ? zeroPad(newProperties?.reportId) : ''}`];
      break;
    case CHANGE_HISTORY_TYPE.BioheartIntegration:
      if (oldProperties && newProperties && newProperties?.reportFrequency !== oldProperties?.reportFrequency) {
        title = 'Bioheart integration updated';
        content = ['Report frequency'];
      }
      if (!newProperties?.isEnabled && oldProperties?.isEnabled) {
        title = 'Bioheart integration disabled';
        content = [];
      }
      if (!oldProperties?.isEnabled && newProperties?.isEnabled) {
        title = 'Bioheart integration enabled';
        content = [];
      }
      break;
    default:
      break;
  }

  return {
    title, content: !content?.isArray ? _.uniq([...content]) : content, comment, createdAt, loggedBy, _id,
  };
};

export const formatEventLogs = async (eventLogs = []) => {
  const formatedEventLogs = [];
  const results = [];

  for (let i = 0; i < eventLogs.length; i += 1) {
    const x = eventLogs[i];
    results.push(newFormatTitleContent(x));
  }
  const ss = await Promise.all(results);
  _.forEach(ss, (x) => {
    formatedEventLogs.push({ ...x, content: x.content?.isArray ? x.content : _.uniq([...x.content]) });
  });
  return formatedEventLogs;
};

export const formatEventLog = async (eventLog = {}) => {
  const formatedEventLog = {};
  const {
    comment, createdAt, loggedBy, _id, newProperties, oldProperties, type,
  } = eventLog || {};
  const { title, content } = await newFormatTitleContent({
    comment, createdAt, loggedBy, _id, newProperties, oldProperties, type,
  });

  _.assign(formatedEventLog, {
    _id,
    createdAt,
    comment,
    loggedBy,
    title,
    content: _.uniq([...content]),
  });

  return formatedEventLog;
};
