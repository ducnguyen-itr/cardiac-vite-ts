import createClient from '../../apolloClient';
import BIOHEART_TRANSMISSION_QUERY from '../../Queries/bioheartTransmission';

const fetchBioheartTransmission = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: BIOHEART_TRANSMISSION_QUERY,
    variables,
  });
  const { bioheartTransmission } = result?.data || {};
  return bioheartTransmission;
};

export default fetchBioheartTransmission;
