import moment from 'moment';
import { FREQUENCY_DATA } from '../../../Constants';

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

export default getTimeToTake;
