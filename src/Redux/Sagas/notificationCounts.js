import _ from 'lodash';
import {
  take, all, call, put, fork,
} from 'redux-saga/effects';

import { useMemo } from 'react';
import AppFlowActions from '../../Constants/appFlowActions';
import { NOTIFICATION_COUNT_TYPE } from '../../Constants';
import fetchCountStatusCarePlan from '../../Apollo/Functions/Fetch/fetchCountStatusCarePlan';
import fetchCountNotificationReport from '../../Apollo/Functions/Fetch/fetchCountNotificationReport';
import fetchCountMonthlyReport from '../../Apollo/Functions/Fetch/fetchCountMonthlyReport';
import fetchCountStudyNotification from '../../Apollo/Functions/Fetch/fetchCountStudyNotification';
import auth from '../../Helpers/auth';
import fetchUnreadInboxCounts from '../../Apollo/Functions/Fetch/fetchUnreadInboxCounts';
import consoleLog from '../../Helpers/consoleLog';
import fetchTotalSummaryReports from '../../Apollo/Functions/Fetch/fetchTotalSummaryReports';
import { CARE_PLAN_STATUS_ENUM } from '../../Constants/enum';
import fetchCountBillableTimeTracking from '../../Apollo/Functions/Fetch/fetchCountBillableTimeTracking';


const fetchStatusCarePlanCount = async (sendingData) => {
  const {
    facilityId,
  } = sendingData;
  const filter = {
    status: CARE_PLAN_STATUS_ENUM.NEW,
    facilityId: facilityId || undefined,
    nurseStatus: auth.isMD() ? undefined : 'New',
    physicianStatus: auth.isMD() ? 'New' : undefined,
    isAssigned: !!auth.isMD(),
    allPatients: false,
  };
  try {
    return await fetchCountStatusCarePlan({ filter });
  } catch (error) {
    consoleLog('Failed to fetch new careplan count', error);
    return 0;
  }
};

const fetchNotificationReportCount = async (sendingData) => {
  const {
    patientId, carePlanId, facilityId, allPatients,
  } = sendingData;
  const filter = {
    patientId: patientId || undefined,
    carePlanId: carePlanId || undefined,
    facilityId: facilityId || undefined,
    nurseStatus: auth.isMD() ? undefined : ['NEW'],
    physicianStatus: auth.isMD() ? ['NEW'] : undefined,
    allPatients: false,
  };
  try {
    return await fetchCountNotificationReport({ filter });
  } catch (error) {
    consoleLog('Failed to fetch unread notifications count', error);
    return 0;
  }
};

const fetchMonthlyReportCount = async (sendingData) => {
  const {
    patientId, carePlanId, facilityId, allPatients,
  } = sendingData;
  const filter = {
    patientId: patientId || undefined,
    carePlanId: carePlanId || undefined,
    facilityId: facilityId || undefined,
    nurseStatus: auth.isMD() ? undefined : ['NEW'],
    physicianStatus: auth.isMD() ? ['NEW'] : undefined,
    allPatients: false,
  };

  try {
    return await fetchCountMonthlyReport({ filter });
  } catch (error) {
    consoleLog('Failed to fetch unread monthly notifications count', error);
    return 0;
  }
};


const fetchStudyNotificationCount = async (sendingData) => {
  const {
    facilityId,
  } = sendingData;
  const filter = {
    fromCardiac: true,
    facilityId: facilityId || undefined,
    // isGetAll: false,
    // technicianId: auth.isNurse() ? auth.userId() : undefined,
  };

  try {
    const count = await fetchUnreadInboxCounts({ filter });
    return count?.unreadEventCount;
  } catch (error) {
    consoleLog('Failed to fetch unread study notifications count', error);
    return 0;
  }
};


const BioheartTotalSummaryReports = async (sendingData) => {
  const facilities = _.map(auth.getFacilities(), x => x._id);
  const { facilityId } = sendingData || {};
  const filter = {
    externalStatus: ['New'],
    facilities: facilityId ? [facilityId] : facilities,
    onlyMyPatient: true,
  };

  try {
    const count = await fetchTotalSummaryReports({ filter });
    return count;
  } catch (error) {
    consoleLog('Failed to fetch unread study notifications count', error);
    return 0;
  }
};

const fetchBillableTimeTrackingCount = async (sendingData) => {
  const {
    patientId, carePlanId, facilityId, allPatients,
  } = sendingData;
  const filter = {
    facilityID: facilityId,
    carePlanId,
    allPatients: false,
  };
  try {
    const count = await fetchCountBillableTimeTracking({ filter });
    return count;
  } catch (error) {
    consoleLog('Failed to fetch billable time tracking count', error);
    return 0;
  }
};

