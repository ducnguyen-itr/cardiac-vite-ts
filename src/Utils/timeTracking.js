import _ from 'lodash';
import moment from 'moment';
import auth from '../Helpers/auth';
import { formatCountDownMMSS } from './index';

const getDuration = (duration = 0, isMin = false) => {
  const minutes = Math.floor((duration / 60));
  const seconds = Math.floor((duration) % 60);
  return isMin ? minutes : seconds;
};

export const formatTimeSheet = (x = {}, isTable = true) => {
  const minDuration = !_.isNil(x?.duration) ? parseInt(x.duration / 60, 10) : 0;
  const userId = auth.userId();
  const timesheet = {
    _id: x?._id || '',
    carePlan: x?.carePlan || '',
    activity: x?.activity ? _.find(auth.getTimeSheetKey(), y => y.key === x.activity)?.value : '',
    date: x?.date ? moment(x.date).format('MM/DD/YYYY') : '',
    duration: `${minDuration} min${minDuration > 1 ? 's' : ''}`,
    timerDuration: formatCountDownMMSS(x?.duration),
    notes: x?.notes || '',
    createdBy: x?.createdBy || '',
    isManual: x?.isManual,
    // billable: x?.billable ? 'Yes' : 'No',
    minDuration: x?.duration ? getDuration(x?.duration, true) : 0,
    secDuration: x?.duration ? getDuration(x?.duration, false) : 0,
    durationStr: `${moment(x.date).format('hh:mm A')} - ${moment(x.date).add(x.duration, 'second').format('hh:mm A')}`,
  };

  let createParticipant = [];
  if (!_.isEmpty(x?.participants)) {
    if (x?.createdBy) {
      createParticipant = _.find(x?.participants, y => y?._id === x?.createdBy);
    } else {
      createParticipant = _.find(x?.participants, y => y?._id === auth.getLoginData()._id);
    }
  }
  const newParticipants = _.uniqBy([createParticipant, ...(x?.participants || [])], y => y?._id);

  if (isTable) {
    _.assign(timesheet, {
      participants: _.map(newParticipants, y => `${y?.firstName || ''} ${y?.lastName || ''}${y?._id === userId ? ' (You)' : ''}`).join('\n') || [],
    });
  } else {
    _.assign(timesheet, {
      participants: _.map(newParticipants, y => ({
        value: y._id,
        label: `${y?.firstName} ${y?.lastName}${y._id === userId ? ' (You)' : ''}`,
      })) || [],
    });
  }
  return timesheet;
};

export const formatTimeSheets = (timeSheets = []) => {
  if (timeSheets?.length === 0) {
    return [];
  }
  return _.map(timeSheets, x => (formatTimeSheet(x)));
};

export const formatActivityHistory = (activityHistory = [], getStartStopOnly = false) => {
  if (_.isEmpty(activityHistory)) return {};
  const activityArr = _.sortBy(activityHistory, 'fromDate');
  const startDate = moment(activityArr?.[0]?.fromDate).isValid() ? activityArr?.[0]?.fromDate : '';
  const stopDate = moment(activityArr?.[0]?.toDate).isValid() ? activityArr[activityArr.length - 1].toDate : '';
  const inactiveTime = [];
  if (getStartStopOnly) {
    return { startDate, stopDate };
  }
  for (let i = 0; i < activityArr.length - 1; i += 1) {
    inactiveTime.push({
      fromDate: moment(activityArr[i].toDate).isValid() ? moment(activityArr[i].toDate).add(1, 'd').startOf('d') : '',
      toDate: moment(activityArr[i + 1].fromDate).isValid() ? moment(activityArr[i + 1].fromDate).startOf('d') : '',
    });
  }
  return { startDate, stopDate, inactiveTime };
};
