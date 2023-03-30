import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import fetchCarePlan from '../../Apollo/Functions/Fetch/fetchCarePlan';
import handleDeleteCarePlan from '../../Apollo/Functions/Handle/handleDeleteCarePlan';
import handleResendPassword from '../../Apollo/Functions/Handle/handleResendPassword';
import handleResendReferenceCode from '../../Apollo/Functions/Handle/handleResendReferenceCode';
import handleStartCarePlan from '../../Apollo/Functions/Handle/handleStartCarePlan';
import handleStopCarePlan from '../../Apollo/Functions/Handle/handleStopCarePlan';
import handleUpdateCarePlan from '../../Apollo/Functions/Handle/handleUpdateCarePlan';
import handleUpdateCarePlanInvitation from '../../Apollo/Functions/Handle/handleUpdateCarePlanInvitation';
import { PROGRAM_TYPE } from '../../Constants/newPatientData';
import { getCarePlanAvatars } from '../../Helpers';
import auth from '../../Helpers/auth';
import consoleLog from '../../Helpers/consoleLog';
import { formatCountDownMMSS, imperialHeight } from '../../Utils';
import { getCountryNameByCode } from '../../Utils/patientFormat';
import { showFailedMsg, showSuccessMsg } from '../../Utils/showNotification';
import { defaultReportSetting, formatPatientInfo } from '../../Utils/table';
import { DEVICE_NAME_ENUM } from '../../Constants/enum';

const Context = React.createContext();

export const getBasicAndContact = (patientData = {}, isDrawer = false) => {
  const {
    email, phone, phone1, dateOfBirth, bmi, height, weight, insuranceName, mobilePhone, emergencyPhoneText, homePhoneText,
    insuranceType,
    address, country,
    invitationPhone,
    invitationEmail,
    invitationFullName,
    programType,
    equipmentProvided,
    bioheartMonitor,
    transmissionDay,
    timeLogged,
  } = patientData;

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
      data: programType === PROGRAM_TYPE.CCM_RPM ? 'CCM & RPM' : programType || '--',
    },
    {
      title: 'Devices',
      data: formatDevice(),
    },
    {
      title: 'Duration',
      data: !_.isNil(timeLogged) ? formatCountDownMMSS(timeLogged) : '00:00',
    },
    {
      title: 'Transmission',
      data: transmissionDay ? `${transmissionDay} ${transmissionDay > 1 ? 'days' : 'day'}` : '--',
    },
  ];

  const basicInfo = [
    {
      title: 'DOB',
      data: dateOfBirth ? moment(dateOfBirth)?.format('MM/DD/YYYY') : '--',
    },
    {
      title: 'Height',
      // data: !_.isNil(height) ? `${isMetric ? `${height} cm` : imperialHeight(height)}` : '--',
      data: !_.isNil(height) ? `${imperialHeight(height)}` : '--',
    },
    {
      title: 'Weight',
      data: !_.isNil(weight) ? `${Number.parseFloat(weight).toFixed(1)} lb` : '--',
    },
    {
      title: 'BMI',
      data: !_.isNil(bmi) ? bmi : '--',
    },
  ];
  if (isDrawer) {
    basicInfo.push(
      {
        title: 'Insurance',
        data: insuranceName || '--',
      },
    );
  }

  const contactInfo = [
    {
      title: 'Email',
      data: email || '--',
    },
    {
      title: 'Mobile',
      data: mobilePhone || '--',
    },
    {
      title: 'Emergency',
      data: emergencyPhoneText || '--',
    },
    {
      title: 'Home',
      data: homePhoneText || '--',
    },
    {
      title: 'Address',
      data: address || '--',
    },
    {
      title: 'Country',
      data: getCountryNameByCode(country) || '--',
    },
  ];


  const invationInfo = [
    {
      title: 'Full name',
      data: invitationFullName || '',
    },
    {
      title: 'Email',
      data: invitationEmail || '',
    },
    {
      title: 'Phone',
      data: invitationPhone || '',
    },
  ];

  const insurancePaymentType = patientData?.insuranceType ? patientData.insuranceType : (patientData?.insuranceName === 'No medical insurance' ? 'Cash/Credit card paying' : 'Insurance');
  const insuranceInfo = [
    {
      title: 'Payment type',
      data: insurancePaymentType,
    },
  ];
  if (insurancePaymentType === 'Insurance') {
    insuranceInfo.push(
      {
        title: 'Name',
        data: patientData?.insuranceName || '--',
      },
    );
  }
  if (country !== 'United States' && insuranceType !== 'Cash/Credit card paying') {
    insuranceInfo.push(
      {
        title: 'Billing',
        data: patientData?.insuranceProvincialBilling || '--',
      },
    );
  }
  if (insurancePaymentType === 'Insurance') {
    insuranceInfo.push(
      {
        title: 'Expiration',
        data: patientData?.insuranceExpireDate && patientData?.insuranceExpireDate !== 'Invalid date' ? moment(patientData?.insuranceExpireDate).format('MM/DD/YYYY') : '--',
      },
    );
  }

  return {
    basicInfo, contactInfo, invationInfo, insuranceInfo, info,
  };
};

