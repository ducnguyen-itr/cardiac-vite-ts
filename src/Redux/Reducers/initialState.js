import { CONFIRMATION_LAYOUT_TYPES } from '../../Constants';
import auth from '../../Helpers/auth';

export default {
  isLoading: false,
  login: {
    user: {},
    isSuccess: false,
    photo: undefined,
  },
  notifications: [],
  unreadNotificationCount: 0,
  isEndOfNotifications: false,
  facility: auth.getSelectedFacility(),
  savePath: {
    // appointmentActiveTab: ...
    // activeNewTab: ....
    // activeReportTab: ....
    // navigateFromTab: ... // a whole pathName
    // tabName: ... // a tabName: new, active, ....

    // patientDetailsActiveTab: ...
    // careplanActiveTab: ...
    // medicalTestResultActiveTab: ...
    // heartMonitorActiveTab: ...
  },
  leavePopUp: {
    isUnsaved: false,
    isShowLeaveModal: false,
    type: CONFIRMATION_LAYOUT_TYPES.LEAVE,
    func: () => { },
  },
  notificationCounts: {
    newCarePlanCount: 0,
    studyNotificationCount: 0,
    notificationCount: 0,
    monthlyNotificationCount: 0,
  },
  histories: {
    current: 0,
    historyStack: [],
  },
  messages: {
    conversations: [],
    nextToken: '',
  },
  country: [],
};
