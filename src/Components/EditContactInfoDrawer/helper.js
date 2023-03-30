import _ from 'lodash';


export const getFormatedPhone = (phoneNumber = '') => {
  if (!phoneNumber) {
    return '';
  }
  const phone = `${phoneNumber}`;
  if (phone?.includes('-')) {
    if (phone?.[3] === '-' && phone?.[7] === '-') {
      return phone;
    }
    const newPhone = phone.replaceAll('-', '');
    return `${newPhone.slice(0, 3)}-${newPhone.slice(3, 6)}-${newPhone.slice(6)}`;
  }
  return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
};

export const isDisabledSaveBtn = (state = {}, innitData = {}) => {
  const {
    firstName, lastName, phoneNumber, email,
  } = state;
  if (!firstName || !lastName || !phoneNumber || !email) {
    return true;
  }
  if (!firstName.trim()) return true;
  if (!lastName.trim()) return true;
  if (!email.trim()) return true;

  const data = {
    firstName, lastName, phoneNumber: getFormatedPhone(phoneNumber), email,
  };
  const dataInitClone = { ...innitData, phoneNumber: getFormatedPhone(innitData.phoneNumber) };
  if (_.isEqual(data, dataInitClone)) {
    return true;
  }

  return false;
};

export const isValidEmail = () => { };
