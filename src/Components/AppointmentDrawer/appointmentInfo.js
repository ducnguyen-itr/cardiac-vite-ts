import React, { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Button } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import moment from 'moment';
import ModalHeader from '../UI/modalHeader';
import PatientAppointmentInfo from './patientAppointmentInfo';
import DisplayData2 from '../UI/displayData2';
import ConfirmationLayout from '../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import { CONFIRMATION_LAYOUT_TYPES } from '../../Constants';
import { useMergeState } from '../../Helpers/customHooks';
import { showVideoCallPopupCenter } from '../VideoCall/videoCallPopupInstance';
import { checkIsBelongTo } from './helper';
import CustomButton from '../Button/customButton';


const AppointmentInfo = forwardRef((props, ref) => {
  const [state, setState] = useMergeState({
    isShowCancelModal: false,
    loading: false,
  });

  useImperativeHandle(ref, () => ({
    closeConfirmModal() {
      setState({ isShowCancelModal: false, loading: false });
    },
  }));

  const {
    className, onCloseDrawer, selectedPatient, attendees, data,
    onClickEditAppointment, isJoin, updateAppointment,
  } = props;

  const {
    date, time, appointmentType, isCancel, _id,
  } = data;

  const { isShowCancelModal, loading } = state;

  const toggleCancelModal = () => {
    setState({ isShowCancelModal: !isShowCancelModal });
  };


  const onClickJoin = () => {
    showVideoCallPopupCenter({
      url: `video-call/${_id}`,
      title: 'Video call',
      isFull: true,
    });
  };

  const isDisabled = () => isCancel || moment().valueOf() > moment(date).valueOf();

  const onClickCancelAppointment = () => {
    updateAppointment(true);
    setState({ loading: true });
  };

  const appointmentInfo = [
    {
      title: 'Appointment type',
      data: appointmentType,
    },
    {
      title: 'Date',
      data: date ? moment(date).format('MM/DD/YYYY') : '',
    },
    {
      title: 'Time',
      data: time ? moment(time).format('hh:mm A') : '',
    },
  ];

  return (
    <>
      <div className={classnames('appointment-drawer', 'appointment-info', className)}>
        <ModalHeader
          className="patient-info-drawer-header"
          title="Appointment information"
          onClick={onCloseDrawer}
        />

        <div className="main-wrapper">

          {
            isCancel && (
              <div className="appointment-info-cancel-row">
                <span>This appointment was cancelled</span>
              </div>
            )
          }

          <div className="appointment-drawer-b-title">
            Patient
          </div>

          <PatientAppointmentInfo
            className="mt4"
            data={selectedPatient}
          />


          <div className="appointment-drawer-b-title mt16">
            Appointment information
          </div>

          <DisplayData2
            className="mt8"
            data={appointmentInfo}
            isStrip
            leftWidth={6}
          />

          {
            isJoin && (
              <CustomButton
                block
                type="primary"
                className="appointment-drawer-join-btn"
                onClick={onClickJoin}
                icon={<VideoCameraOutlined className="join-camera-icon" />}
                label="Join"
              />
            )
          }

          <div className="appointment-drawer-b-title mt16">
            Attendees
          </div>

          {
            _.map(attendees, (x, i) => x.isCheck && (
              <PatientAppointmentInfo
                key={i}
                className="mt8"
                data={x}
              />
            ))
          }

          <div className="appointment-info-footer-btns">
            <CustomButton
              disabled={isDisabled()}
              ghost
              danger
              onClick={toggleCancelModal}
              label="Cancel appointment"
            />
          </div>

        </div>
      </div>

      <ConfirmationLayout
        toggleClick={toggleCancelModal}
        type={CONFIRMATION_LAYOUT_TYPES.CANCEL_APPOINTMENT}
        visible={isShowCancelModal}
        onClick={onClickCancelAppointment}
        isConfirming={loading}
      />
    </>
  );
});
AppointmentInfo.defaultProps = {
  className: '',
  onCloseDrawer: () => { },
  selectedPatient: {},
  attendees: [],
  data: {},
  onClickEditAppointment: () => { },
  updateAppointment: () => { },
  isJoin: false,
};
AppointmentInfo.propTypes = {
  className: PropTypes.string,
  onCloseDrawer: PropTypes.func,
  selectedPatient: PropTypes.shape(),
  attendees: PropTypes.arrayOf(PropTypes.shape()),
  data: PropTypes.shape(),
  onClickEditAppointment: PropTypes.func,
  updateAppointment: PropTypes.func,
  isJoin: PropTypes.bool,
};

export default AppointmentInfo;
