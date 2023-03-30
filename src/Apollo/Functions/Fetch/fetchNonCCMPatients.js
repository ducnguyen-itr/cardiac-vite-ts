import createClient from '../../apolloClient';
import CALENDAR_0_NON_CCM_PATIENTS from '../../Queries/nonCCMPatients';

const fetchNonCCMPatients = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CALENDAR_0_NON_CCM_PATIENTS,
      variables,
    });

    const { nonCCMPatients } = result?.data || {};
    return nonCCMPatients;
  } catch (error) {
    throw error;
  }
};

export default fetchNonCCMPatients;
