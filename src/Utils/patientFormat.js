
import parsePhoneNumber, {
  isValidPhoneNumber,
} from 'libphonenumber-js';
import _ from 'lodash';
import auth from '../Helpers/auth';

export const isValidPhone = (phone = '', countryCode = 'US') => isValidPhoneNumber(phone, countryCode);
export const isValidPhoneWithName = (phone = '', countryName = 'United States') => {
  const countryData = auth.getCountry();
  // const { country } = store.getState();
  const countryObj = _.find(countryData, x => x?.name === countryName);
  return isValidPhoneNumber(phone, countryObj?.alpha2);
};

export const formatPhoneNumberWithCode = (phone = '', countryCode = '') => {
  const countryData = auth.getCountry();
  if (!phone) return '';
  let countryCodeData = countryCode || 'US';
  if (countryCodeData?.length > 2) {
    // const { country } = store?.getState();
    const countryObj = _.find(countryData, x => x?.name === countryCode);
    countryCodeData = countryObj?.alpha2;
  }

  const phoneNumber = parsePhoneNumber(phone, countryCodeData);
  if (phoneNumber) {
    const phoneText = phoneNumber?.formatInternational();
    const arr = phoneText?.split(' ') || [];
    arr[0] = `(${arr[0]})`;
    return arr?.join(' ');
  }
  return '';
};

export const formatPhoneNumberWithCountryName = (phone = '', countryName = 'United States') => {
  const countryData = auth.getCountry();
  // const { country } = store.getState();
  const countryObj = _.find(countryData, x => x?.name === countryName);
  const countryCode = countryObj?.alpha2;
  const phoneNumber = parsePhoneNumber(phone, countryCode);
  if (phoneNumber) {
    const phoneText = phoneNumber.formatInternational();
    const arr = phoneText.split(' ');
    arr[0] = `(${arr[0]})`;
    return arr.join(' ');
  }
  return '';
};

export const getCountryNameByCode = (countryCode = '') => {
  const countryData = auth.getCountry();
  if (!countryCode) return '';
  if (countryCode?.length > 2) return countryCode;
  // const { country } = store.getState();
  const contryObj = _.find(countryData, x => x?.alpha2 === countryCode);
  return contryObj?.name || '';
};
