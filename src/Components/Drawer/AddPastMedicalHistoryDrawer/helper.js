import _ from 'lodash';
import { AFIB_HISTORY_DATA } from '../../../Constants/newPatientData';
import { CURRENT_SYMPTOMS_NAME, PALPITATIONS_CHILDREN, PALPITATIONS_CHILDREN_DATA } from '../../../Constants/newTemplate';
import { configRadioBoolData, configRadioData } from '../../../Utils';
import { formatAfibHistory } from '../../../Utils/createNewPatient';

const {
  AFibStatusQuestion,
  CardioversionQuestion,
  ElectricalShockQuestion,
  CurrentSymptomsQuestion,
  HospitalizedQuestion,
  OtherOptions,
  Myocardial,
  ChestPain,
  chestPainData,
  DIAGNOSED_WITH_AFIB_DATA,
} = AFIB_HISTORY_DATA;

const {
  afibStatusdata,
  BIOFLUX_LOADING,

} = AFibStatusQuestion;
const { cardioversiondata } = CardioversionQuestion;
const { electricaldata } = ElectricalShockQuestion;
const {
  CHEST_PAIN_FREQUENCY, CHEST_PAIN_TIMES,
} = CurrentSymptomsQuestion;

const { hospitalizeddata } = HospitalizedQuestion;

const formatCurrentSymptoms = (data) => {
  if (!data || _.isEmpty(data)) {
    return [];
  }
  const symptoms = [];

  _.forEach(data, (value, key) => {
    switch (key) {
      case 'lightHeadedness':
        if (value) {
          symptoms.push(CURRENT_SYMPTOMS_NAME.lightHeadedness);
        }
        break;
      case 'fatigue':
        if (value) {
          symptoms.push(CURRENT_SYMPTOMS_NAME.fatigue);
        }
        break;
      case 'decreasingExerciseCapacity':
        if (value) {
          symptoms.push(CURRENT_SYMPTOMS_NAME.decreasingExerciseCapacity);
        }
        break;
      case 'dyspnea':
        if (value) {
          symptoms.push(CURRENT_SYMPTOMS_NAME.dyspnea);
        }
        break;
      case 'syncope':
        if (value) {
          symptoms.push(CURRENT_SYMPTOMS_NAME.syncope);
        }
        break;
      case 'numberInArmOrLeg':
        if (value) {
          symptoms.push(CURRENT_SYMPTOMS_NAME.numberInArmOrLeg);
        }
        break;
      case 'painfulUrination':
        if (value) {
          symptoms.push(CURRENT_SYMPTOMS_NAME.painfulUrination);
        }
        break;
      case 'chestPainTimePerWeek':
        if (value && !_.includes(symptoms, CURRENT_SYMPTOMS_NAME.chestPain)) {
          symptoms.push(CURRENT_SYMPTOMS_NAME.chestPain);
        }
        break;
      case 'increasingFrequencyOfChestPain':
        if (!_.isNil(value) && !_.includes(symptoms, CURRENT_SYMPTOMS_NAME.chestPain)) {
          symptoms.push(CURRENT_SYMPTOMS_NAME.chestPain);
        }
        break;
      case 'palpitations':
        if (value?.length >= 0 && !_.isNil(value)) {
          symptoms.push(CURRENT_SYMPTOMS_NAME.palpitations);
        }
        break;
      default: break;
    }
  });

  return symptoms;
};

const formatPalpitations = data => _.map(data, item => (_.includes(_.initial(PALPITATIONS_CHILDREN_DATA), item) ? item : PALPITATIONS_CHILDREN.OTHERS));
const formatPalpitationOther = data => _.find(data, item => !_.includes(_.initial(PALPITATIONS_CHILDREN_DATA), item));


export const formatInitData = data => ({
  cardioversion: configRadioBoolData(data?.hadCardioversion, cardioversiondata, 1),
  electricalShock: configRadioBoolData(data?.electricalShock, electricaldata, 1),

  // CURRENT SYMPTOMS
  currentSymptoms: formatCurrentSymptoms(data?.symptomHistory),
  chestPainTimePerWeek: data?.symptomHistory?.chestPainTimePerWeek || undefined,
  increasingFrequencyOfChestPain: configRadioBoolData(data?.symptomHistory?.increasingFrequencyOfChestPain, chestPainData, 1),
  palpitationTriggers: formatPalpitations(data?.symptomHistory?.palpitations),
  palpitationOther: formatPalpitationOther(data?.symptomHistory?.palpitations),

  hospitalized: configRadioBoolData(data?.isHospitalized, hospitalizeddata, 1),
  hospitalizedDate: data?.hospitalizedDate || undefined,

  chestPainTimePerWeekErr: '',
});

export const formatPastMedicalHistory = ({ carePlanId, state }) => {
  const afibHistory = formatAfibHistory(_.cloneDeep(state));
  delete afibHistory?.usingMedications;
  delete afibHistory?.medicalHistory;

  return {
    carePlanId,
    afibHistory,
  };
};

export const handleDisabledAfibHistory = (oldData, newData, isAddAFib) => {
  if (_.isEqual(formatInitData(oldData), newData) && !isAddAFib) {
    return true;
  }
  return false;
};
