import { notification } from 'antd';
// import { CALENDAR_MESSAGES } from '../Constants';
// import { NEW_PATIENT_MESSAGES } from '../Constants/newPatientData';

// const { NEW_OR_ACTIVE_CAREPLAN_COPY } = NEW_PATIENT_MESSAGES;

// const {
//   CANCELED_SUCCESS, UPDATE_SUCCESS, INVALID_DATE, CREATE_FAILED, CREATE_SUCCESS, UPDATE_FAILED,
// } = CALENDAR_MESSAGES;

let handleShowMes;

export const showFailedMsg = (message = '', duration = 3, description = undefined) => {
  notification.destroy();
  if (handleShowMes) {
    clearTimeout(handleShowMes);
  }
  handleShowMes = setTimeout(() => {
    notification.error({
      message,
      description,
      placement: 'bottomLeft',
      duration,
    });
  }, 300);
};

export const showSuccessMsg = (message = '', duration = 3, description = undefined) => {
  notification.destroy();
  if (handleShowMes) {
    clearTimeout(handleShowMes);
  }
  handleShowMes = setTimeout(() => {
    notification.success({
      message,
      description,
      placement: 'bottomLeft',
      duration,
    });
  }, 300);
};
