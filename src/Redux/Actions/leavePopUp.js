import { LEAVE_POP_ACTIONS } from '../../Constants';

export const setLeavePopRequest = data => ({ type: LEAVE_POP_ACTIONS.SET_LEAVE_POP, data });

export const setLeaveDataRequest = data => ({ type: LEAVE_POP_ACTIONS.SET_LEAVE_DATA, data });
