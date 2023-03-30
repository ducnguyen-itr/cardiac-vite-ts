/* eslint-disable max-len */
import _ from 'lodash';
import { DISPLAY_DATA_2 } from '../../Constants';
import { SF_46_ANSWER_23, SF_46_ANSWER_24_25 } from '../../Constants/carePlan';

export const getAdditionalInfo = (sf36Arr = []) => {
  if (sf36Arr?.length === 0) {
    return [];
  }
  const as23 = sf36Arr?.[0]?.answer?.split(',');
  const as24 = sf36Arr?.[1]?.answer;
  const as25 = sf36Arr?.[2]?.answer;


  const answer1 = [];
  _.forEach(as23 || [], (x) => {
    const item = _.find(SF_46_ANSWER_23, (y, index) => x?.includes(`${index + 1}`));
    answer1.push(item);
  });
  const answer2 = SF_46_ANSWER_24_25[as24?.includes('1') ? 0 : 1];
  const answer3 = SF_46_ANSWER_24_25[as25?.includes('1') ? 0 : 1];


  const arr = [
    {
      title: 'What kind of support does the patient need?',
      data: answer1,
      type: DISPLAY_DATA_2.ARRAY,
    },
    {
      title: 'In the past 12 months, has the patient been physically or emotionally hurt or felt threatened by a current or former spouse/partner, a caregiver, or someone else?',
      data: answer2,
    },
    {
      title: 'Does the patient have someone to call if they need help?',
      data: answer3,
    },
  ];

  return arr;
};

export default getAdditionalInfo;
