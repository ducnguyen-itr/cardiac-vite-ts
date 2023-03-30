import { isValidEmail } from '../../../Utils';

export const isValid = (type, value) => {
  if (value === '') {
    return false;
  }
  if (type === 'email' && !isValidEmail(value)) {
    return false;
  }
  if (type === 'phoneNumber' && value?.length < 10) {
    return false;
  }
  return true;
};
export const isDisabledSaveButton = () => { };
