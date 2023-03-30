import createClient from '../../apolloClient';
import GET_BIOFLUX_PATIENT_REPORT from '../../Queries/getBiofluxPatientReport';

const fetchGetBiofluxPatientReport = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: GET_BIOFLUX_PATIENT_REPORT,
      variables,
    });
    return result?.data?.getBiofluxPatientReport;
  } catch (error) {
    throw error;
  }
};

export default fetchGetBiofluxPatientReport;
