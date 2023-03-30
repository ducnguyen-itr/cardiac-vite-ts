/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
/* eslint-disable import/no-cycle */
/* eslint-disable array-callback-return */
/* eslint-disable no-await-in-loop */
import Auth from '@aws-amplify/auth';
import { notification } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { length, mass } from 'units-converter';
import mime from 'mime-types';
import moment from 'moment-timezone';
import fileDownload from 'react-file-download';
import fetchRequestFileUpload from '../Apollo/Functions/Fetch/fetchRequestFileUpload';
import {
  DISPLAY_DATA_2, NOTIFICATION_CENTER, SEARCH_MEDICATION_URL, TableNames,
} from '../Constants';
import { REPORT_DETAIL_ENUM } from '../Constants/reports';
import { formatCountryDisplaying, getAddressWithOutCountry } from '../Helpers';
import consoleLog from '../Helpers/consoleLog';

const {
  NOTIFICATION, MONTHLY, HM_NOTIFICATION, HM_EOU, ON_DEMAND,
} = REPORT_DETAIL_ENUM;

const {
  NewAssigned, NewRegistered, Active, Inactive, NewMD, Bioheart,
} = TableNames;

export const isShowStopHCPBtn = (hyperName = '') => [NewAssigned, Active, NewMD].includes(hyperName);
export const isShowCreateAptBtnNew = (hyperName = '') => [NewAssigned, Active, NewMD, NewRegistered].includes(hyperName);
export const isShowDeleteCarePlan = (hyperName = '') => [NewAssigned, NewMD, NewRegistered].includes(hyperName);

export const isShowStartHCPtBtn = (hyperName = '') => [NewAssigned].includes(hyperName);


export const imperialHeight = (x) => {
  if (_.isNil(x)) return '';
  const imperialHeight = length(x).from('cm').to('ft').value;
  const newFt = parseInt(imperialHeight, 10);
  const newIns = length(imperialHeight - newFt).from('ft').to('in').value.toFixed(1);
  return `${newFt} ft ${newIns} in`;
};

export const parseImperialHeight = (height) => {
  try {
    return length(+height).from('cm').to('ft').value;
  } catch (error) {
    return height;
  }
};

export const parseMetriclHeightFt = (height) => {
  try {
    return length(+height).from('ft').to('cm').value;
  } catch (error) {
    return height;
  }
};
export const parseMetriclHeightIn = (height) => {
  try {
    return length(+height).from('in').to('cm').value;
  } catch (error) {
    return height;
  }
};

export const parseImperialWeight = (weight) => {
  try {
    return mass(+weight).from('kg').to('lb').value;
  } catch (error) {
    return weight;
  }
};
export const parseMetriclWeight = (weight) => {
  try {
    return mass(+weight).from('lb').to('kg').value;
  } catch (error) {
    return weight;
  }
};

export const converFtToIn = (ft) => {
  try {
    return length(ft).from('ft').to('in').value;
  } catch (error) {
    return ft;
  }
};

export const convertCelsiustoFahrenheit = (cel) => {
  if (cel === null || cel === undefined) return null;
  return (cel * 9 / 5) + 32;
};

export const convertFahrenheitToCelsius = (fah) => {
  if (fah === null || fah === undefined) return null;
  return (fah - 32) * 5 / 9;
};
const formatTime1 = x => `${x ? x < 10 ? `0${x}` : x : '00'}`;

export const formatCountDownMMSS = (time) => {
  // const days = Math.floor(time / (60 * 60 * 24));
  const minutes = Math.floor((time / 60));
  const seconds = Math.floor((time) % 60);
  // ${formatTime(days)}:
  return `${formatTime1(minutes)}:${formatTime1(seconds)}`;
};

export const mergeByKey = (a1, a2, key) => a1.map(itm => ({
  ...a2.find(item => (item[key] === itm[key]) && item),
  ...itm,
}));

export const formatNoEmptyString = (string) => {
  if (_.isEmpty(string)) return '';
  let newString = string;
  newString = newString.replace(/\s\s+/g, ' ');
  return newString?.toLowerCase();
};

