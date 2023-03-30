import createClient from '../../apolloClient';
import PRESCRIBE_NEW_STUDY_BY_CARE_PLAN from '../../Queries/prescribeNewStudyByCarePlan';

const fetchPrescribeNewStudyByCarePlan = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: PRESCRIBE_NEW_STUDY_BY_CARE_PLAN,
      variables,
    });
    const { prescribeNewStudyByCarePlan } = result?.data || {};
    return prescribeNewStudyByCarePlan;
  } catch (error) {
    throw error;
  }
};

export default fetchPrescribeNewStudyByCarePlan;
