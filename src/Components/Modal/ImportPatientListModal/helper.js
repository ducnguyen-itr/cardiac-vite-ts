import _ from 'lodash';
import { isValidEmail } from '../../../Utils';
import { isValidPhoneWithName, isValidPhone } from '../../../Utils/patientFormat';
import store from '../../../Redux/Store';
import auth from '../../../Helpers/auth';
import { CARE_PLAN_PROGRAM_TYPE } from '../../../Constants/carePlanData';
import { PROGRAM_TYPE_LABEL, PROGRAM_TYPE_OPTIONS } from '../../../Constants/newPatientData';

const validatePhoneForE164 = (phoneNumber) => {
  const regEx = /^\+[1-9]\d{10,14}$/;
  return regEx.test(phoneNumber);
};

const isValid = (item) => {
  if (!item?.firstName || !item?.lastName || !item?.phoneNumber || !item?.email || _.isEmpty(item?.programType)) {
    return false;
  }
  if (!isValidPhone(item?.phoneNumber, item.country?.value) || !isValidEmail(item?.email)) {
    return false;
  }
  return true;
};

export const isEmptyFile = (header = {}) => {
  let empty = true;
  _.forEach(Object.keys(header), (x) => {
    const lowerCase = x?.toLowerCase();
    if (lowerCase === 'first name'
      || lowerCase === 'last name'
      || lowerCase === 'phone number'
      || lowerCase === 'email'
      || lowerCase === 'country'
    ) {
      empty = false;
      return false;
    }
  });
  return empty;
};

const getProgramType = (planType) => {
  if (planType === PROGRAM_TYPE_LABEL.CCM_RPM) {
    return PROGRAM_TYPE_OPTIONS[2];
  }
  if (planType === PROGRAM_TYPE_LABEL.CCM) {
    return PROGRAM_TYPE_OPTIONS[0];
  }
  if (planType === PROGRAM_TYPE_LABEL.RPM) {
    return PROGRAM_TYPE_OPTIONS[1];
  }
  return {};
};

export const processData = (data, template) => {
  const country = auth.getCountry();
  // if (isEmptyFile(data[0])) {
  //   return { data: [], error: 'This file type is not supported.' };
  // }
  // if (data.length < 1) {
  //   return { data: [], error: 'The selected file is empty.' };
  // }
  const newList = [];
  _.forEach(data, (item) => {
    const countryText = item.Country?.toString().trim() || item.country?.toString().trim() || '';
    const planType = item['Plan type']?.toString().trim() || item['Plan type']?.toString().trim() || '';
    const newItem = {
      template,
      firstName: item['First name']?.toString().trim() || item['first name']?.toString().trim() || '',
      lastName: item['Last name']?.toString().trim() || item['last name']?.toString().trim() || '',
      phoneNumber: item['Phone number']?.toString().trim() || item['phone number']?.toString().trim() || '',
      programType: getProgramType(planType),
      country: countryText ? _.find(country, x => x.name === countryText) : {},
      email: item?.Email?.toString().trim() || item?.email?.toString().trim() || '',
      isError: false,
    };
    if (!isValid(newItem)) {
      _.assign(newItem, { isError: true });
      newList.unshift(newItem);
    } else {
      newList.push(newItem);
    }
  });
  const uniqData = _.uniqWith(newList, _.isEqual);
  const validItem = _.find(uniqData, x => x?.firstName || x?.lastName || x?.phoneNumber || x?.email);
  if (!validItem) {
    return { data: uniqData, error: 'The selected file is empty or contains the wrong template. Please refer to the sample file.' };
  }
  return { data: uniqData, error: newList.length > 100 ? 'The selected file exceeds 100 patients.' : '' };
};


export const formatXLSXData = (list) => {
  const header = list[0];
  if (isEmptyFile(header)) {
    return false;
  }
  const newList = [];
  for (let i = 1; i < list.length; i += 1) {
    const item = list[i];
    if (isValid(item)) {
      newList.push({
        firstName: item[0],
        lastName: item[1],
        phoneNumber: item[2],
        email: item[3],
        isError: true,
      });
    } else {
      newList.unshift({
        firstName: item[0],
        lastName: item[1],
        phoneNumber: item[2],
        email: item[3],
        isError: false,
      });
    }
  }
  return newList;
};

export const formatCSVData = (dataString) => {
  const dataStringLines = dataString.split(/\r\n|\n/);
  const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

  const list = [];
  for (let i = 1; i < dataStringLines.length; i += 1) {
    const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    if (headers && row.length === headers.length) {
      const obj = {};
      for (let j = 0; j < headers.length; j += 1) {
        let d = row[j];
        if (d.length > 0) {
          if (d[0] === '"') { d = d.substring(1, d.length - 1); }
          if (d[d.length - 1] === '"') { d = d.substring(d.length - 2, 1); }
        }
        if (headers[j]) {
          obj[headers[j]] = d;
        }
      }

      // remove the blank rows
      if (Object.values(obj).filter(x => x).length > 0) {
        list.push(obj);
      }
    }
  }
  return list;
};
