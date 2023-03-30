import { MESSAGES_ACTIONS } from '../../Constants';

export const setMessageDataRequest = data => ({ type: MESSAGES_ACTIONS.SET_MESSAGE_DATA, data });

export const updateMessageDataRequest = data => ({ type: MESSAGES_ACTIONS.UPDATE_MESSAGE_SUBCRIPTION, data });

export const updateMessageDetailRequest = data => ({ type: MESSAGES_ACTIONS.UPDATE_MESSAGE_SUBCRIPTION, data });