const fetchMessagesCount = async (sendingData) => {
  const filter = {};
  try {
    // const count = await fetchUnreadMessages({ filter });
    const count = 4;
    return count;
  } catch (error) {
    consoleLog('Failed to fetch unread study notifications count', error);
    return 0;
  }
};

export function* fetchAllCountRequest() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.FETCH_All_COUNT_REQUEST);
    const { data } = request;

    const [newCarePlanCount, notificationCount, monthlyNotificationCount, studyNotificationCount, bioheartReportCount, unreadMessagesCount, billableTimeTrackingCount] = yield all([
      call(fetchStatusCarePlanCount, data.sendingData),
      call(fetchNotificationReportCount, data.sendingData),
      call(fetchMonthlyReportCount, data.sendingData),
      call(fetchStudyNotificationCount, data.sendingData),
      call(BioheartTotalSummaryReports, data.sendingData),
      call(fetchMessagesCount, data.sendingData),
      call(fetchBillableTimeTrackingCount, data.sendingData),
    ]);
    yield put({
      type: AppFlowActions.FETCH_NOTIFICATION_COUNT_COMPLETE,
      data: {
        newCarePlanCount,
        notificationCount,
        monthlyNotificationCount,
        studyNotificationCount,
        bioheartReportCount,
        unreadMessagesCount,
        billableTimeTrackingCount,
      },
    });
  }
}

export function* fetchNewCareplanCountRequest() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.FETCH_NEW_CAREPLAN_COUNT_REQUEST);
    const { data } = request;
    const newCarePlanCount = yield call(fetchStatusCarePlanCount, data.sendingData);
    yield put({
      type: AppFlowActions.FETCH_NOTIFICATION_COUNT_COMPLETE,
      data: {
        newCarePlanCount,
      },
    });
  }
}
export function* fetchStudyNotificationsCountRequest() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.FETCH_STUDY_NOTIFICATION_COUNT_REQUEST);
    const { data } = request;
    const studyNotificationCount = yield call(fetchStudyNotificationCount, data.sendingData);
    yield put({
      type: AppFlowActions.FETCH_NOTIFICATION_COUNT_COMPLETE,
      data: {
        studyNotificationCount,
      },
    });
  }
}

export function* fetchNotificationsCountRequest() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.FETCH_NOTIFICATION_COUNT_REQUEST);
    const { data } = request;
    const notificationCount = yield call(fetchNotificationReportCount, data.sendingData);
    yield put({
      type: AppFlowActions.FETCH_NOTIFICATION_COUNT_COMPLETE,
      data: {
        notificationCount,
      },
    });
  }
}

export function* fetchNewMonthlyReportCountRequest() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.FETCH_MONTHLY_REPORT_COUNT_REQUEST);
    const { data } = request;

    const monthlyNotificationCount = yield call(fetchMonthlyReportCount, data.sendingData);
    yield put({
      type: AppFlowActions.FETCH_NOTIFICATION_COUNT_COMPLETE,
      data: {
        monthlyNotificationCount,
      },
    });
  }
}

export function* fetchBioheartReportCountRequest() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.FETCH_BIOHEART_REPORT_COUNT_REQUEST);
    const { data } = request;

    const bioheartReportCount = yield call(BioheartTotalSummaryReports, data.sendingData);
    yield put({
      type: AppFlowActions.FETCH_NOTIFICATION_COUNT_COMPLETE,
      data: {
        bioheartReportCount,
      },
    });
  }
}

export function* fetchUnreadMessagesCountRequest() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.FETCH_MESSAGES_COUNT_REQUEST);
    const { data } = request;

    const unreadMessagesCount = yield call(fetchMessagesCount, data.sendingData);
    yield put({
      type: AppFlowActions.FETCH_NOTIFICATION_COUNT_COMPLETE,
      data: {
        unreadMessagesCount,
      },
    });
  }
}

export default function* notificationsCountFlow() {
  yield fork(fetchAllCountRequest);
  yield fork(fetchNewCareplanCountRequest);
  yield fork(fetchStudyNotificationsCountRequest);
  yield fork(fetchNotificationsCountRequest);
  yield fork(fetchNewMonthlyReportCountRequest);
  yield fork(fetchBioheartReportCountRequest);
  yield fork(fetchUnreadMessagesCountRequest);
}
