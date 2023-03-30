import React from 'react';
import { CheckCircleOutlined, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { AFibStatusQuestion } from '../../../Constants/newPatientData';

const {
  BIOFLUX_LOADING, BIOFLUX_LOADING_MSG,
  BIOFLUX_SUCCESS, BIOFLUX_SUCCESS_MSG,
  BIOFLUX_FAILED, BIOFLUX_FAILED_MSG,
} = AFibStatusQuestion;

export const renderBiofluxStatus = (biofluxStatus) => {
  let biofluxMsg = '';
  let icon = <></>;
  let msgClassName = 'bioflux-msg';
  switch (biofluxStatus) {
    case BIOFLUX_LOADING:
      biofluxMsg = BIOFLUX_LOADING_MSG;
      icon = <LoadingOutlined className="bioflux-loading-icon" />;
      msgClassName += ' bioflux-msg-loading';
      break;
    case BIOFLUX_SUCCESS:
      biofluxMsg = BIOFLUX_SUCCESS_MSG;
      icon = <CheckCircleOutlined className="bioflux-success-icon" />;
      msgClassName += ' bioflux-msg-success';
      break;
    case BIOFLUX_FAILED:
      biofluxMsg = BIOFLUX_FAILED_MSG;
      icon = <CloseCircleFilled className="bioflux-failed-icon" />;
      msgClassName += ' bioflux-msg-failed';
      break;
    default:
      break;
  }
  return (
    <div className="bioflux-msg-container">
      {icon}
      <div className={msgClassName}>
        <span>{biofluxMsg}</span>
      </div>
    </div>
  );
};
