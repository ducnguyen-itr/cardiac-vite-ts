/* eslint-disable no-unused-expressions */
import _ from 'lodash';

export const CUSTOM_INPUT_TYPE = {
  TEXT: 'text',
  NUMBER: 'number',
  PASSWORD: 'password',
  TEXTAREA: 'textarea',
};

export const CUSTOM_INPUT_SIZE = {
  LARGE: 'large',
  MIDDLE: 'middle',
  SMALL: 'small',
};

export const CUSTOM_INPUT_NUMBER_TYPE = {
  DEFAULT: 'default',
  INTEGER: 'integer',
  FLOAT: 'float',
};

export const isIntegerNumber = (value) => {
  const reg = /^\d+$/;
  if ((!_.isNaN(value) && reg.test(value)) || value === '') {
    return true;
  }
  return false;
};

export const isFloatNumber = (value) => {
  const reg = /^\d*\.?\d*$/;
  if ((!_.isNaN(value) && reg.test(value)) || value === '') {
    return true;
  }
  return false;
};

export const handleOnChange = ({
  event = {},
  onChange = () => { },
  name = '',
  type = CUSTOM_INPUT_TYPE.TEXT,
  numberFormatType = CUSTOM_INPUT_NUMBER_TYPE.DEFAULT,
  isUseForm = false,
}) => {
  if (type !== CUSTOM_INPUT_TYPE.NUMBER || numberFormatType === CUSTOM_INPUT_NUMBER_TYPE.DEFAULT) {
    isUseForm ? onChange(event?.target?.value) : onChange(name, event?.target?.value);
    return;
  }

  if (numberFormatType === CUSTOM_INPUT_NUMBER_TYPE.INTEGER && isIntegerNumber(event?.target?.value)) {
    isUseForm ? onChange(event?.target?.value) : onChange(name, event?.target?.value);
    return;
  }

  if (numberFormatType === CUSTOM_INPUT_NUMBER_TYPE.FLOAT && isFloatNumber(event?.target?.value)) {
    const { value } = event.target;
    const reg = /^\d*\.?\d*$/;
    const lastestResult = value ? value.match(reg)[0] : '';
    isUseForm ? onChange(lastestResult) : onChange(name, lastestResult);
  }
};