export const handleBottomClick = (
  propsName = '', _id = '', status = '', reportId = '', setPathRequest = () => { }, physicianId = '', nurseId = '',
) => {
  const tab = propsName.includes('new') ? 'patients/new' : 'patients';

  if (['notification', 'monthly', 'appointments', 'hm-notification'].includes(propsName)) {
    setPathRequest({
      navigateFromTab: ['notification', 'monthly', 'hm-notification'].includes(propsName)
        ? `/reports/${propsName}${reportId ? `/${reportId}` : ''}` : '/appointments',
    });
  }

  let pathName = `/${tab}/${status}/${_id}`;
  if (propsName.includes('appointments') && status === 'new') {
    pathName = `/${tab}/new/new-${auth.isMD() && physicianId ? 'md' : nurseId ? 'assigned' : 'registered'}/${_id}`;
    return pathName;
  }

  if (propsName.includes('new-')) {
    pathName = `/${tab}/${propsName}/${_id}`;
    return pathName;
  }

  return pathName;
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

export const mutaionStartHealthCareProgram = async (_id = '', patientId = '', facilityId = '') => {
  try {
    const startCP = await handleStartCarePlan({
      _id,
      input: {
        // patientId,
        startDate: moment().toISOString(),
        // status: 'Active',
        // facilityId,
        currentDate: moment().format('YYYY-MM-DD'),
      },
    });
    return startCP;
  } catch (error) {
    consoleLog('Failed to start care plan', error);
    return {
      isSuccess: false,
      message: error,
    };
  }
};


export const queryCareplanData = async (_id = '') => {
  try {
    const carePlan = await fetchCarePlan({ _id });

    const patientData = formatPatientInfo(carePlan);
    // LOAD AVATAR WITHOUT AWAIT
    getCarePlanAvatars(carePlan);


    const { nurse, physician } = patientData || {};
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
    return { patientData, tagArr };
  } catch (error) {
    consoleLog('Failed to fetch patient info', error);
    return {};
  }
};

export const shouldMutateReportSettings = (reportSettings = {}) => {
  if (_.isEmpty(reportSettings)) {
    return true;
  }
  const {
    minHeartRate, maxHeartRate,
    minBloodPressureDenominator, minBloodPressureNumerator,
    maxBloodPressureNumerator, maxBloodPressureDenominator,
    minInr, maxInr,
    minEhraScore, maxEhraScore,
    medicationComplianceNurse, medicationCompliancePhysician,
    shortnessOfBreath, chestPain, abnormalBleed, lightHeadedness, sleepDisturbanceChange, palpitations,
  } = reportSettings;

  if (minHeartRate || maxHeartRate
    || minBloodPressureDenominator || minBloodPressureNumerator
    || maxBloodPressureNumerator || maxBloodPressureDenominator
    || minInr || maxInr
    || minEhraScore || maxEhraScore
    || medicationComplianceNurse || medicationCompliancePhysician
    || shortnessOfBreath || chestPain || abnormalBleed || lightHeadedness || sleepDisturbanceChange || palpitations) {
    return false;
  }

  return true;
};

export const handleUpDateReportSetttings = async (_id) => {
  {
    const sendingData = {
      _id,
      input: {
        reportSetting: defaultReportSetting(),
      },
    };
    try { // assign MD and update Careplan default report setting
      await handleUpdateCarePlan(sendingData);
      consoleLog('Success update default report settings');
    } catch (error) {
      consoleLog('Failed to update default report settings', error);
    }
  }
};

const successDescription = (email, temporaryPassword) => (
  <Context.Consumer>
    {() => (
      <div>
        <span>The email has been sent to</span>
        <span className="b">{` ${email}. `}</span>
        <span>The temporary password to sign in to the patient’s account is</span>
        <span className="b">{` ${temporaryPassword}`}</span>
      </div>
    )}
  </Context.Consumer>
);

const failedDescription = () => (
  <Context.Consumer>
    {() => (
      <div>
        <span>The user has already signed in using the previous temporary password. If the user has forgotten their password, please advise them to tap on the</span>
        <span className="b">{` ${'Forgot password'} `}</span>
        <span>button.</span>
      </div>
    )}
  </Context.Consumer>
);

export const queryResendCode = async (patientId = '', email = '') => {
  try {
    const { temporaryPassword, message, isSuccess } = await handleResendPassword({ patientId });
    if (isSuccess && temporaryPassword) {
      const description = successDescription(email, temporaryPassword);
      showSuccessMsg('Login information sent', 0, description);
      return { isShowResendModal: false, countDownResend: 90 };
    }
    const description = failedDescription();
    showFailedMsg('Action failed', 3, description);
    return { isShowResendModal: false };
  } catch (error) {
    consoleLog('Failed to query resend code: ', error);
    showFailedMsg('Action failed', 3, `Unexpected error: ${error}`);
    return { isShowResendModal: false };
  }
};

export const mutationResendReferenceCode = async (carePlanId) => {
  try {
    const { isSuccess } = await handleResendReferenceCode({ carePlanId });
    if (isSuccess) {
      showSuccessMsg('Reference code sent', 3, 'A reference code has been sent to patient’s contact info!');
    }
    if (!isSuccess) {
      showFailedMsg('Action failed', 3, 'The user has already used the code to register a health care program successfully!');
    }
    return isSuccess;
  } catch (error) {
    showFailedMsg('Failed to resend the reference code!');
    consoleLog('Failed to resend reference code');
    return false;
  }
};


const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = (`${phoneNumberString}`).replace(/\D/g, '');
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = (match[1] ? '+1 ' : '');
    return [intlCode, match[2], '-', match[3], '-', match[4]].join('');
  }
  return null;
};