export const getSearchData = (filter = {}, searchByList = []) => {
  if (_.isEmpty(filter)) return { searchValue: '', searchByKey: '' };
  const {
    name, friendlyId, carePlanFid, studyFid, reportId, patientName,
  } = filter || {};
  if (!_.isEmpty(patientName) && !!_.find(searchByList, x => x.value === 'patientName')) {
    return { searchValue: patientName, searchByKey: 'patientName' };
  }
  if (!_.isEmpty(name) && !!_.find(searchByList, x => x.value === 'name')) {
    return { searchValue: name, searchByKey: 'name' };
  }
  if (!_.isNil(friendlyId) && !!_.find(searchByList, x => x.value === 'friendlyId')) {
    return { searchValue: friendlyId, searchByKey: 'friendlyId' };
  }
  if (!_.isNil(carePlanFid) && !!_.find(searchByList, x => x.value === 'carePlanFid')) {
    return { searchValue: carePlanFid, searchByKey: 'carePlanFid' };
  }
  if (!_.isNil(studyFid) && !!_.find(searchByList, x => x.value === 'studyFid')) {
    return { searchValue: studyFid, searchByKey: 'studyFid' };
  }
  if (!_.isNil(reportId) && !!_.find(searchByList, x => x.value === 'reportId')) {
    return { searchValue: reportId, searchByKey: 'reportId' };
  }
  return { searchValue: '', searchByKey: '' };
};


export const debounceShowNotification = (time = 0) => {
  // *: Wait 5000ms for 5s duration of notification
  if (moment().valueOf() - time > 5000) {
    let tempTime = moment().valueOf();
    notification.error({
      message: 'There is no internet connection',
      placement: 'bottomLeft',
      duration: 5,
      onClose: () => {
        tempTime = 0;
      },
    });
    return tempTime;
  }
  return time;
};

export const getTabName = (pathName = '') => {
  if (!pathName) {
    return '';
  }
  if (pathName?.includes(MONTHLY)) {
    return MONTHLY;
  }
  if (pathName?.includes(ON_DEMAND)) {
    return ON_DEMAND;
  }
  if (pathName?.includes(HM_NOTIFICATION)) {
    return HM_NOTIFICATION;
  }
  if (pathName?.includes(HM_EOU)) {
    return HM_EOU;
  }
  if (pathName?.includes(NOTIFICATION)) {
    return NOTIFICATION;
  }
  if (pathName?.includes(NewRegistered)) {
    return NewRegistered;
  }
  if (pathName?.includes(NewAssigned)) {
    return NewAssigned;
  }
  if (pathName?.includes(NewMD)) {
    return NewMD;
  }
  if (pathName?.includes(Bioheart)) {
    return Bioheart;
  }
  if (pathName?.includes(Active)) {
    if (pathName?.includes(Inactive)) {
      return Inactive;
    }
    return Active;
  }
  return '';
};

export const isTheSameObj = (objA = {}, objB = {}) => {
  if (JSON.stringify(objA) !== JSON.stringify(objB)) {
    return false;
  }
  return true;
};

export const mutateYesNo = (item = {}, compareValue = '') => {
  if (!item || _.isEmpty(item)) {
    return false;
  }
  if (compareValue) {
    return item?.title === compareValue;
  }
  return item?.title === 'Yes';
};

export const mutateDate = (date = undefined) => {
  if (!date) {
    return undefined;
  }
  return moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : undefined;
};

export const mutateDateTime = (dateTime = undefined) => {
  if (!dateTime) {
    return undefined;
  }
  return moment(dateTime).isValid() ? moment(dateTime).toISOString() : undefined;
};

export const dateFormated = (cell = '') => {
  if (cell && moment(cell).isValid()) {
    return moment(cell).format('MM/DD/YYYY');
  }
  return '';
};

export const dateFormatedToUTC0 = (cell = '') => {
  if (cell && moment(cell).isValid()) {
    const offset = moment().utcOffset();
    return moment(cell).utcOffset(offset).subtract(1, 'd').format('MM/DD/YYYY');
  }
  return '';
};

export const dateUTC0Before30Date = (cell = '') => {
  if (cell && moment(cell).isValid()) {
    const offset = moment().utcOffset();
    return moment(cell).subtract(30, 'd').utcOffset(offset).format('MM/DD/YYYY');
  }
  return '';
};

export const timeFormated = (cell = '') => {
  if (cell && moment(cell).isValid()) {
    return moment(cell).format('MM/DD/YYYY, hh:mm A');
  }
  return '';
};

