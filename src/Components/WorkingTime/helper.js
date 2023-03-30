import _ from 'lodash';
import moment from 'moment';

export const generateWorkingTimeObjectElement = data => _.map(data, (x, i) => {
  const from = moment().startOf().set({ h: x?.from?.h, m: x?.from?.m });
  const to = moment().startOf().set({ h: x?.to?.h, m: x?.to?.m });
  return {
    from: {
      hour: from.format('hh'),
      minute: from.format('mm'),
      meridiem: from.format('A'),
    },
    to: {
      hour: to.format('hh'),
      minute: to.format('mm'),
      meridiem: to.format('A'),
    },
    excludeHoliday: x?.excludeHoliday,
    index: i,
    isConflict: false,
  };
});

export const generateWorkingTime = (data) => {
  const {
    mon = [], tues = [], wed = [], thurs = [], fri = [], sat = [], sun = [],
  } = data || {};
  const workingTime = {};
  workingTime.monday = generateWorkingTimeObjectElement(mon) || [];
  workingTime.tuesday = generateWorkingTimeObjectElement(tues) || [];
  workingTime.wednesday = generateWorkingTimeObjectElement(wed) || [];
  workingTime.thursday = generateWorkingTimeObjectElement(thurs) || [];
  workingTime.friday = generateWorkingTimeObjectElement(fri) || [];
  workingTime.saturday = generateWorkingTimeObjectElement(sat) || [];
  workingTime.sunday = generateWorkingTimeObjectElement(sun) || [];
  return workingTime;
};
export const isEmptyWorkingTime = (workingTime) => {
  let isEmpty = true;
  Object.keys(workingTime).forEach((key) => {
    if (!_.isEmpty(workingTime[key])) { isEmpty = false; }
  });
  return isEmpty;
};
