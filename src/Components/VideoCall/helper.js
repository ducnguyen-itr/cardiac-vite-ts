import _ from 'lodash';
import fetchEvent from '../../Apollo/Functions/Fetch/fetchEvent';
import handleFinishCall from '../../Apollo/Functions/Handle/handleFinishCall';
import calendarHandleJoinCall from '../../Apollo/Functions/Handle/handleJoinCall';

export const handleFinishAppointment = async (callId) => {
  try {
    const result = await handleFinishCall({ callId });
    return true;
  } catch (error) {
    return false;
  }
};

export const handleFetchEvent = async (_id) => {
  try {
    const data = await fetchEvent({ _id });
    return data;
  } catch (error) {
    return {};
  }
};

export const handleJoinCall = async (eventId) => {
  try {
    const data = await calendarHandleJoinCall({ eventId });
    return true;
  } catch (error) {
    return false;
  }
};

export const formatAttendees = (data = []) => data.map(x => ({ ...x.user, fullName: `${x?.user?.firstName} ${x?.user?.lastName}` }));

export const getAttendeeIds = (attendees = []) => {
  if (_.isEmpty(attendees)) return {};
  const physician = attendees.find(x => x.type === 'Physician');
  const nurse = attendees.find(x => x.type === 'Technician');
  return {
    nurseId: nurse?.user?._id,
    physicianId: physician?.user?._id,
  };
};
export const fnBrowserDetect = () => {
  const { userAgent } = navigator;
  let browserName;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = 'chrome';
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = 'firefox';
  } else if (userAgent.match(/safari/i)) {
    browserName = 'safari';
  } else if (userAgent.match(/opr\//i)) {
    browserName = 'opera';
  } else if (userAgent.match(/edg/i)) {
    browserName = 'edge';
  } else {
    browserName = 'No browser detection';
  }
  return browserName;
};

export const isChrome = () => {
  try {
    const { userAgent } = navigator;
    return userAgent.match(/chrome|chromium|crios/i);
  } catch (error) {
    return false;
  }
};
