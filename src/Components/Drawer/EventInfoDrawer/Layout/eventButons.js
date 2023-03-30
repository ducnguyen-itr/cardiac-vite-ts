import {
  ArrowRightOutlined, CheckOutlined, ClockCircleOutlined, DownOutlined,
} from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import handleClinicCancelEvent from '../../../../Apollo/Functions/Handle/handleClinicCancelEvent';
import handleClinicUpdateEventStatus from '../../../../Apollo/Functions/Handle/handleClinicUpdateEventStatus';
import handleFinishCall from '../../../../Apollo/Functions/Handle/handleFinishCall';
import handleResendAppointmentCode from '../../../../Apollo/Functions/Handle/handleResendAppointmentCode';
import { CONFIRMATION_LAYOUT_TYPES } from '../../../../Constants';
import { EVENT_STATUS } from '../../../../Constants/appointment';
import consoleLog from '../../../../Helpers/consoleLog';
import { useMergeState } from '../../../../Helpers/customHooks';
import ConfirmationLayout from '../../../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import { showFailedMsg, showSuccessMsg } from '../../../../Utils/showNotification';
import CustomButton from '../../../Button/customButton';
import {
  CANCEL_APPOINTMENT_TYPES, CLINIC_UPDATE_EVENT_ENUM, getShowBtn,
} from '../helper';


