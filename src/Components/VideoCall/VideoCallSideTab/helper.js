import _ from 'lodash';
import moment from 'moment';
import fetchEvents from '../../../Apollo/Functions/Fetch/fetchEvents';

export const dataTest = [
  {
    date: '04/13/2022 - 02:00 PM',
    systolic: '60',
    diastolic: '110',
    heartRate: '110',
    heartRhythm: '',
    oxygenSaturation: '100',
    respiratoryRate: '100',
    temperature: '37',
    temperatureUnit: 'C',
    weight: '75',
    weightUnit: 'Kg',
    bmi: '23',
    reason: 'Follow up',
  },
  {
    date: '03/20/2022 - 10:00 AM',
    systolic: '60',
    diastolic: '110',
    heartRate: '110',
    heartRhythm: '',
    oxygenSaturation: '100',
    respiratoryRate: '100',
    temperature: '37',
    temperatureUnit: 'C',
    weight: '75',
    weightUnit: 'Kg',
    bmi: '23',
  },
  {
    date: '02/10/2022 - 03:30 PM',
    systolic: '60',
    diastolic: '110',
    heartRate: '110',
    heartRhythm: '',
    oxygenSaturation: '100',
    respiratoryRate: '100',
    temperature: '37',
    temperatureUnit: 'C',
    weight: '75',
    weightUnit: 'Kg',
    bmi: '23',
  },
  {
    date: '01/26/2022 - 11:00 AM',
    systolic: '60',
    diastolic: '110',
    heartRate: '110',
    heartRhythm: '',
    oxygenSaturation: '100',
    respiratoryRate: '100',
    temperature: '37',
    temperatureUnit: 'C',
    weight: '75',
    weightUnit: 'Kg',
    bmi: '23',
  },
  {
    date: '12/15/2021 - 03:45 PM',
    systolic: '60',
    diastolic: '110',
    heartRate: '110',
    heartRhythm: '',
    oxygenSaturation: '100',
    respiratoryRate: '100',
    temperature: '37',
    temperatureUnit: 'C',
    weight: '75',
    weightUnit: 'Kg',
    bmi: '23',
  },
  {
    date: '11/05/2021 - 11:00 AM',
  },
  {
    date: '10/26/2021 - 03:30 PM',
  },
  {
    date: '09/26/2021 - 03:45 PM',
  },
];


export const getVitalsData = (data = {}) => {
  const {
    systolic,
    diastolic,
    heartRate,
    heartRhythm,
    oxygenSaturation,
    respiratoryRate,
    temperature,
    temperatureUnit,
    weight,
    weightUnit,
    bmi,
  } = data || {};
  return [
    {
      title: 'Blood pressure',
      data: (systolic || diastolic) ? `${systolic || '--'} / ${diastolic || '--'} (mmHg)` : '--',
    },
    {
      title: 'Heart rate',
      data: heartRate ? `${heartRate} (bpm)` : '--',
    },
    {
      title: 'Heart rhythm',
      data: heartRhythm || '--',
    },
    {
      title: 'Oxygen saturation',
      data: oxygenSaturation ? `${oxygenSaturation} (%)` : '--',
    },
    {
      title: 'Respiratory rate',
      data: respiratoryRate ? `${respiratoryRate} (bpm)` : '--',
    },
    {
      title: 'Temperature',
      data: !_.isNil(temperature) && temperature !== '' ? `${temperature} °${temperatureUnit}` : '--',
    },
    {
      title: 'Weight',
      data: !_.isNil(weight) && weight !== '' ? `${weight} ${weightUnit}` : '--',
    },
    {
      title: 'BMI',
      data: bmi || '--',
    },
  ];
};

const handleFetchEvents = async (patientId) => {
  try {
    const variables = {
      filter: {
        fromTime: 0,
        toTime: moment().valueOf(),
        attendees: patientId ? [patientId] : undefined,
        status: ['Finished', 'Overdue'],
      },
      limit: 999,
    };
    const { events } = await fetchEvents(variables) || {};
    return events;
  } catch (error) {
    return [];
  }
};

export const handleFetchInitialData = async (patientId) => {
  const promises = [handleFetchEvents(patientId)];
  const result = await Promise.all(promises);
  const data = {
    history: _.map(result[0] || [], x => ({
      title: moment(x?.fromTime).format('MM/DD/YYYY - hh:mm A'),
      vital: x?.info?.vital || {},
      reasons: x?.info?.reasons || [],
    })),
  };
  return data;
};