export const timezoneTimeFormated = (cell = '', timezone = null) => {
  if (!_.isNil(timezone) && cell && moment(cell).isValid()) {
    return moment(cell).tz(timezone).format('MM/DD/YYYY');
  }
  if (cell && moment(cell).isValid()) {
    return moment(cell).format('MM/DD/YYYY');
  }
  return '';
};

export const removeitemFromArr = (item = '', arr = []) => {
  const array = [...arr]; // make a separate copy of the array
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
    return array;
  }
  return array;
};

export const toggleArr = (item = '', arr = []) => {
  const array = [...arr]; // make a separate copy of the array
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
    return array;
  }
  array.push(item);
  return array;
};

export const isCheckOne = (arr = []) => {
  if (arr.length === 0) {
    return true;
  }
  const item = _.find(arr, x => x.isCheck);
  if (item) {
    return true;
  }
  return false;
};

export const isValidEmail = (email = '') => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email.trim()).toLowerCase());
};


export const getStateData = (info = {}) => {
  if (_.isEmpty(info)) {
    return {};
  }
  const tempObj = {};
  Object.keys(info).forEach((key) => {
    if (info[key] !== undefined && info[key] !== '') {
      _.assign(tempObj, { [key]: info[key] });
    }
  });
  return { ...tempObj };
};

export const configRadioData = (givingData = {}, radioData = [], returnIndex = 0) => {
  if (radioData.length === 0) {
    return undefined;
  }
  if (_.isEmpty(givingData)) {
    return radioData[returnIndex];
  }
  const itemIndex = _.findIndex(radioData, x => x.title === givingData.title);
  if (itemIndex !== -1) {
    return radioData[itemIndex];
  }
  return radioData[returnIndex];
};

export const configRadioBoolData = (givingData = false, radioData = [], returnIndex = 0) => {
  if (radioData.length === 0) {
    return undefined;
  }
  const itemIndex = _.findIndex(radioData, x => x.title === (givingData ? 'Yes' : 'No'));
  if (itemIndex !== -1) {
    return radioData[itemIndex];
  }
  return radioData[returnIndex];
};

export const checkNoData = (data = []) => {
  if (data?.length === 0 || data?.includes('') || data?.includes(null)
    || data?.includes(undefined) || data?.includes([])) {
    return true;
  }
  return false;
};

export const getUpdatedKey = (oldData, newData) => {
  if (oldData) {
    const data = _.uniq([...Object.keys(oldData), ...Object.keys(newData)]);
    const updateKeys = {};
    for (const key of data) {
      if (!_.isEqual(oldData[key], newData[key])) {
        _.assign(updateKeys, { [key]: newData[key] });
      }
    }
    return updateKeys;
  }
  return null;
};

export const isNoAllData = (arr = []) => {
  if (arr.length === 0) {
    return true;
  }
  let count = 0;
  _.forEach(arr, (x) => {
    if (!x || _.isEmpty(x)) {
      count += 1;
    }
  });
  return count === arr.length;
};

export const isNoAllObjectData = (obj = {}) => {
  if (_.isEmpty(obj)) {
    return true;
  }
  let count = 0;
  _.forEach(obj, (x) => {
    if (!x || _.isEmpty(x)) {
      count += 1;
    }
  });
  return count === Object.keys(obj)?.length;
};

export const isEmptyObj = (obj = {}) => {
  const clonedObject = _.cloneDeep(obj);

  if (_.isEmpty(clonedObject)) {
    return true;
  }

  Object.keys(clonedObject).forEach((key) => {
    if (!clonedObject[key] || _.isEmpty(clonedObject[key])) {
      delete clonedObject[key];
    }
  });
  return _.isEmpty(clonedObject);
};

