import _, { findIndex } from 'lodash';
import moment from 'moment';

const customPalpitations = (arr = [], other = '') => {
  if (arr.length === 0) {
    return '';
  }
  let res = '';
  _.forEach(arr, (x) => {
    if (x) {
      if (x?.toLowerCase().includes('other')) {
        if (res) {
          res += ', ';
        }
        res += other;
      } else {
        if (res) {
          res += ', ';
        }
        res += x;
      }
    }
  });
  return res;
};

const customChestPain = (chestPainTimePerWeek, increasingFrequencyOfChestPain) => {
  if (!chestPainTimePerWeek && !increasingFrequencyOfChestPain) {
    return '';
  }
  let res = chestPainTimePerWeek ? `- ${chestPainTimePerWeek} time${chestPainTimePerWeek > 1 ? 's' : ''}/week` : '';
  if (increasingFrequencyOfChestPain?.title === 'Yes') {
    res += chestPainTimePerWeek ? ', increasing over the past 4 weeks' : '- increasing over the past 4 weeks';
  }
  return res;
};

export const customCurrentSymptom = (
  currentSymptoms = [], palpitationTriggers = [], palpitationOther = '', chestPainTimePerWeek = undefined, increasingFrequencyOfChestPain = undefined,
) => {
  if (currentSymptoms.length <= 0) {
    return 'No';
  }
  let res = '';
  _.forEach(currentSymptoms, (x) => {
    if (x) {
      if (x === 'Palpitations') {
        if (res) {
          res += '\n';
        }
        const triggerBy = customPalpitations(palpitationTriggers, palpitationOther);
        res += `• Palpitations ${triggerBy ? `- triggered by: ${triggerBy}` : ''}`;
      } else if (x === 'Chest pain') {
        if (res) {
          res += '\n';
        }
        res += `• Chest pain ${customChestPain(chestPainTimePerWeek, increasingFrequencyOfChestPain)}`;
      } else {
        if (res) {
          res += '\n';
        }
        res += `• ${x}`;
      }
    }
  });
  return res || 'No';
};

export const customMedications = (arr = []) => _.map(arr, x => `• ${_.upperFirst(x.name)}`).join('\n');

export const customPastMedicalHistory = (
  pastMedicalHistory = [], pastMedicalOther = '', myocardialInfarction = undefined,
) => {
  if (pastMedicalHistory.length <= 0) {
    return 'No';
  }
  const sortMedicalHistory = _.cloneDeep(pastMedicalHistory.sort((a, b) => {
    if (a?.toLowerCase() < b?.toLowerCase()) return -1;
    if (a?.toLowerCase() > b?.toLowerCase()) return 1;
    return 0;
  }));
  const sortMedicalHistory2 = [];
  const otherList = [];

  _.forEach(sortMedicalHistory, (x) => {
    if (x?.includes('Other: ')) {
      otherList.push(x);
    } else {
      sortMedicalHistory2.push(x);
    }
  });
  let res = '';
  _.forEach([...sortMedicalHistory2, ...otherList], (x) => {
    if (x) {
      if (x === 'Myocardial infarction') {
        if (res) {
          res += '\n';
        }
        res += `• Myocardial infarction${myocardialInfarction ? ` - ${moment(myocardialInfarction).format('MM/DD/YYYY')}` : ''}`;
      } else {
        if (res) {
          res += '\n';
        }
        res += `• ${x}`;
      }
    }
  });
  return res || 'No';
};

export const customAfibStatusStatus = (afibStatus = {}, bioflux = {}) => {
  let res = afibStatus?.title || '';
  if (!_.isEmpty(bioflux)) {
    res += `\n${bioflux?.facilityName || ''}`;
  }
  return res;
};

export const customBiofluxReport = (bioflux = {}) => {
  if (_.isEmpty(bioflux)) {
    return '';
  }
  return 'Report.pdf';
};

const pastMediArr = [
  'Hypertension', 'Diabetes mellitus', 'Myocardial infarction',
  'Stroke transient ischemic attack',
  'Congestive heart failure or LV dysfunction', 'Obesity',
  'Obstructive sleep apnea', 'Cardiothoracic surgery', 'Smoker',
  'Hyperthyroidism or hypothyroidism',
  'Family history of Atrial Fibrillation',
  'Family history',
];

export const formartDisplayMedicalHistory = (medicalHistory = []) => {
  const pastMedicalHistory = [];
  let myocardialInfarction;
  let isMyocardialInfarction = false;
  _.forEach(medicalHistory, (x) => {
    if (x.type === 'Myocardial infarction') {
      pastMedicalHistory.push(x.type);
      isMyocardialInfarction = true;
      myocardialInfarction = x?.date;
    } else if (x.type === 'Other' || x.type === 'Others') {
      pastMedicalHistory.push(`Other: ${x.other}`);
    } else {
      pastMedicalHistory.push(x.type);
    }
  });
  return {
    pastMedicalHistory, myocardialInfarction, isMyocardialInfarction,
  };
};

export const sortListCondition = (conditions = [], isObject = false) => {
  if (_.isEmpty(conditions)) return [];
  if (isObject) {
    const sortList = conditions.sort((a, b) => a?.type?.toLowerCase().localeCompare(b?.type?.toLowerCase()));
    const filterNoOther = [];
    const filterOther = [];
    sortList.forEach((x) => {
      if (x.type?.includes('Other: ')) {
        filterOther.push(x);
      } else {
        filterNoOther.push(x);
      }
    });
    return [...filterNoOther, ...filterOther];
  }
  const sortList = conditions.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const filterNoOther = [];
  const filterOther = [];
  sortList.forEach((x) => {
    if (x.includes('Other: ')) {
      filterOther.push(x);
    } else {
      filterNoOther.push(x);
    }
  });
  return [...filterNoOther, ...filterOther];
};
