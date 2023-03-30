import _ from 'lodash';
import moment from 'moment';
import fetchCarePlansOnGoing from '../../../Apollo/Functions/Fetch/fetchCarePlansOnGoing';
import handleAddTimeLog from '../../../Apollo/Functions/Handle/handleAddTimeLog';
import handleAddTimesheet from '../../../Apollo/Functions/Handle/handleAddTimesheet';
import { getFullName } from '../../../Helpers';
import { formatCountDownV2 } from '../../../Pages/PatientDetails/CarePlan/helper';

export const formatPatientData = (data = [], lastOption = []) => {
  const patientData = lastOption;
  _.forEach(data, (x) => {
    patientData.push(
      {
        ...x,
        photo: x?.patient?.photo,
        fullName: getFullName(x?.patientDemographic),
        firstName: x?.patientDemographic?.firstName,
        lastName: x?.patientDemographic?.lastName,
        facilityId: x?.facility?._id,
        facilityName: x?.facility?.name,
        carePlanFid: x?.friendlyId,
        carePlanId: x?._id,
        // email: x?.patient?.email,
      },
    );
  });
  return patientData;
};


export const fetchPatientData = async (search, isLoadMore = false, lastOptions = [], searchOption = {}) => {
  try {
    const filter = {
      search,
      cursor: undefined,
      sortOrder: 'desc',
      sortField: '_id',
      status: 'Active',
    };
    if (isLoadMore) {
      _.assign(filter, searchOption);
    }
    const sendingData = { filter: { ...filter }, limit: 10 };
    const res = await fetchCarePlansOnGoing(sendingData);
    let shouldLoadMore = true;
    if (res.length < 10 || (!search && !searchOption?.search)) {
      shouldLoadMore = false;
    }
    if (isLoadMore) {
      return {
        data:
          formatPatientData(res, lastOptions),
        searchOption: { search: searchOption?.search, cursor: res?.[res?.length - 1]?._id },
        shouldLoadMore,
      };
    }

    return {
      data:
        formatPatientData(res),
      searchOption: { search, cursor: res?.[res?.length - 1]?._id },
      shouldLoadMore,
    };
  } catch (error) {
    throw error;
  }
};


export const isDisabledAddLog = (state = {}, timer = '00:00:00') => {
  const { activity, selectedPatient, participants } = state || {};
  if (!activity || !selectedPatient?._id || !timer) {
    return true;
  }
  if (participants.includes(undefined)) {
    return true;
  }
  return false;
};

const getParticipantIds = (participants = []) => {
  const list = [];
  _.forEach(participants, (x) => {
    list.push(x?.value);
  });
  return list;
};

const formatUpTimer = (timer = 0) => {
  const mins = Math.ceil(timer / 60);
  return mins * 60;
};

export const handleOnAddTimeLog = async (state, activityCode, timer = 0) => {
  const sendingData = {
    carePlan: state?.selectedPatient?.carePlanId || undefined,
    activity: state?.activity ? _.find(activityCode, y => y.value === state?.activity).key : undefined,
    participants: !_.isEmpty(state?.participants) ? getParticipantIds(state?.participants) : undefined,
    // billable: state?.billable,
    date: moment().toISOString(),
    isManual: true,
    duration: timer ? parseInt(timer, 10) : 0,
    notes: state?.notes ? state.notes : undefined,
  };
  try {
    await handleAddTimeLog({ input: sendingData });
  } catch (error) {
    throw error;
  }
};

const getMins = (timerArr = [], before, after) => {
  const minsArr = [];
  _.forEach(timerArr, (x, i) => {
    if (i > before && i < after) {
      minsArr.push(x);
    }
  });
  return minsArr.join('');
};

const getSecondsTime = (hours = '', mins = '', seconds = '') => {
  let time = 0;
  if (hours) {
    time += parseInt(hours, 10) * 60 * 60;
  }
  if (mins) {
    time += parseInt(mins, 10) * 60;
  }
  if (seconds) {
    time += parseInt(seconds, 10);
  }
  return time;
};

export const formatTimerValue = (timerString = '') => {
  if (!timerString) return { isValid: false, secondTime: 0 };
  const timerArr = timerString?.split('');
  const numberDubDot = timerArr.filter(x => x === ':').length;
  if (numberDubDot > 2) return { isValid: false };

  if (numberDubDot === 0) {
    const timeSecond = timerString ? parseInt(timerString, 10) * 60 : 0;
    return { isValid: true, secondTime: timeSecond > 86400 ? 86400 : timeSecond };
  }
  if (numberDubDot === 1) {
    const dotIndex = timerArr.findIndex(x => x === ':');
    const hoursArr = _.cloneDeep(timerArr);
    const minArr = _.cloneDeep(timerArr);
    const hours = hoursArr.splice(0, dotIndex).join('');
    const mins = minArr.splice(dotIndex + 1).join('');
    const secondTime = getSecondsTime(hours, mins);

    return { isValid: true, secondTime: secondTime > 86400 ? 86400 : secondTime };
  }

  if (numberDubDot === 2) {
    const firstDotIndex = timerArr.findIndex(x => x === ':');
    const lastDotIndex = timerArr.findIndex((x, i) => x === ':' && i !== firstDotIndex);
    const hoursArr = _.cloneDeep(timerArr);
    const minArr = _.cloneDeep(timerArr);
    const hours = hoursArr.splice(0, firstDotIndex).join('');
    const mins = getMins(timerArr, firstDotIndex, lastDotIndex);
    const seconds = minArr.splice(lastDotIndex + 1).join('');
    const secondTime = getSecondsTime(hours, mins, seconds);

    return { isValid: true, secondTime: secondTime > 86400 ? 86400 : secondTime };
  }

  return { isValid: false };
};