function EventButons(props) {
  const [state, setState] = useMergeState({
    isShowCancelModal: false,
    isShowFinishModal: false,
    camcelModalKey: '',
    cancelModalType: '',
  });

  const [resendModal, setResendModal] = useMergeState({
    isShowResendModal: false,
    eventId: '',
  });

  const { appointmentType, status } = props.data || {};
  const showBtnObj = useMemo(() => getShowBtn(appointmentType, status, props.eventStatus, props.isMyPatient), [appointmentType,
    status, props.eventStatus, props.isMyPatient]);

  const confirmCancelAppointment = async () => {
    setState({ loading: true });
    try {
      const options = state.camcelModalKey === '1' ? CLINIC_UPDATE_EVENT_ENUM.FOLLOWING_EVENTS
        : state.camcelModalKey === '2' ? CLINIC_UPDATE_EVENT_ENUM.FUTURE_EVENTS : undefined;
      await handleClinicCancelEvent({ _id: props.data?._id, options });
      showSuccessMsg('The appointment is successfully canceled!');
      setState({
        isShowCancelModal: false,
        camcelModalKey: '',
        cancelModalType: '',
      });
    } catch (error) {
      showFailedMsg('Failed to cancel appointment!');
      consoleLog(error);
    }
    setState({ loading: false });
  };

  const handleFinishAppointment = async () => {
    setState({ loading: true });
    try {
      if (state.appointmentData?.callId) {
        await handleFinishCall({ callId: state.appointmentData?.callId });
      } else {
        await handleClinicUpdateEventStatus({ _id: props.data?._id, status: 'Finished' });
      }
      // showSuccessMsg('The appointment is successfully finished!');
      setState({ isShowFinishModal: false });
    } catch (error) {
      showFailedMsg('Failed to finish appointment!');
      consoleLog(error);
    }
    setState({ loading: false });
  };

  const toggleResendModal = () => {
    setResendModal({ isShowResendModal: !resendModal.isShowResendModal, eventId: '' });
  };

  const onResendCodeClick = (eventId) => {
    setResendModal({ eventId, isShowResendModal: true });
  };

  const onConfirmResendCode = async () => {
    setResendModal({ loading: true });
    try {
      const data = await handleResendAppointmentCode({ _id: resendModal?.eventId });
      if (data?.isSuccess) {
        showSuccessMsg('Resend appointment code successfully!');
        toggleResendModal();
      } else {
        showFailedMsg('Failed to resend appointment code!');
      }
    } catch (error) {
      showFailedMsg('Failed to resend appointment code!');
    } finally {
      setResendModal({ loading: false });
    }
  };

  const onCancelApm = ({ key }) => {
    setState({
      isShowCancelModal: !state.isShowCancelModal,
      camcelModalKey: key,
      cancelModalType: key === '0' ? CONFIRMATION_LAYOUT_TYPES.CANCEL_THIS_APPOINTMENT
        : key === '1' ? CONFIRMATION_LAYOUT_TYPES.CANCEL_FOLLOW_APPOINTMENT
          : CONFIRMATION_LAYOUT_TYPES.CANCEL_ALL_APPOINTMENT,
    });
  };

  const toggleCancelModal = () => {
    setState({
      isShowCancelModal: !state.isShowCancelModal,
      camcelModalKey: '',
      cancelModalType: '',
    });
  };

  const toggleFinishModal = () => {
    setState({ isShowFinishModal: !state.isShowFinishModal });
  };

  const menu = (
    <Menu onClick={onCancelApm} className="dropdown-cancel-apm-menu">
      {_.map(CANCEL_APPOINTMENT_TYPES, (x, i) => (
        <Menu.Item className="dropdown-cancel-apm-item" key={i}>
          {x}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="event-button-container mt20">
      {showBtnObj?.showCancelAPM && props.data?.isInvitedPatient && (
        <CustomButton
          className="w100 mb20"
          type="primary"
          label="Resend appointment code"
          onClick={() => onResendCodeClick(props.data?._id)}
          ghost
        />
      )}
      {showBtnObj?.isShowMarkBtn && (
        <CustomButton
          className="mark-as-done w100 mb20"
          label="Mark as done"
          icon={<CheckOutlined />}
          type="primary"
          onClick={() => props.handleMarkAppointment(props.data?._id, EVENT_STATUS.FINISHED)}
        />
      )}
      {showBtnObj?.isShowMarkBtn && (
        <CustomButton
          className="mark-as-overdue w100 mb20"
          label="Mark as overdue"
          icon={<ClockCircleOutlined />}
          type="primary"
          onClick={() => props.handleMarkAppointment(props.data?._id, EVENT_STATUS.OVERDUE)}
        />
      )}

      {showBtnObj?.isFinishAPM && (
        <CustomButton
          className="w100 mb20"
          type="primary"
          label="Finish appointment"
          icon={<CheckOutlined />}
          onClick={toggleFinishModal}
        />
      )}

      {showBtnObj?.showCancelAPM && (
        <>
          {props.data?.isRecurring ? (
            <Dropdown
              overlay={menu}
              trigger={['click']}
              placement="bottomLeft"
            >
              <CustomButton
                className="w100 mb20 row-reverse"
                type="primary"
                ghost
                danger
                label="Cancel appointment"
                icon={<DownOutlined />}
              />
            </Dropdown>
          ) : (
            <CustomButton
              className="w100 mb20 row-reverse"
              type="primary"
              ghost
              danger
              label="Cancel appointment"
              // icon={<DownOutlined />}
              onClick={() => onCancelApm({ key: '0' })}
            />
          )}
        </>
      )}

      <CustomButton
        className="w100 row-reverse"
        type="primary"
        ghost
        label="Go to appointment details"
        icon={<ArrowRightOutlined />}
        onClick={props.goToDetail}
      />

      <ConfirmationLayout
        toggleClick={toggleCancelModal}
        onClick={confirmCancelAppointment}
        type={state.cancelModalType}
        isConfirming={state.loading}
        visible={state.isShowCancelModal}
      />

      <ConfirmationLayout
        toggleClick={toggleFinishModal}
        type={CONFIRMATION_LAYOUT_TYPES.APPOINTMENT_FINISHED}
        onClick={handleFinishAppointment}
        isConfirming={state.loading}
        visible={state.isShowFinishModal}
      />

      <ConfirmationLayout
        toggleClick={toggleResendModal}
        type={CONFIRMATION_LAYOUT_TYPES.RESEND_APPOINTMENT_CODE}
        visible={resendModal.isShowResendModal}
        onClick={onConfirmResendCode}
        isConfirming={resendModal.loading}
      />
    </div>
  );
}

EventButons.defaultProps = {
  data: {},
  eventStatus: '',
  isMyPatient: false,
  handleMarkAppointment: () => { },
  goToDetail: () => { },
};

EventButons.propTypes = {
  data: PropTypes.shape(),
  eventStatus: PropTypes.string,
  isMyPatient: PropTypes.bool,
  handleMarkAppointment: PropTypes.func,
  goToDetail: PropTypes.func,
};

export default EventButons;
