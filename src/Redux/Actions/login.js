import AppFlowActions from '../../Constants/appFlowActions';

export const loginRequest = data => ({ type: AppFlowActions.LOGIN_REQUEST, data });

export const logoutRequest = data => ({ type: AppFlowActions.LOGOUT_REQUEST, data });

export const updateAvatarRequest = data => ({ type: AppFlowActions.UPDATED_AVATAR, data });