export const mutationEditContactInfo = async (state = {}, _id) => {
  const sendingData = {
    _id,
    input: {
      firstName: state?.firstName.trim(),
      lastName: state?.lastName.trim(),
      phoneNumber: state?.phoneNumber
        ? state?.phoneNumber?.length === 10 ? formatPhoneNumber(state?.phoneNumber) : state?.phoneNumber : '',
      email: state?.email.trim(),
    },
  };
  try {
    const { isSuccess } = await handleUpdateCarePlanInvitation(sendingData);
    return isSuccess;
  } catch (error) {
    consoleLog('Failed to update contact information!');
    return false;
  }
};


export const mutateDeleteCarePlan = async (_id) => {
  try {
    const result = await handleDeleteCarePlan({ _id });
    return result;
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
    };
  }
};


export const mutateStopCarePlan = async (params) => {
  try {
    // { _id, input: { facilityId, stopDate, reason, utcOffset, currentDate}}
    const sendingData = {
      _id: params._id,
      input: {
        // patientId: props.patientId,
        facilityId: params.facilityId,
        stopDate: moment().toISOString(),
        // status: 'Inactive',
        // reason: params?.stopReason === 'Other' ? otherReason : stopReason,
        currentDate: moment().format('YYYY-MM-DD'),
        utcOffset: moment().utcOffset(),
      },
    };
    const result = await handleStopCarePlan(sendingData);
    return result;
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
    };
  }
};

export const showGenderAndAge = (patientData) => {
  const { dateOfBirth, gender, age } = patientData || {};
  if (dateOfBirth && !_.isNil(gender)) {
    return `${gender} - ${age} year${age > 1 ? 's' : ''} old`;
  }
  if (!dateOfBirth && !_.isNil(gender)) {
    return `${gender}`;
  }
  if (dateOfBirth && _.isNil(gender)) {
    return `${age} year${age > 1 ? 's' : ''} old`;
  }
  return '';
};
