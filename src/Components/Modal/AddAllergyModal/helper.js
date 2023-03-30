import _ from 'lodash';
import handleUpdateCarePlanAllergies from '../../../Apollo/Functions/Handle/handleUpdateCarePlanAllergies';

export const testFunction = () => 'test function';

export const handleUpdateAllergies = async (_id, allergies) => {
  try {
    const updatedCarePlanAllergies = await handleUpdateCarePlanAllergies({ _id, allergies });
    return updatedCarePlanAllergies;
  } catch (error) {
    return {
      isSuccess: false,
      message: false,
    };
  }
};

export const handleSplitAllergies = (allergies = '', maxLen = 75) => {
  const removeEmptyAllergies = !allergies ? '' : allergies.split('\n').filter(x => x).join('\n');

  if (removeEmptyAllergies && removeEmptyAllergies?.length > maxLen) {
    const splited = removeEmptyAllergies?.split(' ');
    const arr = [];

    _.forEach(splited || [], (x) => {
      const len = x?.length;
      const timesRun = Math.ceil(len / maxLen);

      _.forEach(new Array(timesRun), (a, i) => {
        const item = x.slice(i * maxLen, (i + 1) * maxLen);
        arr.push(item);
      });
    });
    return arr.join(' ');
  }
  return removeEmptyAllergies;
};
