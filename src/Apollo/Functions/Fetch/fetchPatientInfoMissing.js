import createClient from '../../apolloClient';
import PATIENT_INFO_MISSING from '../../Queries/patientInfoMissing';

const fetchPatientInfoMissing = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: PATIENT_INFO_MISSING,
      variables,
    });
    const { patientInfoMissing } = result?.data;
    if (!patientInfoMissing?.isSuccess) {
      throw patientInfoMissing.message;
    }
    return patientInfoMissing;
  } catch (error) {
    throw error;
  }
};

export default fetchPatientInfoMissing;
