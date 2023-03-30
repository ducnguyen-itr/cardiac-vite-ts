import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CheckCircleFilled, ClockCircleFilled, CloseCircleFilled, VideoCameraOutlined,
} from '@ant-design/icons';
import { Drawer, Space, Spin } from 'antd';
import moment from 'moment';
import { useHistory } from 'react-router';
import ModalHeader from '../../UI/modalHeader';

import { useActions, useEmitter, useMergeState } from '../../../Helpers/customHooks';
import EventHeader from './Layout/eventHeader';
import {
  fetchAppointmentDetail, getAppointmentInfoData, getPatientInfoData,
} from './helper';
import DisplayData2 from '../../UI/displayData2';
import DisplayCaregiver from '../../UI/displayCaregiver';
import EventButons from './Layout/eventButons';
import {
  getAttendeeInfoData,
} from '../../../Pages/Appointments/ApointmentDetails/Layout/ScheduledApt/helper';
import consoleLog from '../../../Helpers/consoleLog';
import { APPOINTMENT_TYPES, SCHEDULE_TYPES } from '../../../Constants';
import './style.scss';
import CustomButton from '../../Button/customButton';
import { showVideoCallPopupCenter } from '../../VideoCall/videoCallPopupInstance';
import auth from '../../../Helpers/auth';
import handleClinicUpdateEventStatus from '../../../Apollo/Functions/Handle/handleClinicUpdateEventStatus';
import { showFailedMsg } from '../../../Utils/showNotification';
import EMITTER_CONSTANTS from '../../../Constants/emitter';
import EditAppointmentDrawer from '../EditAppointmentDrawer';
import { EVENT_STATUS, EVENT_TIME_STATUS } from '../../../Constants/appointment';
import { setPathRequest } from '../../../Redux/Actions/savePath';


