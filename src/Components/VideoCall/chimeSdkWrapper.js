import _ from 'lodash';
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  DefaultModality,
  LogLevel,
  MeetingSessionConfiguration,
} from 'amazon-chime-sdk-js';

class ChimeSdkWrapper {
  deviceObserver = {
    audioInputsChanged: (freshAudioInputDeviceList) => {
      this.audioInputsChanged(freshAudioInputDeviceList);
      this.publishDevicesUpdated();
    },
    audioOutputsChanged: (freshAudioOutputDeviceList) => {
      this.audioOutputsChanged(freshAudioOutputDeviceList);
      this.publishDevicesUpdated();
    },
    videoInputsChanged: (freshVideoInputDeviceList) => {
      this.videoInputsChanged(freshVideoInputDeviceList);
      this.publishVideoInputDevicesUpdated();
    },
  };

  audioVideoObserver = {
    audioVideoDidStart: () => {
      this.publishAudioVideoDidStart();
    },

    audioVideoDidStartConnecting: (reconnecting) => {

    },

    audioVideoDidStop: (sessionStatus) => {
      this.publishAudioVideoDidStop(sessionStatus);
    },

    connectionDidBecomeGood: () => {

    },

    connectionDidBecomePoor: () => {

    },

    connectionDidSuggestStopVideo: () => {

    },

    connectionHealthDidChange: (connectionHealthData) => {

    },

    videoAvailabilityDidChange: (availability) => {

    },

    videoSendDidBecomeUnavailable: () => {

    },

    videoTileDidUpdate: (tileState) => {
      // Ignore a tile without attendee ID
      if (!tileState.boundAttendeeId || tileState.isContent || !tileState.tileId) {
        return;
      }
      this.publishVideoTileDidUpdate(tileState);
    },

    videoTileWasRemoved: (tileId) => {
      this.publishVideoTileWasRemoved(tileId);
    },
    eventDidReceive(name, attributes) {
      // Handle a meeting event.

    },
  };

  constructor() {
    this.TAG = 'ChimeSdkWrapper';
    this.ROSTER_THROTTLE_MS = 400;
    this.meetingSession = null;
    this.currentAudioInputDevice = null;
    this.currentAudioOutputDevice = null;
    this.currentVideoInputDevice = null;
    this.audioInputDevices = [];
    this.audioOutputDevices = [];
    this.videoInputDevices = [];
    this.devicesUpdatedCallbacks = [];
    this.videoInputDevicesUpdatedCallbacks = [];
    this.roster = {};
    this.rosterUpdateCallbacks = [];
    this.audioVideoDidStartCallbacks = [];
    this.audioVideoDidStopCallbacks = [];
    this.audioVideoTileDidUpdateCallbacks = [];
    this.audioVideoTileWasRemovedCallbacks = [];
    this.configuration = null;
    this.videoSession = null;
    this.logger = new ConsoleLogger(this.TAG, LogLevel.OFF);
    this.deviceController = new DefaultDeviceController(this.logger, { enableWebAudio: true });
    this.deviceController.addDeviceChangeObserver(this.deviceObserver);
  }

  initializeSdkWrapper = async () => {
    this.meetingSession = null;
    this.videoSession = null;
    this.roster = {};
    // this.currentAudioInputDevice = null;
    // this.currentAudioOutputDevice = null;
    // this.currentVideoInputDevice = null;
    // this.audioInputDevices = [];
    // this.audioOutputDevices = [];
    // this.videoInputDevices = [];
    this.configuration = null;
  };

  refreshDevices = async () => {
    this.audioInputsChanged(await this.deviceController?.listAudioInputDevices());
    this.audioOutputsChanged(await this.deviceController?.listAudioOutputDevices());
    this.videoInputsChanged(await this.deviceController?.listVideoInputDevices());
    this.publishDevicesUpdated();
    this.publishVideoInputDevicesUpdated();
  }

  initializeMeetingSession = async (meeting, attendee) => {
    if (_.isEmpty(meeting) || _.isEmpty(attendee)) {
      throw new Error('InitializeMeetingSession error');
    }
    this.configuration = new MeetingSessionConfiguration(meeting, attendee);
    this.configuration.enableWebAudio = true;
    this.configuration.attendeePresenceTimeoutMs = 5000;
    this.meetingSession = new DefaultMeetingSession(
      this.configuration,
      this.logger,
      this.deviceController,
    );
    this.videoSession = this.meetingSession?.audioVideo;
    this.videoSession.realtimeSubscribeToAttendeeIdPresence(this.attendeeIdPresence);
    this.videoSession.addObserver(this.audioVideoObserver);
  }

