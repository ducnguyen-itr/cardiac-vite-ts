
import createClient from '../../apolloClient';
import QUERY_MEDICATIONS from '../../Queries/medications';

const fetchMedications = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: QUERY_MEDICATIONS,
    variables,
  });
  return result?.data?.medications;
};

export default fetchMedications;
