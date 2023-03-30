import { FACILITY_ACTIONS } from '../../Constants';

export const setFacilityRequest = data => ({ type: FACILITY_ACTIONS.SET_FACILITY, data });

export const initFacilityRequest = data => ({ type: FACILITY_ACTIONS.INIT_FACILITY, data });
