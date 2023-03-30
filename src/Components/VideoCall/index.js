import { CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Space, Spin } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import React, {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import fetchAppointmentVideo from '../../Apollo/Functions/Fetch/fetchAppointmentVideo';
import fetchTimeLog from '../../Apollo/Functions/Fetch/fetchTimeLog';
import handleAddTimeLog from '../../Apollo/Functions/Handle/handleAddTimeLog';
import handleLeaveCall from '../../Apollo/Functions/Handle/handleLeaveCall';
import handleUpdateTimeLog from '../../Apollo/Functions/Handle/handleUpdateTimeLog';
import { CONFIRMATION_LAYOUT_TYPES } from '../../Constants';
import EMITTER_CONSTANTS from '../../Constants/emitter';
import { TIME_LOG_STATUS_ENUM } from '../../Constants/enum';
import auth from '../../Helpers/auth';
import consoleLog from '../../Helpers/consoleLog';
import { useActions, useEmitter, useMergeState } from '../../Helpers/customHooks';
import ConfirmationLayout from '../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import { setLeavePopRequest } from '../../Redux/Actions/leavePopUp';
import { convertPluralMedicationUnit } from '../../Utils';
import { checkVideoCallStatus, VIDEO_CALL_STATUS } from '../../Utils/calendar';
import { sortListCondition } from '../../Utils/initialIntakeInfo';
import CustomButton from '../Button/customButton';
import {
  formatAttendees,
  getAttendeeIds,
  handleFetchEvent, handleFinishAppointment, handleJoinCall, isChrome,
} from './helper';
import Rejoin from './rejoin';
import VideoCallSideTab from './VideoCallSideTab';
import VideoCallView from './videoCallView';

const {
  VIDEO_CRASH, VIDEO_CALL_LINK_EXPIRED, FINISH_APPOINTMENT, OVERDUE_APPOINTMENT, CANCELED_APPOINTMENT,
} = CONFIRMATION_LAYOUT_TYPES;
const {
  START, END, CHANGE_UPDATER, UPDATE_PARTICIPANTS,
} = VIDEO_CALL_STATUS;

const VideoCallWindow = () => {
  const lastPermissionCam = useRef();
  const lastPermissionMic = useRef();
  const videoStatusRef = useRef(undefined);
  const params = useParams();
  const videoCallViewRef = useRef();
  const chimeData = useRef(undefined);
  const callId = useRef(undefined);
  const activityCode = useRef(auth.getTimeSheetKey());
  const saveParticipantsRef = useRef([]);
  const oldAttendeesList = useRef([]);
  const timeLogIdRef = useRef(undefined);
  const timeLogDurationRef = useRef(0);
  const [loadingFinishApt, setLoadingFinishApt] = useState(false);
  const [data, setData] = useState({});
  const [loadingMain, setLoadingMain] = useState(true);

  const leavePopUp = useSelector(state => state.leavePopUp);

  const actions = useActions({ setLeavePopRequest }, []);

  const [state, setState] = useMergeState({
    chimeData: {
      meeting: undefined,
      attendee: undefined,
    },
    attendees: [],
    loading: true,
    modalContentType: '',
    appointmentInfo: {},
    timeLogId: '',
    isPermissionDeniedModal: false,
    isDisabledCamera: false,
    isDisabledMicrophone: false,
    isShowReloadModal: false,
    isRejoin: false,
  });

  const handleSetInitialData = (appointment) => {
    if (!_.isEmpty(appointment)) {
      const {
        info, patient, fromTime, _id, carePlan,
      } = appointment;
      setData({
        info: {
          reasons: info?.reasons || [],
          note: info?.note || '--',
          condition: info?.condition || [],
          medicalHistory: info?.medicalConditions ? sortListCondition(info?.medicalConditions) : [],
          medication: _.map(info?.medication || [], x => ({
            name: x.name,
            frequency: `${x.frequency} ${+x.frequency > 1 ? 'times' : 'time'}/day`,
            dosages: `${x.dosages} ${+x.dosages > 1 ? convertPluralMedicationUnit(x.unit) : x.unit}/time`,
            note: x.note,
            timeToTake: x.timeToTake,
          })),
          symptom: info?.symptom || '--',
          patient: {
            _id: patient?._id,
            photo: patient?.photo,
            ...(patient || {}),
            ...(carePlan?.patientDemographic || {}),
          },
          allergies: info?.allergies || '--',

        },
        vital: info?.vital || {},
        _id,
      });
      setState({
        appointmentInfo: {
          ...appointment,
          carePlanId: appointment?.carePlan?._id,
        },
        attendees: formatAttendees(appointment?.attendees),
      });
    } else {
      setState({ modalContentType: VIDEO_CRASH });
    }
  };

  const handleInitialData = async () => {
    if (params?.appointmentId && !_.isEmpty(auth.getLoginData())) {
      try {
        const promises = [handleFetchEvent(params.appointmentId), handleJoinCall(params.appointmentId)];
        const result = await Promise.all(promises);
        if (!result[1]) {
          setState({ modalContentType: VIDEO_CRASH });
          return;
        }
        const appointment = result[0];
        handleSetInitialData(appointment);
      } catch (error) {
        setState({ modalContentType: VIDEO_CRASH });
      }
    }
  };


  const onHandleLeaveCall = async () => {
    const id = callId.current;

    if (_.isEmpty(id)) {
      // toastrError('Could not join the appointment', 'Error');
      return;
    }
    const variables = {
      callId: id,
    };
    try {
      const result = await handleLeaveCall(variables);
    } catch (error) {
      // toastrError('Could not join the appointment', 'Error');
    }
  };

  const onEndCallClick = async (isLeave = true) => {
    if (isLeave) {
      await onHandleLeaveCall();
    }
    videoStatusRef.current = undefined;
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  const handleAddTimeTracking = async () => {
    const sendingData = {
      input: {
        carePlan: state.appointmentInfo?.carePlanId || state.appointmentInfo?.friendlyId,
        activity: _.find(activityCode.current, y => y.value === 'Appointment').key,
        date: moment().toISOString(),
        participants: saveParticipantsRef.current,
        notes: '--',
        isManual: false,
        appointment: params?.appointmentId,
        duration: 60, // 60s
        status: TIME_LOG_STATUS_ENUM.DONE,
      },
    };

    try {
      const res = await handleAddTimeLog(sendingData);
      setState({ timeLogId: res?.timeLog?._id || '' });
      timeLogDurationRef.current = 60;
    } catch (error) {
      consoleLog('Failed to add time sheet: ', error);
    }
  };

  const updateAppointmentPerMin = async () => {
    if (timeLogIdRef.current) {
      timeLogDurationRef.current += 30;
      const sendingData = {
        _id: timeLogIdRef.current,
        input: {
          activity: _.find(activityCode.current, y => y.value === 'Appointment').key,
          date: moment().toISOString(),
          participants: saveParticipantsRef.current,
          notes: '--',
          isManual: false,
          duration: timeLogDurationRef.current,
        },
      };
      try {
        await handleUpdateTimeLog(sendingData);
      } catch (error) {
        consoleLog('Failed to update time sheet: ', error);
      }
    }
  };

  const handleKeepUpdateAppointmentTracking = async () => {
    try {
      const appointment = await fetchAppointmentVideo(params.appointmentId);
      if (!appointment?.lastTimeLog) {
        consoleLog('No time sheet lastTimeLog: ', appointment);
        return;
      }
      const timeLogData = await fetchTimeLog({ _id: appointment.lastTimeLog });
      timeLogDurationRef.current = timeLogData?.duration || 0;
      setState({ timeLogId: appointment.lastTimeLog });
    } catch (error) {
      consoleLog('Failed to change updater time sheet: ', error);
    }
  };

  const handleUpdateParticipants = async () => {
    if (timeLogIdRef.current) {
      const sendingData = {
        _id: timeLogIdRef.current,
        input: {
          activity: _.find(activityCode.current, y => y.value === 'Appointment').key,
          date: moment().toISOString(),
          participants: saveParticipantsRef.current,
          notes: '--',
          isManual: false,
          duration: timeLogDurationRef.current,
        },
      };
      try {
        await handleUpdateTimeLog(sendingData);
      } catch (error) {
        consoleLog('Failed to update PARTICIPANTS time sheet: ', error);
      }
    }
  };

  useEffect(() => {
    if (state.appointmentInfo?.carePlanId) { // only log time tracking when this patient is CCM patient
      timeLogIdRef.current = state.timeLogId;
      if (state.timeLogId) {
        const updateTimeLogInterval = setInterval(() => {
          if (timeLogIdRef.current === '') {
            clearInterval(updateTimeLogInterval);
          }
          updateAppointmentPerMin();
        }, 30000);
      }
    }
  }, [state.timeLogId]);

  const onAttendeeChanged = (newData) => {
    if (!state.appointmentInfo?.carePlanId) return; // dont log time tracking when this patient is non CCM patient
    const newAttendeeIds = [];
    _.forEach(newData, (x) => {
      if (x.userId) {
        newAttendeeIds.push(x.userId);
      }
    });
    if (newAttendeeIds.length === 0) {
      return;
    }
    if (_.isEqual(oldAttendeesList.current, newAttendeeIds)) {
      return;
    }
    const { nurseId, physicianId } = getAttendeeIds(state.appointmentInfo.attendees);
    const videoCallStatus = checkVideoCallStatus(
      state.appointmentInfo, newAttendeeIds, oldAttendeesList.current, !!timeLogIdRef.current, saveParticipantsRef.current,
    );

    if (saveParticipantsRef.current.length < 2) {
      if (_.find(newAttendeeIds, x => x === nurseId) && !saveParticipantsRef.current.includes(nurseId)) {
        saveParticipantsRef.current.push(nurseId);
      }
      if (_.find(newAttendeeIds, x => x === physicianId) && !saveParticipantsRef.current.includes(physicianId)) {
        saveParticipantsRef.current.push(physicianId);
      }
    }
    switch (videoCallStatus) {
      case START: {
        if (auth.isNurse() || !saveParticipantsRef.current.includes(nurseId)) {
          handleAddTimeTracking();
        }
        break;
      }
      case END: {
        setState({ timeLogId: '' });
        timeLogIdRef.current = '';
        break;
      }
      case CHANGE_UPDATER: {
        // No state.timeLogId
        handleKeepUpdateAppointmentTracking();
        break;
      }
      case UPDATE_PARTICIPANTS: {
        handleUpdateParticipants();
        break;
      }
      default:
        break;
    }
    oldAttendeesList.current = _.cloneDeep(newAttendeeIds);
  };

  const onDidStop = () => {
    if (videoStatusRef.current !== FINISH_APPOINTMENT
      && videoStatusRef.current !== OVERDUE_APPOINTMENT
      && videoStatusRef.current !== CANCELED_APPOINTMENT) {
      setState({ modalContentType: VIDEO_CRASH });
    }
  };

  const onClickOKModal = useCallback(() => {
    switch (state.modalContentType) {
      case VIDEO_CALL_LINK_EXPIRED:
      case VIDEO_CRASH:
      case FINISH_APPOINTMENT:
      case OVERDUE_APPOINTMENT:
      case CANCELED_APPOINTMENT:
        onEndCallClick(false);
        break;
      default:
        break;
    }
  }, [state.modalContentType]);

  const onFinishappointmentClick = async () => {
    if (leavePopUp?.isUnsaved) {
      actions.setLeavePopRequest({
        type: 'UNSAVED_VITALS',
        isShowLeaveModal: true,
        func: async () => {
          setLoadingFinishApt(true);
          const isSuccess = await handleFinishAppointment(callId.current);
          setState({ isShowFinishedModal: false });
          if (isSuccess) {
            onEndCallClick();
          } else {
            consoleLog('Error');
          }
          setLoadingFinishApt(false);
        },
      });
      return;
    }
    setLoadingFinishApt(true);
    const isSuccess = await handleFinishAppointment(callId.current);
    setState({ isShowFinishedModal: false });
    if (isSuccess) {
      onEndCallClick();
    } else {
      consoleLog('Error');
    }
    setLoadingFinishApt(false);
  };

  const toggleFinishModal = () => {
    setState({ isShowFinishedModal: !state.isShowFinishedModal });
  };

  const togglePermisionDeniedModal = () => {
    setState({ isPermissionDeniedModal: !state.isPermissionDeniedModal });
  };

  const onConfirmReloadPage = () => {
    window.location.reload();
  };

  const handleReceiveChimeObjectFromServer = (data) => {
    if (!_.isEmpty(data?.meeting) && !_.isEmpty(data?.attendee)) {
      const {
        attendee, meeting, _doc, _id,
      } = data;
      callId.current = _doc?._id || _id;

      chimeData.current = { meeting, attendee };
      setState({ loading: false });
    }
  };

  const onNewCallListener = (data) => {
    if (data?.event === params?.appointmentId || data?._doc?.event === params?.appointmentId) {
      handleReceiveChimeObjectFromServer(data);
    }
  };

  const onUpdateCallListener = (data) => {
    if (data?.event === params?.appointmentId || data?._doc?.event === params?.appointmentId) {
      handleReceiveChimeObjectFromServer(data);
    }
  };

  const onRefreshCallListener = (data) => {
    handleReceiveChimeObjectFromServer(data);
    if (videoCallViewRef.current
      && !videoCallViewRef.current?.isMeettingSessionAvailable() && data?.event === params?.appointmentId) {
      videoCallViewRef.current.startChimeMeeting(data?.meeting, data?.attendee);
      chimeData.current = { meeting: data?.meeting, attendee: data?.attendee };
    }
  };

  const onUpdateEventListener = async (data) => {
    if (data?._id === params?.appointmentId && data?.status === 'Overdue') {
      videoStatusRef.current = OVERDUE_APPOINTMENT;
      setState({ modalContentType: OVERDUE_APPOINTMENT });
      return;
    }
    if (data?._id === params?.appointmentId && data?.status === 'Canceled') {
      videoStatusRef.current = CANCELED_APPOINTMENT;
      setState({ modalContentType: CANCELED_APPOINTMENT });
      return;
    }
    if (data?._id === params?.appointmentId && data?.status === 'Finished') {
      videoStatusRef.current = FINISH_APPOINTMENT;
      setState({ modalContentType: FINISH_APPOINTMENT });
    }
    if (data?._id === params?.appointmentId && data?.status === 'Active') {
      const appointment = await handleFetchEvent(params.appointmentId);
      handleSetInitialData(appointment);
    }
  };

  const checkPermissionChrome = async () => {
    const cameraPermission = await navigator.permissions.query({ name: 'camera' });
    const microphonePermission = await navigator.permissions.query({ name: 'microphone' });
    if (cameraPermission?.state === 'denied' || microphonePermission?.state === 'denied') {
      setState({
        isPermissionDeniedModal: true,
        isDisabledCamera: cameraPermission?.state === 'denied',
        isDisabledMicrophone: microphonePermission?.state === 'denied',
      });
    }
    cameraPermission.onchange = function (e) {
      if (!state.isShowReloadModal && e?.target?.state !== 'denied') {
        setState({ isShowReloadModal: true });
      }
      setState({ isDisabledCamera: e?.target?.state === 'denied' });
    };
    microphonePermission.onchange = function (e) {
      if (!state.isShowReloadModal && e?.target.state !== 'denied') {
        setState({ isShowReloadModal: true });
      }
      setState({ isDisabledMicrophone: e?.target?.state === 'denied' });
    };
  };

  const checkPermissionAnother = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        lastPermissionMic.current = true;
      }).catch((err) => {
        if (err?.toString()?.includes('Permission denied')
          || err?.toString()?.includes('The request is not allowed by the user agent or the platform in the current context.')
          || err?.toString()?.includes('denied permission')) {
          setState({
            isPermissionDeniedModal: true,
            isDisabledMicrophone: true,
          });
          lastPermissionMic.current = false;
        }
      });
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        lastPermissionCam.current = true;
      }).catch((err) => {
        if (err?.toString()?.includes('Permission denied')
          || err?.toString()?.includes('The request is not allowed by the user agent or the platform in the current context.')
          || err?.toString()?.includes('denied permission')) {
          setState({
            isPermissionDeniedModal: true,
            isDisabledCamera: true,
          });
          lastPermissionCam.current = false;
        }
      });
  };

  // const getPermissionUpdate = () => {
  //   // navigator.mediaDevices.getUserMedia({ audio: true })
  //   //   .then((stream) => {
  //   //     // if (!lastPermissionMic.current) {
  //   //     //   setState({ isShowReloadModal: true });
  //   //     // }
  //   //     lastPermissionMic.current = true;
  //   //   }).catch((err) => {
  //   //     if (err?.toString()?.includes('Permission denied')
  //   //     || err?.toString()?.includes('The request is not allowed by the user agent or the platform in the current context.')
  //   //     || err?.toString()?.includes('denied permission')) {
  //   //       // if (lastPermissionMic.current) {
  //   //       //   setState({
  //   //       //     isDisabledMicrophone: true,
  //   //       //   });
  //   //       // }
  //   //       lastPermissionMic.current = false;
  //   //     }
  //   //   });
  //   navigator.mediaDevices.getUserMedia({ video: true })
  //     .then((stream) => {
  //       // if (!lastPermissionCam.current) {
  //       //   setState({ isShowReloadModal: true });
  //       // }
  //       lastPermissionCam.current = true;
  //     }).catch((err) => {
  //       if (err?.toString()?.includes('Permission denied')
  //       || err?.toString()?.includes('The request is not allowed by the user agent or the platform in the current context.')
  //       || err?.toString()?.includes('denied permission')) {
  //         // if (lastPermissionCam.current) {
  //         //   setState({ isDisabledCamera: true });
  //         // }
  //         lastPermissionCam.current = false;
  //       }
  //     });
  // };

  // useEffect(() => {
  //   const updatePermission = setInterval(() => {
  //     getPermissionUpdate();
  //   }, 5000);
  //   return () => {
  //     clearInterval(updatePermission);
  //   };
  // }, []);

  const isPageReload = (
    (window.performance.navigation && window.performance.navigation.type === 1)
    || window.performance
      .getEntriesByType('navigation')
      .map(nav => nav.type)
      .includes('reload')
  );

  const socketConnected = () => {
    setLoadingMain(false);
    if (!isPageReload) {
      setTimeout(() => {
        handleInitialData();
      }, 1500);
    }
  };

  const onRejoinClick = () => {
    setState({ isRejoin: false });
    handleInitialData();
  };

  useLayoutEffect(() => {
    if (isPageReload) {
      setState({ isRejoin: true });
    }
  }, []);

  useEffect(() => {
    if (isChrome()) {
      checkPermissionChrome();
    } else {
      checkPermissionAnother();
    }
  }, []);

  useEmitter(EMITTER_CONSTANTS.ON_NEW_CALL, onNewCallListener, []);
  useEmitter(EMITTER_CONSTANTS.ON_UPDATE_CALL, onUpdateCallListener, []);
  useEmitter(EMITTER_CONSTANTS.ON_REFRESH_CALL, onRefreshCallListener, []);
  useEmitter(EMITTER_CONSTANTS.ON_UPDATE_EVENT, onUpdateEventListener, []);
  useEmitter(EMITTER_CONSTANTS.SOCKET_CONNECTED, socketConnected, []);

  const onListenDeleteAccount = (msg) => {
    const findPatient = state.attendees.find(patient => patient?._id === msg?.userId);
    if (findPatient) {
      window.close();
    }
  };
  useEmitter(EMITTER_CONSTANTS.ON_ACCOUNT_DELETION, onListenDeleteAccount, []);

  return (
    <div className={classnames('video-call-window')}>
      {loadingMain && (
        <Space className="loading-space loading-main-page" size="middle">
          <Spin size="large" />
        </Space>
      )}
      {state.isRejoin ? (
        <Rejoin
          onRejoinClick={onRejoinClick}
          onReturnToPortalClick={() => { onEndCallClick(); }}
        />
      ) : (
        <>
          {state.loading ? (
            <Space className="loading-space" size="middle">
              <Spin size="large" />
            </Space>
          ) : (
            <div className="video-call-window-container">
              <div className="video-call-window-main">
                <VideoCallView
                  ref={videoCallViewRef}
                  chimeData={chimeData.current}
                  appointmentId={params.appointmentId}
                  attendees={state.attendees}
                  onEndCallClick={onEndCallClick}
                  onDidStop={onDidStop}
                  onAttendeeChanged={onAttendeeChanged}
                  isDisabledMicrophone={state.isDisabledMicrophone}
                  isDisabledCamera={state.isDisabledCamera}
                />
                <CustomButton
                  htmlType="button"
                  className={classnames('finish-apt-btn')}
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={toggleFinishModal}
                  loading={loadingFinishApt}
                  label="Finish appointment"
                />
              </div>
              <VideoCallSideTab
                appointmentStatus={state.appointmentInfo?.status}
                appointmentId={params?.appointmentId}
                data={data}
              />
            </div>
          )}
        </>
      )}
      <ConfirmationLayout
        visible={!!state.modalContentType}
        type={state.modalContentType}
        icon={[OVERDUE_APPOINTMENT, FINISH_APPOINTMENT].includes(state.modalContentType) ? <></> : <ExclamationCircleOutlined className="row-icon color-red-6" />}
        onClick={onClickOKModal}
        toggleClick={() => { }}
      />
      <ConfirmationLayout
        toggleClick={toggleFinishModal}
        type={CONFIRMATION_LAYOUT_TYPES.APPOINTMENT_FINISHED}
        onClick={onFinishappointmentClick}
        isConfirming={state.loading}
        visible={state.isShowFinishedModal}
      />
      <ConfirmationLayout
        toggleClick={togglePermisionDeniedModal}
        type={CONFIRMATION_LAYOUT_TYPES.PERMISSION_DENIED}
        onClick={togglePermisionDeniedModal}
        visible={state.isPermissionDeniedModal}
      />
      <ConfirmationLayout
        type={CONFIRMATION_LAYOUT_TYPES.RELOAD_REQUIRED}
        onClick={onConfirmReloadPage}
        visible={state.isShowReloadModal}
      />
    </div>
  );
};

VideoCallWindow.defaultProps = {
};
VideoCallWindow.propTypes = {
};
export default VideoCallWindow;
