/* eslint-disable no-unused-expressions */
import {
  MeetingSessionStatusCode,
} from 'amazon-chime-sdk-js';
import { Space, Spin } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {
  forwardRef, useCallback, useEffect, useImperativeHandle, useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { CONFIRMATION_LAYOUT_TYPES } from '../../Constants';
import auth from '../../Helpers/auth';
import consoleLog from '../../Helpers/consoleLog';
import { useMergeState } from '../../Helpers/customHooks';
import ConfirmationLayout from '../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import ChimeSdkWrapper from './chimeSdkWrapper';
import PreviewVideo from './previewVideo';
import RemoteVideo from './remoteVideo';
import TimeCounter, { getTiming } from './timeCounter';
import VideoCallTool from './videoCallTool';

const getInitialVideoList = () => {
  const videoList = [];
  _.forEach(Array.from(Array(7).keys()), (value) => {
    videoList.push({
      isFull: false,
      videoRef: useRef(undefined),
      tileId: null,
      userId: null,
      attendeeId: null,
      isLocal: false,
      indexVideo: value,
      isActive: false,
    });
  });
  return videoList;
};

const VideoCallView = forwardRef((props, ref) => {
  const chime = useRef(new ChimeSdkWrapper());
  const history = useHistory();
  const me = useRef(auth.getLoginData());
  const isJoined = useRef(false);
  const fullScreenRef = useRef(undefined);
  const audioRef = useRef(undefined);
  const previewVideoRef = useRef(undefined);
  const rosters = useRef([]);
  const stateRef = useRef({
    videoList: getInitialVideoList(),
    cameraDisabled: false,
    cameraDeviceSelected: undefined,
  });
  const [state, setState] = useMergeState({
    isLoading: true,
    isFullScreen: false,
    micDisabled: false,
    cameraDisabled: false,
    timer: 0,
    videoList: getInitialVideoList(),
    cameraDevices: [],
    cameraDeviceSelected: undefined,
    isShowAccesMicModal: false,
    isShowAccesCamModal: false,
  });

  const getTimeCounter = (timer) => {
    setState({ timer });
  };

  const getCurrentVideoAttendeeIds = () => {
    const { videoList } = stateRef.current;
    const ids = [];
    _.forEach(videoList, (x) => {
      if (x?.attendeeId) {
        ids.push(x?.attendeeId);
      }
    });
    return ids;
  };

  const getCurrentActiveAttendee = () => {
    const { videoList } = stateRef.current;
    const ids = [];
    _.forEach(videoList, (x) => {
      if (x?.attendeeId && x?.isActive) {
        ids.push(x?.attendeeId);
      }
    });
    return ids;
  };

  const isUsingChime = () => {
    const { meeting, attendee } = props.chimeData;
    if (_.isEmpty(meeting) || _.isEmpty(attendee)) {
      return false;
    }
    return true;
  };

  const updateVideoList = (newRemote, isFull) => {
    const { videoList, cameraDisabled } = stateRef.current;
    const videoListClone = _.cloneDeep(videoList);
    const currentFullIndex = _.findIndex(videoListClone, x => x?.isFull);
    const availableIndex = _.findIndex(videoListClone, x => !x?.tileId && !x?.attendeeId);

    _.assign(videoListClone[availableIndex], {
      isFull,
      tileId: newRemote?.tileId,
      userId: newRemote?.boundExternalUserId,
      attendeeId: newRemote?.boundAttendeeId,
      isLocal: newRemote?.localTile,
      isActive: newRemote?.localTile ? !cameraDisabled : true,
    });
    if (isFull && currentFullIndex !== -1 && currentFullIndex !== availableIndex) {
      videoListClone[currentFullIndex].isFull = false;
    }
    if (videoListClone[availableIndex]?.videoRef?.current) {
      chime.current.videoSession.bindVideoElement(newRemote?.tileId, videoListClone[availableIndex]?.videoRef?.current);
    }
    _.forEach(videoListClone, (x, index) => {
      x.indexVideo = index;
    });
    _.assign(stateRef.current, { videoList: videoListClone });
    setState({ videoList: videoListClone });
  };

  const onDevicesChanged = async (data) => {
    const {
      currentAudioInputDevice, currentAudioOutputDevice,
    } = data;
    if (currentAudioInputDevice) {
      await chime.current.chooseAudioInputDevice(currentAudioInputDevice);
    }

    if (currentAudioOutputDevice) {
      await chime.current.chooseAudioInputDevice(currentAudioOutputDevice);
    }
  };

  const onVideoInputDevicesChanged = useCallback(async (data) => {
    const {
      currentVideoInputDevice, videoInputDevices,
    } = data;
    const { cameraDeviceSelected } = stateRef.current;
    const stateObject = {};
    if (videoInputDevices.length < 1) {
      return;
    }
    const videoInputDevice = _.find(videoInputDevices, device => device.label.includes('front')) || videoInputDevices[0];
    if (videoInputDevice) {
      const cameraSelectedExisted = _.find(videoInputDevices, device => device.value === cameraDeviceSelected?.value);
      if (!cameraDeviceSelected
        || (cameraDeviceSelected && cameraDeviceSelected.value !== videoInputDevice.value)
        || !cameraSelectedExisted) {
        await chime.current.chooseVideoInputDevice(videoInputDevice);
        if (isJoined.current) {
          await chime.current?.videoSession?.startLocalVideoTile();
        }
        _.assign(stateRef.current, { cameraDeviceSelected: videoInputDevice });
        _.assign(stateObject, { cameraDeviceSelected: videoInputDevice });
      }
    }
    _.assign(stateObject, { cameraDevices: videoInputDevices });
    setState({ ...stateObject });
  }, [state.cameraDeviceSelected]);

  const onMuteAndUnmuteAudioChanged = (muted) => {
    setState({ micDisabled: muted });
  };

  const onRosterUpdate = (roster) => {
    // if (JSON.stringify(rosters.current) === JSON.stringify(roster)) {
    //   return;
    // }
    if (_.isEqual(rosters.current, roster)) {
      return;
    }

    const { videoList } = stateRef.current;
    // const videoListClone = _.cloneDeep(videoList);

    // _.assign(rosters.current, _.cloneDeep(roster));
    rosters.current = _.cloneDeep(roster);
    _.forEach(Object.keys(roster), (x) => {
      const rosExisted = _.find(videoList, y => y?.attendeeId === x);
      if (!rosExisted) {
        const availableIndex = _.findIndex(videoList, y => !y?.attendeeId);
        const userId = roster[x?.toString()]?.userId;
        _.assign(videoList[availableIndex], {
          isFull: false,
          tileId: null,
          userId,
          attendeeId: x,
          isLocal: false,
          isActive: false,
        });
      }
    });
    _.forEach(videoList, (x, i) => {
      const eleExisted = _.find(Object.keys(roster), y => y === x?.attendeeId);
      if (!eleExisted) {
        _.assign(videoList[i], {
          isFull: false,
          tileId: null,
          userId: null,
          attendeeId: null,
          isLocal: false,
          indexVideo: null,
          isActive: false,
        });
      }
    });
    const filter1 = _.filter(videoList, x => x?.tileId || x?.attendeeId);
    const filter2 = _.filter(filter1, x => !x?.isFull);
    const fullElement = _.find(videoList, x => (x?.tileId || x?.attendeeId) && x?.isFull);
    if (fullElement) {
      _.assign(fullElement, { indexVideo: filter2.length });
    } else {
      const nearestRemote = _.find(videoList, x => x?.tileId || x?.attendeeId);
      if (nearestRemote) {
        _.assign(nearestRemote, { isFull: true });
      }
    }
    if (filter1.length > 1) {
      // attendee > 1
      // handle other attendee to full
      const fullElement = _.find(videoList, x => (x?.tileId || x?.attendeeId) && x?.isFull);
      if (fullElement && fullElement.isLocal) {
        const nearestRemote = _.find(videoList, x => (x?.tileId || x?.attendeeId) && !x?.isLocal);
        if (nearestRemote) {
          _.assign(nearestRemote, { isFull: true, indexVideo: filter2.length });
          _.assign(fullElement, { isFull: false });
        }
      }
    }
    _.forEach(filter2, (x, index) => {
      x.indexVideo = index;
    });
    _.assign(stateRef.current, { videoList });

    props.onAttendeeChanged(stateRef.current.videoList);
    setState({ videoList });
  };

  const onEndCallClick = () => {
    props.onEndCallClick();
  };

  const onAudioVideoDidStart = () => {
    setState({ isLoading: false });
  };

  const onVideoTileDidUpdate = (tileState) => {
    const { videoList, cameraDisabled } = stateRef.current;


    const currentVideoAttendeeIds = getCurrentVideoAttendeeIds();
    if (currentVideoAttendeeIds.includes(tileState?.boundAttendeeId)) {
      const videoListClone = _.cloneDeep(videoList);
      const remote = _.find(videoListClone, x => x?.attendeeId === tileState.boundAttendeeId);
      if (remote && !remote?.isActive) {
        _.assign(remote, {
          isActive: remote?.isLocal ? !cameraDisabled : true,
          tileId: tileState?.tileId,
          isLocal: tileState?.localTile,
        });
        if (remote?.videoRef?.current) {
          chime.current.videoSession.bindVideoElement(tileState?.tileId, remote?.videoRef?.current);
        }
        _.assign(stateRef.current, { videoList: videoListClone });
        setState({ videoList: videoListClone });
      }
    } else {
      const local = _.find(videoList, x => x?.isLocal);

      const allRemoteVideoTiles = chime.current.videoSession.getAllRemoteVideoTiles() || [];
      if (allRemoteVideoTiles.length === 0 && !local) {
        // only me join
        const localVideoTiles = chime.current.videoSession.getLocalVideoTile();
        updateVideoList(localVideoTiles?.tileState, true);
        if (cameraDisabled) {
          chime.current.videoSession.stopLocalVideoTile();
        }
      } else if (getCurrentActiveAttendee().length === 1) {
        updateVideoList(tileState, true);
      } else {
        updateVideoList(tileState, false);
      }
    }
  };

  const onVideoTileWasRemoved = (tileId) => {
    const { videoList } = stateRef.current;

    const remote = _.find(videoList, x => x?.tileId === tileId);
    if (remote) {
      _.assign(remote, {
        isActive: false,
      });
      _.assign(stateRef.current, { videoList });
      setState({ videoList });
    }
  };

  const stopChimeMeeting = () => {
    chime.current.leaveRoom();
    chime.current.releaseVideoInputDevice();
    chime.current.releaseAudioInputDevice();
    chime.current.unsubscribeFromDevicesUpdated(onDevicesChanged);
    chime.current.unsubscribeFromVideoInputDevicesUpdated(onVideoInputDevicesChanged);
    chime.current.unsubscribeAudioVideoDidStart(onAudioVideoDidStart);
    chime.current.unsubscribeVideoTileDidUpdate(onVideoTileDidUpdate);
    chime.current.unsubscribeVideoTileWasRemoved(onVideoTileWasRemoved);
  };

  const onAudioVideoDidStop = (sessionStatus) => {
    const { _statusCode } = sessionStatus;

    if (_statusCode === MeetingSessionStatusCode.AudioCallEnded) {
      // toastrError('The meeting room session is expired. You can rejoin or start new meeting.');
      props.onDidStop();
    }
  };

  const startChimeMeeting = useCallback(async (meeting, attendee) => {
    const {
      micDisabled, cameraDeviceSelected, cameraDisabled, videoList,
    } = state;
    // if (previewVideoRef.current) {
    //   chime.current.stopVideoPreview(previewVideoRef.current);
    // }
    // setState({ isLoading: true });
    try {
      await chime.current.initializeMeetingSession(meeting, attendee);
      chime.current.videoSession.realtimeSubscribeToMuteAndUnmuteLocalAudio(onMuteAndUnmuteAudioChanged);
      chime.current.subscribeToAudioVideoDidStart(onAudioVideoDidStart);
      chime.current.subscribeToAudioVideoDidStop(onAudioVideoDidStop);
      chime.current.subscribeToVideoTileDidUpdate(onVideoTileDidUpdate);
      chime.current.subscribeToVideoTileWasRemoved(onVideoTileWasRemoved);
      chime.current.subscribeToRosterUpdate(onRosterUpdate);
      await chime.current.joinRoom(audioRef.current);
      if (micDisabled) {
        chime.current.videoSession.realtimeMuteLocalAudio();
      }
      const startVideoInterval = setInterval(async () => {
        if (stateRef.current.cameraDeviceSelected) {
          clearInterval(startVideoInterval);
          if (!cameraDisabled) {
            await chime.current.chooseVideoInputDevice(stateRef.current.cameraDeviceSelected);
          }
          chime.current.videoSession.startLocalVideoTile();
          isJoined.current = true;
        }
      }, 100);
      _.assign(stateRef.current, { videoList });
    } catch (error) {
      consoleLog('error ', error);
    }
  }, [state.micDisabled, state.cameraDeviceSelected, state.cameraDisabled, state.videoList]);

  const startVideoPreview = () => {
    const startVideoPreviewInterval = setInterval(async () => {
      const { cameraDeviceSelected } = stateRef.current;
      if (cameraDeviceSelected) {
        clearInterval(startVideoPreviewInterval);
        await chime.current.chooseVideoInputDevice(cameraDeviceSelected);
        if (previewVideoRef.current) {
          chime.current.startVideoPreview(previewVideoRef.current);
        }
      }
    }, 100);
  };

  useEffect(() => {
    chime.current.subscribeToDevicesUpdated(onDevicesChanged);
    chime.current.subscribeToVideoInputDevicesUpdated(onVideoInputDevicesChanged);
    chime.current.refreshDevices();
    startChimeMeeting(props.chimeData.meeting, props.chimeData.attendee);
    // startVideoPreview();
    return () => {
      stopChimeMeeting();
      chime.current.unsubscribeAudioVideoDidStop(onAudioVideoDidStop);
    };
  }, []);

  // useEffect(() => {
  //   const settingState = {};
  //   if (props.isDisabledCamera) {
  //     _.assign(settingState, { cameraDisabled: true });
  //   }
  //   if (props.isDisabledMicrophone) {
  //     _.assign(settingState, { micDisabled: true });
  //   }
  //   setState(settingState);
  // }, [props.isDisabledMicrophone, props.isDisabledCamera]);

  const isMeettingSessionAvailable = () => !!chime.current?.videoSession;

  useImperativeHandle(ref, () => ({
    startChimeMeeting,
    stopChimeMeeting,
    isMeettingSessionAvailable,
  }));

  const exitHandler = () => {
    if (!document.fullscreenElement
      && !document.webkitIsFullScreen
      && !document.mozFullScreen
      && !document.msFullscreenElement) {
      setState({ isFullScreen: !state.isFullScreen });
    }
  };

  const openFullScreen = (elem) => {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
    document.addEventListener('MSFullscreenChange', exitHandler);
  };

  const closeFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
    document.removeEventListener('fullscreenchange', exitHandler);
    document.removeEventListener('webkitfullscreenchange', exitHandler);
    document.removeEventListener('mozfullscreenchange', exitHandler);
    document.removeEventListener('MSFullscreenChange', exitHandler);
  };

  const onModeScreenChanged = (isFullScreen) => {
    setState({ isFullScreen });
    if (isFullScreen) {
      openFullScreen(fullScreenRef.current);
    } else {
      closeFullScreen();
    }
  };

  const onMicroStateChanged = (micDisabled) => {
    if (props.isDisabledMicrophone) {
      setState({ isShowAccesMicModal: true });
      return;
    }
    if (!isUsingChime()) {
      setState({ micDisabled });
      return;
    }
    if (micDisabled) {
      chime.current.videoSession.realtimeMuteLocalAudio();
    } else {
      chime.current.videoSession.realtimeUnmuteLocalAudio();
    }
    setState({ micDisabled });
  };

  const onCameraStateChanged = async (cameraDisabled) => {
    if (props.isDisabledCamera) {
      setState({ isShowAccesCamModal: true });
      return;
    }
    const { cameraDeviceSelected } = state;

    if (!isUsingChime() && previewVideoRef.current) {
      if (cameraDisabled) {
        chime.current.stopVideoPreview(previewVideoRef.current);
      } else {
        await chime.current.chooseVideoInputDevice(cameraDeviceSelected);
        chime.current.startVideoPreview(previewVideoRef.current);
      }
    } else if (!cameraDisabled) {
      try {
        if (!cameraDeviceSelected) {
          return;
        }
        await chime.current.chooseVideoInputDevice(cameraDeviceSelected);
        if (isJoined.current) {
          chime.current?.videoSession.startLocalVideoTile();
        } else if (previewVideoRef.current) {
          chime.current.startVideoPreview(previewVideoRef.current);
        }
        chime.current?.videoSession.startLocalVideoTile();
      } catch (error) {
        consoleLog('error ', error);
      }
    } else {
      chime.current.videoSession?.stopLocalVideoTile();
    }

    const { videoList } = state;
    const local = _.find(videoList, x => x?.isLocal);
    if (local) {
      _.assign(local, {
        isActive: false,
      });
    }
    _.assign(stateRef.current, { videoList, cameraDisabled });
    setState({ cameraDisabled, videoList });
  };

  const onCameraChanged = useCallback(async (device) => {
    const { cameraDeviceSelected } = state;
    if (cameraDeviceSelected?.value !== device?.value) {
      try {
        await chime.current.chooseVideoInputDevice(device);
        _.assign(stateRef, { cameraDeviceSelected: device });
        setState({ cameraDeviceSelected: device });
      } catch (error) {
        consoleLog('error ', error);
      }
    }
  }, [state.cameraDeviceSelected]);

  const onChooseViewRemoteElement = useCallback((attendeeId) => {
    const { videoList } = state;
    const mainVideo = _.find(videoList, x => x?.attendeeId === attendeeId && x?.isFull);
    if (mainVideo) {
      return;
    }

    const remoteVideo = _.find(videoList, x => x?.attendeeId === attendeeId);
    const fullVideo = _.find(videoList, x => x?.isFull);

    // swap index video
    const tempIndex = remoteVideo.indexVideo;
    remoteVideo.indexVideo = fullVideo.indexVideo;
    fullVideo.indexVideo = tempIndex;

    const remote = _.find(videoList, x => x?.attendeeId === attendeeId);
    const main = _.find(videoList, x => x?.isFull);

    if (remote) {
      _.assign(remote, { isFull: true });
      if (main) {
        _.assign(main, { isFull: false });
      }
    }
    _.assign(stateRef.current, { videoList });
    setState({ videoList });
  }, [state.videoList]);
  const getAttendeeComponentName = (userId) => {
    const attendee = _.find(props.attendees, x => x._id === userId);
    let firstName = '';
    let lastName = '';
    let fullName = '';
    let photo = '';
    if (attendee) {
      firstName = attendee?.firstName || '';
      lastName = attendee?.lastName || '';
      fullName = `${firstName} ${lastName}`;
      photo = attendee.photo || '';
    }
    return {
      firstName,
      lastName,
      fullName,
      photo,
    };
  };

  const getMainVideoName = useCallback(() => {
    if (!isJoined.current) {
      return 'You';
    }
    const { videoList } = state;
    const main = _.find(videoList, x => x.isFull);
    if (main) {
      return main.isLocal ? 'You' : getAttendeeComponentName(main.userId).fullName;
    }
    return '';
  }, [state.videoList]);

  const getMeComponentName = () => {
    const { firstName, lastName, fullName } = me.current;
    return {
      firstName,
      lastName,
      fullName,
    };
  };
  const dismissPermissionDeniedModal = (isShowAccesCamModal) => {
    if (isShowAccesCamModal) {
      setState({ isShowAccesCamModal: false });
    } else {
      setState({ isShowAccesMicModal: false });
    }
  };

  const remoteVideo = () => {
    const { videoList } = state;
    const filter1 = _.filter(videoList, x => x?.tileId || x?.attendeeId);
    const filter2 = _.filter(filter1, x => !x?.isFull);
    const fullVideo = _.find(filter1, x => x?.isFull);
    if (fullVideo) {
      _.forEach(filter2, (x) => {
        if (x.indexVideo > fullVideo.indexVideo) {
          x.indexVideo -= 1;
        }
      });
      fullVideo.indexVideo = filter2.length;
    }
    return (
      _.map(videoList, (value, index) => (
        <RemoteVideo
          key={`remote-video-${index + 1}`}
          ref={value.videoRef}
          isFull={value.isFull}
          isMe={value.isLocal}
          attendeeId={value.attendeeId}
          cameraDisabled={!value.isActive || (props.isDisabledCamera && value.isLocal)}
          className={classnames(`remote-video-${value.indexVideo}`)}
          fullName={value.userId || ''}
          componentName={getAttendeeComponentName(value.userId)}
          enabled={!!value.attendeeId}
          onChooseViewRemoteElement={onChooseViewRemoteElement}
          // timer={state.timer}
        />
      ))
    );
  };

  return (
    <div
      className={classnames('video-call-view', props.className)}
      ref={fullScreenRef}
    >
      <audio
        id="meetingAudio"
        className="hidden"
        ref={audioRef}
      >
        <track kind="captions" srcLang="en" label="english_captions" />
      </audio>
      {state.isLoading && (
        <Space className="loading-space" size="middle">
          <Spin size="large" />
        </Space>
      )}
      {/* <PreviewVideo
        cameraDisabled={state.cameraDisabled}
        ref={previewVideoRef}
        enabled={!isUsingChime()}
        componentName={getMeComponentName()}
      /> */}
      <div className="video-call-view__full-name-and-time">
        <div className="video-call-view__full-name-and-time__full-name">{getMainVideoName()}</div>
        {/* <TimeCounter /> */}
        <div>
          <span>
            {getTiming(state.timer, true)}
          </span>
        </div>
      </div>

      <TimeCounter isHidden getTimeCounter={getTimeCounter} />

      {remoteVideo()}
      <VideoCallTool
        isFullScreen={state.isFullScreen}
        micDisabled={state.micDisabled}
        cameraDisabled={state.cameraDisabled}
        cameraDevices={state.cameraDevices}
        cameraDeviceSelected={state.cameraDeviceSelected}
        onEndCallClick={onEndCallClick}
        onModeScreenChanged={onModeScreenChanged}
        onMicroStateChanged={onMicroStateChanged}
        onCameraStateChanged={onCameraStateChanged}
        onCameraChanged={onCameraChanged}
        isDisabledMicrophone={props.isDisabledMicrophone}
        isDisabledCamera={props.isDisabledCamera}
      />
      <ConfirmationLayout
        toggleClick={() => dismissPermissionDeniedModal(state.isShowAccesCamModal)}
        type={state.isShowAccesCamModal ? CONFIRMATION_LAYOUT_TYPES.PERMISSION_DENIED_CAM : CONFIRMATION_LAYOUT_TYPES.PERMISSION_DENIED_MIC}
        onClick={() => dismissPermissionDeniedModal(state.isShowAccesCamModal)}
        visible={state.isShowAccesCamModal || state.isShowAccesMicModal}
      />
    </div>
  );
});

VideoCallView.defaultProps = {
  className: '',
  // appointmentId: '',
  chimeData: {
    meeting: undefined,
    attendee: undefined,
  },
  attendees: [],
  onEndCallClick: () => {},
  onDidStop: () => {},
  onAttendeeChanged: () => {},
  isDisabledMicrophone: false,
  isDisabledCamera: false,
};

VideoCallView.propTypes = {
  className: PropTypes.string,
  // appointmentId: PropTypes.string,
  chimeData: PropTypes.shape(),
  attendees: PropTypes.arrayOf(PropTypes.shape()),
  onEndCallClick: PropTypes.func,
  onDidStop: PropTypes.func,
  onAttendeeChanged: PropTypes.func,
  isDisabledMicrophone: PropTypes.bool,
  isDisabledCamera: PropTypes.bool,
};

export default VideoCallView;