export const handleNormalRangeData = (data = {}) => {
  if (_.isEmpty(data)) {
    return [];
  }
  const {
    minBloodPressureDenominator, maxBloodPressureNumerator,
    minInr, maxInr,
    minBloodPressureNumerator, maxBloodPressureDenominator,
    minHeartRate, maxHeartRate,
    minOxygenSaturation, maxOxygenSaturation,
    minBodyTemperature, maxBodyTemperature,
    isEnableBloodPressure, isEnableInr,
    isEnableHeartRate, isEnableOxygenSaturation,
    isEnableBodyTemperature,
  } = data;
  const normalRangeArr = [];
  if (isEnableBloodPressure) {
    normalRangeArr.push({
      title: 'Blood pressure',
      data: [
        `Min: ${!_.isNil(minBloodPressureNumerator) ? minBloodPressureNumerator : ''}/${!_.isNil(minBloodPressureDenominator) ? minBloodPressureDenominator : ''} mmHg`,
        `Max: ${!_.isNil(maxBloodPressureNumerator) ? maxBloodPressureNumerator : ''}/${!_.isNil(maxBloodPressureDenominator) ? maxBloodPressureDenominator : ''} mmHg`,
      ],
    });
  }
  if (isEnableInr) {
    normalRangeArr.push({
      title: 'INR',
      data: [
        `Min: ${!_.isNil(minInr) ? Number.parseFloat(minInr).toFixed(1) : ''}`,
        `Max: ${!_.isNil(maxInr) ? Number.parseFloat(maxInr).toFixed(1) : ''}`,
      ],
    });
  }
  if (isEnableHeartRate) {
    normalRangeArr.push({
      title: 'Heart rate',
      data: [
        `Min: ${!_.isNil(minHeartRate) ? minHeartRate : ''} bpm`,
        `Max: ${!_.isNil(maxHeartRate) ? maxHeartRate : ''} bpm`,
      ],
    });
  }
  if (isEnableOxygenSaturation) {
    normalRangeArr.push({
      title: 'Oxygen saturation',
      data: [
        `Min: ${!_.isNil(minOxygenSaturation) ? minOxygenSaturation : ''} %`,
        `Max: ${!_.isNil(maxOxygenSaturation) ? maxOxygenSaturation : ''} %`,
      ],
    });
  }
  if (isEnableBodyTemperature) {
    normalRangeArr.push({
      title: 'Body temperature',
      data: [
        `Min: ${!_.isNil(minBodyTemperature) ? minBodyTemperature : ''} °F`,
        `Max: ${!_.isNil(maxBodyTemperature) ? maxBodyTemperature : ''} °F`,
      ],
    });
  }
  return normalRangeArr;
};

const formatDaysInt = (x = 0) => (!_.isNil(x) ? `${x} day${x > 1 ? 's' : ''}` : '');

export const handleSleepAndActivity = (data = {}) => {
  if (_.isEmpty(data)) {
    return [];
  }
  const {
    minEhraScore, consecutiveEhra,
    sleepLevel, consecutiveSleepDisturbance, isEnableSleepLevel, isEnableEhraScore,
  } = data;
  const sleepAndActivity = [];
  if (isEnableSleepLevel) {
    sleepAndActivity.push({
      title: 'Quality of sleep',
      data: [
        `Quality of sleep: ${!_.isNil(sleepLevel) ? `< ${sleepLevel}` : ''}`,
        `Consecutive days: ${formatDaysInt(consecutiveSleepDisturbance)}`,
      ],
    });
  }
  if (isEnableEhraScore) {
    sleepAndActivity.push({
      title: 'EHRA score',
      data: [
        `EHRA score: ${!_.isNil(minEhraScore) ? `< ${minEhraScore}` : ''}`,
        `Consecutive days: ${formatDaysInt(consecutiveEhra)}`,
      ],
    });
  }

  return sleepAndActivity;
};

export const handleMediComplianceNotiData = (data = {}) => {
  if (_.isEmpty(data)) {
    return [];
  }
  const {
    medicationComplianceNurse, isEnableMedicationCompliance, isEnableMedicationOverdose, medicationOverdose,
  } = data;
  const mediComplianceNotiArr = [];
  if (isEnableMedicationCompliance) {
    mediComplianceNotiArr.push({
      title: 'Medication nonadherence',
      data: formatDaysInt(medicationComplianceNurse),
    });
  }
  if (isEnableMedicationOverdose) {
    mediComplianceNotiArr.push({
      title: 'Overdose',
      data: medicationOverdose ? 'On' : 'Off',
    });
  }

  return mediComplianceNotiArr;
};

