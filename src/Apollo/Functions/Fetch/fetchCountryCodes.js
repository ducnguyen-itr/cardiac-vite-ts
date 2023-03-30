import createClient from '../../apolloClient';
import COUNTRY_CODES from '../../Queries/countryCodes';

const fetchCountryCodes = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: COUNTRY_CODES,
    variables,
  });
  const { data } = result;
  const { countryCodes } = data;
  return countryCodes;
};

export default fetchCountryCodes;
