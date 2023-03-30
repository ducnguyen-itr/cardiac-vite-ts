import { COUNTRY_ACTIONS, FACILITY_ACTIONS } from '../../Constants';

export const setCountryData = data => ({ type: COUNTRY_ACTIONS.SET_COUNTRY, data });
export const deleteCountryData = data => ({ type: COUNTRY_ACTIONS.DELETE_COUNTRY, data });
