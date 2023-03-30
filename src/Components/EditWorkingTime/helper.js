import moment from 'moment';
import _ from 'lodash';
import consoleLog from '../../Helpers/consoleLog';

export const today = moment().toDate();
export const isToday = date => moment().startOf('day').valueOf() === moment(date).startOf('day').valueOf();
export const isSameDate = (date1, date2) => moment(date1).isSame(moment(date2), 'day');
export const getDateFromToInCalendarMonth = (year, month) => {
  // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
  // array is 'year', 'month', 'day', etc
  const startDateOfMonth = moment([year, month - 1]);
  const startDateInWeekOfMonth = startDateOfMonth.day();
  let startDate = startDateOfMonth.toDate();
  if (startDateInWeekOfMonth - 1 > 0) {
    startDate = startDateOfMonth.subtract(startDateInWeekOfMonth - 1, 'days');
  }

  // Clone the value before .endOf()
  const endDateOfMonth = moment([year, month - 1]).endOf('month');
  const endDateInWeekOfMonth = endDateOfMonth.day();
  let endDate = endDateOfMonth.toDate();
  if (7 - endDateInWeekOfMonth > 0) {
    endDate = endDateOfMonth.add(7 - endDateInWeekOfMonth, 'days');
  }
  return { startDate: moment(startDate).startOf('day').format(), endDate: moment(endDate).endOf('day').format() };
};
export const getTimezoneOffsetByFormat = () => {
  // format: '-04:00', '+07:00'
  try {
    const timeZoneMinutes = new Date().getTimezoneOffset();
    if (timeZoneMinutes && typeof (timeZoneMinutes) === 'number') {
      const timeZone = timeZoneMinutes / 60;
      let addSub = '-';
      const abs = Math.abs(timeZone);
      if (timeZone < 0) {
        addSub = '+';
      }
      const timeZoneString = abs > 9 ? `${abs}` : `0${abs}`;

      return `${addSub}${timeZoneString}:00`;
    }
    return '-07:00';
  } catch (error) {
    consoleLog('error ', error);
    return '-07:00';
  }
};
export const getTimezoneOffset = () => {
  // format: 7, -4, 0
  try {
    const timeZoneMinutes = new Date().getTimezoneOffset();
    if (timeZoneMinutes && typeof (timeZoneMinutes) === 'number') {
      const timeZone = timeZoneMinutes / 60;
      if (timeZone < 0) {
        return Math.abs(timeZone);
      }
      return -timeZone;

      // return timeZone;
    }
    return -7;
  } catch (error) {
    consoleLog('error ', error);
    return -7;
  }
};
export const findNearestMinute = () => {
  const currentMinute = moment().minute();
  let minuteTemp = 0;
  if (currentMinute > 45) {
    minuteTemp = 0;
  } else if (currentMinute > 30) {
    minuteTemp = 45;
  } else if (currentMinute > 15) {
    minuteTemp = 30;
  } else if (currentMinute > 0) {
    minuteTemp = 15;
  }
  return minuteTemp;
};

export const generateTimeArray = (from, to, formatTime = 'hh:mm A') => {
  try {
    // from/to format: '9:00 AM'
    const options = [];
    let temp = moment(from, formatTime);
    for (let i = 0; i < 96; i += 1) {
      const tempFormat = temp.format(formatTime);
      options.push(tempFormat);
      if (tempFormat === moment(to, formatTime).format(formatTime)) {
        break;
      }
      temp = moment(temp, formatTime).add(15, 'm');
    }
    return options;
  } catch (error) {
    return [];
  }
};

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

export const generateTimeOptions = (from, to, formatTime = 'hh:mm A') => {
  try {
    // from/to format: '9:00 AM'
    const options = [];
    let temp = moment(from, formatTime);
    for (let i = 0; i < 96; i += 1) {
      const tempFormat = temp.format(formatTime);
      options.push({
        value: tempFormat,
        label: tempFormat,
      });
      if (tempFormat === moment(to, formatTime).format(formatTime)) {
        break;
      }
      temp = moment(temp, formatTime).add(15, 'm');
    }
    return options;
  } catch (error) {
    return [];
  }
};

