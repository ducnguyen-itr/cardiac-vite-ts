import createClient from '../../apolloClient';
import CLINIC_STUDIES_QUERY from '../../Queries/clinicStudies';

const fetchBiofluxClinicStudies = async (variables, key = 0) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CLINIC_STUDIES_QUERY(key),
      variables,
    });
    const { data } = result;
    const { Bioflux0clinicStudies } = data;
    return Bioflux0clinicStudies;
  } catch (error) {
    throw error;
  }
};

export default fetchBiofluxClinicStudies;
