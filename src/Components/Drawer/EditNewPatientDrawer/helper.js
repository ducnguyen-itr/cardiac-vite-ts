import { isValidEmail } from '../../../Utils';

const isValid = (type, value) => {
  if (value === '') {
    return false;
  }
  if (type === 'email' && !isValidEmail(value)) {
    return false;
  }
  if (type === 'phoneNumber' && !value?.length) {
    return false;
  }
  return true;
};

export const isDisabledSave = ({ state, error }) => {
  if (error.phoneError || error.programTypeError) {
    return true;
  }
  if (!state.firstName || !state.lastName || !state.email || !state.phoneNumber) {
    return true;
  }
  if (!isValidEmail(state.email)) {
    return true;
  }
  return false;
};
export default isValid;
