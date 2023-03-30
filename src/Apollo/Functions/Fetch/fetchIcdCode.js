import createClient from '../../apolloClient';
import ICD_CODE from '../../Queries/icdCode';

const fetchIcdCode = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: ICD_CODE,
    variables,
  });
  const { icdCodes } = result?.data || {};
  return icdCodes;
};

export default fetchIcdCode;
