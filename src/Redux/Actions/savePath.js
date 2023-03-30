import { SavePathActions } from '../../Constants';

export const setPathRequest = data => ({ type: SavePathActions.SET_PATH, data });

export const deletePathRequest = data => ({ type: SavePathActions.DELETE_PATH, data });

export const deleteAllPathRequest = data => ({ type: SavePathActions.DELETE_ALL_PATH, data });

export const deleteDetailPathRequest = data => ({ type: SavePathActions.DELETE_DETAIL_PATH, data });

export const deleteNavigateToHMCurrentStudy = data => ({ type: SavePathActions.DELETE_NAVIGATE_TO_HM_CURRENT, data });

export const deleteNavigateToMedicalTest = data => ({ type: SavePathActions.DELETE_NAVIGATE_TO_MEDICAL_TEST, data });
