import initialState from './initialState';
import { SavePathActions } from '../../Constants';

const {
  SET_PATH, DELETE_PATH, ACTIVE_REPORT_TAB, DELETE_DETAIL_PATH, TAB_NAME, DELETE_NAVIGATE_TO_HM_CURRENT, DELETE_ALL_PATH,
} = SavePathActions;

const savePath = (state = initialState.savePath, action) => {
  switch (action.type) {
    case SET_PATH: {
      return { ...state, ...action.data };
    }
    case DELETE_PATH: { // delete all
      delete state.appointmentActiveTab;
      delete state.activeNewTab;
      delete state.activeHeartMonitorTab;
      delete state.activeReportTab;
      delete state.navigateFromTab;
      delete state.tabName;
      delete state.patientDetailsActiveTab;
      delete state.medicalTestResultActiveTab;
      delete state.dailyEntrySelectedDay;
      return { ...state };
    }
    case DELETE_ALL_PATH: {
      return {};
    }
    case DELETE_DETAIL_PATH: { // delete just detail path
      delete state[ACTIVE_REPORT_TAB];
      delete state[TAB_NAME];
      return { ...state };
    }
    case DELETE_NAVIGATE_TO_HM_CURRENT: { // delete link from notification center to HM current study
      delete state.patientDetailsActiveTab;
      delete state.careplanActiveTab;
      return { ...state };
    }
    default: {
      return { ...state };
    }
  }
};

export default savePath;
