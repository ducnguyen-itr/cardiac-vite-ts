import AppFlowActions from '../../Constants/appFlowActions';

export const fetchNotificationsRequest = data => ({ type: AppFlowActions.FETCH_NOTIFICATIONS_REQUEST, data });

export const fetchNotificationRequest = data => ({ type: AppFlowActions.FETCH_NOTIFICATION_REQUEST, data });

export const deleteAllNotificationRequest = data => ({ type: AppFlowActions.DELETE_ALL_NOTIFICATIONS_REQUEST, data });

export const updateNotificationsRequest = data => ({ type: AppFlowActions.UPDATE_NOTIFICATIONS_REQUEST, data });