  startVideoPreview = (videoElement) => {
    // this.stopVideoPreview(videoElement);
    this.deviceController.startVideoPreviewForVideoInput(videoElement);
  }

  stopVideoPreview = async (videoElement) => {
    this.deviceController.stopVideoPreviewForVideoInput(videoElement);
  }

  joinRoom = async (audioElement) => {
    if (!audioElement) {
      throw new Error('element does not exist');
    }

    this.publishDevicesUpdated();
    this.publishVideoInputDevicesUpdated();

    this.videoSession.bindAudioElement(audioElement);
    this.videoSession.start();
  }

  leaveRoom = async () => {
    try {
      this.videoSession.removeObserver(this.audioVideoObserver);
      this.videoSession.chooseVideoInputDevice(null);
      this.videoSession.stopLocalVideoTile();
      this.videoSession.stop();
    } catch (error) {
      this.logError(error);
    }

    this.initializeSdkWrapper();
  };

  /**
   * ====================================================================
   * Device
   * ====================================================================
   */

  createAnalyserNodeForAudioInput = () => {
    try {
      return this.deviceController?.createAnalyserNodeForAudioInput();
    } catch (error) {
      this.logError(error);
      return null;
    }
  };

  releaseAudioInputDevice = async () => {
    try {
      await this.deviceController?.chooseAudioInputDevice(null);
    } catch (error) {
      this.logError(error);
    }
  };

  releaseVideoInputDevice = async () => {
    try {
      await this.deviceController?.chooseVideoInputDevice(null);
    } catch (error) {
      this.logError(error);
    }
  };

  chooseAudioInputDevice = async (device) => {
    try {
      await this.deviceController?.chooseAudioInputDevice(device.value);
      this.currentAudioInputDevice = device;
    } catch (error) {
      this.logError(error);
    }
  };

  chooseAudioOutputDevice = async (device) => {
    try {
      await this.deviceController?.chooseAudioOutputDevice(device.value);
      this.currentAudioOutputDevice = device;
    } catch (error) {
      this.logError(error);
    }
  };

  chooseVideoInputDevice = async (device) => {
    try {
      await this.deviceController?.chooseVideoInputDevice(device?.value);
      this.currentVideoInputDevice = device;
    } catch (error) {
      this.logError(error);
    }
  };

  /**
   * ====================================================================
   * Observer methods
   * ====================================================================
   */

  attendeeIdPresence = (presentAttendeeId, present, externalUserId) => {
    if (!present) {
      setTimeout(() => {
        delete this.roster[presentAttendeeId];
        this.publishRosterUpdate.cancel();
        this.publishRosterUpdate();
      }, 300);
      return;
    }
    this.videoSession.realtimeSubscribeToVolumeIndicator(
      presentAttendeeId,
      async (attendeeId, volume, muted, signalStrength) => {
        const baseAttendeeId = new DefaultModality(attendeeId).base();
        if (baseAttendeeId !== attendeeId) {
          // See the "Screen and content share" section for details.
          return;
        }
        // const shouldPublishImmediately = false;
        if (!this.roster[attendeeId]) {
          this.roster[attendeeId] = { name: '', userId: externalUserId };
          setTimeout(() => {
            this.publishRosterUpdate.cancel();
            this.publishRosterUpdate();
          }, 1000);
        }
        // if (volume !== null) {
        //   this.roster[attendeeId].volume = Math.round(volume * 100);
        // }
        // if (muted !== null) {
        //   this.roster[attendeeId].muted = muted;
        // }
        // if (signalStrength !== null) {
        //   this.roster[attendeeId].signalStrength = Math.round(signalStrength * 100);
        // }
        // if (this.title && attendeeId && !this.roster[attendeeId].name) {
        //   // const response = await fetch(
        //   //   `${getBaseUrl()}attendee?title=${encodeURIComponent(
        //   //     this.title
        //   //   )}&attendee=${encodeURIComponent(attendeeId)}`
        //   // );
        //   // const json = await response.json();
        //   // this.roster[attendeeId] = json.AttendeeInfo.Name || '';
        //   shouldPublishImmediately = true;
        // }

        // if (shouldPublishImmediately) {
        //   this.publishRosterUpdate.cancel();
        // }
        // this.publishRosterUpdate();
      },
    );
    // this.videoSession.subscribeToActiveSpeakerDetector(
    //   new DefaultActiveSpeakerPolicy(),
    //   (attendeeIds) => {
    //     Object.keys(this.roster).forEach((attendeeId) => {
    //       this.roster[attendeeId].active = false;
    //     });

    //     attendeeIds.some((attendeeId) => {
    //       if (this.roster[attendeeId]) {
    //         this.roster[attendeeId].active = true;
    //         return true; // only show the most active speaker
    //       }
    //       return false;
    //     });
    //   },
    // );
  }

