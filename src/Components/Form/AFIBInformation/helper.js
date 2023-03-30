import axios from 'axios';
import _ from 'lodash';
import { BASELINE_DIAGNOSED_CONDITIONS, BASELINE_DIAGNOSED_CONDITIONS_OTHER } from '../../../Constants/baseline';
import consoleLog from '../../../Helpers/consoleLog';

export const disabledAddMore = (diagnosedConditions = []) => {
  if (_.isEmpty(diagnosedConditions)) {
    return false;
  }
  const lastItem = _.last(diagnosedConditions);
  if (_.isEmpty(lastItem) || !lastItem?.type) {
    return true;
  }
  const emptyOtherDiagnosed = _.find(diagnosedConditions, x => x?.type === BASELINE_DIAGNOSED_CONDITIONS_OTHER && _.isEmpty(x?.othersConditions));
  if (emptyOtherDiagnosed) {
    return true;
  }
  return false;
};

export const getConditionsSelectData = (diagnosedConditions = [], current = '') => {
  const selectData = [];
  _.forEach(BASELINE_DIAGNOSED_CONDITIONS, (x) => {
    const item = _.find(diagnosedConditions, y => y?.type === x);

    if (_.isEmpty(item) || x === current) {
      selectData.push(x);
    }
  });

  selectData.push('Other');
  return _.uniq(selectData);
};

export const getHeartValveData = (diagnosedConditions = [], key = '') => {
  let heartValveIssue;
  let valvularHeartDisease;
  let heartValveReplacement;
  let mitralValveStatus;
  _.forEach(diagnosedConditions, (x) => {
    if (x?.type === 'Valvular heart disease') {
      valvularHeartDisease = _.cloneDeep(x?.valvularDisease) || undefined;
    }
    if (x?.type === 'Heart valve replacement') {
      heartValveReplacement = [
        {
          value: 'Left',
          isCheck: _.cloneDeep(x?.heartValveReplacement?.heartValveReplacement?.[0]?.isCheck) || false,
        },
        {
          value: 'Right',
          isCheck: _.cloneDeep(x?.heartValveReplacement?.heartValveReplacement?.[1]?.isCheck) || false,
        },
      ];
      mitralValveStatus = _.cloneDeep(x?.heartValveReplacement?.mitralValveStatus) || undefined;
    }
  });
  switch (key) {
    case 1:
      return heartValveIssue;
    case 2:
      return valvularHeartDisease;
    case 3:
      return heartValveReplacement;
    case 4:
      return mitralValveStatus;
    default:
      return null;
  }
};

export const isDisabledSaveBtn = (state = {}, isUnLinked = false) => {
  const { diagnosedConditions } = state;
  let flag = false;
  _.forEach(diagnosedConditions, (x) => {
    if (x?.type === 'Atrial Fibrillation' && x?.confirmedVia === 'Bioflux'
      && (x?.biofluxStatus === 'BIOFLUX_FAILED' || _.isEmpty(x?.facility))) {
      flag = true;
    }
    if (x?.type === 'Others' && !x?.othersConditions?.trim()) {
      flag = true;
    }
  });

  return flag;
};


export const fetchAtRiskCondition = (input) => {
  const searchUrl = `https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${input}&maxList=50`;

  return new Promise((resolve) => {
    axios.get(searchUrl)

      .then((response) => {
        const data = response.data[3];
        const tempdata = _.map(data, (x) => {
          const object = {
            label: x[0],
            value: x[0],
          };
          return object;
        });
        const dataSorted = _.sortBy(tempdata, [o => o?.label]);
        resolve(dataSorted);
      })
      .catch((error) => {
        consoleLog('error', error);
        resolve([]);
      });
  });
};

export const formartaAtRiskConditionValue = (aAtRiskCondition = []) => {
  const data = [];
  _.forEach(aAtRiskCondition, (x) => {
    data.push({
      value: x,
      label: x,
    });
  });
  return data;
};

export const formataAtRiskCondition = (aAtRiskCondition) => {
  const data = [];
  _.forEach(aAtRiskCondition, (x) => {
    data.push(x.value);
  });
  return data;
};
