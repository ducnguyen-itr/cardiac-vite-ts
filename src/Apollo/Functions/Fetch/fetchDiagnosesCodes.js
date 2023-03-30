import createClient from '../../apolloClient';
import DIAGNOSIS_CODES_QUERY from '../../Queries/diagnosesCodes';

const fetchDiagnosesCodes = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: DIAGNOSIS_CODES_QUERY,
      variables,
    });
    const { diagnosesCodes } = result?.data || {};
    return diagnosesCodes;
  } catch (error) {
    throw error;
  }
};

export default fetchDiagnosesCodes;