export const isConflictTime = (dayInWeek, day) => {
  let isConflict = false;
  const fromDay = moment(`${day.from.hour}:${day.from.minute} ${day.from.meridiem}`, 'hh:mm A');
  const toDay = moment(`${day.to.hour}:${day.to.minute} ${day.to.meridiem}`, 'hh:mm A');

  _.forEach(dayInWeek, (x) => {
    const from = moment(`${x.from.hour}:${x.from.minute} ${x.from.meridiem}`, 'hh:mm A');
    const toTimeStr = `${x.to.hour}:${x.to.minute} ${x.to.meridiem}`;
    const to = moment(toTimeStr === '12:00 AM' ? '11:59 PM' : toTimeStr, 'hh:mm A');
    if (fromDay.isSameOrBefore(from) && toDay.isSameOrAfter(to)) {
      isConflict = true;
    }
    if (fromDay.isBetween(from, to) || toDay.isBetween(from, to)) {
      isConflict = true;
    }
  });
  return isConflict;
};

export const isConflictTimeForLeaveEvent = (eventExisteds, start, end) => {
  let isConflict = false;
  const eventStart = moment(start).format('hh:mm A');
  const eventEnd = moment(end).format('hh:mm A');
  const events = generateTimeArray(eventStart, eventEnd);
  _.forEach(eventExisteds, (x) => {
    const eventExistedStart = moment(x.start).format('hh:mm A');
    const eventExistedEnd = moment(x.end).format('hh:mm A');
    const eventExistedArray = generateTimeArray(eventExistedStart, eventExistedEnd);
    const rangeTimeConflictArray = _.filter(events || [], y => eventExistedArray.includes(y));
    if (rangeTimeConflictArray.length > 1 || x.allDay) {
      isConflict = true;
      return false;
    }
  });
  return isConflict;
};

export const durationDate = (fromDate, toDate) => {
  const start = moment(fromDate);
  const end = moment(toDate);
  const duration = moment.duration(end.diff(start));
  const days = duration.asDays();
  return days + 1;
};

export const isDateTimeSelectedFuture = (dateSelected, timeSelected, isOnlyCheckDate = false) => {
  try {
    if (isOnlyCheckDate) {
      const selected = moment(`${dateSelected.format('YYYY-MM-DD')}`);
      const now = moment(`${moment().format('YYYY-MM-DD')}`);
      if (selected.isBefore(now)) {
        return false;
      }
    } else {
      const selected = moment(`${dateSelected.format('YYYY-MM-DD')} ${timeSelected.format('HH:mm')}`);
      const now = moment(`${moment().format('YYYY-MM-DD')} ${moment().format('HH:mm')}`);
      if (selected.isBefore(now)) {
        return false;
      }
    }
    return true;
  } catch (error) {
    consoleLog('error ', error);
    return false;
  }
};

export const getTiming = (diff, isH = false) => {
  if (isH) {
    if (moment.utc(diff).format('HH') === '00') {
      return moment.utc(diff).format('mm:ss');
    }
    return moment.utc(diff).format('HH:mm:ss');
  }
  return moment.utc(diff).format('mm:ss');
};

export const parseWeekDayFromServer = (date, workingTime) => {
  const weekDayNumber = moment(date).isoWeekday();
  switch (weekDayNumber) {
    case 1:
      return workingTime.mon;
    case 2:
      return workingTime.tues;
    case 3:
      return workingTime.wed;
    case 4:
      return workingTime.thurs;
    case 5:
      return workingTime.fri;
    case 6:
      return workingTime.sat;
    case 7:
      return workingTime.sun;
    default:
      return workingTime.sun;
  }
};

export const findAvailableAttendeeByWorkingTime = (attendees, selectedDate, selectedTime) => {
  const attendeesFilter = _.filter(attendees, (x) => {
    const weekDay = parseWeekDayFromServer(selectedDate, x?.workingTime);
    const weekDayArray = _.map(weekDay, (x) => {
      const from = moment().startOf().set({ h: x?.from?.h, m: x?.from?.m }).format('hh:mm A');
      const to = moment().startOf().set({ h: x?.to?.h, m: x?.to?.m }).subtract(15, 'm')
        .format('hh:mm A');
      return generateTimeArray(from, to) || [];
    });
    let isAvailable = false;
    _.forEach(weekDayArray, (x) => {
      if (x.includes(selectedTime?.value)) {
        isAvailable = true;
        return false;
      }
    });
    return isAvailable;
  });
  return attendeesFilter;
};

