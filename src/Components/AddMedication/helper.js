import _ from 'lodash';
import moment from 'moment';
import { FREQUENCY_DATA } from '../../Constants';
import { convertPluralMedicationUnit } from '../../Utils';


export const getTimeToTake = (fre = FREQUENCY_DATA[0], time = []) => {
  switch (fre) {
    case FREQUENCY_DATA[0]:
      return [
        moment(time[0] || '09:00', 'hh:mm A'),
      ];
    case FREQUENCY_DATA[1]:
      return [
        moment(time[0] || '09:00', 'hh:mm A'),
        moment(time[1] || '18:00', 'hh:mm A'),
      ];
    case FREQUENCY_DATA[2]:
      return [
        moment(time[0] || '09:00', 'hh:mm A'),
        moment(time[1] || '12:00', 'hh:mm A'),
        moment(time[2] || '18:00', 'hh:mm A'),
      ];
    case FREQUENCY_DATA[3]:
      return [
        moment(time[0] || '09:00', 'hh:mm A'),
        moment(time[1] || '12:00', 'hh:mm A'),
        moment(time[2] || '15:00', 'hh:mm A'),
        moment(time[3] || '18:00', 'hh:mm A'),
      ];
    case FREQUENCY_DATA[4]:
      return [
        moment(time[0] || '09:00', 'hh:mm A'),
        moment(time[1] || '12:00', 'hh:mm A'),
        moment(time[2] || '15:00', 'hh:mm A'),
        moment(time[3] || '18:00', 'hh:mm A'),
        moment(time[4] || '21:00', 'hh:mm A'),
      ];
    default:
      return [];
  }
};

export const INIT_STATE = {
  name: '',
  quantity: '',
  unit: undefined,
  time: getTimeToTake(),
  notes: '',
  prescribedDate: undefined,
  quantityErr: '',
  options: [],
  frequency: FREQUENCY_DATA[0],
  isDisabledName: false,
};

export const isDisabled = (state) => {
  const {
    quantity, name, unit, prescribedDate,
  } = state;
  if (!name || !quantity || !unit || !prescribedDate) {
    return true;
  }
  return false;
};

export const isDisabledClear = (state) => {
  const {
    quantity, name, notes, time,
    frequency, unit, prescribedDate,
  } = state || {};
  if (name || quantity || unit || notes) {
    return false;
  }
  if (frequency !== FREQUENCY_DATA[0]) {
    return false;
  }
  if (!_.isEqual(time, getTimeToTake())) {
    return false;
  }
  if (moment(prescribedDate).format('MM-DD-YYYY') !== moment().format('MM-DD-YYYY')) {
    return false;
  }
  return true;
};

export const formatInput = state => ({
  ...state,
  name: state.name,
  quantity: parseInt(state.quantity, 10),
  frequency: parseInt(state.frequency?.slice(0, 1), 10),
  time: state.time?.map(x => moment(x).format('HH:mm')),
  notes: state.notes,
  prescribeAt: moment(state.prescribedDate).format('YYYY-MM-DD'),
});


export const getMedicationInfoText = (medication = {}) => {
  const { quantity, unit, frequency } = medication;
  const quantityText = quantity ? `${quantity || 0} ${quantity > 1 ? convertPluralMedicationUnit(unit) : unit}` : '';
  const frequencyText = frequency ? ` - ${frequency} time${frequency > 1 ? 's' : ''}/day ` : '';
  return `${quantityText}${frequencyText}`;
};

export const getTimeToTakeInfoText = (medication = {}) => {
  const { time, timeToTake, notes } = medication;
  const timeText = !_.isEmpty(time) ? `${timeToTake || 0}` : '';
  const noteText = notes ? ` - ${notes}` : '';
  return `${timeText}${noteText}`;
};
