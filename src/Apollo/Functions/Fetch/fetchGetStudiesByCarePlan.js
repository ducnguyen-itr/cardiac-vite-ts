import createClient from '../../apolloClient';
import GET_STUDIES_BY_CARE_PLAN from '../../Queries/getStudiesByCarePlan';

const fetchGetStudiesByCarePlan = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: GET_STUDIES_BY_CARE_PLAN,
      variables,
    });
    const { getstudiesbycareplan } = result?.data || {};
    return getstudiesbycareplan;
  } catch (error) {
    throw error;
  }
};

export default fetchGetStudiesByCarePlan;