export const geneneraFullTimeFromDateTime = (date, time) => {
  const dateString = moment(date).format('MM-DD-YYYY');
  const datetime = moment(`${dateString} ${time}`, 'MM-DD-YYYY hh:mm A').format('');
  return datetime;
};

export const generateTimeArrayWithOffset = (from, to, offset) => {
  // let start = moment().utc().startOf('d').subtract(offset, 'm').add(from.h, 'h').add(from.m, 'm')
  let start = moment().utc().startOf('d').utcOffset(-offset)
    .add(from.h, 'h')
    .add(from.m, 'm');
  const startDate = start.format('MM/DD/YYYY');
  const end = moment().utc().startOf('d').utcOffset(-offset)
    .add(to.h, 'h')
    .add(to.m, 'm');
  const arr = [];
  const arrNextDate = [];
  while (start < end) {
    const startTemp = moment(start).add(-(new Date().getTimezoneOffset()), 'm');
    if (startTemp.format('MM/DD/YYYY') !== startDate) {
      arrNextDate.push(startTemp.format('hh:mm A'));
    } else {
      arr.push(startTemp.format('hh:mm A'));
    }
    start = start.add(15, 'm');
  }
  const am = arr.filter(x => x.includes('AM'));
  const pm = arr.filter(x => x.includes('PM'));
  const amNextDate = arrNextDate.filter(x => x.includes('AM'));
  const pmNextDate = arrNextDate.filter(x => x.includes('PM'));
  return {
    today: [...am, ...pm],
    nextDate: [...amNextDate, ...pmNextDate],
  };
};

export const customGenerateTimeOptions = (dateSelected, physicianSelected = undefined, bookedTime = [], leaveAllDay = false) => {
  try {
    if (leaveAllDay) {
      return [];
    }
    let timeOptions = [];
    const isToday = moment(dateSelected).isSame(moment(), 'day');
    const isPastDay = moment(dateSelected).isBefore(moment(), 'day');
    if (isToday) {
      const currentHour = moment().hour();
      const startTime = moment(`${moment().minute() > 45 ? currentHour + 1 : currentHour}:${findNearestMinute()}`, 'hh:mm A');
      if (currentHour === 23 && moment().minute() > 45) {
        timeOptions = [];
      } else {
        timeOptions = generateTimeOptions(startTime, '11:45 PM');
      }
    } else if (isPastDay) {
      timeOptions = [];
    } else {
      timeOptions = generateTimeOptions('12:00 AM', '11:45 PM');
    }
    if (physicianSelected && physicianSelected?.workingTime) {
      const weekDay = parseWeekDayFromServer(dateSelected, physicianSelected.workingTime);
      const weekDaySorted = _.orderBy(weekDay, ['from.h', 'from.m'], ['asc', 'asc']);
      const weekDayArray = _.map(weekDaySorted, (x) => {
        const from = moment().startOf().set({ h: x?.from?.h, m: x?.from?.m }).format('hh:mm A');
        const to = moment().startOf().set({ h: x?.to?.h, m: x?.to?.m }).subtract(15, 'm')
          .format('hh:mm A');
        return generateTimeArray(from, to) || [];
      });
      if (weekDayArray.length > 0) {
        const timeOptionsTemp = [];
        _.forEach(weekDayArray, (x) => {
          const availableTimeArray = _.filter(timeOptions || [], y => x.includes(y.value));
          timeOptionsTemp.push(...availableTimeArray);
        });
        timeOptions = timeOptionsTemp;
      } else {
        timeOptions = [];
      }
      if (bookedTime.length > 0) {
        timeOptions = _.filter(timeOptions, x => !bookedTime.includes(x.value));
      }
    }
    return _.sortedUniq(timeOptions);
  } catch (err) {
    return [];
  }
};

