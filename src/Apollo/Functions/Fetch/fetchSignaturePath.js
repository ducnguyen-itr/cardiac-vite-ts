import createClient from '../../apolloClient';
import SIGNATURE_PATH_QUERY from '../../Queries/signaturePath';

const fetchSignaturePath = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: SIGNATURE_PATH_QUERY,
      variables,
    });
    const { user } = result?.data;
    return user?.signature;
  } catch (error) {
    throw error;
  }
};

export default fetchSignaturePath;