export const handleSymptomsData = (data = {}) => {
  if (_.isEmpty(data)) {
    return [];
  }
  const {
    shortnessOfBreath, chestPain, abnormalBleed, lightHeadedness, palpitations,
    isEnableShortnessOfBreath, isEnableChestPain, isEnableAbnormalBleed, isEnableLightHeadedness, isEnablePalpitations,
  } = data;
  const symptomsArr = [];
  if (isEnableShortnessOfBreath) {
    symptomsArr.push({
      title: 'Increasing shortness of breath',
      data: formatDaysInt(shortnessOfBreath),
    });
  }
  if (isEnableChestPain) {
    symptomsArr.push({
      title: 'Chest pain',
      data: formatDaysInt(chestPain),
    });
  }
  if (isEnableAbnormalBleed) {
    symptomsArr.push({
      title: 'Abnormal bleeding',
      data: formatDaysInt(abnormalBleed),
    });
  }
  if (isEnableLightHeadedness) {
    symptomsArr.push(
      {
        title: 'Lightheadedness',
        data: formatDaysInt(lightHeadedness),
      },
    );
  }
  if (isEnablePalpitations) {
    symptomsArr.push({
      title: 'Palpitations',
      data: formatDaysInt(palpitations),
    });
  }
  return symptomsArr;
};


export const handleFormatWeightData = (data = {}) => {
  if (_.isEmpty(data)) {
    return [];
  }
  const {
    weightLoss, weightGain,
  } = data;
  const sleepAndActivity = [];
  if (weightGain?.enable) {
    const dayThresholdGain = parseFloat(parseImperialWeight(weightGain?.dayThreshold).toFixed(0));
    const weekThresholdGain = parseFloat(parseImperialWeight(weightGain?.weekThreshold).toFixed(0));
    sleepAndActivity.push({
      title: 'Weight gain',
      data: [
        `Weight gain in 1 day: ${dayThresholdGain ? `≥ ${dayThresholdGain} lb${dayThresholdGain === 1 ? '' : 's'}` : '--'}`,
        `Weight gain in 7 days: ${weekThresholdGain ? `≥ ${weekThresholdGain} lbs` : '--'}`,
      ],
    });
  }
  if (weightLoss?.enable) {
    const dayThresholdLoss = parseFloat(parseImperialWeight(weightLoss?.dayThreshold).toFixed(0));
    const weekThresholdLoss = parseFloat(parseImperialWeight(weightLoss?.weekThreshold).toFixed(0));
    sleepAndActivity.push({
      title: 'Weight loss',
      data: [
        `Weight loss in 1 day: ${dayThresholdLoss ? `≥ ${dayThresholdLoss} lb${dayThresholdLoss === 1 ? '' : 's'}` : '--'}`,
        `Weight loss in 7 days: ${weekThresholdLoss ? `≥ ${weekThresholdLoss} lbs` : '--'}`,
      ],
    });
  }

  return sleepAndActivity;
};

export const getFormatedReportSettings = (reportSettings = {}) => {
  const normalRangeData = handleNormalRangeData(reportSettings);
  const sleepAndActivity = handleSleepAndActivity(reportSettings);
  const mediComplianceNotiData = handleMediComplianceNotiData(reportSettings);
  const symptomsData = handleSymptomsData(reportSettings);
  const weightData = handleFormatWeightData(reportSettings);
  return {
    normalRangeData, sleepAndActivity, mediComplianceNotiData, symptomsData, weightData,
  };
};

export const setMultipleCheckboxData = (data = []) => {
  if (data.length === 0) {
    return [];
  }
  const tempArr = [];
  _.forEach(data, (x) => {
    const obj = {
      value: x.value || '',
      isCheck: x.isCheck || false,
      content: x.content || '',
      suffix: x?.suffix || '',
      var: x?.var,
    };
    tempArr.push(obj);
  });
  return tempArr;
};

export const getDateSummaryAttachment = (date = undefined, summary = '', attachments = []) => {
  const dataArr = [
    {
      title: 'Date',
      data: date,
      type: DISPLAY_DATA_2.DATE,
    },
    {
      title: 'Summary',
      data: summary,
    },
    {
      title: 'Attachment',
      data: attachments,
      type: DISPLAY_DATA_2.ATTACHMENT,
    },
  ];
  return dataArr;
};

