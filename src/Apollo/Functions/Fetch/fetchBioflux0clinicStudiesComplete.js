import createClient from '../../apolloClient';
import CLINIC_STUDIES_COMPLETE_QUERY from '../../Queries/clinicStudiesComplete';

const fetchBiofluxClinicStudiesComplete = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CLINIC_STUDIES_COMPLETE_QUERY,
      variables,
    });
    const { data } = result;
    const { Bioflux0clinicStudies } = data;
    return Bioflux0clinicStudies;
  } catch (error) {
    throw error;
  }
};

export default fetchBiofluxClinicStudiesComplete;