  audioInputsChanged = (freshAudioInputDeviceList) => {
    this.audioInputDevices = _.map(freshAudioInputDeviceList, x => ({
      label: x.label,
      value: x.deviceId,
    }));
    const hasCurrentDevice = _.find(this.audioInputDevices, x => x.value === this.currentAudioInputDevice?.value);
    if (!hasCurrentDevice) {
      this.currentAudioInputDevice = this.audioInputDevices.length > 0 ? this.audioInputDevices[0] : null;
    }
  }

  audioOutputsChanged = (freshAudioOutputDeviceList) => {
    this.audioOutputDevices = _.map(freshAudioOutputDeviceList, x => ({
      label: x.label,
      value: x.deviceId,
    }));
    const hasCurrentDevice = _.find(this.audioOutputDevices, x => x.value === this.currentAudioOutputDevice?.value);
    if (!hasCurrentDevice) {
      this.currentAudioOutputDevice = this.audioOutputDevices.length > 0 ? this.audioOutputDevices[0] : null;
    }
  }

  videoInputsChanged = (freshVideoInputDeviceList) => {
    this.videoInputDevices = _.map(freshVideoInputDeviceList, x => ({
      label: x.label,
      value: x.deviceId,
    }));
    // let videoInputDevicesClone = [];
    // if (this.avoidDevices.length > 0) {
    //   videoInputDevicesClone = _.filter(this.videoInputDevices, (x) => {
    //     return _.find(this.avoidDevices, (y) => !x?.label.includes(y));
    //   });
    // } else {
    //   videoInputDevicesClone = this.videoInputDevices;
    // }

    // const hasCurrentDevice = _.find(videoInputDevicesClone, (x) => x.value === this.currentVideoInputDevice?.value);
    // if (!hasCurrentDevice) {
    //   const frontDevice = _.find(videoInputDevicesClone, (x) => {
    //     const cameraLabel = x?.label || '';
    //     return cameraLabel.toLocaleLowerCase().includes('front');
    //   });
    //   if (frontDevice) {
    //     this.currentVideoInputDevice = frontDevice;
    //   } else {
    //     this.currentVideoInputDevice = videoInputDevicesClone.length > 0 ? videoInputDevicesClone[0] : null;
    //   }
    // }
  }

  /**
   * ====================================================================
   * Subscribe and unsubscribe from SDK events
   * ====================================================================
   */

  subscribeToDevicesUpdated = (callbackFunc) => {
    const index = _.indexOf(this.devicesUpdatedCallbacks, callbackFunc);
    if (index === -1) {
      this.devicesUpdatedCallbacks.push(callbackFunc);
    }
  };

  subscribeToVideoInputDevicesUpdated = (callbackFunc) => {
    const index = _.indexOf(this.videoInputDevicesUpdatedCallbacks, callbackFunc);
    if (index === -1) {
      this.videoInputDevicesUpdatedCallbacks.push(callbackFunc);
    }
  };

  unsubscribeFromDevicesUpdated = (callbackFunc) => {
    const index = _.indexOf(this.devicesUpdatedCallbacks, callbackFunc);
    if (index !== -1) {
      this.devicesUpdatedCallbacks.splice(index, 1);
    }
  };

  unsubscribeFromVideoInputDevicesUpdated = (callbackFunc) => {
    const index = _.indexOf(this.videoInputDevicesUpdatedCallbacks, callbackFunc);
    if (index !== -1) {
      this.videoInputDevicesUpdatedCallbacks.splice(index, 1);
    }
  };

  subscribeToRosterUpdate = (callbackFunc) => {
    const index = _.indexOf(this.rosterUpdateCallbacks, callbackFunc);
    if (index === -1) {
      this.rosterUpdateCallbacks.push(callbackFunc);
    }
  };

  unsubscribeFromRosterUpdate = (callbackFunc) => {
    const index = this.rosterUpdateCallbacks.indexOf(callbackFunc);
    if (index !== -1) {
      this.rosterUpdateCallbacks.splice(index, 1);
    }
  };