export const getTestResult = (data = {}, type = '') => {
  const {
    summary, attachments, testTitle,
    hgbA1C, inrRes, lvef,
  } = data;

  const dataArr = [{
    title: 'Summary',
    data: summary || '--',
  }];
  if (type === 'inr') {
    dataArr.unshift({ title: 'INR result', data: inrRes });
  }
  if (type === 'hgbA1C') {
    dataArr.unshift({ title: 'HbA1c', data: `${hgbA1C}%` });
  }
  if (type === 'lvef') {
    dataArr.unshift({ title: 'LVEF', data: `${lvef}%` });
  }
  dataArr.push({
    title: 'Attachment',
    data: attachments || [],
    type: DISPLAY_DATA_2.ATTACHMENT,
  });
  if (testTitle) {
    dataArr.unshift({ title: 'Test title', data: testTitle });
  }
  return dataArr;
};

export const convertNewMedicationItem = (arr = []) => {
  const object = [];
  _.forEach(arr, (x) => {
    if (!_.find(object, d => (d.prescribableName === x.prescribable_name && JSON.stringify(d.strength) === JSON.stringify(x.strength)))) {
      if (x?.strength && x?.strength.unit && !x?.strength.unit.includes('USP')) {
        object.push({
          name: x.name,
          prescribableName: x.prescribable_name,
          dosageForm: x.dosage_form,
          strength: x.strength,
          productId: _.join(x.ndc_product_codes, ','),

          route: x.route,
          quantity: 1,
          frequency: 1,

          title: x.prescribable_name,
          dis: x.strength.number || x.strength.unit ? `${x.strength.number || ''}${x.strength.unit || ''}` : '',
        });
      }
    }
  });
  return object;
};

export const formatedTimeSheetCode = timeSheetCode => Object.keys(timeSheetCode).map(key => ({
  key,
  value: timeSheetCode[key],
}));

export const convertLoginData = (loginData = {}) => {
  const {
    birthdate,
    email,
    email_verified: emailVerfified,
    gender,
    role, username,
    _id,
    roles,
    title,
    contact,
    lastName,
    firstName,
    timeSheetCode,
    photo,
    facilities,
    cognitoId,
  } = loginData?.user || {};
  const {
    phone1, country,
    // address, city, state, zip,
  } = contact || {};

  const dob = birthdate && moment(birthdate).isValid()
    ? moment(birthdate).format('MM/DD/YYYY')
    : undefined;

  const sortedTimeSheetCode = _.sortBy(formatedTimeSheetCode(timeSheetCode), x => x.key);

  const formatedData = {
    dob,
    email,
    isVerified: emailVerfified,
    gender,
    lastName,
    firstName,
    fullName: `${firstName || ''} ${lastName || ''}`,
    role,
    username,
    _id,
    roles,
    title,
    address: getAddressWithOutCountry(contact),
    phone: phone1,
    timeSheetCode: sortedTimeSheetCode,
    photo,
    country: formatCountryDisplaying(country),
    facilities,
    cognitoId,
  };

  return formatedData;
};

const putFileToUrl = async (url, binaryData, contentType) => {
  const options = {
    method: 'PUT',
    body: binaryData,
    redirect: 'follow',
    headers: {
      'Content-Type': contentType,
    },
  };
  return fetch(url, options);
};

export const uploadFileToUrl = async (images = []) => {
  if (!images.length) {
    return [];
  }
  const dataGrouped = _.groupBy(images, 'customFileType');
  const data = _.map(dataGrouped, (value, key) => ({
    customFileType: key,
    files: value.map(item => item.data),
  }));
  const urls = [];
  for (let i = 0; i < data.length; i += 1) {
    const sendingData = {
      input: {
        amount: data[i].files.length,
        type: data[i].customFileType,
      },
    };
    try {
      const uploadFileUrls = await fetchRequestFileUpload(sendingData);
      const binaryData = data[i].files;
      let customContentType = mime.contentType(data[i].customFileType);
      if (!customContentType) {
        if (data[i].customFileType === 'jfif') {
          customContentType = 'image/jpeg';
        }
      }
      if (uploadFileUrls?.length) {
        const promises = [];
        uploadFileUrls.map((uploadFileUrl, index) => {
          promises.push(putFileToUrl(uploadFileUrl, binaryData[index], customContentType));
        });
        await Promise.all(promises);
        urls.push(...uploadFileUrls);
      }
    } catch (error) {
      consoleLog('Failed to fetch request file upload', error);
      throw error;
    }
  }
  return urls;
};

