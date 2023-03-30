import AppFlowActions from '../../Constants/appFlowActions';

export const fetchAllCountRequest = data => ({ type: AppFlowActions.FETCH_All_COUNT_REQUEST, data });

export const fetchNewCareplanCountRequest = data => ({ type: AppFlowActions.FETCH_NEW_CAREPLAN_COUNT_REQUEST, data });

export const fetchStudyNotificationsCountRequest = data => ({ type: AppFlowActions.FETCH_STUDY_NOTIFICATION_COUNT_REQUEST, data });

export const fetchNotificationsCountRequest = data => ({ type: AppFlowActions.FETCH_NOTIFICATION_COUNT_REQUEST, data });

export const fetchNewMonthlyReportCountRequest = data => ({ type: AppFlowActions.FETCH_MONTHLY_REPORT_COUNT_REQUEST, data });

export const fetchBioheartReportCountRequest = data => ({ type: AppFlowActions.FETCH_BIOHEART_REPORT_COUNT_REQUEST, data });

export const fetchMessagesCount = data => ({ type: AppFlowActions.FETCH_MESSAGES_COUNT_REQUEST, data });