  subscribeToAudioVideoDidStart = (callbackFunc) => {
    const index = _.indexOf(this.audioVideoDidStartCallbacks, callbackFunc);
    if (index === -1) {
      this.audioVideoDidStartCallbacks.push(callbackFunc);
    }
  };

  unsubscribeAudioVideoDidStart = (callbackFunc) => {
    const index = this.audioVideoDidStartCallbacks.indexOf(callbackFunc);
    if (index !== -1) {
      this.audioVideoDidStartCallbacks.splice(index, 1);
    }
  };

  subscribeToAudioVideoDidStop = (callbackFunc) => {
    const index = _.indexOf(this.audioVideoDidStopCallbacks, callbackFunc);
    if (index === -1) {
      this.audioVideoDidStopCallbacks.push(callbackFunc);
    }
  };

  unsubscribeAudioVideoDidStop = (callbackFunc) => {
    const index = this.audioVideoDidStopCallbacks.indexOf(callbackFunc);
    if (index !== -1) {
      this.audioVideoDidStopCallbacks.splice(index, 1);
    }
  };

  subscribeToVideoTileDidUpdate = (callbackFunc) => {
    const index = _.indexOf(this.audioVideoTileDidUpdateCallbacks, callbackFunc);
    if (index === -1) {
      this.audioVideoTileDidUpdateCallbacks.push(callbackFunc);
    }
  };

  unsubscribeVideoTileDidUpdate = (callbackFunc) => {
    const index = this.audioVideoTileDidUpdateCallbacks.indexOf(callbackFunc);
    if (index !== -1) {
      this.audioVideoTileDidUpdateCallbacks.splice(index, 1);
    }
  };

  subscribeToVideoTileWasRemoved = (callbackFunc) => {
    const index = _.indexOf(this.audioVideoTileWasRemovedCallbacks, callbackFunc);
    if (index === -1) {
      this.audioVideoTileWasRemovedCallbacks.push(callbackFunc);
    }
  };

  unsubscribeVideoTileWasRemoved = (callbackFunc) => {
    const index = this.audioVideoTileWasRemovedCallbacks.indexOf(callbackFunc);
    if (index !== -1) {
      this.audioVideoTileWasRemovedCallbacks.splice(index, 1);
    }
  };

  /**
   * ====================================================================
   * Publish event
   * ====================================================================
   */

  publishRosterUpdate = _.throttle(() => {
    for (let i = 0; i < this.rosterUpdateCallbacks.length; i += 1) {
      const callback = this.rosterUpdateCallbacks[i];
      callback(this.roster);
    }
  }, this.ROSTER_THROTTLE_MS);

  publishDevicesUpdated = () => {
    _.forEach(this.devicesUpdatedCallbacks, (callbackFunc) => {
      callbackFunc({
        currentAudioInputDevice: this.currentAudioInputDevice,
        currentAudioOutputDevice: this.currentAudioOutputDevice,
        audioInputDevices: this.audioInputDevices,
        audioOutputDevices: this.audioOutputDevices,
      });
    });
  };

  publishVideoInputDevicesUpdated = () => {
    _.forEach(this.videoInputDevicesUpdatedCallbacks, (callbackFunc) => {
      callbackFunc({
        currentVideoInputDevice: this.currentVideoInputDevice,
        videoInputDevices: this.videoInputDevices,
      });
    });
  };

  publishAudioVideoDidStart = () => {
    _.forEach(this.audioVideoDidStartCallbacks, (callbackFunc) => {
      callbackFunc();
    });
  };

  publishAudioVideoDidStop = (sessionStatus) => {
    _.forEach(this.audioVideoDidStopCallbacks, (callbackFunc) => {
      callbackFunc(sessionStatus);
    });
  };

  publishVideoTileDidUpdate = (tileState) => {
    _.forEach(this.audioVideoTileDidUpdateCallbacks, (callbackFunc) => {
      callbackFunc(tileState);
    });
  };

  publishVideoTileWasRemoved = (tileId) => {
    _.forEach(this.audioVideoTileWasRemovedCallbacks, (callbackFunc) => {
      callbackFunc(tileId);
    });
  };

  /**
   * ====================================================================
   * Utilities
   * ====================================================================
   */

  logError = (error) => {

  }
}

// const staticChimeSdkWrapper = new ChimeSdkWrapper();

export default ChimeSdkWrapper;