export const hasTimeOptionsWithOffset = (previousWeekDay, weekDay, physicianSelected) => {
  const weekDaySorted = _.orderBy(weekDay, ['from.h', 'from.m'], ['asc', 'asc']);
  const previousWeekDaySorted = _.orderBy(previousWeekDay, ['from.h', 'from.m'], ['asc', 'asc']);
  const weekDayArray = [];
  const previousWeekDayArray = [];
  _.forEach(weekDaySorted, (x) => {
    weekDayArray.push(...(generateTimeArrayWithOffset(x.from, x.to, physicianSelected.utcOffset)?.today || []));
  });
  _.forEach(previousWeekDaySorted, (x) => {
    previousWeekDayArray.push(...(generateTimeArrayWithOffset(x.from, x.to, physicianSelected.utcOffset)?.nextDate || []));
  });
  const arr = [...previousWeekDayArray, ...weekDayArray];
  return arr.length > 0;
};

export const generateTimeOptionsOnlyWithOffset = (dateSelected, physicianSelected) => {
  const weekDay = parseWeekDayFromServer(dateSelected, physicianSelected.workingTime);
  const previousWeekDay = parseWeekDayFromServer(moment(dateSelected).subtract(1, 'd'), physicianSelected.workingTime);
  const weekDaySorted = _.orderBy(weekDay, ['from.h', 'from.m'], ['asc', 'asc']);
  const previousWeekDaySorted = _.orderBy(previousWeekDay, ['from.h', 'from.m'], ['asc', 'asc']);
  const weekDayArray = [];
  const previousWeekDayArray = [];
  _.forEach(weekDaySorted, (x) => {
    weekDayArray.push(...(generateTimeArrayWithOffset(x.from, x.to, physicianSelected.utcOffset)?.today || []));
  });
  _.forEach(previousWeekDaySorted, (x) => {
    previousWeekDayArray.push(...(generateTimeArrayWithOffset(x.from, x.to, physicianSelected.utcOffset)?.nextDate || []));
  });
  return [...previousWeekDayArray, ...weekDayArray];
};

export const generateTimeOptionsWithOffset = (dateSelected, physicianSelected = undefined, bookedTime = [], leaveAllDay = false) => {
  try {
    if (leaveAllDay || _.isEmpty(physicianSelected?.workingTime) || _.isEmpty(physicianSelected)) {
      return [];
    }
    let timeOptions = [];
    // generate time by working time
    timeOptions = generateTimeOptionsOnlyWithOffset(dateSelected, physicianSelected);

    // filter time by booked time
    if (bookedTime.length > 0) {
      timeOptions = _.filter(timeOptions, x => !bookedTime.includes(x));
    }
    // filter time by today or pastday
    const isToday = moment(dateSelected).isSame(moment(), 'day');
    const isPastDay = moment(dateSelected).isBefore(moment(), 'day');
    if (isToday) {
      const currentHour = moment().hour();
      const startTime = moment(`${moment().minute() > 45 ? currentHour + 1 : currentHour}:${findNearestMinute()}`, 'hh:mm A');
      if (currentHour === 23 && moment().minute() > 45) {
        timeOptions = [];
      } else {
        const avoidTodayTime = _.map(generateTimeOptions(moment().startOf('d'), startTime), 'value');
        avoidTodayTime.pop();
        timeOptions = _.filter(timeOptions, x => !avoidTodayTime.includes(x));
      }
    } else if (isPastDay) {
      timeOptions = [];
    }
    return _.map(_.sortedUniq(timeOptions), x => ({
      label: x,
      value: x,
    }));
  } catch (err) {
    return [];
  }
};

export const getMeetingAtFormat = (dateSelected, timeSelected) => {
  const date = dateSelected.format('YYYY-MM-DD');
  const time = timeSelected.format('HH-mm-ss');
  return `${date} ${time}`;
};

export const getDobMoment = (dobString) => {
  if (!moment(dobString).isValid()) {
    return moment(dobString, 'MM-DD-YYYY');
  }
  return moment(dobString);
};

export const getPhone = (phone) => {
  let phoneTemp = phone;
  if (phone?.includes('+') && phone?.length > 11) {
    // handle parse old phone format
    if (phone?.includes('+84')) {
      phoneTemp = phone.slice(3);
    } else {
      phoneTemp = phone.slice(2);
    }
    phoneTemp = `${phoneTemp.slice(0, 3)}-${phoneTemp.slice(3, 6)}-${phoneTemp.slice(6)}`;
  } else if (!phone?.includes('-') && phone?.length > 9) {
    phoneTemp = `${phoneTemp.slice(0, 3)}-${phoneTemp.slice(3, 6)}-${phoneTemp.slice(6)}`;
  }
  return phoneTemp;
};