function EventInfoDrawer(props) {
  const history = useHistory();
  const [state, setState] = useMergeState({
    isEdit: true,
    type: EVENT_STATUS.CANCELED,
    loading: false,
    appointmentData: {},
  });

  const actions = useActions({ setPathRequest });

  const [editAppointment, setEditAppointment] = useMergeState({
    isShowDrawer: false,
  });

  const [isRecheck, setRecheck] = useState(false);

  const fetchData = async () => {
    setState({ loading: true });
    try {
      const appointmentData = await fetchAppointmentDetail(props.appointmentId);
      setState({ appointmentData });
    } catch (error) {
      consoleLog(error);
    }
    setState({ loading: false });
  };

  const onClickJoinCall = (_id) => {
    showVideoCallPopupCenter({
      url: `video-call/${_id}`,
      title: 'Video call',
      isFull: true,
    });
  };

  const onClickEdit = () => {
    setEditAppointment({ isShowDrawer: true });
  };

  const onCloseAppointmentDrawer = () => {
    setEditAppointment({ isShowDrawer: false });
  };

  const handleMarkAppointment = async (appointmentId = '', status = '') => {
    setState({ loading: true });
    try {
      // Overdue || Finished
      await handleClinicUpdateEventStatus({ _id: appointmentId, status });
    } catch (error) {
      showFailedMsg(`Failed to mark it as ${status === 'Overdue' ? 'overdue' : 'done'}!`);
      consoleLog(error);
    }
    setState({ loading: false });
  };

  const goToDetail = () => {
    if (props.name === 'appointments') {
      actions.setPathRequest({ redirecFilter: { calendarFilter: props.filter } });
    }
    const pathName = `/appointments/${state?.appointmentData?._id}`;
    history.push(pathName);
  };

  const onUpdateEventListener = ({ _id }) => {
    if (_id === props.appointmentId) {
      fetchData();
    }
  };

  useEffect(() => {
    if (props.appointmentId && props.visible) {
      fetchData();
    }
  }, [props.appointmentId, props.visible]);
  useEffect(() => {
    const interval = setInterval(() => { setRecheck(prev => !prev); }, 60000);
    return () => { if (interval) { clearInterval(interval); } };
  }, []);

  const appointmentInfo = useMemo(() => getAppointmentInfoData(state.appointmentData), [state.appointmentData]);
  const patientInfo = useMemo(() => getPatientInfoData(state.appointmentData), [state.appointmentData]);
  const attendeeInfo = useMemo(() => getAttendeeInfoData(state.appointmentData), [state.appointmentData]);

  const eventStatus = useMemo(() => {
    const is15Upcoming = moment(state.appointmentData?.fromTime).diff(moment(), 'm') <= 15
      && moment(state.appointmentData?.fromTime).diff(moment(), 'm') > 0;
    const isUpcoming = moment(state.appointmentData?.fromTime).diff(moment(), 'm') > 15;
    return isUpcoming ? EVENT_TIME_STATUS.BEFORE_BOOKING : is15Upcoming ? EVENT_TIME_STATUS.BEFORE_BOOKING_15 : EVENT_TIME_STATUS.IN_BOOKING;
  }, [state.appointmentData, isRecheck]);

  const isMyPatient = useMemo(() => {
    const userId = auth.userId();
    return state.appointmentData?.attendeesIds?.includes(userId);
  }, [state.appointmentData?.attendeesIds]);

  const isShowJoinBtn = useMemo(() => {
    if (state.appointmentData?.appointmentType === APPOINTMENT_TYPES[1]) {
      return false;
    }
    const from = moment(state.appointmentData?.fromTimeMoment).subtract(15, 'minutes');
    const to = state.appointmentData?.callStatus === 'Started' ? moment(state.appointmentData?.toTimeMoment)
      : moment(state.appointmentData?.fromTimeMoment).add(30, 'minutes');
    if (moment().isBetween(from, to, undefined, '[]') && !state.appointmentData?.isCancel && state.appointmentData?.isShowVideoIcon) {
      return true;
    }
    return false;
  }, [state.appointmentData, isRecheck]);

  useEmitter(EMITTER_CONSTANTS.ON_UPDATE_EVENT, onUpdateEventListener, [props.appointmentId]);
  useEmitter(EMITTER_CONSTANTS.ON_APPOINTMENT_SYNCED, onUpdateEventListener, [props.appointmentId]);

  const renderStatus = (type) => {
    switch (type) {
      case EVENT_STATUS.FINISHED:
        return (
          <div className="event-status">
            <CheckCircleFilled className="event-status-icon" />
            <p>{EVENT_STATUS.DONE}</p>
          </div>
        );
      case EVENT_STATUS.OVERDUE:
        return (
          <div className="event-status overdue">
            <ClockCircleFilled className="event-status-icon" />
            <p>{EVENT_STATUS.OVERDUE}</p>
          </div>
        );
      case EVENT_STATUS.CANCELED:
        return (
          <div className="event-status canceled">
            <CloseCircleFilled className="event-status-icon" />
            <p>{EVENT_STATUS.CANCELED}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      width={400}
      placement="right"
      className="event-info-drawer-wrapper"
      onClose={props.onCancel}
      visible={props.visible}
      maskClosable
    >
      <ModalHeader
        title="More information"
        onClick={props.onCancel}
      />
      {
        state.loading && (
          <Space className="loading-space" size="middle">
            <Spin size="large" />
          </Space>
        )
      }
      <div className="event-info-drawer-body">
        <EventHeader
          isShowEditBtn={eventStatus === EVENT_TIME_STATUS.BEFORE_BOOKING && state.appointmentData?.status === EVENT_STATUS.ACTIVE}
          data={state.appointmentData}
          className="mb20"
          onClickEdit={onClickEdit}
        />
        {renderStatus(state.appointmentData?.status)}

        {isShowJoinBtn && (
          <div className="padlr40">
            <CustomButton
              icon={<VideoCameraOutlined />}
              label="Join now"
              type="primary"
              className="w100 mb20"
              onClick={() => onClickJoinCall(state?.appointmentData?._id)}
            />
          </div>
        )}

        <div className="event-info-title mb12">Appointment infomation</div>
        <DisplayData2 className="event-data-info" data={appointmentInfo} />

        <div className="event-info-title mt20 mb12">Patient’s infomation</div>
        <DisplayData2 className="event-data-info" data={patientInfo} />

        <DisplayCaregiver
          className="mt20"
          isAttendee
          isDetails={false}
          caregiverInfo={attendeeInfo}
        />

        <EventButons
          goToDetail={goToDetail}
          data={state.appointmentData}
          eventStatus={eventStatus}
          isMyPatient={isMyPatient}
          handleMarkAppointment={handleMarkAppointment}
        />
      </div>

      <EditAppointmentDrawer
        _id={props.appointmentId}
        followUpId={state.followUpId}
        visible={editAppointment.isShowDrawer}
        onCloseDrawer={onCloseAppointmentDrawer}
        type={SCHEDULE_TYPES[state.followUpId ? 1 : 0]}
      />
    </Drawer>
  );
}


EventInfoDrawer.defaultProps = {
  visible: true,
  onCancel: () => { },
  appointmentId: '',
  name: '',
  filter: {},
};

EventInfoDrawer.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  appointmentId: PropTypes.string,
  name: PropTypes.string,
  filter: PropTypes.shape(),
};

export default EventInfoDrawer;