// export const uploadFileToUrl_DEPRECATED = async (binaryData = [], type) => {
//   const sendingData = {
//     input: {
//       amount: binaryData.length,
//       type,
//     },
//   };
//   try {
//     const uploadFileUrls = await fetchRequestFileUpload(sendingData);
//     if (uploadFileUrls?.length) {
//       const putFileToUrlPromises = _.map(uploadFileUrls, (uploadFileUrl, index) => {
//         putFileToUrl(uploadFileUrl, binaryData[index]);
//       });
//       await Promise.all(putFileToUrlPromises);
//       return uploadFileUrls.length === 1 ? uploadFileUrls[0] : uploadFileUrls;
//     }
//     return null;
//   } catch (error) {
//     throw error;
//   }
// };

export const fetchMedication = async (input, token) => {
  const formatInput = input?.replaceAll('%', '');
  const url = `${SEARCH_MEDICATION_URL}/drug_names?q=${formatInput}`;
  const result = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const { data } = result;
  return data.products;
};


export function convertMedicationItem(arr) {
  const object = [];
  _.forEach(arr, (x) => {
    if (!_.find(object, d => (d.prescribableName === x.prescribable_name)) && x.prescribable_name) {
      if (x.strength && x.strength.unit && !x.strength.unit.includes('USP')) {
        object.push({
          name: x.name,
          prescribableName: x.prescribable_name,
          dosageForm: x.dosage_form,
          strength: x.strength,
          productId: _.join(x.ndc_product_codes, ','),
          route: x.route,
          quantity: 1,
          frequency: 1,
          label: x.prescribable_name,
          dis: x.strength.number || x.strength.unit ? `${x.strength.number || ''}${x.strength.unit || ''}` : '',
        });
      }
    }
  });
  return object;
}

export function convertPluralMedicationUnit(unit = '') {
  if (_.isEmpty(unit) || unit?.length < 1) {
    return 'units';
  }
  if (unit === 'spray') {
    return 'sprays';
  }
  const endLetter = unit[unit.length - 1];
  if (endLetter === 'y') {
    return `${unit.slice(0, -1)}ies`;
  }
  const end2Letter = unit.slice(-2);
  if (end2Letter === 'ch') {
    return `${unit}es`;
  }
  return `${unit}s`;
}

export const zeroPad = (num, places = 5) => {
  if (num || num === 0) {
    return num.toString().padStart(places, '0');
  }
  return '';
};

export const downloadFile = async (url, filename) => {
  try {
    const currentSession = await Auth.currentSession();
    const token = currentSession.accessToken.jwtToken;
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'access-token': token,
      },
    });
    fileDownload(response.data, filename);
  } catch (error) {
    consoleLog('Failed to download file', error.message);
  }
};

export const dataURIToUInt8Array = (dataURI) => {
  const BASE64_MARKER = ';base64,';
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64String = dataURI.substring(base64Index);
  const uint8Array = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
  return uint8Array;
};


export const formatNotificaiotnTitle = (title = '', type = '') => {
  switch (type) {
    case NOTIFICATION_CENTER.CENCELED_APPOINTMENT:
      return 'Appointment cancellation';
    case NOTIFICATION_CENTER.DAILY_ENTRY:
      return 'Daily info not completed';
    case NOTIFICATION_CENTER.REMOVE_ATTENDEE_APPOINTMENT:
      return 'Appointment updates';
    case NOTIFICATION_CENTER.UPDATE_APPOINTMENT:
      return 'Appointment updates';
    case NOTIFICATION_CENTER.NURSE_ASSIGNMENT:
    case NOTIFICATION_CENTER.PHYSICIAN_ASSIGNMENT:
      return 'Care plan assignment';
    case NOTIFICATION_CENTER.NURSE_REASSIGNMENT:
    case NOTIFICATION_CENTER.PHYSICIAN_REASSIGNMENT:
      return 'Care plan reassignment';
    case NOTIFICATION_CENTER.SENT_REPORT:
      return 'Notification report';
    case NOTIFICATION_CENTER.PATIENT_COMPLETE_PROFILE:
      return 'Quality of life test completed';
    case NOTIFICATION_CENTER.NEW_MEDICATION_ADDED:
      return 'New medication added';
    case NOTIFICATION_CENTER.COMPLETED_CARE_PLAN:
      return 'Care plan is stopped';
    case NOTIFICATION_CENTER.RESTORE_CARE_PLAN:
      return 'Care plan restored';
    case NOTIFICATION_CENTER.DELETED_CARE_PLAN:
      return 'Care plan deleted';
    case NOTIFICATION_CENTER.REACTIVE_CAREPLAN:
      return 'Care plan is reactivated';
    case NOTIFICATION_CENTER.PATIENT_RECOVER_ACCOUNT:
      return 'Patient recovered account';
    default:
      return title;
  }
};

