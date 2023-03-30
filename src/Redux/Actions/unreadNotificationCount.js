import AppFlowActions from '../../Constants/appFlowActions';

export const updateUnreadNotificationCount = data => ({ type: AppFlowActions.UPDATE_UNREAD_NOTIFICATION_COUNT_REQUEST, data });

export const addUnreadNotificationCount = data => ({ type: AppFlowActions.ADD_UNREAD_NOTIFICATION_COUNT_REQUEST, data });