export const isChangeAttendees = (attendees = [], oldAttendees = []) => {
  if (_.isEmpty(attendees) || _.isEmpty(oldAttendees)) return false;
  const attendeeIds = _.map(attendees, x => x._id);
  return !_.isEqual(oldAttendees, attendeeIds);
};

export const isChangeAppointment = (appointment = {}, oldAppointment = {}, key) => {
  switch (key) {
    case 'appointmentType':
      return !_.isEqual(appointment?.appointmentType, oldAppointment?.appointmentType);
    case 'fromTime':
      return !_.isEqual(appointment?.fromTime, oldAppointment?.fromTime);
    case 'attendees':
      return !_.isEqual(appointment?.attendees, oldAppointment?.attendees);
    default:
      return false;
  }
};

export const checkChangeAppointmentTime = (appointment = {}, oldAppointment = {}) => {
  const isChangeTime = appointment?.toTime !== oldAppointment?.toTime || appointment?.fromTime !== oldAppointment?.fromTime;
  const apppointmentTime = `${moment(appointment?.fromTime).format('MM/DD/YYYY')}, ${moment(appointment?.fromTime).format('hh:mm A')} - ${moment(appointment?.toTime).format('hh:mm A')}`;
  return { isChangeTime, apppointmentTime };
};

export const getMedicationString = (medications = []) => {
  let medicationString = '';
  _.forEach(medications, (x, i) => {
    if (i === 0) {
      medicationString += x;
    } else {
      medicationString += `, ${x}`;
    }
  });
  return medicationString;
};

const checkMissingAddress = (contact = {}) => {
  if (_.isEmpty(contact)) return true;
  if (!contact?.address || !contact?.country || !contact?.city) {
    return true;
  }
  if (contact?.country === 'US' || contact?.country === 'CA') {
    if (!contact?.state || !contact?.zip) {
      return true;
    }
  }
  return false;
};
export const formatMissingData = (carePlan) => {
  if (_.isEmpty(carePlan)) return {};
  const {
    patientDemographic, signCMMConsent, info, programType,
  } = carePlan;
  const isMissingAddress = checkMissingAddress(patientDemographic?.contact);

  const isNotSignedCCMConsent = programType?.includes('CCM') && !_.find(signCMMConsent?.attachments, x => x.type === 'CCM')
    && !_.find(signCMMConsent?.signatures, x => x.type === 'CCM');
  const isNotSignedRPMConsent = programType?.includes('RPM') && !_.find(signCMMConsent?.attachments, x => x.type === 'RPM')
    && !_.find(signCMMConsent?.signatures, x => x.type === 'RPM');
  const patientMissingData = {
    isMissingPaymentType: !patientDemographic?.patientInfo?.insuranceType,
    isMissingDoB: !patientDemographic?.dateOfBirth,
    isMissingGender: !patientDemographic?.gender,
    isMissingAddress,
    isNotSetUpFollowUp: _.isNil(info?.frequencyOfFollowUp),
    isNotSignedCCMConsent,
    isNotSignedRPMConsent,
  };
  let isMissing = false;
  let isMissingCreateBill = false;
  let isMissingCreateStudy = _.isNil(patientDemographic?.height) || _.isNil(patientDemographic?.weight);
  Object.keys(patientMissingData).forEach((x) => {
    if (patientMissingData[x]) {
      isMissing = true;
    }
    if (patientMissingData[x] && x !== 'isNotSetUpFollowUp') {
      isMissingCreateBill = true;
    }
    if (patientMissingData[x] && x !== 'isNotSetUpFollowUp' && x !== 'isNotSignedCCMConsent' && x !== 'isNotSignedRPMConsent') {
      isMissingCreateStudy = true;
    }
  });
  return {
    patientMissingData, isMissing, isMissingCreateBill, isMissingCreateStudy,
  };
};

export const getUtcOffset = (timestamp) => {
  if (timestamp) {
    return moment(timestamp).utcOffset();
  }
  return moment().utcOffset();
};

export const capitalizeString = string => string.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
